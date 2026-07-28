import {
    House,
    Cpu,
    PackageOpen,
    Cog
} from 'lucide-react';

export const navigation = [
    {
        label: "Home",
        path: "/",
        icon: House,
    },
    {
        label: "Inventory",
        path: "/builds",
        icon: Cpu,
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