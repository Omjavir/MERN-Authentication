const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// REGISTER CONTROLLER
exports.register = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exist" })
        // Hashing the user's password
        const hashedPassword = await bcrypt.hash(password, 12)
        // Creating User in Database
        const result = await User.create({ name, email, password: hashedPassword })
        // Creating (Signing) the token for user
        const token = jwt.sign({ email: result.email, id: result._id }, 'OMJAVIR', { expiresIn: "1h" })

        res.status(200).cookie('jwt', token, {
            expires: new Date(Date.now() + 29800000000),
            httpOnly: true,
        }).json({ Success: true, message: "User registered successfully", user: result, token })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

// LOGIN CONTROLLER
exports.login = async (req, res) => {
    const { email, password } = req.body //Coming from formData
    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(404).json({ message: "Invalid credentials" })
        // Comparing the user password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })
        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'OMJAVIR', { expiresIn: "1h" })
        //Then send the token to the client/frontend
        res.status(200).cookie('jwt', token, {
            expires: new Date(Date.now() + 29800000000),
            httpOnly: true,
        }).json({ Success: true, message: "Login Successfull", user: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error);
    }
}

// GETTING ALL USERS (ADMIN ROUTE)
exports.getAllUser = async (req, res) => {
    const users = await User.find()
    res.json({
        Success: true,
        users
    })
}