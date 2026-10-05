const User = require('../models/user');
const Submission = require('../models/submission')
const validate = require('../utils/validator');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis')
const isProduction = process.env.NODE_ENV === "production";

const register = async (req, res) => {
    try {
        //validate the data
        validate(req.body);
        const firstName = req.body.firstName.trim();

        const emailId = req.body.emailId
            .trim()
            .toLowerCase();

        const password = req.body.password;
        req.body.emailId = emailId;
        req.body.firstName = firstName;
        req.body.role = 'user'

        req.body.password = await bcrypt.hash(password, 10)
        const existingUser = await User.findOne({ emailId });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }
        const user = await User.create(req.body);
        const token = jwt.sign({ id: user._id, emailId: user.emailId, role: 'user' }, process.env.JWT_KEY, { expiresIn: 60 * 60 });
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
            isPremium: user.isPremium
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).json({
            user: reply,
            message: "registered"
        });




    }
    catch (err) {
        console.log(err);
        console.log(err.message);

        res.status(400).json({ message: err.message || "Registration failed. Please try again." });
    }
}



const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId)
            throw new Error('Invalid credentials');
        if (!password)
            throw new Error('Invalid credentials');
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const ans = await bcrypt.compare(password, user.password);
        if (!ans)
            throw new Error('Invalid credentials');

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
            isPremium: user.isPremium
        }
        const token = jwt.sign({ id: user._id, emailId: user.emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 });
        //        res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: isProduction,
        //     sameSite: isProduction ? "None" : "Lax",
        //     maxAge: 60 * 60 * 1000,
        // });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 60 * 60 * 1000,
        });
        res.status(200).json({
            user: reply,
            message: "loggedin successfully"
        });
    }
    catch (err) {
        res.status(401).json({ message: err.message || "Invalid credentials" });
    }
}


const logout = async (req, res) => {
    try {
        //validate the token middleware se hoga
        //token ko redis ke blocklist me add karna hai
        const { token } = req.cookies;
        const payload = jwt.decode(token);
        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);
        //cookies clear kar dena
        //
        // res.cookie('token',null,{expires:new Date(Date.now())});
        //       res.clearCookie("token", {
        //     httpOnly: true,
        //     secure: isProduction,
        //     sameSite: isProduction ? "None" : "Lax",
        // });
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        res.send("User logged out successfully");
    }
    catch (err) {
        res.status(503).send("error: " + err);
    }
}


const adminRegister = async (req, res) => {
    try {
        //validate the data
        validate(req.body);
        const { firstName, emailId, password } = req.body;
        req.body.role = 'admin'

        req.body.password = await bcrypt.hash(password, 10)

        const user = await User.create(req.body);
        const token = jwt.sign({ id: user._id, emailId: user.emailId, role: 'user' }, process.env.JWT_KEY, { expiresIn: 60 * 60 });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).send("user registered successfully");




    }
    catch (err) {
        res.status(400).json({ message: err.message || "Registration failed. Please try again." });
    }
}


const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id
        //user schema se delete
        await User.findByIdAndDelete(userId)

        //submission  se delete kro
        await Submission.deleteMany({ userId })
        res.status(200).send("deleted successfully")

    }
    catch (err) {
        res.status(500).send("internal server error")
    }
}

module.exports = { register, login, logout, adminRegister, deleteProfile };