import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";

const { default: adminRoutes } = await import("../../routes/admin/index.js");
const { default: User } = await import("../../models/User.js");

// Every admin endpoint family, checked for each caller type, without needing a database:
// the User lookup is stubbed, and guarded requests are rejected before any handler runs.
const ENDPOINTS = [
    ["GET", "/api/admin/dashboard"],
    ["GET", "/api/admin/inventory"],
    ["POST", "/api/admin/inventory"],
    ["PUT", "/api/admin/inventory/507f1f77bcf86cd799439011"],
    ["PATCH", "/api/admin/inventory/507f1f77bcf86cd799439011/stock"],
    ["DELETE", "/api/admin/inventory/507f1f77bcf86cd799439011"],
    ["GET", "/api/admin/categories"],
    ["PUT", "/api/admin/categories/rename"],
    ["GET", "/api/admin/suppliers"],
    ["POST", "/api/admin/suppliers"],
    ["PUT", "/api/admin/suppliers/507f1f77bcf86cd799439011"],
    ["DELETE", "/api/admin/suppliers/507f1f77bcf86cd799439011"],
    ["GET", "/api/admin/customers"],
    ["GET", "/api/admin/customers/507f1f77bcf86cd799439011"],
    ["GET", "/api/admin/orders"],
    ["GET", "/api/admin/orders/507f1f77bcf86cd799439011"],
    ["PATCH", "/api/admin/orders/507f1f77bcf86cd799439011/status"],
    ["GET", "/api/admin/reports"],
];

let server, base, currentRole;
const originalFindById = User.findById;

const call = (method, path, token) =>
    fetch(base + path, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: ["POST", "PUT", "PATCH"].includes(method) ? "{}" : undefined,
    });

describe("admin API authorization", () => {
    before(async () => {
        // Role comes from the (stubbed) database record, as in the real authMiddleware.
        User.findById = () => ({ select: async () => ({ _id: "507f1f77bcf86cd799439011", role: currentRole }) });
        const app = express();
        app.use(express.json());
        app.use("/api/admin", adminRoutes);
        server = http.createServer(app);
        await new Promise((r) => server.listen(0, r));
        base = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => {
        User.findById = originalFindById;
        server.close();
    });

    test("no token -> 401 on every admin endpoint", async () => {
        for (const [m, p] of ENDPOINTS) assert.equal((await call(m, p)).status, 401, `${m} ${p}`);
    });

    test("garbage token -> 401 on every admin endpoint", async () => {
        for (const [m, p] of ENDPOINTS) assert.equal((await call(m, p, "not.a.jwt")).status, 401, `${m} ${p}`);
    });

    for (const role of ["customer", "partner"]) {
        test(`${role} token -> 403 on every admin endpoint`, async () => {
            currentRole = role;
            const token = jwt.sign({ userId: "507f1f77bcf86cd799439011" }, process.env.JWT_SECRET);
            for (const [m, p] of ENDPOINTS) assert.equal((await call(m, p, token)).status, 403, `${m} ${p}`);
        });
    }

    test("a role claim inside the JWT is ignored (DB role wins)", async () => {
        currentRole = "customer";
        const token = jwt.sign({ userId: "507f1f77bcf86cd799439011", role: "admin" }, process.env.JWT_SECRET);
        assert.equal((await call("GET", "/api/admin/dashboard", token)).status, 403);
    });
});