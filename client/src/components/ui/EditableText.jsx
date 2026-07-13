import { useState } from "react";

export default function EditableText ({value}) {
        const [isEditing, setIsEditing] = useState(false);
        const [text, setText] = useState(value);

        const handleSave = () => setIsEditing(false);

        return (
            <div>
                {isEditing?(
                    <input
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-white outline-none focus:border-blue-500"
                        value={text}
                        onChange={(e)=> setText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e)=> e.key === "Enter" && handleSave()}
                        autoFocus
                    />
                ):(
                    <span className="cursor-pointer hover:text-blue-400" onClick={() => setIsEditing(true)}> {text} </span>
                )}
            </div>
        );
    };