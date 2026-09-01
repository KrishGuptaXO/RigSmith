import {create} from "zustand";
import {persist} from "zustand/middleware";

const authStore = create (
    persist (
        (set, get) => ({
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

            restoreSession: async () => {
                const { token } = get();

                if (!token) {
                    return false;
                }

                try {
                    const response = await fetch ("http://localhost:5000/api/auth/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Session expired");
                    }
                    
                    const data = await response.json();

                    set ({
                        user: data.user,
                        isAuthenticated: true,
                    });

                    return true;
                } catch (error) {
                    console.error("Session restore failed: ", error);

                    set ({
                        token: null,
                        user: null,
                        isAuthenticated: false,
                    });

                    return false;
                }
            },
        }),
        {
            name: "rigsmith-auth",

            onRehydrateStorage: () => {
                return () => {
                    setTimeout (() => {
                        authStore.setState({
                            hasHydrated: true,
                        });
                    }, 0);
                };
            },
        }
    )
);

export default authStore;