import {
    House,
    Cpu,
    PackageOpen,
    Cog,
    Heart
} from 'lucide-react';

export const navigation = [
    {
        label: "Home",
        path: "/",
        icon: House,
    },
    {
        label: "Inventory",
        path: "/inventory",
        icon: Cpu,
    },
    {
        label: "Wishlist",
        path: "/wishlisted-builds",
        icon: Heart,
    },
    {
        label: "Orders",
        path: "/orders",
        icon: PackageOpen,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Cog,
    },
];