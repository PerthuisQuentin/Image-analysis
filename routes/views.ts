const Express = require('express');

import Log from '../lib/logger';

var router = Express.Router();

router.get('/', function(request: any, response: any) {
    response.render('index');
});

Log.verbose('Loaded : [VIEW][GET] /');

export default router;