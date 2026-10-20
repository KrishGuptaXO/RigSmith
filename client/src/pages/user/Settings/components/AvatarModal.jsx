import { useEffect, useState } from "react";
import Modal from "../../../../components/common/Modal";
import AvatarGrid from "./AvatarGrid";
import Button from "../../../../components/common/Button";
import Avatar from "../../../../data/Avatars";
import authStore from "../../../../store/authStore";

export default function AvatarModal({ open, onClose, avatarId, onSave }) {
    const [selectedAvatar, setSelectedAvatar] = useState(
        () => Avatar.find((avatar) => avatar.id === avatarId) ?? Avatar[0]
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setSelectedAvatar(
                Avatar.find((avatar) => avatar.id === avatarId) ?? Avatar[0]
            );
            setError("");
        }
    }, [open, avatarId]);

    const handleClose = () => {
        if (saving) return;
        setError("");
        onClose();
    };

    const handleSave = async () => {
        const token = authStore.getState().token;

        if (!token) {
            setError("Your session has expired. Please log in again.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/avatar", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    avatarId: selectedAvatar.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update avatar.");
            }

            onSave(data.user);
            onClose();
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="w-180 max-w-full">
                <h2 className="text-3xl font-bold text-white">
                    Choose your Avatar
                </h2>

                <div className="mt-8">
                    <AvatarGrid
                        avatarId={selectedAvatar.id}
                        onSelect={setSelectedAvatar}
                    />
                </div>

                {error && (
                    <p role="alert" className="mt-4 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Avatar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
