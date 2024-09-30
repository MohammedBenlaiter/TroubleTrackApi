const { authentication } = require('../middleware/auth');
const express = require('express');

const { addReportError, getErrors, updateError, deleteError } = require('../controllers/errorController');

const router = express.Router();

router.post('/projects/:projectId/errors', authentication, addReportError);

router.get('/projects/:projectId/errors', getErrors);

router.put('/projects/:projectId/errors/:errorId', updateError);

router.delete('/projects/:projectId/errors/:errorId', deleteError);

module.exports = router;