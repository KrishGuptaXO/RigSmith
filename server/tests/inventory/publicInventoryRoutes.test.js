import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

const { default: inventoryRoutes } = await import("../../routes/InventoryRoutes.js");
const { default: Inventory } = await import("../../models/Inventory.js");

// Regression coverage for GET /api/inventory (the public route): user-supplied `search` and
// `category` must be escaped before they become RegExp objects in the MongoDB filter.
// No database here: Inventory.find is stubbed, and we assert on the filter the real route builds.
let server, base, findCalls;
const originalFind = Inventory.find;

// The route does `let query = Inventory.find(filter); query = query.sort(...); await query`,
// so the stub returns a chainable thenable.
const fakeQuery = (results) => {
    const query = {
        sort(spec) {
            findCalls[findCalls.length - 1].sort = spec;
            return query;
        },
        then(resolve, reject) {
            return Promise.resolve(results).then(resolve, reject);
        },
    };
    return query;
};

const get = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${base}/api/inventory${qs ? `?${qs}` : ""}`);
};

const lastFilter = () => findCalls[findCalls.length - 1].filter;
const searchRegexes = () => lastFilter().$or.map((clause) => Object.values(clause)[0]);

describe("GET /api/inventory (public) - regex input is treated literally", () => {
    before(async () => {
        Inventory.find = (filter) => {
            findCalls.push({ filter, sort: null });
            return fakeQuery([]);
        };

        const app = express();
        app.use("/api/inventory", inventoryRoutes);
        server = http.createServer(app);
        await new Promise((resolve) => server.listen(0, resolve));
        base = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => {
        Inventory.find = originalFind;
        server.close();
    });

    beforeEach(() => {
        findCalls = [];
    });

    describe("search", () => {
        test("`.*` is a literal string, not a wildcard", async () => {
            const res = await get({ search: ".*" });
            assert.equal(res.status, 200);
            assert.equal(findCalls.length, 1);

            assert.deepEqual(
                lastFilter().$or.map((clause) => Object.keys(clause)[0]),
                ["name", "brand", "specs"],
            );
            for (const rx of searchRegexes()) {
                assert.ok(rx instanceof RegExp);
                assert.equal(rx.test("price .* list"), true, "should match the literal text .*");
                assert.equal(rx.test("abc"), false, ".* must not match arbitrary text");
                assert.equal(rx.test("Ryzen 5 5600"), false);
            }
        });

        test("`a.b` does not match `axb` (the dot is not a wildcard)", async () => {
            const res = await get({ search: "a.b" });
            assert.equal(res.status, 200);

            for (const rx of searchRegexes()) {
                assert.equal(rx.test("a.b"), true, "should match the literal text a.b");
                assert.equal(rx.test("axb"), false, "a.b must not match axb");
                assert.equal(rx.test("a-b"), false);
            }
        });

        test("normal search `Ryzen` still works and stays case-insensitive", async () => {
            const res = await get({ search: "Ryzen" });
            assert.equal(res.status, 200);

            assert.deepEqual(
                lastFilter().$or.map((clause) => Object.keys(clause)[0]),
                ["name", "brand", "specs"],
            );
            for (const rx of searchRegexes()) {
                assert.ok(rx.flags.includes("i"), "search must stay case-insensitive");
                assert.equal(rx.test("AMD Ryzen 5 5600"), true);
                assert.equal(rx.test("RYZEN"), true);
                assert.equal(rx.test("ryzen"), true);
                assert.equal(rx.test("Intel Core i5"), false);
            }
        });
    });

    describe("category", () => {
        test("`GPU|CPU` is one literal category, not an alternation", async () => {
            const res = await get({ category: "GPU|CPU" });
            assert.equal(res.status, 200);

            const rx = lastFilter().category;
            assert.ok(rx instanceof RegExp);
            assert.equal(rx.test("GPU|CPU"), true, "should match the literal category");
            assert.equal(rx.test("gpu|cpu"), true, "category stays case-insensitive");
            assert.equal(rx.test("GPU"), false, "must not match GPU on its own");
            assert.equal(rx.test("CPU"), false, "must not match CPU on its own");
            assert.equal(rx.test("xGPU|CPUx"), false, "category match stays anchored");
        });

        test("ordinary category is an anchored, case-insensitive exact match", async () => {
            const res = await get({ category: "GPU" });
            assert.equal(res.status, 200);

            const rx = lastFilter().category;
            assert.equal(rx.test("GPU"), true);
            assert.equal(rx.test("gpu"), true);
            assert.equal(rx.test("GPUs"), false);
            assert.equal(rx.test("eGPU"), false);
        });

        test("category `all` adds no category filter", async () => {
            const res = await get({ category: "All" });
            assert.equal(res.status, 200);
            assert.deepEqual(lastFilter(), {});
        });
    });
});