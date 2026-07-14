export default function Card({
    children,
    className = "",
}) {
    return (
        <div className={`rounded-xl border border-[#3A2F5B] bg-[#241C38] p-5 shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:shadow-cyan-500/10 ${className}`} >
            {children}
        </div>
    );
}