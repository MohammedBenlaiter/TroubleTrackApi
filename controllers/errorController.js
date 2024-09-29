const { Project, User, ProjectMember, Error } = require('../models');

exports.AddReportError = async (req, res) => {
    const { projectId } = req.params;
    const { userId, type, message, stackTrace, status } = req.body;
    try {
        const project = await Project.findByPk(projectId);
        const user = await User.findByPk(userId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let isOwner = false;
        let isMemberOwner = false;
        if (user.userId === project.ownerId) {
            isOwner = true;
        }
        const projectMembers = await ProjectMember.findAll({
            where: {
                projectId: projectId,
            }
        });
        projectMembers.forEach(member => {
            if (member.userId === user.userId && member.role === 'owner') {
                isMemberOwner = true;
            }
        });
        if (isOwner || isMemberOwner) {
            const newError = await Error.create({
                projectId: projectId,
                type: type,
                message: message,
                stackTrace: stackTrace,
                status: status,
                postedBy: user.username
            });
            return res.status(201).json(newError);
        }
        else {
            return res.status(403).json({ error: "This user can't post an error" });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
} // is still just authentication 


exports.GetErrors = async (req, res) => {
    
};