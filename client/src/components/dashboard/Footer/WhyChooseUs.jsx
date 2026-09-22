import { ShieldCheck, BadgeCheck, Truck, Headset, Wallet, Wrench } from "lucide-react";

const features = [
    {
        icon: BadgeCheck,
        title: "Quality Components",
        description: "Reliable hardware from trusted brands, selected for performance and quality"
    },
    {
        icon: Wallet,
        title: "Competitive Pricing",
        description: "Get the components and builds you need at prices that makes sense"
    },
    {
        icon: Wrench,
        title: "Custom PC Builds",
        description: "Build your perfect PC with components tailored to your requirements"
    },
    {
        icon: ShieldCheck,
        title: "Secure Shopping",
        description: "Your account and orders are protected with secure authentication"
    },
    {
        icon: Truck,
        title: "Reliable Delivery",
        description: "Convenient delivery and pickup options for your orders"
    },
    {
        icon: Headset,
        title: "Customer Support",
        description: "Get assistance whenever you need help with your purchase or build"
    }
];

export default function WhyChooseUs() {
    return (
        <section className="mt-16 border-t border-zinc-800 pt-14 pb-8">
            <div className="mx-auto max-w-6xl px-4">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Why Choose Us
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-white">
                        Everything You Need to Build Better
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                        From quality components to complete PC builds, RigSmith
                        makes your hardware shopping experience simple and reliable.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-zinc-800 bg-[#111827] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                                    <Icon size={22} />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-white">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}