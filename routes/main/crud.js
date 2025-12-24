let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Portal,Database,Page_Data,Stat_Data,Data_Logic,Search_Data,Content_Data,Review_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {DataType,DataItem,App_Logic,}=require("biz9-logic");
const {Scriptz}=require("biz9-scriptz");
const {Error,Log,Str}=require("biz9-utility");
/* -- biz9_end -- */
router.get('/ping',function(req,res,next){
    let error = null;
    let data="crud-ping";
    res.send({error:error,data:data});
    res.end();
});
//9_get
// - required_form_data = data_type, id and or key
router.post('/get',function(req,res,next){
    let error = null;
    let database = {};
    let post_data = DataItem.get_new(req.body.data.data_type,req.body.data.id,{key:req.body.data.key?req.body.data.key:null});
    let data = DataItem.get_new(req.body.data.data_type,req.body.data.id,{key:req.body.data.key?req.body.data.key:null});
    let option = req.body.data.option ? req.body.data.option : {get_parent:false,get_type:false,type_search:{},get_category:false,category_search:{}};
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
            const [biz_error,biz_data] = await Portal.get(database,post_data.data_type,post_data.id,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
        //type
        async function(call){
            if(option.get_type){
                data.types = [];
                let search = App_Logic.get_search(
                    option.type_search.data_type,
                    option.type_search.filter,
                    option.type_search.sort_by,
                    option.type_search.page_current,
                    option.type_search.page_size);
                let option_type ={get_field:true,fields:'title,type'};
                const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option_type);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.types =  biz_data.data_list;
                }
            }
        },
        //category
        async function(call){
            if(option.get_category){
                data.categorys = [];
                let search = App_Logic.get_search(
                    option.category_search.data_type,
                    option.category_search.filter,
                    option.category_search.sort_by,
                    option.category_search.page_current,
                    option.category_search.page_size);
                let option_category = {get_field:false,fields:'title,type,data_type',get_distinct:true,distinct_field:'title'};
                const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option_category);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.categorys =  biz_data.data_list;
                }
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_post
// - required data = {data_type:DataType.PRODUCT,id:123,data:form_data};
router.post('/post',function(req,res,next){
    let error = null;
    let database = {};
    let post_data = DataItem.get_new(req.body.data.data_type,req.body.data.id,req.body.data.data);
    let data = DataItem.get_new(req.body.data.data_type,0);
    let option = req.body.data.option ? req.body.data.option : {};
    let delete_cache = false;
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
            if(Str.check_is_true(option.delete_cache)){
                const [biz_error,biz_data] = await Portal.delete_cache(database,post_data.data_type,post_data.id,option);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    delete_cache = biz_data;
                }
            }
        },
        async function(call){
            const [biz_error,biz_data] = await Portal.post(database,post_data.data_type,post_data,option);
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
//9_search
// - required_form_data = search
router.post('/search',function(req,res,next){
    let error = null;
    let database = {};
    let search = req.body.data.search;
    let data = {data_type:search.data_type,data_count:0,page_count:1,filter:{},data_list:[],app_id:null};
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
        async function(call){
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.data_type=biz_data.data_type;
                data.search=biz_data.search;
                data.data_count=biz_data.data_count;
                data.page_count=biz_data.page_count;
                data.filter=biz_data.filter;
                data.data_list=biz_data.data_list;
                data.app_id = database.app_id;
            }
        },
    ],
        function(err,result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_delete
// required - data_type,id
router.post('/delete',function(req,res,next){
    let error = null;
    let database = {};
    let post_data = DataItem.get_new(req.body.data.data_type,req.body.data.id);
    let data = DataItem.get_new(req.body.data.data_type,req.body.data.id);
    let option = {delete_item:true,delete_group:true,delete_item_query:{parent_id:post_data.id},delete_image:true,delete_image_query:{parent_id:post_data.id}};
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
            const [biz_error,biz_data] = await Portal.delete(database,post_data.data_type,post_data.id,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err,result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_copy
//required_form_data = data{data_type,id}
router.post('/copy',function(req,res,next){
    let error = null;
    let database = {};
    let post_data = DataItem.get_new(req.body.data.data_type,req.body.data.id);
    let data = DataItem.get_new(req.body.data.data_type,0);
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
        async function(call){
            const [biz_error,biz_data] = await Portal.copy(database,post_data.data_type,post_data.id);
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
//9_post_list
//required = data = []
router.post('/post_list',function(req,res,next){
    let error = null;
    let database = {};
    let data_list = [];
    let post_data_list = req.body.data.data?req.body.data.data : [];
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
        async function(call){
            if(post_data_list.length > 0){
                const [biz_error,biz_data] = await Portal.post_list(database,post_data_list,option);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data_list = biz_data;
                }
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data_list});
            res.end();
        });
});
//9_delete_search
//required = search
router.post('/delete_search',function(req,res,next){
    let error = null;
    let database = {};
    let search = req.body.data.search;
    let data = DataItem.get_new(search.data_type,0);
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
        async function(call){
            const [biz_error,biz_data] = await Portal.delete_search(database,search.data_type,search.filter,option);
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
//9_database_info
//required = data : app_id
router.post('/database_info',function(req,res,next){
    let error = null;
    let database = {};
    let data = [];
    let app_id = req.body.data.app_id;
    let option = req.body.data.option ? req.body.data.option : {};
    async.series([
        async function(call){
            const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:app_id}));
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        async function(call){
            const [biz_error,biz_data] = await Database.info(database,option);
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
