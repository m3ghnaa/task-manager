const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Show the Signup Page
router.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

// Signup Logic
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.render("signup", { error: "Username or Email already exists!" });
        }
        const trimmedPassword = password.trim();
        const newUser = new User({ username, email, password: trimmedPassword });

        await newUser.save();
        res.redirect("/auth/login");
    } catch (error) {
        res.render("signup", { error: "An error occurred while creating your account." });
    }
});

// Show the Login Page
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

//Login Logic
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "Invalid email or password!" });
        }

        const trimmedPassword = password.trim();
        const isMatch = await bcrypt.compare(trimmedPassword, user.password);

        if (!isMatch) {
            return res.render("login", { error: "Invalid email or password!" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });

        res.redirect("/tasks"); 
    } catch (error) {
        res.render("login", { error: "An error occurred while logging in." });
    }
});

//Logout Route
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
});

module.exports = router;
