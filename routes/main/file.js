let express=require('express');
let router=express.Router();
const fs = require('fs');
const path = require('path');
//const FormData = require('form-data');
/* -- biz9_start -- */
const {File_Logic,Data_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Str,Num,Obj}=require("biz9-utility");
//const {File_Cloud_Flare,File_File}=require("biz9-file");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error=null;
    let data="file-ping";
    res.send({data:data});
    res.end();
});
//9_write_file
// - required_form_data = file_list[file_data]
router.post('/post',function(req,res,next){
    let error = null;
    //Log.w('44b_post_file_list',post_file_list);

    let post_file_list = req.body.data.file_list;
    let data = {file_list:[],resultOK:false};
    let upload_dir = path.join('public', 'uploads');
    var item = {};
    async.series([
        //get file_list
        async function(call){
            console.log('abbbbbbbbbbbbbb');
            /*
            post_file_list.forEach(item => {
                data.file_list.push(File.get_new_by_base64(item));
            });
            */
            Log.w('33_post',post_file_list);
        },
        /*
        //write - file_list
        async function(call){
            for(const item of data.file_list) {
                let file_process_list = File_Logic.get_process_list(upload_dir,item.file_filename);
                for (const file of file_process_list) {
                    const [biz_error,biz_data] = await File_File.post_write(item.buffer,file.size,file.path_filename,file.type_resize);
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
            for(const item of data.file_list) {
                delete item.file_data;
                delete item.buffer;
                delete item.resultOK;
            }
        },
        */
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_cdn_file
// - required_form_data = file_list[file_filename]
/*
router.post('/cdn_post',function(req,res,next){
    let error = null;
    let data = {file_list:req.body.data.file_list,resultOK:false};
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
        //cdn - file_list
        async function(call){
            for (const item of data.file_list) {
                let file_process_list = Image_Logic.get_process_list(upload_dir,item.file_filename);
                for (const file of file_process_list) {
                    const [biz_error,biz_data] = await Image_Cloud_Flare.post_batch_file(CLOUD_FLARE_API_TOKEN,cloud_flare_batch_token,file.file_filename,file.path_filename);
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
            for(const item of data.file_list) {
                delete item.resultOK;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
*/
module.exports = router;
