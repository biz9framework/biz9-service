let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Portal,Database,Data_Logic,Search_Data,Content_Data,Review_Data,Business_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {DataType,DataItem,App_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Scriptz}=require("biz9-scriptz");
const {Error,Log,Form,Str}=require("biz9-utility");
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
    data.admin =DataItem.get_new(DataType.ADMIN,0);
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
    let post_data=DataItem.get_new(req.body.data.item.data_type,req.body.data.item.id,req.body.data.item);
    let post_group_list=req.body.data.group_list ? req.body.data.group_list : [];
    let option = req.body.data.option ? req.body.data.option : {};
    data.item = DataItem.get_new(req.body.data.data_type,req.body.data.id);
    data.delete_cache_item=DataItem.get_new(req.body.data.data_type,req.body.data.id);
    async.series([
        async function(call){
            const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null}));
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        /*
        //post group_list
        async function(call){
            if(post_group_list.length>0){
                data.group_list=[];
                post_group_list.forEach(item =>{
                    delete item.items;
                    delete item.images;
                });
                const [biz_error,biz_data] = await Portal.post_list(database,post_group_list);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.post_group_list = biz_data;
                }
            }
        },
        */
        //clean
        async function(call){
            delete post_data.images;
            delete post_data.items;
            delete post_data.photos;
            delete post_data.groups;
        },
        //post item
        async function(call){
            const [biz_error,biz_data] = await Portal.post(database,post_data.data_type,post_data,option);
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

//9_get_item_parent_top_type_category
//requird = data_type,id
router.post('/item_parent_top_type_category',function(req,res,next){
    let error,database = null;
    let data =
        {
            item:DataItem.get_new(req.body.data.data_type,req.body.data.id),
            parent_item:DataItem.get_new(req.body.data.data_type,req.body.data.id),
            top_item:DataItem.get_new(req.body.data.data_type,req.body.data.id),
            type_list:[],
            category_list:[],
            type_category_list:[]
        };
    let post_data = DataItem.get_new(req.body.data.data_type,req.body.data.id);
    data.item = DataItem.get_new(post_data.data_type,post_data.id);
    data.parent_item = DataItem.get_new(post_data.data_type,post_data.id);
    data.top_item = DataItem.get_new(post_data.data_type,post_data.id);
    data.category_list = [];
    data.item_list = [];
    let option = req.body.data.option ? req.body.data.option : {};
    async.series([
        async function(call){
            const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null}));
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //item
        async function(call){
            if(!Str.check_is_null(data.item.id)){
                const [biz_error,biz_data] = await Portal.get(database,data.item.data_type,data.item.id,option);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.item = biz_data;
                }
            }
        },
        //parent
        async function(call){
            if(!Str.check_is_null(data.item.parent_id) && !Str.check_is_null(data.item.parent_data_type) ){
                const [biz_error,biz_data] = await Portal.get(database,data.item.parent_data_type,data.item.parent_id);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.parent_item = biz_data;
                }
            }
        },
        //top
        async function(call){
            if(!Str.check_is_null(data.item.top_id) &&!Str.check_is_null(data.item.top_data_type) ){
                const [biz_error,biz_data] = await Portal.get(database,data.item.top_data_type,data.item.top_id);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.top_item = biz_data;
                }
            }
        },
        //type
        async function(call){
            let search = App_Logic.get_search(DataType.TYPE,{},{},1,0);
            let option ={get_field:true,fields:'title,type'};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.type_list =  biz_data.data_list;
            }
        },
        //category
        async function(call){
            let search = App_Logic.get_search(DataType.CATEGORY,{category:post_data.data_type},{},1,0);
            let option = {get_field:false,fields:'title,type,data_type',get_distinct:true,distinct_field:'title'};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_list =  biz_data.data_list;
            }
        },
    ],
        function(err,result){
            res.send({error:error,data:data});
            res.end();
        });
});

//9_search_item_type_category
// - required_form_data = data_type
router.post('/search_item_type_category', function(req, res, next) {
    let error = null;
    let database,data = {};
    let post_search = req.body.data.search;
    let post_option = req.body.data.option ? req.body.data.option : {};
    data.data_type = req.body.data.data_type;
    data.type_list = [];
    data.category_list = [];
    data.item_list = [];
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
            let search = App_Logic.get_search(DataType.TYPE,{},{},1,0);
            let option ={get_field:true,fields:'title,type'};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.type_list =  biz_data.data_list;
            }
        },
        //category
        async function(call){
            let search = App_Logic.get_search(DataType.CATEGORY,{category:data.data_type},{},1,0);
            let option = {get_field:false,fields:'title,type,data_type',get_distinct:true,distinct_field:'title'};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_list =  biz_data.data_list;
            }
        },
        //item
        async function(call){
            let search = App_Logic.get_search(post_search.data_type,post_search.filter,post_search.sort_by,post_search.page_current,post_search.page_size);
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,post_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.item_list =  biz_data.data_list;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});

//9_demo_post
// - required_form_data = type_logic.type_list, data_type, option
router.post('/demo_post', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {type_list:[]};
    let post_type_list = req.body.data.type_list;
    let post_data_type = req.body.data.data_type;
    let option = req.body.data.option;
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
        //demo_portal_post
        async function(call){
            const [biz_error,biz_data] = await Portal.demo_post(database,post_data_type,post_type_list,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data =  biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});


module.exports = router;
