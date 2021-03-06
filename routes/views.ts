const Express = require('express');

import Log from '../lib/logger';

var router = Express.Router();

router.get('/', function(request: any, response: any) {
    response.render('index');
});

Log.verbose('Loaded : [VIEW][GET] /');

router.get('/face-detection', function(request: any, response: any) {
    response.render('face-detection');
});

Log.verbose('Loaded : [VIEW][GET] /face-detection');

router.get('/usb-detection', function(request: any, response: any) {
    response.render('usb-detection');
});

Log.verbose('Loaded : [VIEW][GET] /usb-detection');

export default router;