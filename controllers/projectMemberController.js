
const { ProjectMember, Project, User } = require('../models');

exports.addMemberToProject = async (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
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