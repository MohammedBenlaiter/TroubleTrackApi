const { Project, User, ProjectMember, Error } = require('../models');
const verifyOwnership = async (User, Project) => {
    let isOwner = false;
    let isMemberOwner = false;
    if (User.userId === Project.ownerId) {
        isOwner = true;
    }
    const projectMembers = await ProjectMember.findAll({
        where: {
            projectId: Project.projectId,
        }
    });
    projectMembers.forEach(member => {
        if (member.userId === User.userId && member.role === 'owner') {
            isMemberOwner = true;
        }
    });
    return isOwner || isMemberOwner;
}
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

exports.addReportError = async (req, res) => {
    const { projectId } = req.params;
    const { type, message, stackTrace, status } = req.body;

    try {
        const userId = req.user.userId;
        const project = await Project.findByPk(projectId);
        const user = await User.findByPk(userId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isOwner = await verifyOwnership(user, project);
        if (isOwner) {
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
};

exports.getErrors = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.userId;
    try {
        const project = await Project.findByPk(projectId);
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        let isMember = await verifyMembership(user, project);
        if (isMember) {
            const errors = await Error.findAll({
                where: {
                    projectId: projectId
                }
            });
            return res.json(errors);
        }
        else {
            return res.status(403).json({ error: "This user can't view errors" });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.updateError = async (req, res) => {
    const { projectId, errorId } = req.params;
    const { type, message, stackTrace, status } = req.body;
    const userId = req.user.userId;
    try {
        const project = await Project.findByPk(projectId);
        const error = await Error.findByPk(errorId);
        const user = await User.findByPk(userId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (!error) {
            return res.status(404).json({ error: 'Error not found' });
        }
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        if (error.projectId !== project.projectId) {
            return res.status(404).json({ error: 'Error not found in this project' });
        }
        let isOwner = await verifyOwnership(user, project);
        if (isOwner) {
            error.type = type;
            error.message = message;
            error.stackTrace = stackTrace;
            error.status = status;
            await error.save();
            return res.json(error);
        }
        else {
            return res.status(403).json({ error: "This user can't update an error" });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.deleteError = async (req, res) => {
    const { projectId, errorId } = req.params;
    const userId = req.user.userId;
    try {
        const project = await Project.findByPk(projectId);
        const error = await Error.findByPk(errorId);
        const user = await User.findByPk(userId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (!error) {
            return res.status(404).json({ error: 'Error not found' });
        }
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        if (error.projectId !== project.projectId) {
            return res.status(404).json({ error: 'Error not found in this project' });
        }
        let isOwner = await verifyOwnership(user, project);
        if (isOwner) {
            await error.destroy();
            return res.json({ message: 'Error deleted successfully' });
        }
        else {
            return res.status(403).json({ error: "This user can't delete an error" });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};