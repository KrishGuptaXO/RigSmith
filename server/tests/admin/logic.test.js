import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ORDER_STATUSES, ORDER_TRANSITIONS, canTransition } from "../../utils/orderStatus.js";
import { validateInventoryInput } from "../../utils/inventoryValidation.js";
import { escapeRegex, parsePagination, HttpError } from "../../utils/helper.js";
import Order from "../../models/Order.js";

describe("order status transitions", () => {
    test("transition map covers exactly the statuses in the Order model", () => {
        const modelStatuses = Order.schema.path("status").enumValues;
        assert.deepEqual([...ORDER_STATUSES].sort(), [...modelStatuses].sort());
        assert.deepEqual(Object.keys(ORDER_TRANSITIONS).sort(), [...modelStatuses].sort());
    });

    test("allows the forward path and early cancellation", () => {
        assert.ok(canTransition("pending", "confirmed"));
        assert.ok(canTransition("confirmed", "processing"));
        assert.ok(canTransition("processing", "shipped"));
        assert.ok(canTransition("shipped", "delivered"));
        assert.ok(canTransition("pending", "cancelled"));
        assert.ok(canTransition("processing", "cancelled"));
    });

    test("blocks skipping, going backwards, and leaving terminal states", () => {
        assert.ok(!canTransition("pending", "shipped"));
        assert.ok(!canTransition("shipped", "processing"));
        assert.ok(!canTransition("shipped", "cancelled"));
        assert.ok(!canTransition("delivered", "cancelled"));
        assert.ok(!canTransition("cancelled", "pending"));
        assert.ok(!canTransition("pending", "pending"));
        assert.ok(!canTransition("bogus", "pending"));
    });
});

describe("validateInventoryInput", () => {
    const valid = { name: " RTX 5090 ", brand: "NVIDIA", category: "GPU", image: "/images/inventory/x.webp", price: "1999.999", stock: 4, specs: [" 32GB ", ""] };

    test("trims, rounds price and cleans specs", () => {
        const out = validateInventoryInput(valid);
        assert.equal(out.name, "RTX 5090");
        assert.equal(out.price, 2000);
        assert.deepEqual(out.specs, ["32GB"]);
    });

    test("ignores fields that must not be writable (mass assignment)", () => {
        const out = validateInventoryInput({ ...valid, _id: "x", id: 999, createdAt: "2020-01-01", role: "admin" });
        for (const k of ["_id", "id", "createdAt", "role"]) assert.ok(!(k in out), k);
    });

    test("rejects negative/NaN price and fractional/negative stock", () => {
        for (const bad of [{ price: -1 }, { price: "abc" }, { price: "" }, { stock: -1 }, { stock: 1.5 }, { stock: "" }]) {
            assert.throws(() => validateInventoryInput({ ...valid, ...bad }), HttpError);
        }
    });

    test("rejects missing required fields and bad image", () => {
        assert.throws(() => validateInventoryInput({ ...valid, name: "  " }), HttpError);
        assert.throws(() => validateInventoryInput({ ...valid, image: "javascript:alert(1)" }), HttpError);
    });

    test("partial mode only validates supplied fields", () => {
        assert.deepEqual(validateInventoryInput({ stock: 0 }, { partial: true }), { stock: 0 });
        assert.throws(() => validateInventoryInput({ price: -5 }, { partial: true }), HttpError);
    });
});

describe("helpers", () => {
    test("escapeRegex neutralises regex metacharacters", () => {
        assert.equal(new RegExp(escapeRegex("a.b(c)*")).test("a.b(c)*"), true);
        assert.equal(new RegExp(escapeRegex("a.b")).test("axb"), false);
    });

    test("parsePagination clamps values", () => {
        assert.deepEqual(parsePagination({ page: "-3", limit: "9999" }), { page: 1, limit: 100, skip: 0 });
        assert.deepEqual(parsePagination({ page: "3", limit: "10" }), { page: 3, limit: 10, skip: 20 });
    });
});