const User = require("../models/user.js");
const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");
const jwt = require("jsonwebtoken");

/* ================= GET ALL USERS ================= */
const getUsers = async (req, res) => {
    try {
        const { name, role } = req.query;
        let conditions = [];

        if (name) {
            conditions.push({ firstName: name });
            conditions.push({ lastName: name });
        }

        if (role) {
            conditions.push({ userType: role });
        }

        const users =
            conditions.length === 0
                ? await User.find({})
                : await User.find({ $or: conditions });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET USER BY ID ================= */
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/* ================= USER VALIDATION ================= */
const isUserValid = (newUser) => {
    let errors = [];

    if (!newUser.firstName) errors.push("Please enter first name");
    if (!newUser.lastName) errors.push("Please enter last name");
    if (!newUser.email) errors.push("Please enter email");
    if (!newUser.password) errors.push("Please enter password");
    if (!newUser.confirmPassword) errors.push("Please re-enter password");
    if (!newUser.userType) errors.push("Please enter User Type");
    if (newUser.password !== newUser.confirmPassword)
        errors.push("Password and Confirm Password did not match");

    return errors.length ? { status: false, errors } : { status: true };
};

/* ================= SIGNUP USER ================= */
const saveUser = async (req, res) => {
    const newUser = req.body;
    const validation = isUserValid(newUser);

    if (!validation.status) {
        return res.status(400).json({
            message: "error",
            errors: validation.errors
        });
    }

    try {
        const user = await User.create({
            email: newUser.email,
            username: newUser.email.split("@")[0], // ✅ AUTO USERNAME
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            password: newUser.password, // plain text (project style)
            userType: newUser.userType,
            activated: true
        });

        if (user.userType === "Doctor") {
            await Doctor.create({
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }

        if (user.userType === "Patient") {
            await Patient.create({
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }

        res.status(201).json({ message: "success" });

    } catch (error) {
        res.status(400).json({
            message: "error",
            errors: [error.message]
        });
    }
};

/* ================= LOGIN USER ================= */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({
                message: "error",
                errors: ["Invalid email or password"]
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.userType },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "success",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "error",
            errors: ["Server error"]
        });
    }
};

/* ================= UPDATE USER ================= */
const updateUser = async (req, res) => {
    try {
        await User.updateOne({ _id: req.params.id }, { $set: req.body });
        res.status(200).json({ message: "success" });
    } catch (error) {
        res.status(400).json({
            message: "error",
            errors: [error.message]
        });
    }
};

/* ================= DELETE USER ================= */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user.userType === "Doctor") {
            await Doctor.deleteOne({ userId: user._id });
        }

        if (user.userType === "Patient") {
            await Patient.deleteOne({ userId: user._id });
        }

        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: "success" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/* ================= EXPORTS ================= */
module.exports = {
    getUsers,
    getUserById,
    saveUser,
    loginUser,
    updateUser,
    deleteUser
};
