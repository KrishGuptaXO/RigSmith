import { create } from "zustand";
import authStore from "./authStore";

const API_URL = "http://localhost:5000/api/cart";

const getToken = () => authStore.getState().token;

const normalizeItem = (item) => ({
    build: {
        ...item.inventoryId,
        id: item.inventoryId._id,
    },
    quantity: item.quantity,
    customizations: item.customizations || "",
});

const normalizeCart = (cart) => ({
    items: cart.items.map(normalizeItem),
});

const useCartStore = create((set, get) => ({
    items: [],
    loading: false,

    // Fetch cart from backend
    fetchCart: async () => {
        const token = getToken();

        if (!token) {
            set({ items: [] });
            return;
        }

        set({ loading: true });

        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch cart.");
            }

            set(normalizeCart(data));
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            set({ loading: false });
        }
    },

    // Add item to cart
    addItem: async (build, customizations = "") => {
        const token = getToken();

        if (!token) {
            throw new Error("You must be logged in to add items to cart.");
        }

        const inventoryId = build._id || build.id;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    inventoryId,
                    quantity: 1,
                    customizations,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add item to cart.");
            }

            set(normalizeCart(data));
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        }
    },

    // Remove item completely
    removeItem: async (buildId) => {
        const token = getToken();

        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/${buildId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to remove item from cart."
                );
            }

            set(normalizeCart(data));
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        }
    },

    // Change quantity by delta (+1 / -1)
    updateQuantity: async (buildId, delta) => {
        const token = getToken();

        if (!token) return;

        const item = get().items.find(
            (item) => item.build.id === buildId
        );

        if (!item) return;

        const newQuantity = item.quantity + delta;

        try {
            if (newQuantity <= 0) {
                await get().removeItem(buildId);
                return;
            }

            const response = await fetch(`${API_URL}/${buildId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: newQuantity,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update cart."
                );
            }

            set(normalizeCart(data));
        } catch (error) {
            console.error("Failed to update cart:", error);
            throw error;
        }
    },

    // Clear entire cart
    clearCart: async () => {
        const token = getToken();

        if (!token) return;

        try {
            const response = await fetch(API_URL, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to clear cart."
                );
            }

            set({ items: [] });
        } catch (error) {
            console.error("Failed to clear cart:", error);
            throw error;
        }
    },

    // Derived: total item count
    totalCount: () =>
        get().items.reduce(
            (sum, item) => sum + item.quantity,
            0
        ),

    // Derived: total price
    totalPrice: () =>
        get().items.reduce((sum, item) => {
            const price = Number(item.build.price) || 0;

            return sum + price * item.quantity;
        }, 0),
}));

export default useCartStore;