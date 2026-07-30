import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import SettingsTab from "./components/SettingsTab";
import ProfileSection from "./components/ProfileSection";
import PasswordSection from "./components/PasswordSection";
import PreferenceSection from "./components/PreferenceSection";
import AddressSection from "./components/AddressSection";
import SecuritySection from "./components/SecuritySection";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    
    const renderSection = () => {
        switch(activeTab) {
            case "password":
                return <PasswordSection />;
            case "addresses":
                return <AddressSection />;
            case "preferences":
                return <PreferenceSection />;
            case "security":
                return <SecuritySection />;
            default:
                return <ProfileSection />;
        }
    };
    
    return (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <ProfileCard />
            
            <div className="space-y-6">
                <SettingsTab activeTab={activeTab} setActiveTab={setActiveTab} />
                {renderSection()}
            </div>
        </div>
    );
}