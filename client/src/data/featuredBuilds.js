import NovaX from "../assets/images/Nova_X.webp"
import PhantomV4 from "../assets/images/Phantom.avif"
import Echo from "../assets/images/Echo.avif"
import Shark from "../assets/images/SharkX.webp"
import Lian from "../assets/images/Lian_Li.webp"
import Star from "../assets/images/StarScream.webp"

const featuredBuilds = [
    {
        id: "nova",
        name: "Nova X",
        cpu: "AMD Ryzen 7 9850X3D",
        gpu: "NVIDIA Geforce RTX 5070 Ti",
        ram: "Kingston Fury 32GB DDR5 6000 MT/s",
        price: "₹3,59,999",
        image: NovaX,
    },
    {
        id: "phantom",
        name: "Phantom V4",
        cpu: "AMD Ryzen 5 9600X",
        gpu: "Geforce RTX 5060 Ti",
        ram: "16GB DDR5 5600 MT/s",
        price: "₹1,34,999",
        image: PhantomV4,
    },
    {
        id: "echo",
        name: "Echo",
        cpu: "AMD Ryzen 7 9800X3D",
        gpu: "NVIDIA Geforce RTX 5080",
        ram: "32GB DDR5 6000 MT/s",
        price: "₹3,49,999",
        image: Echo,
    },
    {
        id: "shark",
        name: "Shark X",
        cpu: "Intel Core i7 14700F",
        gpu: "RTX 4070 Super",
        ram: "64GB 2 x 32GB DDR5 6000 MT/s",
        price: "₹5,33,439",
        image: Shark,
    },
    {
        id: "frostb",
        name: "Frost Byte",
        cpu: "Intel Core i9 9900K",
        gpu: "MSI RTX 5070 Ti White",
        ram: "32GB DDR4 3600 MT/s",
        price: "₹3,52,898",
        image: Lian,
    },
    {
        id: "stars",
        name: "StarScream",
        cpu: "Intel Xeon X5675",
        gpu: "NVIDIA GTX Titan",
        ram: "Corsair 12GB DDR4",
        price: "₹1,54,899",
        image: Star,
    },
];

export default featuredBuilds;