import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";

const { default: cartRoutes } = await import("../../routes/cartRoutes.js");
const { default: buildRoutes } = await import("../../routes/buildRoutes.js");
const { default: User } = await import("../../models/User.js");
const { default: Cart } = await import("../../models/Cart.js");
const { default: Build } = await import("../../models/Build.js");

const USER = "507f1f77bcf86cd799439011";
const B1 = "707f1f77bcf86cd799439016";

let server, base, token, cart, builds;
const saved = [];
const stub = (obj, key, fn) => { saved.push([obj, key, obj[key]]); obj[key] = fn; };

const asDoc = (o) => ({ ...o, toObject: () => JSON.parse(JSON.stringify(o)) });
const post = (body) =>
    fetch(`${base}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
    });

describe("cart customizations", () => {
    before(async () => {
        stub(User, "findById", () => ({ select: async () => ({ _id: USER, role: "customer" }) }));
        stub(Build, "findById", () => {
            const q = { populate: () => q, then: (res, rej) => Promise.resolve(builds[0] ? asDoc(builds[0]) : null).then(res, rej) };
            return q;
        });
        stub(Build, "find", () => ({ populate: async () => builds.map(asDoc) }));
        stub(Cart, "findOne", async () => cart);
        stub(Cart, "findById", () => {
            const q = { populate: () => q, then: (res, rej) => Promise.resolve(cart).then(res, rej) };
            return q;
        });

        const app = express();
        app.use(express.json());
        app.use("/api/cart", cartRoutes);
        app.use("/api/builds", buildRoutes);
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
        builds = [{ _id: B1, name: "Phantom V4", price: 100, components: [] }];
        cart = { _id: "c1", items: [], save: async () => {} };
    });

    test("stores customizations on a new build line (trimmed)", async () => {
        const res = await post({ itemType: "build", buildId: B1, customizations: "  CPU: Ryzen 9  " });
        assert.equal(res.status, 200);
        assert.equal(cart.items[0].customizations, "CPU: Ryzen 9");
    });

    test("applies customizations when the build is already in the cart", async () => {
        cart.items = [{ itemType: "build", buildId: B1, quantity: 1, customizations: "" }];
        const res = await post({ itemType: "build", buildId: B1, customizations: "GPU: RTX 5090" });
        assert.equal(res.status, 200);
        assert.equal(cart.items.length, 1);
        assert.equal(cart.items[0].quantity, 2);
        assert.equal(cart.items[0].customizations, "GPU: RTX 5090");
    });

    test("adding again with no customizations keeps the existing ones", async () => {
        cart.items = [{ itemType: "build", buildId: B1, quantity: 1, customizations: "GPU: RTX 5090" }];
        await post({ itemType: "build", buildId: B1 });
        assert.equal(cart.items[0].customizations, "GPU: RTX 5090");
    });

    test("rejects non-string or oversized customizations", async () => {
        assert.equal((await post({ itemType: "build", buildId: B1, customizations: { a: 1 } })).status, 400);
        assert.equal((await post({ itemType: "build", buildId: B1, customizations: "x".repeat(501) })).status, 400);
    });

    test("build API drops components whose inventory item no longer exists", async () => {
        builds = [{
            _id: B1, name: "Phantom V4", price: 100,
            components: [
                { inventoryId: { _id: "a", name: "CPU", category: "CPU" }, quantity: 1 },
                { inventoryId: null, quantity: 1 },
            ],
        }];
        const warn = console.warn;
        console.warn = () => {};
        try {
            const list = await (await fetch(`${base}/api/builds`)).json();
            assert.equal(list[0].components.length, 1);
            const one = await (await fetch(`${base}/api/builds/${B1}`)).json();
            assert.equal(one.components.length, 1);
            assert.equal(one.components[0].inventoryId.name, "CPU");
        } finally {
            console.warn = warn;
        }
    });
});