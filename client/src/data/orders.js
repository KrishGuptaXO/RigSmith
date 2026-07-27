import NovaX from "../assets/images/Nova_X.webp";
import PhantomV4 from "../assets/images/Phantom.avif";
import Echo from "../assets/images/Echo.avif";
import Shark from "../assets/images/SharkX.webp";
import Lian from "../assets/images/Lian_Li.webp";
import Star from "../assets/images/StarScream.webp";

const orders = [
    // ── Active / In-Progress ──────────────────────────────────────────────
    {
        id: "RS-2026-001",
        buildId: "nova-x",
        buildName: "Nova X",
        image: NovaX,
        price: "₹3,59,999",
        orderedOn: "2026-07-20",
        completedBy: "2026-08-02",
        shippedBy: "2026-08-05",
        deliveryType: "delivery",   // "delivery" | "pickup"
        status: "building",         // "building" | "shipped" | "delivered" | "completed" | "cancelled"
        address: "221B Baker Street, Andheri West, Mumbai – 400053",
    },
    {
        id: "RS-2026-002",
        buildId: "shark",
        buildName: "Shark X",
        image: Shark,
        price: "₹5,33,439",
        orderedOn: "2026-07-18",
        completedBy: "2026-07-30",
        shippedBy: null,
        deliveryType: "pickup",
        status: "building",
        address: null,
    },
    {
        id: "RS-2026-003",
        buildId: "echo",
        buildName: "Echo",
        image: Echo,
        price: "₹3,49,999",
        orderedOn: "2026-07-10",
        completedBy: "2026-07-22",
        shippedBy: "2026-07-24",
        deliveryType: "delivery",
        status: "shipped",
        address: "42, MG Road, Koramangala, Bengaluru – 560034",
    },

    // ── Past / Completed ─────────────────────────────────────────────────
    {
        id: "RS-2026-004",
        buildId: "phantom",
        buildName: "Phantom V4",
        image: PhantomV4,
        price: "₹1,34,999",
        orderedOn: "2026-06-15",
        completedBy: "2026-06-25",
        shippedBy: "2026-06-27",
        deliveredOn: "2026-06-30",
        deliveryType: "delivery",
        status: "delivered",
        address: "Flat 4C, Sector 18, Noida – 201301",
    },
    {
        id: "RS-2026-005",
        buildId: "frostb",
        buildName: "Frost Byte",
        image: Lian,
        price: "₹3,52,898",
        orderedOn: "2026-05-28",
        completedBy: "2026-06-08",
        shippedBy: null,
        completedOn: "2026-06-09",
        deliveryType: "pickup",
        status: "completed",
        address: null,
    },
    {
        id: "RS-2026-006",
        buildId: "stars",
        buildName: "StarScream",
        image: Star,
        price: "₹1,54,899",
        orderedOn: "2026-05-10",
        completedBy: null,
        shippedBy: null,
        cancelledOn: "2026-05-12",
        deliveryType: "delivery",
        status: "cancelled",
        address: "House No. 7, Civil Lines, Jaipur – 302006",
    },
];

export default orders;