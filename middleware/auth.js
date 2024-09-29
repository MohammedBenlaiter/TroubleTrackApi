const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
    } catch (error) {
        res.status(400).json({ error: 'Invalid Token', details: error.message });
    }
}