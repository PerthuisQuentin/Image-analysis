const Express = require('express');

import Log from '../lib/logger';

interface View {
    path: string,
    render: string
}

var views: View[] = [
    { path: '/', render: 'index' },
    { path: '/face-detection', render: 'face-detection' }
];

var router = Express.Router();

for (let view of views) {
    router.get(view.path, function(request: any, response: any) {
        response.render(view.render);
    });

    Log.verbose('Loaded : [VIEW][GET] ' + view.path);
}

export default router;