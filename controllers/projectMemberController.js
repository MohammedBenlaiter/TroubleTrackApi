
const { ProjectMember, Project, User } = require('../models');

const verifyMembership = async (User, Project) => {
    let isOriginalMember = false;
    if (Project.ownerId === User.userId) {
        isOriginalMember = true;
    }
    let isMember = false;
    const projectMembers = await ProjectMember.findAll({
        where: {
            projectId: Project.projectId,
        }
    });
    projectMembers.forEach(member => {
        if (member.userId === User.userId) {
            isMember = true;
        }
    })
    return isOriginalMember || isMember;
};

exports.addMemberToProject = async (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;
    try {
        const ownerId = req.user.userId;
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.ownerId !== ownerId) {
            return res.json(403).json({ error: 'You are not the owner of this project' });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const projectMember = await ProjectMember.findOne({
            where: {
                projectId: projectId,
                userId: userId
            }
        });
        if (projectMember) {
            return res.status(400).json({ error: 'User is already a member of this project' });
        }
        const newProjectMember = await ProjectMember.create({
            projectId: projectId,
            userId: userId,
            role: role,
        });
        return res.status(201).json(newProjectMember);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

exports.removeMemberFromProject = async (req, res) => {
    const { projectId, userId } = req.params;
    try {
        const ownerId = req.user.userId;
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.ownerId !== ownerId) {
            return res.json(403).json({ error: 'You are not the owner of this project' });
        }
        const projectMember = await ProjectMember.findOne({
            where: {
                projectId: projectId,
                userId: userId
            }
        });
        if (!projectMember) {
            return res.status(404).json({ error: 'User is not a member of this project' });
        }
        await projectMember.destroy();
        return res.status(204).json({ message: 'User removed from project' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

exports.getProjectMembers = async (req, res) => {
    const { projectId } = req.params;
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        isMember = await verifyMembership(user, project);
        if (!isMember) {
            return res.status(403).json({ error: 'You are not a member of this project' });
        }
        const projectMembers = await ProjectMember.findAll({
            where: {
                projectId: projectId
            },
            include: [{
                model: User,
                as: 'User', // Specify the alias used in the association
                attributes: ['username', 'firstName', 'lastName']
            }]
        });
        return res.json(projectMembers);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};