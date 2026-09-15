import { create } from "zustand";
import authStore from "./authStore.js";

const API_URL = "http://localhost:5000/api/wishlist";

const getToken = () => {
    return authStore.getState().token;
};

const normalizeItem = (item) => ({
    ...item,
    id: item._id || item.id,
});

const useWishlistStore = create((set, get) => ({
    buildWishlist: [],
    inventoryWishlist: [],
    loading: false,

    fetchWishlist: async () => {
        const token = getToken();

        if (!token) {
            set({
                buildWishlist: [],
                inventoryWishlist: [],
            });
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
                throw new Error(
                    data.message || "Failed to fetch wishlist."
                );
            }

            set({
                buildWishlist: (data.builds || []).map(normalizeItem),
                inventoryWishlist: (data.inventory || []).map(
                    normalizeItem
                ),
            });
        } catch (error) {
            console.error(
                "Failed to fetch wishlist:",
                error
            );
        } finally {
            set({ loading: false });
        }
    },

    addBuild: async (build) => {
        const token = getToken();

        if (!token) {
            throw new Error(
                "You must be logged in to use the wishlist."
            );
        }

        const buildId = build._id || build.id;

        try {
            const response = await fetch(
                `${API_URL}/build/${buildId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to add build to wishlist."
                );
            }

            set((state) => ({
                buildWishlist: [
                    ...state.buildWishlist,
                    normalizeItem(build),
                ],
            }));

            return true;
        } catch (error) {
            console.error(
                "Failed to add build to wishlist:",
                error
            );
            throw error;
        }
    },

    removeBuild: async (id) => {
        const token = getToken();

        if (!token) {
            throw new Error(
                "You must be logged in to use the wishlist."
            );
        }

        try {
            const response = await fetch(
                `${API_URL}/build/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to remove build from wishlist."
                );
            }

            set((state) => ({
                buildWishlist: state.buildWishlist.filter(
                    (build) => build.id !== id
                ),
            }));

            return true;
        } catch (error) {
            console.error(
                "Failed to remove build from wishlist:",
                error
            );
            throw error;
        }
    },

    addInventory: async (product) => {
        const token = getToken();

        if (!token) {
            throw new Error(
                "You must be logged in to use the wishlist."
            );
        }

        const inventoryId = product._id || product.id;

        try {
            const response = await fetch(
                `${API_URL}/inventory/${inventoryId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to add item to wishlist."
                );
            }

            set((state) => ({
                inventoryWishlist: [
                    ...state.inventoryWishlist,
                    normalizeItem(product),
                ],
            }));

            return true;
        } catch (error) {
            console.error(
                "Failed to add inventory item to wishlist:",
                error
            );
            throw error;
        }
    },

    removeInventory: async (id) => {
        const token = getToken();

        if (!token) {
            throw new Error(
                "You must be logged in to use the wishlist."
            );
        }

        try {
            const response = await fetch(
                `${API_URL}/inventory/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to remove item from wishlist."
                );
            }

            set((state) => ({
                inventoryWishlist:
                    state.inventoryWishlist.filter(
                        (item) => item.id !== id
                    ),
            }));

            return true;
        } catch (error) {
            console.error(
                "Failed to remove inventory item from wishlist:",
                error
            );
            throw error;
        }
    },

    toggleBuild: async (build) => {
        const id = build._id || build.id;

        const exists = get().buildWishlist.some(
            (item) => item.id === id
        );

        if (exists) {
            await get().removeBuild(id);
        } else {
            await get().addBuild(build);
        }
    },

    toggleInventory: async (product) => {
        const id = product._id || product.id;

        const exists = get().inventoryWishlist.some(
            (item) => item.id === id
        );

        if (exists) {
            await get().removeInventory(id);
        } else {
            await get().addInventory(product);
        }
    },

    isBuildWishlisted: (id) =>
        get().buildWishlist.some(
            (build) => build.id === id
        ),

    isInventoryWishlisted: (id) =>
        get().inventoryWishlist.some(
            (item) => item.id === id
        ),
}));

export default useWishlistStore;