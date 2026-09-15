import { create } from "zustand";
import  authStore from "./authStore.js";

const API_URL = "http://localhost:5000/api/cart";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.getState().token}`,
});

const normalizeItem = (item) => {
    if (item.itemType === "build") {
        return {
            itemType: "build",
            build: {
                ...item.buildId,
                id: item.buildId?._id,
            },
            quantity: item.quantity,
            customizations: item.customizations || "",
        };
    }

    return {
        itemType: "inventory",
        build: {
            ...item.inventoryId,
            id: item.inventoryId?._id,
        },
        quantity: item.quantity,
        customizations: item.customizations || "",
    };
};

const useCartStore = create((set, get) => ({
    items: [],
    loading: false,

    fetchCart: async () => {
        try {
            set({ loading: true });

            const response = await fetch(API_URL, {
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await response.json();

            set({
                items: data.items.map(normalizeItem),
                loading: false,
            });
        } catch (error) {
            console.error("Fetch cart error:", error);
            set({ loading: false });
        }
    },

    addItem: async (item, customizations = "") => {
        try {
            const isBuild = item.components && item._id;

            const body = isBuild
                ? {
                      itemType: "build",
                      buildId: item._id,
                      quantity: 1,
                      customizations,
                  }
                : {
                      itemType: "inventory",
                      inventoryId: item._id,
                      quantity: 1,
                      customizations,
                  };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add item");
            }

            const data = await response.json();

            set({
                items: data.items.map(normalizeItem),
            });

            return true;
        } catch (error) {
            console.error("Add to cart error: ", error);
            throw error;
        }
    },

    updateQuantity: async (itemId, quantity, itemType) => {
        try {
            const response = await fetch(`${API_URL}/${itemId}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({
                    quantity,
                    itemType,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update cart");
            }

            const data = await response.json();

            set({
                items: data.items.map(normalizeItem),
            });
        } catch (error) {
            console.error("Update cart error:", error);
        }
    },

    removeItem: async (itemId, itemType) => {
        try {
            const response = await fetch(
                `${API_URL}/${itemId}?itemType=${itemType}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove item");
            }

            const data = await response.json();

            set({
                items: data.items.map(normalizeItem),
            });
        } catch (error) {
            console.error("Remove cart item error:", error);
        }
    },

    clearCart: async () => {
        try {
            const response = await fetch(API_URL, {
                method: "DELETE",
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error("Failed to clear cart");
            }

            set({ items: [] });
        } catch (error) {
            console.error("Clear cart error:", error);
        }
    },

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            return total + (item.build?.price || 0) * item.quantity;
        }, 0),
}));

export default useCartStore;