import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Admin } from "../modals/admin.modal.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const adminSchema = z.object({
        firstName: z.string().min(2, { message: "First name should be at least 2 chars long" }),
        lastName: z.string().min(2, { message: "Last name should be at least 2 chars long" }),
        email: z.string().email(),
        password: z.string().min(8, { message: "Password must be at least 8 chars long" })
    });

    const validateData = adminSchema.safeParse(req.body);

    if (!validateData.success) {
        return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ errors: "Admin already exists" });
        }

        const newUser = new Admin({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Signup success", newUser });
    } catch (error) {
        res.status(500).json({ errors: "Error in signup" });
        console.log("Error in signup", error);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(403).json({ errors: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ errors: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id },
            config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 86400000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        };

        res.status(200).cookie("jwt", token, cookieOptions).json({ message: "Login success", admin, token });
    } catch (error) {
        res.status(500).json({ errors: "Error in login" });
        console.log("Error in login", error);
    }
};

export const logout = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(401).json({ errors: "Kindly login first" });
        }
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout success" });
    } catch (error) {
        res.status(500).json({ errors: "Error in logout" });
        console.log("Error in logout", error);
    }
}