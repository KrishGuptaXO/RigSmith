import dotenv from "dotenv";
import mongoose from "mongoose";
import Inventory from "./models/Inventory.js";

dotenv.config();

const inventory = [
    // =========================
    // GPUs
    // =========================
    {
        id: 1,
        category: "GPU",
        name: "RTX 5070 Ti Gaming OC",
        brand: "Gigabyte",
        image: "/images/inventory/Gb-5070-Ti.webp",
        price: 79999,
        stock: 12,
        specs: [
            "16GB GDDR7",
            "PCIe 5.0",
            "Factory OC",
            "RGB",
        ],
    },
    {
        id: 2,
        category: "GPU",
        name: "RTX 5080 16GB",
        brand: "NVIDIA",
        image: "/images/inventory/RTX-5080.webp",
        price: 129999,
        stock: 8,
        specs: [
            "16GB GDDR7",
            "PCIe 5.0",
            "Ray Tracing",
            "DLSS 4",
        ],
    },
    {
        id: 3,
        category: "GPU",
        name: "RTX 4070 Super 32GB",
        brand: "NVIDIA",
        image: "/images/inventory/RTX-4070-Super.webp",
        price: 84999,
        stock: 6,
        specs: [
            "32GB",
            "PCIe 4.0",
            "Ray Tracing",
            "DLSS 3",
        ],
    },
    {
        id: 4,
        category: "GPU",
        name: "RTX 5070 Ti White Edition",
        brand: "MSI",
        image: "/images/inventory/MSI-5070-Ti-White.webp",
        price: 82999,
        stock: 7,
        specs: [
            "16GB GDDR7",
            "PCIe 5.0",
            "White Edition",
            "RGB",
        ],
    },
    {
        id: 5,
        category: "GPU",
        name: "RTX 5060 Ti 16GB",
        brand: "PNY",
        image: "/images/inventory/PNY-5060-Ti.webp",
        price: 54999,
        stock: 10,
        specs: [
            "16GB GDDR7",
            "PCIe 5.0",
            "Ray Tracing",
            "DLSS 4",
        ],
    },
    {
        id: 6,
        category: "GPU",
        name: "GeForce GTX Titan 6GB",
        brand: "NVIDIA",
        image: "/images/inventory/GTX-Titan.webp",
        price: 39999,
        stock: 4,
        specs: [
            "6GB GDDR5",
            "384-bit",
            "PCIe 3.0",
            "Legacy GPU",
        ],
    },

    // =========================
    // CPUs
    // =========================
    {
        id: 7,
        category: "CPU",
        name: "Ryzen 7 9800X3D",
        brand: "AMD",
        image: "/images/inventory/A-R7-9800x3d.webp",
        price: 54999,
        stock: 3,
        specs: [
            "8 Cores",
            "16 Threads",
            "AM5",
            "120W",
        ],
    },
    {
        id: 8,
        category: "CPU",
        name: "Core i7 14700F",
        brand: "Intel",
        image: "/images/inventory/Intel-i7-14700F.webp",
        price: 38999,
        stock: 7,
        specs: [
            "20 Cores",
            "28 Threads",
            "LGA1700",
            "65W",
        ],
    },
    {
        id: 9,
        category: "CPU",
        name: "Core i9 9900K",
        brand: "Intel",
        image: "/images/inventory/Intel-i9-9900K.webp",
        price: 29999,
        stock: 3,
        specs: [
            "8 Cores",
            "16 Threads",
            "LGA1151",
            "95W",
        ],
    },
    {
        id: 10,
        category: "CPU",
        name: "Ryzen 7 9850X3D",
        brand: "AMD",
        image: "/images/inventory/R7-9850X3D.webp",
        price: 59999,
        stock: 5,
        specs: [
            "8 Cores",
            "16 Threads",
            "AM5",
            "120W",
        ],
    },
    {
        id: 11,
        category: "CPU",
        name: "Ryzen 5 9600X",
        brand: "AMD",
        image: "/images/inventory/R5-9600X.webp",
        price: 24999,
        stock: 9,
        specs: [
            "6 Cores",
            "12 Threads",
            "AM5",
            "65W",
        ],
    },
    {
        id: 12,
        category: "CPU",
        name: "Xeon X5675",
        brand: "Intel",
        image: "/images/inventory/Xeon-X5675.webp",
        price: 12999,
        stock: 2,
        specs: [
            "6 Cores",
            "12 Threads",
            "LGA1366",
            "95W",
        ],
    },

    // =========================
    // Motherboards
    // =========================
    {
        id: 13,
        category: "Motherboard",
        name: "MSI MAG X870 Tomahawk WiFi",
        brand: "MSI",
        image: "/images/inventory/MSI-X870-Tomahawk.webp",
        price: 32999,
        stock: 5,
        specs: [
            "AMD X870",
            "AM5",
            "Wi-Fi 7",
            "DDR5",
        ],
    },
    {
        id: 14,
        category: "Motherboard",
        name: "ASUS ROG Crosshair X870E Hero",
        brand: "ASUS",
        image: "/images/inventory/ASUS-X870E-Hero.webp",
        price: 69999,
        stock: 3,
        specs: [
            "AMD X870E",
            "AM5",
            "Wi-Fi 7",
            "DDR5",
        ],
    },
    {
        id: 15,
        category: "Motherboard",
        name: "Gigabyte Z890 AORUS Elite ICE",
        brand: "Gigabyte",
        image: "/images/inventory/Gigabyte-Z890-Aorus.webp",
        price: 36999,
        stock: 4,
        specs: [
            "Intel Z890",
            "LGA1851",
            "DDR5",
            "White Edition",
        ],
    },
    {
        id: 16,
        category: "Motherboard",
        name: "MSI MEG X870E GODLIKE",
        brand: "MSI",
        image: "/images/inventory/MSI-X870E-Godlike.webp",
        price: 109999,
        stock: 2,
        specs: [
            "AMD X870E",
            "AM5",
            "Wi-Fi 7",
            "DDR5",
        ],
    },
    {
        id: 17,
        category: "Motherboard",
        name: "MSI B650M Gaming Plus WiFi",
        brand: "MSI",
        image: "/images/inventory/MSI-B650M-Gaming.webp",
        price: 16999,
        stock: 8,
        specs: [
            "AMD B650",
            "AM5",
            "Wi-Fi 6E",
            "DDR5",
        ],
    },
    {
        id: 18,
        category: "Motherboard",
        name: "ASUS Rampage III Extreme",
        brand: "ASUS",
        image: "/images/inventory/ASUS-Rampage-III.webp",
        price: 19999,
        stock: 1,
        specs: [
            "Intel X58",
            "LGA1366",
            "DDR3",
            "Legacy Motherboard",
        ],
    },

    // =========================
    // RAM
    // =========================
    {
        id: 19,
        category: "RAM",
        name: "Corsair Dominator Titanium",
        brand: "Corsair",
        image: "/images/inventory/C-32gb.webp",
        price: 18499,
        stock: 25,
        specs: [
            "32GB",
            "DDR5",
            "6000MHz",
            "RGB",
        ],
    },
    {
        id: 20,
        category: "RAM",
        name: "Kingston Fury 64GB",
        brand: "Kingston",
        image: "/images/inventory/Kingston-Fury-64GB.webp",
        price: 29999,
        stock: 12,
        specs: [
            "64GB",
            "DDR5",
            "6000MHz",
            "CL30",
        ],
    },
    {
        id: 21,
        category: "RAM",
        name: "G.Skill Trident Z 32GB",
        brand: "G.Skill",
        image: "/images/inventory/Gskill-Trident-Z.webp",
        price: 14999,
        stock: 10,
        specs: [
            "32GB",
            "DDR4",
            "3600MHz",
            "White RGB",
        ],
    },
    {
        id: 22,
        category: "RAM",
        name: "16GB DDR5 5600",
        brand: "Generic",
        image: "/images/inventory/16GB-DDR5.webp",
        price: 7999,
        stock: 15,
        specs: [
            "16GB",
            "DDR5",
            "5600 MT/s",
        ],
    },
    {
        id: 23,
        category: "RAM",
        name: "Corsair 12GB DDR4",
        brand: "Corsair",
        image: "/images/inventory/Corsair-12GB.webp",
        price: 6999,
        stock: 2,
        specs: [
            "12GB",
            "DDR4",
            "Triple Channel",
        ],
    },

    // =========================
    // SSD
    // =========================
    {
        id: 24,
        category: "SSD",
        name: "Samsung 990 Pro",
        brand: "Samsung",
        image: "/images/inventory/S-990.webp",
        price: 15999,
        stock: 0,
        specs: [
            "2TB",
            "PCIe Gen4",
            "7450 MB/s",
        ],
    },
    {
        id: 25,
        category: "SSD",
        name: "Samsung 9100 PRO",
        brand: "Samsung",
        image: "/images/inventory/Samsung-9100-Pro.webp",
        price: 34999,
        stock: 5,
        specs: [
            "4TB",
            "PCIe Gen5",
            "High Performance",
        ],
    },
    {
        id: 26,
        category: "SSD",
        name: "WD Black SN850X",
        brand: "Western Digital",
        image: "/images/inventory/WD-SN850X.webp",
        price: 17999,
        stock: 8,
        specs: [
            "2TB",
            "PCIe Gen4",
            "7300 MB/s",
        ],
    },
    {
        id: 27,
        category: "SSD",
        name: "Kingston NV3",
        brand: "Kingston",
        image: "/images/inventory/Kingston-NV3.webp",
        price: 7999,
        stock: 14,
        specs: [
            "1TB",
            "PCIe Gen4",
            "NVMe",
        ],
    },
    {
        id: 28,
        category: "SSD",
        name: "Samsung 870 EVO",
        brand: "Samsung",
        image: "/images/inventory/Samsung-870-EVO.webp",
        price: 5999,
        stock: 5,
        specs: [
            "512GB",
            "SATA",
            "2.5-inch",
        ],
    },
    {
        id: 29,
        category: "HDD",
        name: "2TB HDD",
        brand: "Generic",
        image: "/images/inventory/2TB-HDD.webp",
        price: 4999,
        stock: 5,
        specs: [
            "2TB",
            "SATA",
            "7200 RPM",
        ],
    },

    // =========================
    // Power Supplies
    // =========================
    {
        id: 30,
        category: "Power Supply",
        name: "Corsair RM850x",
        brand: "Corsair",
        image: "/images/inventory/Corsair-RM850x.webp",
        price: 15999,
        stock: 8,
        specs: [
            "850W",
            "80+ Gold",
            "Fully Modular",
        ],
    },
    {
        id: 31,
        category: "Power Supply",
        name: "Corsair HX1200i Platinum",
        brand: "Corsair",
        image: "/images/inventory/Corsair-HX1200i.webp",
        price: 29999,
        stock: 4,
        specs: [
            "1200W",
            "80+ Platinum",
            "Fully Modular",
        ],
    },
    {
        id: 32,
        category: "Power Supply",
        name: "Cooler Master GX III 850W",
        brand: "Cooler Master",
        image: "/images/inventory/CM-GX-III-850W.webp",
        price: 13999,
        stock: 5,
        specs: [
            "850W",
            "80+ Gold",
            "White Edition",
        ],
    },
    {
        id: 33,
        category: "Power Supply",
        name: "Seasonic PRIME TX-1300",
        brand: "Seasonic",
        image: "/images/inventory/Seasonic-TX-1300.webp",
        price: 39999,
        stock: 3,
        specs: [
            "1300W",
            "80+ Titanium",
            "Fully Modular",
        ],
    },
    {
        id: 34,
        category: "Power Supply",
        name: "DeepCool PK650D",
        brand: "DeepCool",
        image: "/images/inventory/DeepCool-PK650D.webp",
        price: 6499,
        stock: 7,
        specs: [
            "650W",
            "80+ Bronze",
        ],
    },
    {
        id: 35,
        category: "Power Supply",
        name: "Corsair HX850",
        brand: "Corsair",
        image: "/images/inventory/Corsair-HX850.webp",
        price: 17999,
        stock: 2,
        specs: [
            "850W",
            "80+ Gold",
            "Fully Modular",
        ],
    },

    // =========================
    // CPU Coolers
    // =========================
    {
        id: 36,
        category: "CPU Cooler",
        name: "DeepCool Mystique 360 ARGB",
        brand: "DeepCool",
        image: "/images/inventory/DeepCool-Mystique-360.webp",
        price: 16999,
        stock: 5,
        specs: [
            "360mm",
            "ARGB",
            "Liquid Cooler",
        ],
    },
    {
        id: 37,
        category: "CPU Cooler",
        name: "Corsair iCUE LINK H170i LCD",
        brand: "Corsair",
        image: "/images/inventory/Corsair-H170i.webp",
        price: 29999,
        stock: 3,
        specs: [
            "420mm",
            "LCD Display",
            "Liquid Cooler",
        ],
    },
    {
        id: 38,
        category: "CPU Cooler",
        name: "NZXT Kraken Elite 360 RGB",
        brand: "NZXT",
        image: "/images/inventory/NZXT-Kraken-360.webp",
        price: 24999,
        stock: 4,
        specs: [
            "360mm",
            "RGB",
            "LCD Display",
        ],
    },
    {
        id: 39,
        category: "CPU Cooler",
        name: "Lian Li Galahad II Trinity Performance 360",
        brand: "Lian Li",
        image: "/images/inventory/Lian-Li-Galahad-360.webp",
        price: 21999,
        stock: 4,
        specs: [
            "360mm",
            "ARGB",
            "Liquid Cooler",
        ],
    },
    {
        id: 40,
        category: "CPU Cooler",
        name: "DeepCool AG400 ARGB",
        brand: "DeepCool",
        image: "/images/inventory/DeepCool-AG400.webp",
        price: 3999,
        stock: 8,
        specs: [
            "Air Cooler",
            "ARGB",
            "120mm Fan",
        ],
    },
    {
        id: 41,
        category: "CPU Cooler",
        name: "Cooler Master Hyper 212 EVO",
        brand: "Cooler Master",
        image: "/images/inventory/Hyper-212-EVO.webp",
        price: 4999,
        stock: 3,
        specs: [
            "Air Cooler",
            "120mm Fan",
            "Legacy Cooler",
        ],
    },

    // =========================
    // Cabinets
    // =========================
    {
        id: 42,
        category: "Cabinet",
        name: "Lian Li Lancool 216 RGB",
        brand: "Lian Li",
        image: "/images/inventory/Lian-Li-Lancool-216.webp",
        price: 11999,
        stock: 6,
        specs: [
            "Mid Tower",
            "RGB",
            "ATX",
        ],
    },
    {
        id: 43,
        category: "Cabinet",
        name: "HYTE Y70 Touch",
        brand: "HYTE",
        image: "/images/inventory/HYTE-Y70-Touch.webp",
        price: 29999,
        stock: 3,
        specs: [
            "Mid Tower",
            "Touch Display",
            "ATX",
        ],
    },
    {
        id: 44,
        category: "Cabinet",
        name: "NZXT H9 Flow White",
        brand: "NZXT",
        image: "/images/inventory/NZXT-H9-Flow.webp",
        price: 15999,
        stock: 4,
        specs: [
            "Dual Chamber",
            "ATX",
            "White Edition",
        ],
    },
    {
        id: 45,
        category: "Cabinet",
        name: "Lian Li O11 Vision",
        brand: "Lian Li",
        image: "/images/inventory/Lian-Li-O11-Vision.webp",
        price: 16999,
        stock: 5,
        specs: [
            "Dual Chamber",
            "Tempered Glass",
            "ATX",
        ],
    },
    {
        id: 46,
        category: "Cabinet",
        name: "Ant Esports ICE-211TG ARGB",
        brand: "Ant Esports",
        image: "/images/inventory/Ant-Esports-ICE-211TG.webp",
        price: 5999,
        stock: 8,
        specs: [
            "Mid Tower",
            "ARGB",
            "Tempered Glass",
        ],
    },
    {
        id: 47,
        category: "Cabinet",
        name: "Cooler Master HAF X",
        brand: "Cooler Master",
        image: "/images/inventory/CM-HAF-X.webp",
        price: 10999,
        stock: 2,
        specs: [
            "Full Tower",
            "ATX",
            "Legacy Cabinet",
        ],
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected.");

        await Inventory.deleteMany();
        await Inventory.insertMany(inventory);

        console.log("Inventory seeded successfully.");
        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();