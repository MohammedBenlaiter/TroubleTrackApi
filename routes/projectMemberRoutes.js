const express = require('express');
const { addMemberToProject, removeMemberFromProject, getProjectMembers } = require('../controllers/projectMemberController');
const { authentication } = require('../middleware/auth');

const router = express.Router();

router.post('/projectsMembers/:projectId/:userId', authentication, addMemberToProject);

router.delete('/projectsMembers/:projectId/:userId', authentication, removeMemberFromProject);

router.get('/projectsMembers/:projectId', authentication, getProjectMembers);

module.exports = router;