/*
 *  AuthInput — Reusable labeled input with optional icon.
 *
 *  Props:
 *    label       – Text above the input
 *    type        – HTML input type (default: "text")
 *    placeholder – Placeholder text
 *    icon        – Lucide icon component (optional)
 *    className   – Classes for the outer wrapper (layout, spacing, grid spans)
 *    ...props    – Spread onto <input> (value, onChange, name, disabled, etc.)
 */

export default function AuthInput ({
    label,
    type="text",
    placeholder,
    icon: Icon,
    className="",
    ...props
}) {
    return (
        <div className={`mb-5 ${className}`}>
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