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
};

exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await Project.findOne({
            where: {
                name: name
            }
        });
        if (project) {
            return res.status(400).json({ error: 'Project name already exists' });
        }
        const userId = req.user.userId;
        const newProject = await Project.create({
            ownerId: userId,
            name,
            description
        });
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Error creating project', details: error.message });
    }
};

exports.deleteProject = async (req, res) => { // Delete project
    const { projectId } = req.params;
    try {
        const ownerId = req.user.userId;
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.ownerId !== ownerId) {
            return res.status(403).json({ error: 'You are not the owner of this project' });
        }
        await project.destroy();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting project', details: error.message });
    }
};