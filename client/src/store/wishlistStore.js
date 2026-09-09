import {create} from "zustand";
import authStore from "./authStore.js";

const API_URL = "http://localhost:5000/api/wishlist";

const getToken = () => {
    return authStore.getState().token;
}

const normalizeItem = (item) => ({
    ...item,
    id: item._id || item.id,
});

const useWishlistStore = create((set,get) => ({
    wishlist: [],
    loading: false,

    fetchWishlist: async () => {
        const token = getToken();

        if (!token) {
            set ({wishlist: []});
            return;
        }

        set ({ loading: true });

        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error (
                    data.message || "Failed to fetch wishlist."
                );
            }

            set ({
                wishlist: data.map(normalizeItem),
            });
        } catch (error) {
            console.error ("Failed to fetch wishlist: ", error);
        } finally {
            set ({ loading: false });
        }
    },

    addBuild: async (build) => {
        const token = getToken();

        if (!token) return;

        const inventoryId = build._id || build.id;

        try {
            const response = await fetch (
                `${API_URL}/${inventoryId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error (
                    data.message || "Failed to add item to wishlist."
                );
            }

            set((state) => ({
                wishlist: [
                    ...state.wishlist,
                    normalizeItem(build),
                ],
            }));
        } catch (error) {
            console.error("Failed to add item to wishlist: ", error);
            throw error;
        }
    },

    removeBuild: async (id) => {
        const token = getToken();

        if (!token) return;

        try {
            const response = await fetch (
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error (
                    data.message || "Failed to remove item from wishlist."
                );
            }

            set((store) => ({
                wishlist: state.wishlist.filter(
                    (build) => build.id !== id
                ),
            }));
        } catch (error) {
            console.error ("Failed to remove item from wishlist: ", error);
            throw error;
        }
    },

    toggleBuild: async (build) => {
        const id = build.id || build._id;

        const exists = get().wishlist.some(
            (item) => item.id === id
        );

        if (exists) {
            await get().removeBuild(id);
        } else {
            await get().addBuild(id);
        }
    },

    isWishlisted: (id) => 
        get().wishlist.some(
            (build) => (build.id) === id
        ),
}));

export default useWishlistStore;