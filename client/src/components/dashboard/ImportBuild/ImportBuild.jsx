import Card from "../../common/Card"
import Button from "../../common/Button"
import Input from "../../common/Input"
import { useState } from "react";

export default function ImportBuild() {
    const [importMode, setImportMode] = useState("url");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const OpenLinkinNewTab = (url) => {
        window.open(url, '_blank', 'noopener, noreferrer');
    };
    const validateImport = () => {
        setError("");

        if(!inputValue.trim()){
            setError("Please enter a PCPartPicker URL or build text.");
            return;
        }

        if (importMode === "url") {
            if (!inputValue.includes("https://pcpartpicker.com/list/")){
                setError("Please enter a valid URL.");
                return;
            }
        }

        if (importMode === "text") {
            if(inputValue.length < 30) {
                setError("Please paste a complete component list.");
                return;
            }
        }

        console.log("Validation Passed!");
    };
    return (
        
        <section className="mt-8">

            <Card>
            {/* Title */}
                <div className="flex items-center justify-between">
                    <div>

                        <h2 className="text-3xl font-bold text-white group">
                            Import your PC Build
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Check component availability, pricing and receive a quotation.
                        </p>

                        <button className="mt-3 text-cyan-400 text-sm hover:text-cyan-300 cursor-pointer" onClick={() => OpenLinkinNewTab('https://pcpartpicker.com/list')}>
                            Don't have a build? Create one on PCPartPicker →
                        </button>
                    </div>

                </div>

            {/* Import Controls */}
            <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-3">
                    
                    <button 
                    onClick={() => setImportMode("url")}
                    className= {`rounded-full px-5 py-2 transition-all duration-300 cursor-pointer ${importMode === "url" ? "bg-cyan-500 text-black font-semibold" : "border border-zinc-700 text-zinc-400 hover:border-cyan-500"} `} >
                        URL
                    </button>

                    <button 
                    onClick={() => setImportMode("text")}
                    className={` rounded-full px-5 py-2 transition-all duration-300 cursor-pointer ${importMode === "text" ? "bg-cyan-500 text-black font-semibold" : "border border-zinc-700 text-zinc-400 hover:border-cyan-500"} `} >
                        Text
                    </button>

                </div>

                <Button disabled={!inputValue.trim()} onClick={validateImport}> Check Availability →</Button>

            </div>

            {/* Input */}
            <div className="mt-6">

                <Input 
                placeholder={importMode === "url" ? "Paste your PCPartPicker URL..." : "Paste your component list..."} 
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
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