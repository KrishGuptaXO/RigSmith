import dotenv from "dotenv";
import mongoose from "mongoose";
import Inventory from "./models/Inventory.js";

dotenv.config();

const inventory = [
    {
        id: 1,
        category: "GPU",
        name: "RTX 5070 Ti Gaming OC",
        brand: "Gigabyte",
        image: "Gb-5070-Ti.webp",
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
        category: "CPU",
        name: "Ryzen 7 9800X3D",
        brand: "AMD",
        image: "A-R7-9800x3d.webp",
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
        id: 3,
        category: "RAM",
        name: "Corsair Dominator Titanium",
        brand: "Corsair",
        image: "C-32gb.webp",
        price: 18499,
        stock: 25,
        specs: [
            "32GB",
            "DDR5",
            "6000Mhz",
            "RGB",
        ],
    },

    {
        id: 4,
        category: "SSD",
        name: "Samsung 990 Pro",
        brand: "Samsung",
        image: "S-990.webp",
        price: 15999,
        stock: 0,
        specs: [
            "2TB",
            "PCIe Gen4",
            "7450 MB/s",
        ],
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log ("MongoDB connected.");
        
        await Inventory.deleteMany();
        await Inventory.insertMany(inventory);
        console.log ("Inventory seeded successfully.");
        
        await mongoose.connection.close();
        console.log ("Database connection closed.");
    } catch (error) {
        console.error ("Seeding failed: ", error.message);

        await mongoose.connection.close();

        process.exit (1);
    }
};

seedDatabase();