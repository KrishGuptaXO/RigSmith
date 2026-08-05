import { useState } from "react";
import Avatar from "../../../../data/Avatars";
import AvatarCard from "./AvatarCard";

export default function AvatarGrid () {
    const [selectedAvatar, setSelectedAvatar] = useState(Avatar[0]);
    return(
        <div className="grid grid-cols-4 gap-5">
            {Avatar.map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} selected={selectedAvatar?.id === avatar.id} onSelect = {setSelectedAvatar} />
            ))}
        </div>
    );
}