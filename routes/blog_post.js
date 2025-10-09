let express=require('express');
let router=express.Router();
/* -- biz9-start -- */
const {Scriptz}=require("biz9-scriptz");
const {Portal,Database,Page_Data,Blog_Post_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {DataType,DataItem,App_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Form,Str}=require("biz9-utility");
/* -- biz9-end -- */
router.post('/ping', function(req, res, next) {
    let error = null;
    let data="blog_post-ping";
    console.log(data);
    res.send({error:biz_error,biz_data:data});
    res.end();
});
router.post('/detail/:key', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.blog_post = DataItem.get_new(DataType.BLOG_POST,0,{key:req.params.key});
    data.blog_post_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(biz_error,biz_error);
            }else{
                database = data;
            }
        },
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.get(database,data.blog_post.key);
            if(biz_error){
                error=Log.append(biz_error,biz_error);
            }else{
                data.blog_post = data;
            }
        },
        //blog_post_list
        async function(call){
            let query = {};
            let search = App_Logic.get_search(DataType.BLOG_POST,query,{},1,12);
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(biz_error,biz_error);
            }else{
                data.blog_post_list = data.data_list;
            }
        },
        async function(call){
            data.blog_post_list.filter(item=>item.id!==data.blog_post.id);
            data.data_type=biz_data.data_type;
            data.item_count=biz_data.item_count;
            data.page_count=biz_data.page_count;
            data.filter=biz_data.filter;
            data.blog_post_list=biz_data.data_list;
            data.app_id = database.app_id;
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_home
router.post('/', function(req, res, next) {
    let error = null;
    let database = {};
    let cloud = {};
    cloud.page  = DataItem.get_new(DataType.PAGE,0);
    if(APP_ENV == !App_Logic.TYPE_ENV_TEST){
        user = User_Logic.get_request_user(req);
    }else{
        user = DataItem.get_new(DataType.USER,USER_ID);
    }
    cloud.blog_post_list = [];
    cloud.blog_post_count=0;
    cloud.blog_post_page_count=0;
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(biz_error,biz_error);
            }else{
                database = data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_BLOG_POST);
            if(biz_error){
                error=Log.append(biz_error,biz_error);
            }else{
                cloud.page = data.item;
            }
        },
        //blog_post_list
        async function(call){
            let search = App_Logic.get_search(DataType.BLOG_POST,{},{date_create:-1},1,0);
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(biz_error,biz_error);
            }else{
                cloud.blog_post_list=data.item_list;
                cloud.blog_post_count=data.item_count;
                cloud.blog_post_page_count=data.page_count;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
