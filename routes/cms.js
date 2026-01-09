let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Portal,Database}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {Type,Data_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Obj}=require("biz9-utility");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let data={};
    data="cms-ping";
    console.log(data);
    res.send({data:data});
    res.end();
});
router.get('/user_home', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.app_id = null;
    data.admin =Data_Logic.get(Type.DATA_ADMIN,0);
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            data.app_id = biz9_config.app_id;
            const [error,data] = await Database.get(biz9_config);
            if(error){
                error=Log.append(error,error);
            }else{
                database = data;
            }
        },
        async function(call){
            const [error,data] = await Admin_Data.get(database);
            if(error){
                error=Log.append(error,error);
            }else{
                data.admin = data.item;
            }
        },
    ],
        function(err, result){
            res.send({error,data});
            res.end();
        });
});
//9_cms_post - 9_post
//required form_data = data_type, id
router.post('/post',function(req,res,next){
    let error=null;
    let database,data={};
    let data=Data_Logic.get(req.body.item.data_type,req.body.item.id,{data:{req.body.item}});
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
        //clean
        async function(call){
            for(const field in data){
                if(Obj.check_is_array(data[field])){
                    delete data[field];
                }
            }
        },
        //post item
        async function(call){
            const [biz_error,biz_data] = await Portal.post(database,data.data_type,data,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.item = biz_data;
            }
        },
    ],
        function(err,result){
            res.send({error:error,data:data});
            res.end();
        });
});
// - required_form_data = data_type
router.post('/search_item_type_category', function(req, res, next) {
    let error = null;
    let database,data = {};
    let post_search = req.body.search;
    let post_option = req.body.option ? req.body.option : {};
    data.data_type = req.body.data_type;
    data.types = [];
    data.categorys = [];
    data.items = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //type
        async function(call){
            let search = Data_Logic.get_search(Type.DATA_TYPE,{},{},1,0);
            let option ={get_field:true,fields:'title,type'};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.types =  biz_data.items;
            }
        },
        //category
        async function(call){
            let search = Data_Logic.get_search(Type.DATA_CATEGORY,{category:data.data_type},{},1,0);
            let option = {get_field:false,fields:'title,type,data_type',get_distinct:true,distinct_field:'title'};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.categorys =  biz_data.items;
            }
        },
        //item
        async function(call){
            let search = Data_Logic.get_search(post_search.data_type,post_search.filter,post_search.sort_by,post_search.page_current,post_search.page_size);
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,post_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.items =  biz_data.items;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
