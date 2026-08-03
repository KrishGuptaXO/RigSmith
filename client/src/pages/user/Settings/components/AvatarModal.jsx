import Modal from "../../../../components/common/Modal";
import AvatarGrid from "./AvatarGrid";
import Button from "../../../../components/common/Button";

export default function AvatarModals ({open, onClose}) {
    return (

        <Modal open={open} onClose={onClose} >
            <div className="w-180 max-w-full">
                <h2 className="text-3xl font-bold text-white">
                    Choose your Avatar
                </h2>

                <div className="mt-8">
                    <AvatarGrid />
                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <Button variant="secondary">
                        Cancel
                    </Button>

                    <Button>
                        Save Avatar
                    </Button>

                </div>

            </div>

        </Modal>
        
    );
}