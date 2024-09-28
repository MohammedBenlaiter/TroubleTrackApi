const express = require('express');
const { addMemberToProject } = require('../controllers/projectMemberController');

const router = express.Router();

router.post('/projectsMembers/:projectId/:userId', addMemberToProject);

module.exports = router;