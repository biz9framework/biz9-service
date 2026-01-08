let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Portal,Database}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {Type,Data_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num}=require("biz9-utility");
/* -- biz9_end -- */
router.get('/ping',function(req,res,next){
    let error = null;
    let data="crud-ping";
    res.send({error:error,data:data});
    res.end();
});
//9_get
/*
 * Required Form Data
   - object / {data_type:string,key:string-num};
   - ex. / {data_type:Type.DATA_PRODUCT,id:123};
 * Option
   - object / {};
   - ex. / {image:{0}};
*/
router.post('/get',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.data_type,req.body.id);
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
            const [biz_error,biz_data] = await Portal.get(database,data.data_type,data.id,option);
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
//9_post
// - required data = {data_type:TYPE.DATA_PRODUCT,id:123,data:form_data};
router.post('/post',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.data_type,req.body.id,{data:req.body.data});
    let option = req.body.option ? req.body.option : {};
    Log.w('33_data',data);
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
            const [biz_error,biz_data] = await Portal.post(database,data.data_type,data,option);
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
    let data = {search:req.body.search};
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
            const [biz_error,biz_data] = await Portal.search(database,data.search.data_type,data.search.filter,data.search.sort_by,data.search.page_current,data.search.page_size,option);
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
//9_delete
// required - data_type,id
router.post('/delete',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.data_type,req.body.id);
    let option =  req.body.option ? req.body.option : {};
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
            const [biz_error,biz_data] = await Portal.delete(database,data.data_type,data.id,option);
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
    let data = Data_Logic.get(req.body.data_type,req.body.id);
    let option =  req.body.option ? req.body.option : {};
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
            const [biz_error,biz_data] = await Portal.copy(database,data.data_type,data.id);
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
//9_post_items
//required = data = []
router.post('/post_items',function(req,res,next){
    let error = null;
    let database = {};
    let items = [];
    let data = req.body.data ? req.body.data : [];
    let option =  req.body.option ? req.body.option : {};
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
            if(post_items.length > 0){
                const [biz_error,biz_data] = await Portal.post_items(database,post_items,option);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    items = biz_data;
                }
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:items});
            res.end();
        });
});
//9_delete_search
//required = search
router.post('/delete_search',function(req,res,next){
    let error = null;
    let database = {};
    let data = {data_type:search.data_type,search:req.body.search,item_count:0,page_count:1,filter:{},items:[],app_id:database.app_id,delete_result:{}};
    let option =  req.body.option ? req.body.option : {};
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
            const [biz_error,biz_data] = await Portal.delete_search(database,data.search.data_type,data.search.filter,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.delete_result = biz_data;
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
    let data = Data_Logic.get(Type.DATA_APP,0,{data:req.body.data});
    let option =  req.data.option ? req.body.option : {};
    async.series([
       async function(call){
            const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:data.app_id,result:[]}));
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
                data.result = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
