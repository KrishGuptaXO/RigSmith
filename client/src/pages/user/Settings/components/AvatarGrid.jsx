import { useEffect, useState } from "react";
import Avatar from "../../../../data/Avatars";
import AvatarCard from "./AvatarCard";

export default function AvatarGrid({ avatarId, onSelect }) {
    const [selectedAvatar, setSelectedAvatar] = useState(
        () => Avatar.find((avatar) => avatar.id === avatarId) ?? Avatar[0]
    );

    useEffect(() => {
        setSelectedAvatar(
            Avatar.find((avatar) => avatar.id === avatarId) ?? Avatar[0]
        );
    }, [avatarId]);

    const handleSelect = (avatar) => {
        setSelectedAvatar(avatar);
        onSelect(avatar);
    };

    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {Avatar.map((avatar) => (
                <AvatarCard
                    key={avatar.id}
                    avatar={avatar}
                    selected={selectedAvatar?.id === avatar.id}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}