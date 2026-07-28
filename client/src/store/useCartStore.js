import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [], // [{ build, quantity, customizations }]

            /** Add a build to cart, or increment qty if already present */
            addItem: (build, customizations = "") => {
                const existing = get().items.find((i) => i.build.id === build.id);
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.build.id === build.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, { build, quantity: 1, customizations }] });
                }
            },

            /** Remove item entirely */
            removeItem: (buildId) => {
                set({ items: get().items.filter((i) => i.build.id !== buildId) });
            },

            /** Update quantity; removes if qty drops to 0 */
            updateQuantity: (buildId, delta) => {
                set({
                    items: get()
                        .items.map((i) =>
                            i.build.id === buildId
                                ? { ...i, quantity: i.quantity + delta }
                                : i
                        )
                        .filter((i) => i.quantity > 0),
                });
            },

            /** Clear all items */
            clearCart: () => set({ items: [] }),

            /** Derived: total item count */
            totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            /** Derived: total price (strips ₹ and commas) */
            totalPrice: () =>
                get().items.reduce((sum, i) => {
                    const raw = i.build.price?.replace(/[₹,]/g, "") ?? "0";
                    return sum + parseFloat(raw) * i.quantity;
                }, 0),
        }),
        {
            name: "rigsmith-cart", // localStorage key
        }
    )
);

export default useCartStore;
