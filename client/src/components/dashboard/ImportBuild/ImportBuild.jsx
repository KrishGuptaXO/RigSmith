import Card from "../../common/Card"
import Button from "../../common/Button"
import Input from "../../common/Input"
import authStore from "../../../store/authStore";
import { useState } from "react";

const isValidUrl = (value) => {
    try {
        const url = new URL(value.trim());

        return (
            url.protocol === "https:" &&
            url.hostname === "pcpartpicker.com" &&
            /^\/list\/[^/]+\/?$/.test(url.pathname)
        );
    } catch {
        return false;
    }
};

export default function ImportBuild() {
    const token = authStore((s) => s.token);
    const [importMode, setImportMode] = useState("url");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const OpenLinkinNewTab = (url) => {
        window.open(url, '_blank', 'noopener, noreferrer');
    };
    
    const validateImport = async() => {
        setError("");

        if(!inputValue.trim()){
            setError("Please enter a PCPartPicker URL or build text.");
            return;
        }

        if (importMode === "url") {
            if (!isValidUrl(inputValue)) {
                setError("Please enter a valid PCPartPicker build URL.");
                return;
            }

            try {
                setLoading(false);

                const response = await fetch ("http://localhost:5000/api/custom-builds/import",
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            url: inputValue.trim(),
                        }),
                    }
                );
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Failed to import PCPartPicker build.");
                }
                
                console.log("Imported builds: ", data);
            } catch (error) {
                console.error("Build import failed: ", error);
                setError(error.message || "Unable to import this PCPartPicker build.");
            } finally {
                setLoading(false);
            }
            
            return;
        }

        if (importMode === "text") {
            if(inputValue.length < 30) {
                setError("Please paste a complete component list.");
                return;
            }

            console.log("Text import not implemented yet.");
        }
    };


    return (
        <section className="mt-8">
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            Import your PC Build
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Check component availability, pricing and receive a quotation.
                        </p>

                        <button
                            className="mt-3 cursor-pointer text-sm text-cyan-400 hover:text-cyan-300"
                            onClick={() =>
                                OpenLinkinNewTab("https://pcpartpicker.com/list")
                            }
                        >
                            Don't have a build? Create one on PCPartPicker →
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setImportMode("url");
                                setError("");
                            }}
                            className={`cursor-pointer rounded-full px-5 py-2 transition-all duration-300 ${
                                importMode === "url"
                                    ? "bg-cyan-500 font-semibold text-black"
                                    : "border border-zinc-700 text-zinc-400 hover:border-cyan-500"
                            }`}
                        >
                            URL
                        </button>

                        <button
                            onClick={() => {
                                setImportMode("text");
                                setError("");
                            }}
                            className={`cursor-pointer rounded-full px-5 py-2 transition-all duration-300 ${
                                importMode === "text"
                                    ? "bg-cyan-500 font-semibold text-black"
                                    : "border border-zinc-700 text-zinc-400 hover:border-cyan-500"
                            }`}
                        >
                            Text
                        </button>
                    </div>

                    <Button
                        disabled={!inputValue.trim() || loading}
                        onClick={validateImport}
                    >
                        {loading ? "Checking..." : "Check Availability →"}
                    </Button>
                </div>

                <div className="mt-6">
                    <Input
                        placeholder={
                            importMode === "url"
                                ? "Paste your PCPartPicker URL..."
                                : "Paste your component list..."
                        }
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    {error && (
                        <p className="mt-2 text-sm text-red-400">
                            {error}
                        </p>
                    )}
                </div>
            </Card>
        </section>
    );
}