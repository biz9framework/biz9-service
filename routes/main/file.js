var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud photo ping';
    res.send({helper:helper});
    res.end();
});
router.post("/update_photo", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK, 0);
    var aws_config={aws_key:AWS_KEY,aws_secret:AWS_SECRET,region:AWS_REGION};
    var file_ext=null;
    var file_mime_type=null;
    helper.error=null;
    async.series([
        function(call){
            try {
                if (fs.existsSync(FILE_SAVE_PATH)) {
                    call();
                } else {
                    helper.error="Image save directory does not exist.";
                    call();
                }
            } catch(e) {
                helper.error="An error occurred. "+ error;
                call();
            }
        },
        function(call){
            if(helper.error==null){
                let imageFileName = {}
                const bb = busboy({ headers: req.headers });
                const run = async function(a, b) {
                    bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
                        // Getting extension of any image
                        const imageExtension = filename.filename.split(".")[filename.filename.split(".").length - 1];
                        file_ext = imageExtension;
                        // Setting filename
                        //helper.item.photofilename = biz9.get_guid()+"."+file_ext;
                        imageFileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`;
                        filepath = path.join(FILE_SAVE_PATH, imageFileName);
                        // Creating path
                        helper.item.photofilename=imageFileName;
                        file.pipe(fs.createWriteStream(filepath));
                    });
                    bb.on("finish", () => {
                        call();
                    });
                    req.pipe(bb);
                }
                run();
            }else{
                call();
            }
        },
        /*upload_mulitple_photos work
         * https://stackoverflow.com/questions/58461076/upload-multiple-images-on-firebase-using-nodejs-and-busboy
        function(call){
            let imageFileName = {}
            let imagesToUpload = []
            let imageToAdd = {}
        //This triggers for each file type that comes in the form data
            busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
                if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
                    return res
                        .status(400)
                        .json({ error: "Wrong file type submitted!" });
                }
        // Getting extension of any image
                const imageExtension = filename.split(".")[
                    filename.split(".").length - 1
                ];
// Setting filename
                imageFileName = `${Math.round(
                    Math.random() * 1000000000
                )}.${imageExtension}`;
        // Creating path
                const filepath = path.join(os.tmpdir(), imageFileName);
                imageToAdd = {
                    imageFileName
                    filepath,
                    mimetype };
                file.pipe(fs.createWriteStream(filepath));
    //Add the image to the array
                imagesToUpload.push(imageToAdd);
            });
            busboy.on("finish", () => {
                let promises = []
                let imageUrls = []
                imagesToUpload.forEach(imageToBeUploaded => {
                    imageUrls.push(`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o${folder}%2F${imageFileName}?alt=media`)
                    promises.push(admin
                        .storage()
                        .bucket()
                        .upload(imageToBeUploaded.filepath, {
                            destination: `${folder}/${imageFileName}`,
                            resumable: false,
                            metadata: {
                                metadata: {
                                    contentType: imageToBeUploaded.mimetype
                                }
                            }
                        }))
                })
                try{
                    await Promises.all(resolve)
                    res.status(200).json({msg: 'Successfully uploaded all images', imageUrls})
                }catch(err){ res.status(500).json(err) }
            });
            busboy.end(req.rawBody);
        },
        */
        //save file_old
        /*
        function(call){
            const bb = busboy({ headers: req.headers });
            const run = async function(a, b) {
                bb.on('file', (fieldname, file,filename, encoding,mimetype) => {
                    file_ext=filename.filename.substr(filename.filename.lastIndexOf('.') + 1);
                    helper.item.photofilename = biz9.get_guid()+"."+file_ext;
                    const saveTo = path.join(FILE_SAVE_PATH,helper.item.photofilename);
                    file.pipe(fs.createWriteStream(saveTo));
                });
                bb.on('finish', () => {
                    call();
                });
                req.pipe(bb);
            }
            run();
        },
        */
        function(call){
            switch (file_ext) {
                case 'png':
                    file_mime_type='image/png';
                    break;
                case 'jpeg':
                    file_mime_type='image/jpeg';
                    break;
                case 'jpg':
                    file_mime_type='image/jpeg';
                    break;
                case 'avif':
                    file_mime_type='image/avif';
                    break;
                case 'svg':
                    file_mime_type='image/svg+xml';
                    break;
                case 'webp':
                    file_mime_type='image/jpeg';
                    //file_mime_type='image/webp';
                    break;
                default:
                    file_mime_type='image/jpeg';
            }
            call();
        },
        //save with new filename album_sizez
        function(call){
            if(helper.error==null){
                async function run() {
                    try {
                        var sizes = [{
                            path:FILE_SAVE_PATH+PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,
                            xy: PHOTO_SIZE_THUMB.size
                        },{
                            path:FILE_SAVE_PATH+PHOTO_SIZE_MID.title_url+helper.item.photofilename,
                            xy: PHOTO_SIZE_MID.size
                        },
                        ];
                        biz9.set_resize_photo_file(FILE_SAVE_PATH+helper.item.photofilename,sizes,function(error,data) {
                            helper.error=error;
                            call();
                        });
                    } catch (e) {
                        helper.error=e;
                        call();
                    }
                }
                run();
            }else{
                call();
            }
        },
        //save with new filename square_sizez
        function(call){
            if(helper.error==null){
                async function run() {
                    try {
                var sizes = [{
                    path:FILE_SAVE_PATH+PHOTO_SIZE_SQUARE_THUMB.title_url+helper.item.photofilename,
                    xy: PHOTO_SIZE_SQUARE_THUMB.size
                },{
                    path:FILE_SAVE_PATH+PHOTO_SIZE_SQUARE_MID.title_url+helper.item.photofilename,
                    xy: PHOTO_SIZE_SQUARE_MID.size
                }
                        ];
                biz9.set_resize_square_photo_file(FILE_SAVE_PATH+helper.item.photofilename,sizes,function(error,data) {
                            helper.error=error;
                            call();
                        });
                    } catch (e) {
                        helper.error=e;
                        call();
                    }
                }
                run();
            }else{
                call();
            }
        },
        //update_s3_org
        function(call){
            if(helper.error==null){
                if(AWS_S3_SAVE){
                    biz9.update_bucket_file(aws_config,AWS_S3_BUCKET,FILE_SAVE_PATH+helper.item.photofilename,helper.item.photofilename,file_mime_type,
                        function(error,data) {
                            helper.error=error;
                            call();
                        });

                }else{
                    call();
                }
            }else{
                call();
            }
        },
        //update_s3_thumb
        function(call){
            if(AWS_S3_SAVE){
                biz9.update_bucket_file(aws_config,AWS_S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,file_mime_type,function(error,data) {
                    helper.error=error;
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_mid
        function(call){
            if(AWS_S3_SAVE){
                biz9.update_bucket_file(aws_config,AWS_S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_MID.title_url+helper.item.photofilename,PHOTO_SIZE_MID.title_url+helper.item.photofilename,file_mime_type,function(error,data) {
                    helper.error=error;
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_square_thumb
        function(call){
            if(AWS_S3_SAVE){
                biz9.update_bucket_file(aws_config,AWS_S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_SQUARE_THUMB.title_url+helper.item.photofilename,PHOTO_SIZE_SQUARE_THUMB.title_url+helper.item.photofilename,file_mime_type,function(error,data) {
                    helper.error=error;
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_square_mid
        function(call){
            if(AWS_S3_SAVE){
                biz9.update_bucket_file(aws_config,AWS_S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_SQUARE_MID.title_url+helper.item.photofilename,PHOTO_SIZE_SQUARE_MID.title_url+helper.item.photofilename,file_mime_type,function(error,data) {
                    helper.error=error;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.item = biz9.set_biz_item(helper.item);
            call();
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update_mp3", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK, 0);
    var aws_config={aws_key:AWS_KEY,aws_secret:AWS_SECRET,region:AWS_REGION};
    helper.error=null;
    async.series([
        //save file
        function(call){
            const bb = busboy({ headers: req.headers });
            const run = async function(a, b) {
                bb.on('file', (fieldname, file,filename, encoding,mimetype) => {
                    helper.item.mp3filename = biz9.get_guid()+"."+filename.filename.substr(filename.filename.lastIndexOf('.') + 1);
                    const saveTo = path.join(FILE_SAVE_PATH,helper.item.mp3filename);
                    file.pipe(fs.createWriteStream(saveTo));
                });
                req.pipe(bb);
                bb.on('finish', () => {
                    call();
                });
            }
            run();
        },
        function(call){
            helper.item.mp3duration='0:00';
            if(helper.error==null){
                mp3Duration(FILE_SAVE_PATH+helper.item.mp3filename,function(error, duration) {
                    if(error){
                        helper.error=error;
                    }else{
                        helper.item.mp3duration= biz9.get_mp3_duration(duration);
                    }
                    call();
                });
            }
        },
        //upload to s3
        function(call){
            if(AWS_S3_SAVE && helper.error==null){
                biz9.update_bucket_file(aws_config,AWS_S3_BUCKET,FILE_SAVE_PATH+helper.item.mp3filename,helper.item.mp3filename,"audio/mp3",function(data,error){
                    helper.item.mp3_url = FILE_URL+helper.item.mp3filename;
                    call();
                });
            }else{
                call();
            }
        },
        //delete mp3
        /*
        function(call){
            if(helper.error==null){
                try {
                    fs.unlinkSync(FILE_SAVE_PATH+helper.item.mp3filename)
                    call();
                } catch(err) {
                    helper.error='error: could not delete mp3';
                    call();
                }
            }else{
                call();
            }
        },
        */
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
