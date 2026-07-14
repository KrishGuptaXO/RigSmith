export default function Input({
    type="text",
    placeholder="",
    value,
    onChange,
    className="",
}) {
    return (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`w-full rounded-lg border border-[3A2F5B] bg-[#1A1325] px-4 py-2 text-white placeholder:text-[#888CA3] outline-none transition-all duration-200 focus:border-cyan-400 focus-ring-2 focus:ring-cyan-400/20 ${className}`} />
    );
}