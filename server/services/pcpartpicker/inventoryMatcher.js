const CATEGORY_COMPATIBILITY = {
    CPU: ["CPU"],
    "CPU Cooler": ["CPU Cooler"],
    Motherboard: ["Motherboard"],
    RAM: ["RAM"],
    GPU: ["GPU"],
    Storage: ["SSD", "HDD"],
    Case: ["Case"],
    "Power Supply": ["Power Supply"],
    "Case Fans": ["Case Fans"],
};

/**
 * Normalizes text for comparison without changing the original values.
 */
function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Returns the inventory categories that can satisfy a parsed PCPartPicker type.
 */
function getCompatibleCategories(type) {
    return CATEGORY_COMPATIBILITY[type] || [];
}

/**
 * Checks whether the requested component name strongly identifies
 * the inventory item.
 *
 * We intentionally avoid fuzzy matching here. Similar-looking hardware
 * models should not be treated as the same product.
 */
function isStrongNameMatch(requestedName, inventoryItem) {
    const requested = normalizeText(requestedName);
    const inventoryName = normalizeText(inventoryItem.name);

    if (!requested || !inventoryName) {
        return false;
    }

    // Exact normalized match.
    if (requested === inventoryName) {
        return true;
    }

    // Inventory name contained inside the PCPartPicker name.
    //
    // Example:
    // "AMD Ryzen 7 7800X3D 4.2 GHz 8-Core Processor"
    // contains:
    // "Ryzen 7 7800X3D"
    if (requested.includes(inventoryName)) {
        return true;
    }

    return false;
}

/**
 * Matches one parsed PCPartPicker component against RigSmith inventory.
 *
 * Returns null when no strong match exists.
 */
function findExactMatch(component, inventoryItems) {
    const compatibleCategories = getCompatibleCategories(component.type);

    if (compatibleCategories.length === 0) {
        return null;
    }

    const categoryItems = inventoryItems.filter((item) =>
        compatibleCategories.some(
            (category) =>
                normalizeText(item.category) === normalizeText(category)
        )
    );

    const matches = categoryItems.filter((item) =>
        isStrongNameMatch(component.name, item)
    );

    if (matches.length === 0) {
        return null;
    }

    /*
     * If multiple inventory records somehow match the same requested name,
     * prefer the one whose brand also appears in the requested name.
     */
    const requestedName = normalizeText(component.name);

    const brandMatch = matches.find((item) =>
        item.brand &&
        requestedName.includes(normalizeText(item.brand))
    );

    return brandMatch || matches[0];
}

/**
 * Matches all parsed PCPartPicker components against RigSmith inventory.
 *
 * This function does not query MongoDB.
 * The caller supplies the inventory records.
 */
export function matchComponents(components, inventoryItems) {
    if (!Array.isArray(components)) {
        throw new TypeError("Components must be an array.");
    }

    if (!Array.isArray(inventoryItems)) {
        throw new TypeError("Inventory items must be an array.");
    }

    return components.map((component) => {
        const match = findExactMatch(component, inventoryItems);

        return {
            requested: component,

            match: match
                ? {
                      inventoryId: match._id,
                      item: match,
                  }
                : null,

            status: match ? "matched" : "unavailable",
        };
    });
}

export {
    CATEGORY_COMPATIBILITY,
    getCompatibleCategories,
    normalizeText,
};