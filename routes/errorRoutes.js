const express = require('express');

const { AddReportError } = require('../controllers/errorController');

const router = express.Router();

router.post('/projects/:projectId/errors', AddReportError);

module.exports = router;