// Promote an existing account to admin (there is intentionally no public API for this).
// Usage (from /server):  node scripts/makeAdmin.js user@example.com
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
    console.error("Usage: node scripts/makeAdmin.js <email>");
    process.exit(1);
}

try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate({ email }, { $set: { role: "admin" } }, { new: true });

    if (!user) {
        console.error(`No account found for ${email}. Register it first, then run this again.`);
        process.exitCode = 1;
    } else {
        console.log(`${user.email} is now an admin.`);
    }
} catch (error) {
    console.error("Failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}