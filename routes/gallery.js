let express=require('express');
let router=express.Router();
/* -- biz9-start -- */
const {Scriptz}=require("biz9-scriptz");
const {Portal,Database,Page_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {DataType,DataItem,App_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Form,Str}=require("biz9-utility");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let cloud={};
    cloud.data="gallery-ping";
    console.log(cloud);
    res.send({cloud:cloud});
    res.end();
});
router.get('/detail/:key', function(req, res, next) {
    let cloud_error = null;
    let database,cloud = {};
    cloud.gallery = DataItem.get_new(DataType.GALLERY,0,{key:req.params.key});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [error,data] = await Database.get(biz9_config);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                database = data;
            }
        },
       async function(call){
            const [error,data] = await Portal.get(database,DataType.GALLERY,cloud.gallery.key);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                cloud.gallery = data.item;
            }
        },
    ],
        function(err, result){
            res.send({cloud_error,cloud});
            res.end();
        });
});
//9_home
router.get('/', function(req, res, next) {
    let cloud_error = null;
    let database = {};
    let cloud = {};
    if(APP_ENV !=App_Logic.TYPE_ENV_TEST){
        cloud.user = User_Logic.get_request_user(req);
    }else{
        cloud.user = DataItem.get_new(DataType.USER,USER_ID);
    }
    cloud.page  = DataItem.get_new(DataType.PAGE,0);
    cloud.category_list = [];
    cloud.gallery_list = [];
    cloud.gallery_count = 0;
    cloud.gallery_page_count = 0;
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [error,data] = await Database.get(biz9_config);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                database = data;
            }
        },
        //category_list
        async function(call){
            let search = App_Logic.get_search(DataType.CATEGORY,{type:DataType.GALLERY},{title:-1},1,0);
            const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                cloud.category_list=data.item_list;
            }
        },
        //page
        async function(call){
            const [error,data] = await Page_Data.get(database,Type.PAGE_GALLERY);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                cloud.page = data.item;
            }
        },
        //gallery_list
        async function(call){
            let search = App_Logic.get_search(DataType.GALLERY,{portfolio:'true'},{title:-1},1,0);
            const [error,data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
             if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                cloud.gallery_list=data.item_list;
            }
        },
    ],
        function(err, result){
            res.send({cloud_error,cloud});
            res.end();
        });
});
module.exports = router;
