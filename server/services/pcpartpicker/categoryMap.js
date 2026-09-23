/**
 * Types RigSmith explicitly understands today (used later for inventory
 * matching). This list is informational, not a filter: a raw type that
 * doesn't appear here is NOT discarded — normalizeType() passes it through
 * unchanged so nothing pasted by the user silently disappears.
 */
export const SUPPORTED_TYPES = [
    "CPU",
    "CPU Cooler",
    "Motherboard",
    "RAM",
    "GPU",
    "Storage",
    "Case",
    "Power Supply",
    "Case Fans",
];

// Keys are lower-cased, trimmed PCPartPicker labels as they appear before
// the ":" in a copied part list line (e.g. "Memory: ...", "Video Card: ...").
const TYPE_ALIASES = new Map([
    ["cpu", "CPU"],
    ["cpu cooler", "CPU Cooler"],
    ["motherboard", "Motherboard"],

    ["memory", "RAM"],
    ["ram", "RAM"],

    ["video card", "GPU"],
    ["gpu", "GPU"],
    ["graphics card", "GPU"],

    ["storage", "Storage"],
    ["internal hard drive", "Storage"],
    ["solid state drive", "Storage"],

    ["case", "Case"],

    ["power supply", "Power Supply"],
    ["psu", "Power Supply"],

    ["case fan", "Case Fans"],
    ["case fans", "Case Fans"],
    ["fan", "Case Fans"],
]);

/**
 * Normalizes a raw PCPartPicker type label (e.g. "Memory", "Video Card") to
 * RigSmith's canonical name (e.g. "RAM", "GPU") where a mapping is known.
 * For any type RigSmith doesn't have a mapping for (e.g. "Headphones",
 * "Monitor", "Operating System"), the original label is returned unchanged
 * rather than being collapsed into a generic bucket — see SUPPORTED_TYPES.
 *
 * @param {string} rawType
 * @returns {string}
 */
export function normalizeType(rawType) {
    if (!rawType) {
        return rawType;
    }

    const key = rawType.trim().toLowerCase();
    return TYPE_ALIASES.get(key) || rawType.trim();
}