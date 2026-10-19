
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Package,
    AlertTriangle,
    ExternalLink,
    Cpu,
} from "lucide-react";

const STORAGE_KEY = "rigsmithImportedBuild";

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(price || 0);

const formatSourcePrice = (price) => {
    if (price == null) return "Not provided";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

export default function CustomBuildResults() {
    const navigate = useNavigate();

    const [build] = useState(() => {
    try {
        const savedBuild = localStorage.getItem(
            "rigsmithImportedBuild"
        );

        if (!savedBuild) return null;

        const parsedBuild = JSON.parse(savedBuild);

        return Array.isArray(parsedBuild.components)
            ? parsedBuild
            : null;
    } catch {
        return null;
    }
});

    if (!build) {
    return (
        <main className="min-h-screen bg-[#100B18] p-8 text-white">
            <h1 className="text-2xl font-bold">
                No imported build found
            </h1>
            <p className="mt-2 text-zinc-400">
                Import a PCPartPicker build to view its results.
            </p>
            <button
                onClick={() => navigate("/")}
                className="mt-4 text-cyan-400 cursor-pointer hover:text-cyan-300"
            >
                Back to Dashboard
            </button>
        </main>
    );
}

    const components = build.components;

    const matchedCount = components.filter(
        (component) => component.match?.item
    ).length;

    const unavailableCount = components.length - matchedCount;

    const availableSubtotal = components.reduce((total, component) => {
        const item = component.match?.item;
        const quantity = component.requested?.quantity || 1;

        if (!item || item.stock < quantity) {
            return total;
        }

        return total + item.price * quantity;
    }, 0);

    const formatStock = (component) => {
        const item = component.match?.item;
        const quantity = component.requested?.quantity || 1;

        if (!item) {
            return {
                label: "Unavailable",
                description: "No matching RigSmith product found.",
                type: "unavailable",
            };
        }

        if (item.stock <= 0) {
            return {
                label: "Out of stock",
                description: "This product is currently unavailable to purchase.",
                type: "out",
            };
        }

        if (item.stock < quantity) {
            return {
                label: "Insufficient stock",
                description: `Requested ${quantity}, but only ${item.stock} available.`,
                type: "out",
            };
        }

        return {
            label: "In stock",
            description: `${item.stock} unit(s) available.`,
            type: "available",
        };
    };

    const clearImportedBuild = () => {
        localStorage.removeItem(STORAGE_KEY);
        navigate("/");
    };

    return (
        <main className="min-h-screen bg-[#100B18] px-4 py-8 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400 cursor-pointer"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </button>

                <header className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Custom PC Builder
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Your Build Results
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                        We compared your imported PCPartPicker components
                        against the current RigSmith inventory.
                    </p>
                </header>

                <section className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800 bg-[#1A1325] p-5">
                        <p className="text-sm text-zinc-400">
                            Imported components
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {components.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                        <p className="text-sm text-zinc-400">
                            Products matched
                        </p>
                        <p className="mt-2 text-3xl font-bold text-emerald-400">
                            {matchedCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                        <p className="text-sm text-zinc-400">
                            Unavailable
                        </p>
                        <p className="mt-2 text-3xl font-bold text-red-400">
                            {unavailableCount}
                        </p>
                    </div>
                </section>

                <section className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-zinc-400">
                                Available items subtotal
                            </p>

                            <p className="mt-1 text-3xl font-bold text-cyan-400">
                                {formatPrice(availableSubtotal)}
                            </p>

                            <p className="mt-2 text-xs leading-5 text-zinc-400">
                                Includes matched items with sufficient stock
                                for the requested quantities. Excludes
                                unavailable and insufficient-stock items.
                                Taxes and delivery are not included.
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#1A1325] p-3 text-sm text-zinc-300">
                            <Package
                                className="mb-2 text-cyan-400"
                                size={22}
                            />
                            {components.length === 0
                                ? "No components found."
                                : `${matchedCount} of ${components.length} components matched.`}
                        </div>
                    </div>
                </section>

                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">
                        Component Breakdown
                    </h2>

                    <span className="text-xs text-zinc-500">
                        Source: PCPartPicker
                    </span>
                </div>

                <section className="space-y-4">
                    {components.map((component, index) => {
                        const requested = component.requested || {};
                        const item = component.match?.item;
                        const stock = formatStock(component);

                        return (
                            <article
                                key={`${requested.type}-${requested.name}-${index}`}
                                className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#1A1325]"
                            >
                                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                                        {item?.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full rounded-xl object-contain"
                                            />
                                        ) : (
                                            <Cpu size={24} />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                                                {requested.type || "Component"}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                                                    stock.type === "available"
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : stock.type === "out"
                                                          ? "bg-amber-500/10 text-amber-400"
                                                          : "bg-red-500/10 text-red-400"
                                                }`}
                                            >
                                                {stock.type === "available" ? (
                                                    <CheckCircle2 size={13} />
                                                ) : stock.type === "out" ? (
                                                    <AlertTriangle size={13} />
                                                ) : (
                                                    <XCircle size={13} />
                                                )}
                                                {stock.label}
                                            </span>
                                        </div>

                                        <h3 className="break-words font-semibold text-white">
                                            {requested.name || "Unnamed component"}
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            Quantity: {requested.quantity || 1}
                                            {" · "}
                                            PCPartPicker price:{" "}
                                            {formatSourcePrice(requested.sourcePrice)}
                                            {requested.sourceRetailer
                                                ? ` · ${requested.sourceRetailer}`
                                                : ""}
                                        </p>

                                        <div className="mt-4 border-t border-zinc-800 pt-4">
                                            {item ? (
                                                <>
                                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                                        RigSmith match
                                                    </p>

                                                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <p className="font-medium text-cyan-300">
                                                                {item.name}
                                                            </p>

                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {item.brand}
                                                                {" · "}
                                                                {item.category}
                                                            </p>

                                                            <p className="mt-2 text-sm text-zinc-400">
                                                                {stock.description}
                                                            </p>
                                                        </div>

                                                        <p className="shrink-0 text-lg font-semibold">
                                                            {formatPrice(item.price)}
                                                            <span className="ml-1 text-xs font-normal text-zinc-500">
                                                                / unit
                                                            </span>
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-sm text-zinc-400">
                                                    {stock.description} Product
                                                    alternatives will be added
                                                    in the next step.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle
                            className="mt-0.5 shrink-0 text-amber-400"
                            size={20}
                        />

                        <div>
                            <h3 className="font-semibold text-amber-300">
                                Verify hardware compatibility
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                RigSmith does not currently validate
                                compatibility between components. Review your
                                selected parts on PCPartPicker before
                                finalizing your build.
                            </p>

                            <a
                                href="https://pcpartpicker.com/list"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                                Open PCPartPicker
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </section>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={clearImportedBuild}
                        className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-cyan-400 hover:text-cyan-400"
                    >
                        Start a New Import
                    </button>
                </div>
            </div>
        </main>
    );
}
