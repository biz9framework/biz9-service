let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Data,Database}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {Data_Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Favorite_Field,Favorite_Logic,Favorite_Message,Favorite_Table,Favorite_Type}=require("/home/think1/www/doqbox/biz9-framework/biz9-favorite/source");
const {Favorite_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-favorite-data/source");
const {Log,Str,Num}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Scriptz}=require("biz9-scriptz");
/* -- biz9_end -- */
router.get('/ping',function(req,res,next){
    let error = null;
    let data="favorite-ping";
    res.send({error:error,data:data});
    res.end();
});
//9_post
router.post('/post',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(Favorite_Table.FAVORITE,0,{data:{parent_table:req.body.parent_table,parent_id:req.body.parent_id,user_id:req.body.user_id}});
    let option = req.body.option ? req.body.option : {};
    async.series([
        async function(call){
            const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null}));
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        async function(call){
            const [biz_error,biz_data] = await Favorite_Data.post(database,data.parent_table,data.parent_id,data.user_id,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});

module.exports = router;
