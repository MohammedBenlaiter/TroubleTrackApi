const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN;

exports.registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;
        const userExist = await User.findOne({ where: { username } });
        if (userExist) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        await User.create({
            username,
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
        });
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json('Username not found');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json('Invalid password');
        }
        const token = jwt.sign({ userId: user.userId }, secretKey, {
            expiresIn,
        });
        return res.status(200).json({
            /*  id: user.userId,
                username: user.username,
                email: user.email, */
            accessToken: token,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Sign in error', details: error.message });
    }
};