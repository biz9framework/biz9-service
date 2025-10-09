let express=require('express');
let router=express.Router();
const fs = require('fs');
const path = require('path');
//const FormData = require('form-data');
/* -- biz9_start -- */
const {Image_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Str,Num,Obj}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
const {Image_Cloud_Flare,Image_File}=require("/home/think2/www/doqbox/biz9-framework/biz9-image/code");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error=null;
    let data="image-ping";
    res.send({data:data});
    res.end();
});
//9_write_image
// - required_form_data = image_list[image_data]
router.post('/post',function(req,res,next){
    let error = null;
    let post_image_list = req.body.data.image_list;
    let data = {image_list:[],resultOK:false};
    let upload_dir = path.join('public', 'uploads');
    var item = {};
    async.series([
        //get image_list
        async function(call){
            post_image_list.forEach(item => {
                    data.image_list.push(Image_File.get_new_by_base64(item.image_data));
            });
        },
        //write - image_list
        async function(call){
            for (const item of data.image_list) {
                let image_process_list = Image_Logic.get_process_list(upload_dir,item.image_filename);
                for (const image of image_process_list) {
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
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_cdn_image
// - required_form_data = image_list[image_filename]
router.post('/cdn_post',function(req,res,next){
    let error = null;
    let data = {image_list:req.body.data.image_list,resultOK:false};
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
        //cdn - image_list
        async function(call){
            console.log('33333333333');
            for (const item of data.image_list) {
                let image_process_list = Image_Logic.get_process_list(upload_dir,item.image_filename);
                console.log(item);
                for (const image of image_process_list) {
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
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
