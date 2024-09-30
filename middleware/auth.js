const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

exports.authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1]; // Assuming the token is in the format "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Malformed token' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};