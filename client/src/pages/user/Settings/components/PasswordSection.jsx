import Button from "../../../../components/common/Button";
import AuthInput from "../../../Auth/components/AuthInput";

export default function PasswordSection() {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-[#111827] p-8">
            <div className="mb-8">
                
                <h2 className="text-2xl font-semibold text-white">
                    Change Password
                </h2>
                
                <p className="mt-2 text-zinc-400">
                    Update your password to keep your account secure.
                </p>

            </div>
            
            <div className="space-y-2">
                <AuthInput label="Current Password" type="password" placeholder="••••••••" />
                <AuthInput label="New Password" type="password" placeholder="••••••••" />
                <AuthInput label="Confirm New Password" type="password" placeholder="••••••••" />
            </div>

            <div className="mt-8 flex justify-end">
                <Button className="cursor-pointer">
                    Update Password
                </Button>
            </div>
        </div>
    );
}