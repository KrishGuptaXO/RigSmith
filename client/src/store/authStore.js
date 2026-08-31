import {create} from "zustand";
import {persist} from "zustand/middleware";

const authStore = create (
    persist (
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            login: (token, user) => {
                set({
                    token,
                    user,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: "rigsmith-auth",
        }
    )
);

export default authStore;