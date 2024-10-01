const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};