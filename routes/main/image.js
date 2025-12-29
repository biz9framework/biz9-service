let express=require('express');
let router=express.Router();
const fs = require('fs');
const path = require('path');
//const FormData = require('form-data');
/* -- biz9_start -- */
const {Image_Logic,DataItem,DataType,Type}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Str,Num,Obj}=require("biz9-utility");
const {Image_Cloud_Flare,Image_File}=require("biz9-image");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error=null;
    let data="image-ping";
    res.send({data:data});
    res.end();
});
//9_write_image
// - required_form_data = images[image_data]
router.post('/post',function(req,res,next){
    let error = null;
    let post_image_items = req.body.data.images;
    let data = {images:[],resultOK:false};
    let upload_dir = path.join('public', 'uploads');
    var item = {};
     function get_process_items(upload_dir,image_filename){
         console.log('start-here');
		upload_dir = upload_dir ? upload_dir : "";
		image_filename = image_filename ? image_filename : "";
		return [
			{
				image_filename:Type.IMAGE_SIZE_ORIGINAL+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_ORIGINAL+"_"+image_filename,
				size:0,
				type_resize:Type.IMAGE_RESIZE_NONE,
			},
			/*
			{
				image_filename:Type.IMAGE_SIZE_THUMB+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_THUMB+"_"+image_filename,
				size:250,
				type_resize:Type.IMAGE_RESIZE_NORMAL,
			},
			{
				image_filename:Type.IMAGE_SIZE_MID+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_MID+"_"+image_filename,
				size:720,
				type_resize:Type.IMAGE_RESIZE_NORMAL,
			},
			*/
			{
				image_filename:Type.IMAGE_SIZE_LARGE+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_LARGE+"_"+image_filename,
				size:1000,
				type_resize:Type.IMAGE_RESIZE_NORMAL,
			},
			{
				image_filename:Type.IMAGE_SIZE_SQUARE_THUMB+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_SQUARE_THUMB+"_"+image_filename,
				size:250,
				type_resize:Type.IMAGE_RESIZE_SQUARE,
			},
			{
				image_filename:Type.IMAGE_SIZE_SQUARE_MID+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_SQUARE_MID+"_"+image_filename,
				size:720,
				type_resize:Type.IMAGE_RESIZE_SQUARE,
			},
			/*
			{
				image_filename:Type.IMAGE_SIZE_SQUARE_LARGE+"_"+image_filename,
				path_filename:upload_dir+"/"+Type.IMAGE_SIZE_SQUARE_LARGE+"_"+image_filename,
				size:1000,
				type_resize:Type.IMAGE_RESIZE_SQUARE,
			},
			*/
		];
	}

    async.series([
        //get images
        async function(call){
            post_image_items.forEach(item => {
                data.images.push(Image_Logic.get_new_by_base64(item));
            });
        },
        //write - images
        async function(call){
            for(const item of data.images) {
                let image_process_items = get_process_items(upload_dir,item.image_filename);
                for (const image of image_process_items) {
                    const [biz_error,biz_data] = await Image_File.post_write(item.buffer,image.size,image.path_filename,image.type_resize);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }
                }
                if(!error){
                    item.resultOK = true;
                }
            }
            if(!error){
                data.resultOK=true;
            }
        },
        //clean
        async function(call){
            for(const item of data.images) {
                delete item.image_data;
                delete item.buffer;
                delete item.resultOK;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_cdn_image
// - required_form_data = images[image_filename]
router.post('/cdn_post',function(req,res,next){
    let error = null;
    let data = {images:req.body.data.images,resultOK:false};
    let upload_dir = path.join('public', 'uploads');
    var item = {};
    let cloud_flare_batch_token = null;
   async.series([
        async function(call){
            const [biz_error,biz_data] = await Image_Cloud_Flare.get_batch_token(CLOUD_FLARE_ACCOUNT_ID,CLOUD_FLARE_API_TOKEN);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                cloud_flare_batch_token = biz_data;
            }
        },
        //cdn - images
        async function(call){
            for (const item of data.images) {
                let image_process_items = Image_Logic.get_process_items(upload_dir,item.image_filename);
                for (const image of image_process_items) {
                    const [biz_error,biz_data] = await Image_Cloud_Flare.post_batch_image(CLOUD_FLARE_API_TOKEN,cloud_flare_batch_token,image.image_filename,image.path_filename);
                    if(biz_error){
                        error=Log.append(error,biz_error);
                    }
                }
                if(!error){
                    item.resultOK = true;
                }
            }
            if(!error){
                data.resultOK = true;
            }
        },
        //clean
        async function(call){
            for(const item of data.images) {
                delete item.resultOK;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
