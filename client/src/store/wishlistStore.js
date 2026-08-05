import {create} from "zustand";

const useWishlistStore = create((set,get) => ({
    wishlist: [],

    addBuild: (build) =>
        set((state) => ({
            wishlist: [...state.wishlist, build],
        })),
    
        removeBuild: (id) =>
        set((state) => ({
            wishlist: state.wishlist.filter(
                (build) => build.id !== id
            ),
        })),
    
    toggleBuild: (build) => {
        const exists = get().wishlist.some(
            (item) => item.id === build.id
        );

        if (exists) {
            get().removeBuild(build.id);
        } else {
            get().addBuild(build);
        }
    },

    isWishlisted: (id) =>
        get().wishlist.some(
            (build) => build.id === id
        ),
}));

export default useWishlistStore;