import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

process.env.JWT_SECRET = "test-secret";

const { default: authRoutes } = await import("../../routes/authRoutes.js");
const { default: User } = await import("../../models/User.js");
const { createRateLimiter } = await import("../../middleware/rateLimiters.js");

describe("rate limiting", () => {
    let server, base;
    const orig = User.findOne;

    before(async () => {
        User.findOne = async () => null; // every login fails -> counts toward the limit
        const app = express();
        app.use(express.json());
        app.use("/api/auth", authRoutes);
        app.get("/limited", createRateLimiter({ windowMs: 60000, limit: 2, message: "slow down" }), (req, res) => res.json({ ok: true }));
        server = http.createServer(app);
        await new Promise((r) => server.listen(0, r));
        base = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => { User.findOne = orig; server.close(); });

    test("createRateLimiter returns 429 with a JSON message after the limit", async () => {
        assert.equal((await fetch(`${base}/limited`)).status, 200);
        assert.equal((await fetch(`${base}/limited`)).status, 200);
        const res = await fetch(`${base}/limited`);
        assert.equal(res.status, 429);
        assert.equal((await res.json()).message, "slow down");
    });

    test("login blocks after 10 failed attempts from one client", async () => {
        const attempt = () =>
            fetch(`${base}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "a@b.co", password: "nope-nope" }),
            });
        for (let i = 0; i < 10; i++) assert.equal((await attempt()).status, 401);
        const blocked = await attempt();
        assert.equal(blocked.status, 429);
        assert.match((await blocked.json()).message, /15 minutes/);
    });
});