import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import argon2 from "argon2";

process.env.JWT_SECRET = "test-secret";

const { default: authRoutes } = await import("../../routes/authRoutes.js");
const { default: User } = await import("../../models/User.js");
const { validateEnv, getAllowedOrigins } = await import("../../config/env.js");
const { validateRegistration, validateLogin } = await import("../../utils/authValidation.js");

describe("validateRegistration", () => {
    const ok = { name: " Krish ", email: " Krish@Example.COM ", password: "secret1" };

    test("trims and lowercases", () => {
        assert.deepEqual(validateRegistration(ok).value, {
            name: "Krish", email: "krish@example.com", password: "secret1",
        });
    });

    test("rejects non-string values (Mongo operator objects, arrays, numbers)", () => {
        for (const bad of [
            { ...ok, email: { $ne: null } },
            { ...ok, email: ["a@b.co"] },
            { ...ok, password: { $gt: "" } },
            { ...ok, name: 123 },
            {},
            undefined,
        ]) {
            assert.ok(validateRegistration(bad).error, JSON.stringify(bad));
        }
    });

    test("rejects bad email, short and oversized passwords, long names", () => {
        assert.match(validateRegistration({ ...ok, email: "nope" }).error, /valid email/);
        assert.match(validateRegistration({ ...ok, password: "12345" }).error, /at least 6/);
        assert.match(validateRegistration({ ...ok, password: "x".repeat(129) }).error, /128/);
        assert.match(validateRegistration({ ...ok, name: "n".repeat(81) }).error, /80/);
    });
});

describe("validateLogin", () => {
    test("requires string email and password", () => {
        assert.ok(validateLogin({ email: { $ne: null }, password: "x" }).error);
        assert.ok(validateLogin({ email: "a@b.co", password: { $ne: "" } }).error);
        assert.ok(validateLogin({}).error);
    });

    test("oversized password is a 401, not a hash attempt", () => {
        const r = validateLogin({ email: "a@b.co", password: "x".repeat(129) });
        assert.equal(r.status, 401);
    });
});

describe("env checks", () => {
    test("requires MONGO_URI and JWT_SECRET", () => {
        assert.equal(validateEnv({}).errors.length, 2);
    });

    test("short JWT_SECRET: warning in dev, error in production", () => {
        const dev = validateEnv({ MONGO_URI: "x", JWT_SECRET: "short" });
        assert.equal(dev.errors.length, 0);
        assert.equal(dev.warnings.length, 1);
        const prod = validateEnv({ MONGO_URI: "x", JWT_SECRET: "short", NODE_ENV: "production", CLIENT_URL: "https://a.b" });
        assert.equal(prod.errors.length, 1);
    });

    test("production needs CLIENT_URL", () => {
        const r = validateEnv({ MONGO_URI: "x", JWT_SECRET: "a".repeat(40), NODE_ENV: "production" });
        assert.match(r.errors[0], /CLIENT_URL/);
    });

    test("allowed origins: defaults, trailing slashes, multiple", () => {
        assert.deepEqual(getAllowedOrigins({}), ["http://localhost:5173"]);
        assert.deepEqual(
            getAllowedOrigins({ CLIENT_URL: "https://a.app/, http://localhost:5173" }),
            ["https://a.app", "http://localhost:5173"]
        );
    });
});

describe("auth routes", () => {
    let server, base, created, findCalls;
    const saved = [];
    const stub = (obj, key, fn) => { saved.push([obj, key, obj[key]]); obj[key] = fn; };
    const send = (path, body) =>
        fetch(`${base}/api/auth/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

    before(async () => {
        created = [];
        findCalls = [];
        const stored = { email: "krish@example.com", name: "Krish", role: "customer", password: await argon2.hash("secret1") };
        stored._id = "507f1f77bcf86cd799439011";

        stub(User, "findOne", async (q) => { findCalls.push(q); return q.email === "krish@example.com" ? stored : null; });
        stub(User, "create", async (doc) => {
            created.push(doc);
            if (doc.email === "race@example.com") throw Object.assign(new Error("dup"), { code: 11000 });
            return { _id: "1", role: "customer", ...doc };
        });

        const app = express();
        app.use(express.json());
        app.use("/api/auth", authRoutes);
        server = http.createServer(app);
        await new Promise((r) => server.listen(0, r));
        base = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => {
        for (const [o, k, v] of saved.reverse()) o[k] = v;
        server.close();
    });

    test("register: operator-injection email is rejected before any query", async () => {
        const res = await send("register", { name: "A", email: { $ne: null }, password: "secret1" });
        assert.equal(res.status, 400);
        assert.equal(findCalls.length, 0);
    });

    test("register: stores normalized email, never returns the password", async () => {
        const res = await send("register", { name: " New ", email: "New@Example.com", password: "secret1" });
        assert.equal(res.status, 201);
        assert.equal(created.at(-1).email, "new@example.com");
        assert.match(created.at(-1).password, /^\$argon2id\$/);
        assert.equal(JSON.stringify(await res.json()).includes("argon2"), false);
    });

    test("register: duplicate email (existing or racing) is a 409", async () => {
        assert.equal((await send("register", { name: "A", email: "krish@example.com", password: "secret1" })).status, 409);
        assert.equal((await send("register", { name: "A", email: "race@example.com", password: "secret1" })).status, 409);
    });

    test("login: success returns a token, case-insensitive email", async () => {
        const res = await send("login", { email: "KRISH@example.com", password: "secret1" });
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.ok(body.token);
        assert.equal(body.user.password, undefined);
    });

    test("login: wrong password and unknown user give the same 401", async () => {
        const a = await send("login", { email: "krish@example.com", password: "wrong-pass" });
        const b = await send("login", { email: "ghost@example.com", password: "wrong-pass" });
        assert.equal(a.status, 401);
        assert.equal(b.status, 401);
        assert.deepEqual(await a.json(), await b.json());
    });

    test("login: object email/password is a 400, not a 500", async () => {
        assert.equal((await send("login", { email: { $ne: null }, password: "x" })).status, 400);
        assert.equal((await send("login", { email: "krish@example.com", password: { $ne: "" } })).status, 400);
    });
});