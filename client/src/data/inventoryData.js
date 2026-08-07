import R50 from "../assets/images/Gb-5070-Ti";
import R7 from "../assets/images/A-R7-9800x3d";
import C32 from "../assets/images/C-32gb";
import S9 from "../assets/images/S-990";


const inventory = [
    {
        id: 1,
        category: "GPU",
        name: "RTX 5070 Ti Gaming OC",
        brand: "Gigabyte",
        image: R50,
        price: "₹79,999",
        stock: "In Stock",
        specs: [
            "16GB GDDR7",
            "PCIe 5.0",
            "Factory OC",
            "RGB",
        ]
    },
    {
        id: 2,
        category: "CPU",
        name: "Ryzen 7 9800X3D",
        brand: "AMD",
        image: R7,
        price: "₹54,999",
        stock: "Limited Stock",
        specs: [
            "8 Cores",
            "16 Threads",
            "AM5",
            "120W",
        ]
    },
    {
        id: 3,
        category: "RAM",
        name: "Corsair Dominator Titanium",
        brand: "Corsair",
        image: C32,
        price: "₹18,499",
        stock: "In Stock",
        specs: [
            "32GB",
            "DDR5",
            "6000Mhz",
            "RGB",
        ]
    },
    {
        id: 4,
        category: "SSD",
        name: "Samsung 990 Pro",
        brand: "Samsung",
        image: S9,
        price: "₹15,999",
        stock: "Out of Stock",
        specs: [
            "2TB",
            "PCIe Gen4",
            "7450 MB/s",
        ]
    },
];

export default inventory;