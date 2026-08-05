import {
    Wrench,
    Package,
    CreditCard,
    Truck,
    TriangleAlert,
} from "lucide-react";

const notifications = [
    {
        id: 1,
        type: "build",
        icon: Wrench,
        title: "Your Nova_X build is ready.",
        time: "2 mins ago",
        color: "text-purple-400",
        unread: true,
    },
    {
        id: 2,
        type: "shipping",
        icon: Truck,
        title: "Echo has been shipped.",
        time: "Yesterday",
        color: "text-cyan-400",
        unread: true,
    },
    {
        id: 3,
        type: "payment",
        icon: CreditCard,
        title: "Payment of ₹3,49,999 received.",
        time: "2 days ago",
        color: "text-green-400",
        unread: false,
    },
    {
        id: 4,
        type: "order",
        icon: Package,
        title: "Order #RS-2026-014 confirmed.",
        time: "3 days ago",
        color: "text-blue-400",
        unread: false,
    },
    {
        id: 6,
        type: "warning",
        icon: TriangleAlert,
        title: "Warranty expiring in 30 days.",
        time: "1 week ago",
        color: "text-amber-400",
        unread: false,
    }, 
];

export default notifications;