const { authentication } = require('../middleware/auth');
const express = require('express');

const { addReportError, getErrors, updateError, deleteError } = require('../controllers/errorController');

const router = express.Router();

router.post('/projects/:projectId/errors', authentication, addReportError);

router.get('/projects/:projectId/errors', authentication, getErrors);

router.put('/projects/:projectId/errors/:errorId', authentication, updateError);

router.delete('/projects/:projectId/errors/:errorId', authentication, deleteError);

module.exports = router;