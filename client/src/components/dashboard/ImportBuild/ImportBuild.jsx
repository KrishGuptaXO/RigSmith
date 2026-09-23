import Card from "../../common/Card"
import Button from "../../common/Button"
import authStore from "../../../store/authStore";
import { ClipboardPaste, ExternalLink, Info } from "lucide-react";
import { useState } from "react";

export default function ImportBuild() {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    
    const token = authStore((state) => state.token);

    const OpenPCPartPicker = () => {
        window.open("https://pcpartpicker.com/list", "_blank", "noopener, noreferrer");
    };

    const handleCheckAvailability = async () => {
    setError("");

    if (!inputValue.trim()) {
        setError("Please paste your PCPartPicker component list.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/custom-builds/import",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    partList: inputValue.trim(),
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Failed to process your build.");
            return;
        }

        console.log("Parsed PCPartPicker build:", data);
    } catch (error) {
        console.error("Build import failed:", error);
        setError("Unable to connect to the server.");
    }
};
    
    return (
        <section className="mt-8">
            <Card>
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                            <ClipboardPaste size={22} />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white">
                                Import Your PC Build
                            </h2>

                            <p className="mt-1 text-sm text-zinc-400">
                                Check component availability, pricing and
                                recommendations for your build.
                            </p>
                        </div>
                    </div>

                    {/* PCPartPicker helper */}
                    <div className="mt-6 rounded-xl border border-zinc-800 bg-[#0D1117] p-4">
                        <div className="flex items-start gap-3">
                            <Info
                                size={18}
                                className="mt-0.5 shrink-0 text-cyan-400"
                            />

                            <div>
                                <p className="text-sm font-medium text-zinc-200">
                                    Don't have a build yet?
                                </p>

                                <p className="mt-1 text-sm leading-6 text-zinc-400">
                                    Create your build on PCPartPicker, then
                                    copy the generated Part List and paste it
                                    below.
                                </p>

                                <button
                                    onClick={OpenPCPartPicker}
                                    className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                                >
                                    Open PCPartPicker
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="mt-6">
                    <textarea
                        placeholder="Paste your PCPartPicker Part List here..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setError("");
                        }}
                        rows={10}
                        className="
                            w-full
                            resize-y
                            rounded-lg
                            border
                            border-[#3A2F5B]
                            bg-[#1A1325]
                            px-4
                            py-3
                            text-white
                            placeholder:text-[#888CA3]
                            outline-none
                            transition-all
                            duration-200
                            focus:border-cyan-400
                            focus:ring-2
                            focus:ring-cyan-400/20
                        "
                    />

                    {error && (
                        <p className="mt-2 text-sm text-red-400">
                            {error}
                        </p>
                    )}
                </div>

                {/* Compatibility notice */}
                <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/5 px-4 py-3">
                    <p className="text-xs leading-5 text-zinc-400">
                        <span className="font-medium text-amber-400">
                            Before finalizing:
                        </span>{" "}
                        Please verify your selected components on PCPartPicker
                        to ensure your build is compatible. RigSmith does not
                        perform hardware compatibility validation.
                    </p>
                </div>

                {/* Action */}
                <div className="mt-6 flex justify-end">
                    <Button
                        disabled={!inputValue.trim()}
                        onClick={handleCheckAvailability}
                    >
                        Check Availability →
                    </Button>
                </div>
            </Card>
        </section>
    );
}