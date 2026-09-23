import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
    matchComponents,
    getCompatibleCategories,
    normalizeText,
} from "../../services/pcpartpicker/inventoryMatcher.js";

const INVENTORY = [
    {
        _id: "cpu-9800x3d",
        category: "CPU",
        name: "Ryzen 7 9800X3D",
        brand: "AMD",
        price: 54999,
        stock: 3,
        specs: ["8 Cores", "16 Threads", "AM5", "120W"],
    },
    {
        _id: "cpu-9850x3d",
        category: "CPU",
        name: "Ryzen 7 9850X3D",
        brand: "AMD",
        price: 59999,
        stock: 5,
        specs: ["8 Cores", "16 Threads", "AM5", "120W"],
    },
    {
        _id: "gpu-5070ti",
        category: "GPU",
        name: "GeForce RTX 5070 Ti Gaming OC",
        brand: "Gigabyte",
        price: 79999,
        stock: 12,
        specs: ["16GB GDDR7", "PCIe 5.0", "Factory OC", "RGB"],
    },
    {
        _id: "ssd-990pro",
        category: "SSD",
        name: "Samsung 990 Pro",
        brand: "Samsung",
        price: 15999,
        stock: 0,
        specs: ["2TB", "PCIe Gen4", "7450 MB/s"],
    },
    {
        _id: "ssd-9100pro",
        category: "SSD",
        name: "Samsung 9100 PRO",
        brand: "Samsung",
        price: 34999,
        stock: 5,
        specs: ["4TB", "PCIe Gen5", "High Performance"],
    },
    {
        _id: "hdd-2tb",
        category: "HDD",
        name: "WD Blue 2TB HDD",
        brand: "Western Digital",
        price: 4999,
        stock: 5,
        specs: ["2TB", "SATA", "7200 RPM"],
    },
];

describe("inventoryMatcher", () => {
    test("normalizes comparison text", () => {
        assert.equal(
            normalizeText("  Ryzen 7 9800X3D  "),
            "ryzen 7 9800x3d"
        );
    });

    test("returns compatible inventory categories for Storage", () => {
        assert.deepEqual(getCompatibleCategories("Storage"), [
            "SSD",
            "HDD",
        ]);
    });

    test("matches a PCPartPicker CPU to the RigSmith inventory", () => {
        const components = [
            {
                type: "CPU",
                name: "AMD Ryzen 7 9800X3D 4.7 GHz 8-Core Processor",
                quantity: 1,
                sourcePrice: 599,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result.length, 1);
        assert.equal(result[0].status, "matched");
        assert.equal(result[0].match.inventoryId, "cpu-9800x3d");
    });

    test("does not falsely match a similar CPU model", () => {
        const components = [
            {
                type: "CPU",
                name: "AMD Ryzen 7 7800X3D 4.2 GHz 8-Core Processor",
                quantity: 1,
                sourcePrice: 366.49,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result[0].status, "unavailable");
        assert.equal(result[0].match, null);
    });

    test("matches a GPU when the inventory name appears inside the PCPartPicker name", () => {
        const components = [
            {
                type: "GPU",
                name: "Gigabyte GeForce RTX 5070 Ti Gaming OC 16 GB",
                quantity: 1,
                sourcePrice: 799,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result[0].status, "matched");
        assert.equal(result[0].match.inventoryId, "gpu-5070ti");
    });

    test("matches Storage against both SSD and HDD categories", () => {
        const components = [
            {
                type: "Storage",
                name: "Samsung 990 Pro 2TB",
                quantity: 1,
                sourcePrice: 150,
                sourceRetailer: "Amazon",
            },
            {
                type: "Storage",
                name: "WD Blue 2TB HDD",
                quantity: 1,
                sourcePrice: 50,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result[0].status, "matched");
        assert.equal(result[0].match.inventoryId, "ssd-990pro");

        assert.equal(result[1].status, "matched");
        assert.equal(result[1].match.inventoryId, "hdd-2tb");
    });

    test("preserves an exact match even when the item is out of stock", () => {
        const components = [
            {
                type: "Storage",
                name: "Samsung 990 Pro 2TB",
                quantity: 1,
                sourcePrice: 159.99,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result[0].status, "matched");
        assert.equal(result[0].match.inventoryId, "ssd-990pro");
        assert.equal(result[0].match.item.stock, 0);
    });

    test("marks unsupported categories as unavailable", () => {
        const components = [
            {
                type: "Headphones",
                name: "HP HyperX Cloud II 7.1 Channel Headset",
                quantity: 1,
                sourcePrice: 49.99,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result[0].status, "unavailable");
        assert.equal(result[0].match, null);
    });

    test("handles multiple components", () => {
        const components = [
            {
                type: "CPU",
                name: "AMD Ryzen 7 9800X3D 4.7 GHz 8-Core Processor",
                quantity: 1,
                sourcePrice: 599,
                sourceRetailer: "Amazon",
            },
            {
                type: "GPU",
                name: "Gigabyte GeForce RTX 5070 Ti Gaming OC 16 GB",
                quantity: 1,
                sourcePrice: 799,
                sourceRetailer: "Amazon",
            },
            {
                type: "Headphones",
                name: "HP HyperX Cloud II 7.1 Channel Headset",
                quantity: 1,
                sourcePrice: 49.99,
                sourceRetailer: "Amazon",
            },
        ];

        const result = matchComponents(components, INVENTORY);

        assert.equal(result.length, 3);
        assert.equal(result[0].status, "matched");
        assert.equal(result[1].status, "matched");
        assert.equal(result[2].status, "unavailable");
    });

    test("rejects invalid component input", () => {
        assert.throws(
            () => matchComponents(null, INVENTORY),
            TypeError
        );
    });

    test("rejects invalid inventory input", () => {
        assert.throws(
            () => matchComponents([], null),
            TypeError
        );
    });
});