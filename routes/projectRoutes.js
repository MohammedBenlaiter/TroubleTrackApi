const express = require('express');
const { getAllProjects, createProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', getAllProjects);
router.post('/projects/:userId', createProject);

module.exports = router;