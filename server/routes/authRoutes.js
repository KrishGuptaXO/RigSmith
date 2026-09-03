import express from "express";
import argon2 from "argon2";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters long.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const hashPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            message: "Account has been created successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Registration failed: ", error.message);

        res.status(500).json({
            message: "Failed to create account."
        });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // Find user
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Verify password
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id, 
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error ("Login failed: ", error.message);

        res.status(500).json({
            message: "Failed to login.",
        });
    }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
    try{
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({message: "User not found."});

        res.status(200).json({
            user: {id: user._id, name: user.name, email: user.email},
        });
    } catch (error) {
        res.status(500).json({message: "Failed to fetch user."});
    }
});

export default router;