import dotenv from "dotenv";
import mongoose from "mongoose";
import Inventory from "./models/Inventory.js";
import Build from "./models/Build.js";

dotenv.config();

const builds = [
    {
        name: "Echo",
        image: "/images/builds/Echo.avif",
        price: 349999,
        emi: "Starting at ₹9,722/month",
        warranty: {
            duration: "3 Years",
            coverage: "On-site + Parts Replacement",
        },
        componentIds: [7, 2, 13, 19, 24, 30, 36, 42],
        specs: [
            {
                label: "Operating System",
                value: "Windows 11 Pro",
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7 + Bluetooth 5.4",
            },
        ],
    },

    {
        name: "Shark X",
        image: "/images/builds/SharkX.webp",
        price: 533439,
        emi: "Starting at ₹14,851/month",
        warranty: {
            duration: "5 Years",
            coverage: "Premium On-site Support",
        },
        componentIds: [8, 3, 14, 20, 25, 31, 37, 43],
        specs: [
            {
                label: "Operating System",
                value: "Windows 11 Pro",
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7 + Bluetooth 5.4",
            },
        ],
    },

    {
        name: "Frost Byte",
        image: "/images/builds/Lian_Li.webp",
        price: 352898,
        emi: "Starting at ₹9,806/month",
        warranty: {
            duration: "3 Years",
            coverage: "Parts + Labor",
        },
        componentIds: [9, 4, 15, 21, 26, 32, 38, 44],
        specs: [
            {
                label: "Operating System",
                value: "Windows 11 Home",
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7",
            },
        ],
    },

    {
        name: "Nova X",
        image: "/images/builds/Nova_X.webp",
        price: 359999,
        emi: "Starting at ₹11,917/month",
        warranty: {
            duration: "5 Years",
            coverage: "Premium Care + Lifetime Technical Support",
        },
        componentIds: [10, 1, 16, 20, 25, 33, 39, 45],
        specs: [
            {
                label: "Operating System",
                value: "Windows 11 Pro",
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7 + Bluetooth 5.4",
            },
        ],
    },

    {
        name: "Phantom V4",
        image: "/images/builds/Phantom.avif",
        price: 134999,
        emi: "Starting at ₹3,758/month",
        warranty: {
            duration: "3 Years",
            coverage: "Parts + Labor",
        },
        componentIds: [11, 5, 17, 22, 27, 34, 40, 46],
        specs: [
            {
                label: "Operating System",
                value: "Windows 11 Home",
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 6E + Bluetooth 5.3",
            },
        ],
    },

    {
        name: "StarScream",
        image: "/images/builds/StarScream.webp",
        price: 154899,
        emi: "Starting at ₹4,312/month",
        warranty: {
            duration: "1 Year",
            coverage: "Limited Hardware Warranty",
        },
        componentIds: [12, 6, 18, 23, 28, 29, 35, 41],
        specs: [
            {
                label: "Operating System",
                value: "Windows 10 Pro",
            },
            {
                label: "Connectivity",
                value: "Gigabit Ethernet",
            },
        ],
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected.");

        const inventory = await Inventory.find();

        const getInventoryId = (id) => {
            const item = inventory.find((product) => product.id === id);

            if (!item) {
                throw new Error(`Inventory item with id ${id} not found.`);
            }

            return item._id;
        };

        const buildDocuments = builds.map((build) => ({
            name: build.name,
            image: build.image,
            price: build.price,
            emi: build.emi,
            warranty: build.warranty,
            specs: build.specs,
            components: build.componentIds.map((id) => ({
                inventoryId: getInventoryId(id),
                quantity: 1,
            })),
        }));

        await Build.deleteMany();
        await Build.insertMany(buildDocuments);

        console.log("Builds seeded successfully.");
        console.log(`Seeded ${buildDocuments.length} builds.`);

        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();