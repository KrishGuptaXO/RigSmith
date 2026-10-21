import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

process.env.JWT_SECRET = "test-secret";

const { default: adminRoutes } = await import("../../routes/admin/index.js");
const { default: User } = await import("../../models/User.js");
const { default: Order } = await import("../../models/Order.js");
const { default: Inventory } = await import("../../models/Inventory.js");
const { default: Build } = await import("../../models/Build.js");

// No database here: models/session are stubbed so we can verify the control flow of
// PATCH /api/admin/orders/:id/status (valid transitions, one-time restock on cancel).
const ID = "507f1f77bcf86cd799439011";
const INV_A = "607f1f77bcf86cd799439012";
const BUILD = "707f1f77bcf86cd799439013";
const INV_B = "807f1f77bcf86cd799439014";

let server, base, token, order, stockCalls, raceLost;
const saved = {};

const stub = (obj, key, fn) => { saved[`${obj.modelName || "m"}.${key}`] = [obj, key, obj[key]]; obj[key] = fn; };

const patch = (status) =>
    fetch(`${base}/api/admin/orders/${ID}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
    });

describe("PATCH /api/admin/orders/:id/status", () => {
    before(async () => {
        stub(User, "findById", () => ({ select: async () => ({ _id: ID, role: "admin" }) }));
        stub(mongoose, "startSession", async () => ({ withTransaction: async (fn) => fn(), endSession() {} }));
        stub(Order, "findById", () => ({ session: async () => order }));
        stub(Order, "findOneAndUpdate", async (filter, update) =>
            raceLost ? null : { ...order, status: update.$set.status });
        stub(Inventory, "updateOne", async (filter, update) => {
            stockCalls.push({ id: String(filter._id), inc: update.$inc.stock });
            return { matchedCount: 1 };
        });
        stub(Build, "findById", () => ({
            session: async () => ({ components: [{ inventoryId: INV_B, quantity: 2 }] }),
        }));

        token = jwt.sign({ userId: ID }, process.env.JWT_SECRET);
        const app = express();
        app.use(express.json());
        app.use("/api/admin", adminRoutes);
        server = http.createServer(app);
        await new Promise((r) => server.listen(0, r));
        base = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => {
        for (const [obj, key, orig] of Object.values(saved)) obj[key] = orig;
        server.close();
    });

    beforeEach(() => {
        stockCalls = [];
        raceLost = false;
        order = {
            _id: ID,
            status: "pending",
            items: [
                { itemType: "inventory", inventoryId: INV_A, name: "GPU", quantity: 2 },
                { itemType: "build", buildId: BUILD, name: "Starter PC", quantity: 3 },
            ],
        };
    });

    test("valid forward transition does not touch stock", async () => {
        const res = await patch("confirmed");
        assert.equal(res.status, 200);
        assert.equal((await res.json()).order.status, "confirmed");
        assert.equal(stockCalls.length, 0);
    });

    test("invalid transition -> 409 and no stock change", async () => {
        const res = await patch("delivered");
        assert.equal(res.status, 409);
        assert.equal(stockCalls.length, 0);
    });

    test("unknown status -> 400", async () => {
        assert.equal((await patch("teleported")).status, 400);
    });

    test("cancelling restocks inventory lines and build components exactly once", async () => {
        const res = await patch("cancelled");
        assert.equal(res.status, 200);
        assert.deepEqual(stockCalls, [
            { id: INV_A, inc: 2 },
            { id: INV_B, inc: 6 }, // 2 per build x 3 builds
        ]);
    });

    test("cancelled and delivered orders cannot be changed (no double restock)", async () => {
        for (const status of ["cancelled", "delivered"]) {
            order.status = status;
            assert.equal((await patch("cancelled")).status, 409);
        }
        assert.equal(stockCalls.length, 0);
    });

    test("losing a concurrent update race -> 409 and no restock", async () => {
        raceLost = true;
        const res = await patch("cancelled");
        assert.equal(res.status, 409);
        assert.equal(stockCalls.length, 0);
    });

    test("shipped orders cannot be cancelled", async () => {
        order.status = "shipped";
        assert.equal((await patch("cancelled")).status, 409);
        assert.equal(stockCalls.length, 0);
    });
});