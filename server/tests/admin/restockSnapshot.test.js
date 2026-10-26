import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

process.env.JWT_SECRET = "test-secret";

const { default: adminRoutes } = await import("../../routes/admin/index.js");
const { default: userOrderRoutes } = await import("../../routes/orderRoutes.js");
const { default: User } = await import("../../models/User.js");
const { default: Order } = await import("../../models/Order.js");
const { default: Cart } = await import("../../models/Cart.js");
const { default: Inventory } = await import("../../models/Inventory.js");
const { default: Build } = await import("../../models/Build.js");

const ID = "507f1f77bcf86cd799439011";
const CPU = "607f1f77bcf86cd799439012";
const GPU = "607f1f77bcf86cd799439013";
const OLD_PART = "607f1f77bcf86cd799439014";
const NEW_PART = "607f1f77bcf86cd799439015";
const BUILD = "707f1f77bcf86cd799439016";

let server, base, token, role;
let partMissing, stockCalls, buildLookups, order, createdOrders, cart, buildDoc;
const saved = [];
const stub = (obj, key, fn) => { saved.push([obj, key, obj[key]]); obj[key] = fn; };

const adminPatch = (status) =>
    fetch(`${base}/api/admin/orders/${ID}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
    });

describe("build restock uses the order-time snapshot", () => {
    before(async () => {
        stub(User, "findById", () => ({ select: async () => ({ _id: ID, role }) }));
        stub(mongoose, "startSession", async () => ({
            withTransaction: async (fn) => fn(),
            startTransaction() {}, commitTransaction: async () => {}, abortTransaction: async () => {},
            endSession() {},
        }));

        // admin cancel path
        stub(Order, "findById", () => ({ session: async () => order }));
        stub(Order, "findOneAndUpdate", async (f, u) => ({ ...order, status: u.$set.status }));
        stub(Inventory, "updateOne", async (f, u) => {
            stockCalls.push({ id: String(f._id), inc: u.$inc.stock });
            return { matchedCount: partMissing ? 0 : 1 };
        });

        // checkout path
        stub(Cart, "findOne", () => ({ session: async () => cart }));
        stub(Inventory, "findById", () => ({ session: async () => null }));
        stub(Inventory, "findByIdAndUpdate", async (id, u) => {
            stockCalls.push({ id: String(id), inc: u.$inc.stock });
        });
        stub(Build, "findById", () => {
            buildLookups++;
            return { populate() { return this; }, session: async () => buildDoc };
        });
        stub(Order, "create", async (docs) => { createdOrders.push(docs[0]); return [docs[0]]; });

        const app = express();
        app.use(express.json());
        app.use("/api/admin", adminRoutes);
        app.use("/api/orders", userOrderRoutes);
        server = http.createServer(app);
        await new Promise((r) => server.listen(0, r));
        base = `http://127.0.0.1:${server.address().port}`;
        token = jwt.sign({ userId: ID }, process.env.JWT_SECRET);
    });

    after(() => {
        for (const [obj, key, orig] of saved.reverse()) obj[key] = orig;
        server.close();
    });

    beforeEach(() => {
        role = "admin";
        partMissing = false;
        stockCalls = [];
        buildLookups = 0;
        createdOrders = [];
    });

    describe("cancelling", () => {
        beforeEach(() => {
            order = {
                _id: ID,
                status: "pending",
                items: [{
                    itemType: "build", buildId: BUILD, name: "Starter PC", quantity: 3,
                    components: [{ inventoryId: OLD_PART, name: "Old part", quantity: 2 }],
                }],
            };
            // The build was edited after the order: different part now.
            buildDoc = { name: "Starter PC", components: [{ inventoryId: NEW_PART, quantity: 5 }] };
        });

        test("restores the snapshot, not the build's current components", async () => {
            const res = await adminPatch("cancelled");
            assert.equal(res.status, 200);
            assert.deepEqual(stockCalls, [{ id: OLD_PART, inc: 6 }]); // 2 per build x 3
            assert.equal(buildLookups, 0, "Build must not be consulted when a snapshot exists");
            assert.deepEqual((await res.json()).warnings, []);
        });

        test("still restocks when the build has been deleted", async () => {
            buildDoc = null;
            const res = await adminPatch("cancelled");
            assert.equal(res.status, 200);
            assert.deepEqual(stockCalls, [{ id: OLD_PART, inc: 6 }]);
        });

        test("warns when a snapshotted part no longer exists", async () => {
            partMissing = true;
            const res = await adminPatch("cancelled");
            const body = await res.json();
            assert.equal(body.warnings.length, 1);
            assert.match(body.warnings[0], /Old part/);
        });

        test("legacy order without a snapshot falls back to current components and warns", async () => {
            delete order.items[0].components;
            const res = await adminPatch("cancelled");
            assert.equal(res.status, 200);
            assert.deepEqual(stockCalls, [{ id: NEW_PART, inc: 15 }]); // 5 x 3
            const { warnings } = await res.json();
            assert.equal(warnings.length, 1);
            assert.match(warnings[0], /before component snapshots/);
        });

        test("legacy order whose build is gone warns and restocks nothing", async () => {
            delete order.items[0].components;
            buildDoc = null;
            const res = await adminPatch("cancelled");
            assert.equal(res.status, 200);
            assert.equal(stockCalls.length, 0);
            assert.equal((await res.json()).warnings.length, 1);
        });
    });

    describe("checkout", () => {
        test("saves the snapshot on the order and deducts exactly that snapshot", async () => {
            role = "customer";
            cart = {
                items: [{ itemType: "build", buildId: BUILD, quantity: 2, customizations: "" }],
                save: async () => {},
            };
            buildDoc = {
                _id: BUILD, name: "Starter PC", price: 1000,
                components: [
                    { inventoryId: { _id: CPU, name: "CPU", stock: 10 }, quantity: 1 },
                    { inventoryId: { _id: GPU, name: "GPU", stock: 10 }, quantity: 3 },
                ],
            };

            const res = await fetch(`${base}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    shippingAddress: { name: "A", phone: "1", addressLine: "x", city: "c", state: "s", postalCode: "1" },
                }),
            });
            assert.equal(res.status, 201);

            const item = createdOrders[0].items[0];
            assert.deepEqual(
                item.components.map((c) => ({ id: String(c.inventoryId), name: c.name, quantity: c.quantity })),
                [{ id: CPU, name: "CPU", quantity: 1 }, { id: GPU, name: "GPU", quantity: 3 }]
            );
            assert.deepEqual(stockCalls, [{ id: CPU, inc: -2 }, { id: GPU, inc: -6 }]);
            assert.equal(buildLookups, 1, "build is read once, so deduction and snapshot cannot diverge");
        });
    });
});

describe("Order schema", () => {
    const base = {
        orderNumber: "RS-TEST", userId: ID, totalAmount: 10,
        shippingAddress: { name: "A", phone: "1", addressLine: "x", city: "c", state: "s", postalCode: "1" },
    };

    test("accepts and keeps build component snapshots", () => {
        const doc = new Order({
            ...base,
            items: [{ itemType: "build", buildId: BUILD, name: "PC", price: 10, quantity: 1,
                components: [{ inventoryId: CPU, name: "CPU", quantity: 2 }] }],
        });
        assert.equal(doc.validateSync(), undefined);
        assert.equal(doc.items[0].components[0].quantity, 2);
    });

    test("inventory items get no components array; invalid snapshot quantity is rejected", () => {
        const plain = new Order({
            ...base,
            items: [{ itemType: "inventory", inventoryId: CPU, name: "CPU", price: 10, quantity: 1 }],
        });
        assert.equal(plain.items[0].components, undefined);

        const bad = new Order({
            ...base,
            items: [{ itemType: "build", buildId: BUILD, name: "PC", price: 10, quantity: 1,
                components: [{ inventoryId: CPU, quantity: 0 }] }],
        });
        assert.ok(bad.validateSync());
    });
});