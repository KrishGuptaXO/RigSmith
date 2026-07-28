import NovaX from "../assets/images/Nova_X.webp"
import PhantomV4 from "../assets/images/Phantom.avif"
import Echo from "../assets/images/Echo.avif"
import Shark from "../assets/images/SharkX.webp"
import Lian from "../assets/images/Lian_Li.webp"
import Star from "../assets/images/StarScream.webp"

const builds = [
    {
        id: "echo",
        name: "Echo",
        image: Echo,
        price: "₹3,49,999",
        emi: "Starting at ₹9,722/month",
        warranty: {
            duration: "3 Years",
            coverage: "On-site + Parts Replacement"
        },
        specs: [
            {
                label: "Processor",
                value: "AMD Ryzen 7 9800X3D"
            },
            {
                label: "Graphics Card",
                value: "NVIDIA GeForce RTX 5080 16GB"
            },
            {
                label: "Motherboard",
                value: "MSI MAG X870 Tomahawk WiFi"
            },
            {
                label: "Memory",
                value: "32GB DDR5 6000MHz CL30"
            },
            {
                label: "Storage",
                value: "2TB Samsung 990 PRO NVMe Gen4 SSD"
            },
            {
                label: "Power Supply",
                value: "Corsair RM850x 850W 80+ Gold"
            },
            {
                label: "CPU Cooler",
                value: "DeepCool Mystique 360 ARGB"
            },
            {
                label: "Cabinet",
                value: "Lian Li Lancool 216 RGB"
            },
            {
                label: "Operating System",
                value: "Windows 11 Pro"
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7 + Bluetooth 5.4"
            }
        ]
    },
    {
        id: "shark",
        name: "Shark X",
        image: Shark,
        price: "₹5,33,439",
        emi: "Starting at ₹14,851/month",
        warranty: {
            duration: "5 Years",
            coverage: "Premium On-site Support"
        },
        specs: [
            {
                label: "Processor",
                value: "Intel Core i7 14700F"
            },
            {
                label: "Graphics Card",
                value: "NVIDIA RTX 4070 Super 32GB"
            },
            {
                label: "Motherboard",
                value: "ASUS ROG Crosshair X870E Hero"
            },
            {
                label: "Memory",
                value: "64GB DDR5 6000MHz"
            },
            {
                label: "Storage",
                value: "4TB Samsung 9100 PRO Gen5 SSD"
            },
            {
                label: "Power Supply",
                value: "Corsair HX1200i Platinum"
            },
            {
                label: "CPU Cooler",
                value: "Corsair iCUE LINK H170i LCD"
            },
            {
                label: "Cabinet",
                value: "HYTE Y70 Touch"
            },
            {
                label: "Operating System",
                value: "Windows 11 Pro"
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7 + Bluetooth 5.4"
            }
        ]
    },
    {
        id: "frostb",
        name: "Frost Byte",
        image: Lian,
        price: "₹3,52,898",
        emi: "Starting at ₹9,806/month",
        warranty: {
            duration: "3 Years",
            coverage: "Parts + Labor"
        },
        specs: [
            {
                label: "Processor",
                value: "Intel Core i9 9900K"
            },
            {
                label: "Graphics Card",
                value: "MSI RTX 5070 Ti White Edition"
            },
            {
                label: "Motherboard",
                value: "Gigabyte Z890 AORUS Elite ICE"
            },
            {
                label: "Memory",
                value: "G.Skill Trident Z 32GB DDR4 3600MHz White RGB"
            },
            {
                label: "Storage",
                value: "2TB WD Black SN850X"
            },
            {
                label: "Power Supply",
                value: "Cooler Master GX III 850W Gold White"
            },
            {
                label: "CPU Cooler",
                value: "NZXT Kraken Elite 360 RGB White"
            },
            {
                label: "Cabinet",
                value: "NZXT H9 Flow White"
            },
            {
                label: "Operating System",
                value: "Windows 11 Home"
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7"
            }
        ]
    },
    {
        id: "nova-x",
        name: "Nova X",
        image: NovaX,
        price: "₹3,59,999",
        emi: "Starting at ₹11,917/month",
        warranty: {
            duration: "5 Years",
            coverage: "Premium Care + Lifetime Technical Support"
        },
        specs: [
            {
                label: "Processor",
                value: "AMD Ryzen 7 9850X3D"
            },
            {
                label: "Graphics Card",
                value: "NVIDIA GeForce RTX 5070 Ti"
            },
            {
                label: "Motherboard",
                value: "MSI MEG X870E GODLIKE"
            },
            {
                label: "Memory",
                value: "Kingston Fury 64GB DDR5 6000MHz CL30"
            },
            {
                label: "Storage",
                value: "4TB Samsung 9100 PRO Gen5 SSD"
            },
            {
                label: "Power Supply",
                value: "Seasonic PRIME TX-1300 Titanium"
            },
            {
                label: "CPU Cooler",
                value: "Lian Li Galahad II Trinity Performance 360"
            },
            {
                label: "Cabinet",
                value: "Lian Li O11 Vision"
            },
            {
                label: "Operating System",
                value: "Windows 11 Pro"
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 7 + Bluetooth 5.4"
            }
        ]
    },
    {
        id: "phantom",
        name: "Phantom V4",
        image: PhantomV4,
        price: "₹1,34,999",
        emi: "Starting at ₹3,758/month",
        warranty: {
            duration: "3 Years",
            coverage: "Parts + Labor"
        },
        specs: [
            {
                label: "Processor",
                value: "AMD Ryzen 5 9600X"
            },
            {
                label: "Graphics Card",
                value: "PNY GeForce RTX 5060 Ti 16GB"
            },
            {
                label: "Motherboard",
                value: "MSI B650M Gaming Plus WiFi"
            },
            {
                label: "Memory",
                value: "16GB DDR5 5600 MT/s"
            },
            {
                label: "Storage",
                value: "1TB Kingston NV3 PCIe Gen4 NVMe SSD"
            },
            {
                label: "Power Supply",
                value: "DeepCool PK650D 650W 80+ Bronze"
            },
            {
                label: "CPU Cooler",
                value: "DeepCool AG400 ARGB"
            },
            {
                label: "Cabinet",
                value: "Ant Esports ICE-211TG ARGB"
            },
            {
                label: "Operating System",
                value: "Windows 11 Home"
            },
            {
                label: "Connectivity",
                value: "Wi-Fi 6E + Bluetooth 5.3"
            }
        ]
    },
    {
        id: "stars",
        name: "StarScream",
        image: Star,
        price: "₹1,54,899",
        emi: "Starting at ₹4,312/month",
        warranty: {
            duration: "1 Year",
            coverage: "Limited Hardware Warranty"
        },
        specs: [
            {
                label: "Processor",
                value: "Intel Xeon X5675 (6 Cores / 12 Threads)"
            },
            {
                label: "Graphics Card",
                value: "NVIDIA GeForce GTX Titan 6GB"
            },
            {
                label: "Motherboard",
                value: "ASUS Rampage III Extreme"
            },
            {
                label: "Memory",
                value: "Corsair 12GB DDR4 3800 MT/s Triple Channel"
            },
            {
                label: "Storage",
                value: "512GB Samsung 870 EVO SATA SSD + 2TB HDD"
            },
            {
                label: "Power Supply",
                value: "Corsair HX850 850W 80+ Gold"
            },
            {
                label: "CPU Cooler",
                value: "Cooler Master Hyper 212 EVO"
            },
            {
                label: "Cabinet",
                value: "Cooler Master HAF X"
            },
            {
                label: "Operating System",
                value: "Windows 10 Pro"
            },
            {
                label: "Connectivity",
                value: "Gigabit Ethernet"
            }
        ]
    },
];

export default builds;