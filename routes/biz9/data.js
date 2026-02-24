let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Data,Database}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {Data_Type,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Num}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Scriptz}=require("biz9-scriptz");
/* -- biz9_end -- */
router.get('/ping',function(req,res,next){
    let error = null;
    let data="crud-ping";
    res.send({error:error,data:data});
    res.end();
});
//9_post
router.post('/post',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.table,req.body.id,{data:req.body.data});
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
            const [biz_error,biz_data] = await Data.post(database,data.table,data,option);
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
//9_get
router.post('/get',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.table,req.body.id);
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
            const [biz_error,biz_data] = await Data.get(database,data.table,data.id,option);
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
router.post('/post_items',function(req,res,next){
    let error = null;
    let database = {};
    let data =  req.body.data ? req.body.data : [];
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
            if(data.length > 0){
                const [biz_error,biz_data] = await Data.post_items(database,data,option);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data = biz_data;
                }
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_delete
router.post('/delete',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.table,req.body.id);
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
            const [biz_error,biz_data] = await Data.delete(database,data.table,data.id,option);
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
//9_delete_search
router.post('/delete_search',function(req,res,next){
    let error = null;
    let database = {};
	let data = Data_Logic.get(req.body.search.table,0,{data:{search:req.body.search}});
	data[Data_Type.FIELD_RESULT_OK_DELETE] = false;
	data[Data_Type.FIELD_RESULT_OK_GROUP_DELETE] = false;
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
            const [biz_error,biz_data] = await Data.delete_search(database,data.search.table,data.search.filter,option);
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
//9_copy
router.post('/copy',function(req,res,next){
    let error = null;
    let database = {};
    let data = Data_Logic.get(req.body.table,req.body.id);
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
            const [biz_error,biz_data] = await Data.copy(database,data.table,data.id);
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
router.post('/search',function(req,res,next){
    let error = null;
    let database = {};
    let data = {search:req.body.search};
    Log.w('my_data',data);
    let option = req.body.option ? req.body.option : {};
    async.series([
        async function(call){
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        async function(call){
            const [biz_error,biz_data] = await Data.search(database,data.search.table,data.search.filter,data.search.sort_by,data.search.page_current,data.search.page_size,option);
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
module.exports = router;
