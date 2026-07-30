export default function AuthInput ({
    label,
    type="text",
    placeholder,
    icon: Icon,
    ...props
}) {
    return (
        <div className="mb-5">
            <label className="mb-2 block text-sm text-zinc-400">
                {label}
            </label>

            <div className="flex items-center rounded-xl border border-[#2A3240] bg-[#0F141D] px-4 focus-within:border-cyan-400 transition-colors">
                {Icon && (
                    <Icon size={18} className="text-zinc-500 shrink-0" />
                )}

                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-zinc-600"
                    {...props}
                />

            </div>
        </div>
    );
}