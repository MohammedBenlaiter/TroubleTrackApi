const { Project, User } = require('../models');

exports.getAllProjects = async (req, res) => { // Get all projects with user info
    try {
        const projects = await Project.findAll({
            include: [{
                model: User,
                attributes: ['username', 'firstName', 'lastName']
            }]
        });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects', details: error.message });
    }
}

exports.createProject = async (req, res) => {
    const { userId } = req.params;
    const { name, description } = req.body; // Include ownerId in the request body
    try {
        const newProject = await Project.create({
            ownerId: userId, // Use ownerId from the request body
            name,
            description
        });
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Error creating project', details: error.message });
    }
}