const Express = require('express');
const Multer = require('multer');
const Async = require('async');
const _ = require('lodash');
const Easyimg = require('easyimage');
const OpenCV = require('opencv');

import Log from '../lib/logger';

var router = Express.Router();
var upload = Multer({dest: 'uploads/'});

// MIME types for image uploads
var exts: any = {
  'image/jpeg': '.jpg',
  'image/png' : '.png',
  'image/gif' : '.gif'
};

router.post('/face-detection-upload', upload.single('file'), function(request: any, response: any, next: any) {

    Log.debug('New request on /face-detection');

    // Generate a filename; just use the one generated for us, plus the appropriate extension
    var filename = request.file.filename + exts[request.file.mimetype];
    // and source and destination filepaths

    var src = './' + request.file.path;
    var dst = './public/result/' + filename;

    /**
     * Go through the various steps
     */
    Async.waterfall(
        [
            function(callback: any) {
                /**
                 * Check the mimetype to ensure the uploaded file is an image
                 */
                 Log.debug('[face-detection] Check MIME type');

                if(!_.includes(['image/jpeg', 'image/png', 'image/gif'], request.file.mimetype)) {
                    return callback( new Error( 'Invalid file - please upload an image (.jpg, .png, .gif).' ) )
                }

                return callback();
            },
            function(callback: any) {
                /**
                 * Get some information about the uploaded file
                 */
                 Log.debug('[face-detection] Check image size');

                Easyimg.info(src)
                    .then(function(file: any) {
                        /**
                         * Check that the image is suitably large
                         */
                        if((file.width < 320) || (file.height < 100)) {
                            return callback(new Error('Image must be at least 320 x 100 pixels'));
                        }

                        return callback();
                    });
            },
            function(callback: any) {
                /**
                 * Resize the image to a sensible size
                 */
                Log.debug('[face-detection] Resize image');

                Easyimg.resize({
                        width      :   960,
                        src        :   src,
                        dst        :   dst
                    })
                    .then(function(image: any) {
                        return callback();
                    });
            },
            function(callback: any) {
                /**
                 * Use OpenCV to read the (resized) image
                 */
                 Log.debug('[face-detection] Read image');

                OpenCV.readImage(dst, callback);
            },
            function(im: any, callback: any) {
                /**
                 * Run the face detection algorithm
                 */
                 Log.debug('[face-detection] Detect faces');

                im.detectObject(OpenCV.FACE_CASCADE, {}, callback);
            }
        ],
        function(err: any, faces: any) {
            /**
             * If an error occurred somewhere along the way, render the
             * error page.
             */
             Log.debug('[face-detection] Final callback');

            if(err) {
                return response.render('error', { message : err.message });
            }

            /**
             * We're all good; render the result page.
             */
            return response.render('face-detection-result', {
                filename   :   filename,
                faces     :   faces
            });
        }
    );
});

Log.verbose('Loaded : [VIEW][GET] /face-detection');

export default router;