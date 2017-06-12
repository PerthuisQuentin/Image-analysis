const Express = require('express');

import Log from './logger';

var router = Express.Router();

import Views from '../routes/views';
import FaceDetection from '../routes/detection';

router.use('/', Views);
router.use('/', FaceDetection);

export default router;