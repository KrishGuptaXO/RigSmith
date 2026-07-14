export default function Badge({
    children,
    variant="default",
    className=""
}) {
    const badgeVariants = {
        default: "bg-[#2E2447] text-white",
        success: "bg-green-500/20 text-gren-400",
        warning: "bg-yellow-500/20 text-yellow-400",
        danger: "bg-red-500/20 text-red-400",
        info: "bg-cyan-500/20 text-cyan-400",
        outline: "border border-cyan-400 text-cyan-400",
    };
    
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ${badgeVariants[variant]} ${className}`} >
            {children}
        </span>
    );
}
