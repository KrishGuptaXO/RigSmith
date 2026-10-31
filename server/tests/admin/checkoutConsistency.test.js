import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

process.env.JWT_SECRET = "test-secret";

const { default: orderRoutes } = await import("../../routes/orderRoutes.js");
const { default: User } = await import("../../models/User.js");
const { default: Order } = await import("../../models/Order.js");
const { default: Cart } = await import("../../models/Cart.js");
const { default: Inventory } = await import("../../models/Inventory.js");
const { default: Build } = await import("../../models/Build.js");

const USER = "507f1f77bcf86cd799439011";
const GPU = "607f1f77bcf86cd799439013";
const CPU = "607f1f77bcf86cd799439012";
const B1 = "707f1f77bcf86cd799439016";
const B2 = "707f1f77bcf86cd799439017";

const ADDRESS = { name: "A", phone: "1", addressLine: "x", city: "c", state: "s", postalCode: "1" };

let server, base, token;
let cart, builds, inventory, updates, created, guardFails;
const saved = [];
const stub = (obj, key, fn) => { saved.push([obj, key, obj[key]]); obj[key] = fn; };

const part = (id, name, stock) => ({ _id: id, name, stock, price: 100 });
const buildOf = (id, comps, price = 1000) => ({
    _id: id,
    name: `Build ${id.slice(-2)}`,
    price,
    components: comps.map(([p, quantity]) => ({ inventoryId: p, quantity })),
});

const checkout = () =>
    fetch(`${base}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ shippingAddress: ADDRESS }),
    });

describe("checkout stock consistency", () => {
    before(async () => {
        stub(User, "findById", () => ({ select: async () => ({ _id: USER, role: "customer" }) }));
        stub(mongoose, "startSession", async () => ({
            withTransaction: async (fn) => fn(),
            endSession() {},
        }));
        stub(Cart, "findOne", () => ({ session: async () => cart }));
        stub(Inventory, "findById", (id) => ({ session: async () => inventory[String(id)] || null }));
        stub(Build, "findById", (id) => ({
            populate() { return this; },
            session: async () => builds[String(id)] || null,
        }));
        stub(Inventory, "updateOne", async (filter, update) => {
            updates.push({ filter, update });
            return { matchedCount: guardFails ? 0 : 1 };
        });
        stub(Order, "create", async (docs) => { created.push(docs[0]); return [docs[0]]; });

        const app = express();
        app.use(express.json());
        app.use("/api/orders", orderRoutes);
        server = http.createServer(app);
        await new Promise((r) => server.listen(0, r));
        base = `http://127.0.0.1:${server.address().port}`;
        token = jwt.sign({ userId: USER }, process.env.JWT_SECRET);
    });

    after(() => {
        for (const [obj, key, orig] of saved.reverse()) obj[key] = orig;
        server.close();
    });

    beforeEach(() => {
        updates = [];
        created = [];
        guardFails = false;
        inventory = {};
        builds = {};
        cart = { items: [], save: async () => {} };
    });

    test("pre-built checkout ignores component stock entirely", async () => {
        // Component stock is 0 and one component link is dangling (null): a ready-made
        // build must still be orderable, and no inventory is touched.
        builds[B1] = buildOf(B1, [[part(GPU, "GPU", 0), 1], [null, 1]]);
        cart.items = [{ itemType: "build", buildId: B1, quantity: 2, customizations: "RTX upgrade" }];

        const res = await checkout();
        assert.equal(res.status, 201);
        assert.equal(updates.length, 0, "no stock may be deducted for a pre-built");
        assert.equal(created.length, 1);

        const item = created[0].items[0];
        assert.equal(item.itemType, "build");
        assert.equal(item.quantity, 2);
        assert.equal(item.customizations, "RTX upgrade");
        assert.deepEqual(item.components, [], "empty snapshot marks 'nothing deducted'");
        assert.equal(created[0].totalAmount, 2000);
    });

    test("a build in the cart does not consume a standalone part's stock", async () => {
        const gpu = part(GPU, "GPU", 4);
        inventory[GPU] = gpu;
        builds[B1] = buildOf(B1, [[gpu, 3]]);
        cart.items = [
            { itemType: "inventory", inventoryId: GPU, quantity: 4 },
            { itemType: "build", buildId: B1, quantity: 1 },
        ];

        const res = await checkout();
        assert.equal(res.status, 201);
        assert.deepEqual(
            updates.map((u) => [String(u.filter._id), u.update.$inc.stock]),
            [[GPU, -4]]
        );
    });

    test("standalone parts are still limited by stock", async () => {
        inventory[GPU] = part(GPU, "GPU", 2);
        cart.items = [{ itemType: "inventory", inventoryId: GPU, quantity: 3 }];

        const res = await checkout();
        assert.equal(res.status, 400);
        assert.match((await res.json()).message, /GPU/);
        assert.equal(created.length, 0);
    });

    test("a missing build is a 400", async () => {
        cart.items = [{ itemType: "build", buildId: B1, quantity: 1 }];
        const res = await checkout();
        assert.equal(res.status, 400);
        assert.match((await res.json()).message, /no longer exists/);
    });

    test("the decrement is atomic: filtered on stock >= needed", async () => {
        inventory[GPU] = part(GPU, "GPU", 10);
        cart.items = [{ itemType: "inventory", inventoryId: GPU, quantity: 4 }];

        await checkout();
        assert.deepEqual(updates[0].filter.stock, { $gte: 4 });
    });

    test("if another checkout wins the race (guard matches nothing), no order is created", async () => {
        inventory[GPU] = part(GPU, "GPU", 10); // stale read says plenty
        cart.items = [{ itemType: "inventory", inventoryId: GPU, quantity: 4 }];
        guardFails = true;

        const res = await checkout();
        assert.equal(res.status, 400);
        assert.match((await res.json()).message, /GPU/);
        assert.equal(created.length, 0);
    });

    test("empty cart is a 400", async () => {
        const res = await checkout();
        assert.equal(res.status, 400);
        assert.match((await res.json()).message, /empty/i);
    });

    test("unexpected errors return a generic 500, not internals", async () => {
        cart.items = [{ itemType: "inventory", inventoryId: GPU, quantity: 1 }];
        inventory = { [GPU]: part(GPU, "GPU", 10) };
        const orig = Order.create;
        Order.create = async () => { throw new Error("mongo internal detail"); };
        const origLog = console.error;
        console.error = () => {};
        try {
            const res = await checkout();
            assert.equal(res.status, 500);
            assert.doesNotMatch((await res.json()).message, /mongo internal/);
        } finally {
            Order.create = orig;
            console.error = origLog;
        }
    });
});