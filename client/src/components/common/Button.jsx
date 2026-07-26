export default function Button( {
    children,
    onClick,
    type="button",
    variant="primary",
    disabled=false,
    className="",
}) {
    const ButtonVariants = {
        primary:
            "bg-cyan-400 text-black hover:bg-cyan-500",
        
        secondary:
            "bg-[#2E2447] text-white hover:bg-[#3A2F5B]",
        
        outline:
            "border border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black",
        
        danger:
            "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2 mt-2 rounded-lg font-medium transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:-translate-y-0.5 active:scale-95"} ${ButtonVariants[variant]} ${className} `} >
            {children}
        </button>
    );
}