export default function Modal ({open, onClose, children}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="
                    w-full 
                    max-w-2xl
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-2xl 
                    border border-zinc-800 
                    bg-[#111827] 
                    p-8" 
                onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}