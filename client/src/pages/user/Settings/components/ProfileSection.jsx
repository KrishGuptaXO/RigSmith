import Button from "../../../../components/common/Button";
import AuthInput from "../../../Auth/components/AuthInput";

export default function ProfileSection() {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                    Profile Information
                </h2>
                
                <p className="mt-2 text-zinc-400">
                    Manage your personal information.
                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <AuthInput label="First Name" placeholder="Krish" />
                <AuthInput label="Last Name" placeholder="Gupta" />
                <AuthInput type="email"  label="Email" placeholder="krish@email.com" />
                <AuthInput label="Phone Number" placeholder="+91 9876543210" />
            </div>

            <div className="mt-8 flex justify-end">
                <Button>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}