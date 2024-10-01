const express = require('express');
const { authentication } = require('../middleware/auth');
const { getAllProjects, createProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', getAllProjects);
router.post('/projects', authentication, createProject);
router.delete('/projects/:projectId', authentication, deleteProject);


module.exports = router;