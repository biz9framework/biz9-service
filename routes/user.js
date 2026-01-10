let express=require('express');
let router=express.Router();
const os = require('os');
/* -- biz9-start -- */
const {Scriptz}=require("biz9-scriptz");
const {Portal,Database,User_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {Type,Data_Logic,User_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Str,Obj}=require("biz9-utility");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error=null;
    let data={};
    data="user-ping";
    console.log(data);
    res.send({error:biz_error,biz_data:data});
    res.end();
});
//9_dashboard
router.post('/dashboard', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {apps:[]};
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(error){
                error=Log.append(error,biz_error);
            }else{
                database = data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_post
// - required req.body.data = {id:123,data:form_user_data};
router.post('/post', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {user:Data_Logic.get(Type.DATA_USER,req.body.data.id)};
    data[Type.FIELD_RESULT_OK] = false;
    data[Type.FIELD_RESULT_OK_EMAIL] = false;
    let post_user = Data_Logic.get_new(Type.DATA_USER,req.body.data.id,req.body.data.data);
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
        async function(call){
            const [biz_error,biz_data] = await User_Data.post(database,post_user);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.user =biz_data.user;
                data[Type.FIELD_RESULT_OK_EMAIL] = biz_data[Type.FIELD_RESULT_OK_EMAIL];
                data[Type.FIELD_RESULT_OK] = biz_data[Type.FIELD_RESULT_OK];
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});

//9_register
router.post('/register', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {user:Data_Logic.get_new(Type.DATA_USER,0)};
    data[Type.FIELD_RESULT_OK] = false;
    data[Type.FIELD_RESULT_OK_EMAIL] = false;
    let option = {};
    /*
    let option = {post_stat:false,post_ip_address:false,post_device:false};
    let stat = Data_Logic.get_new(Type.DATA_STAT,0);
    let post_user = Data_Logic.get_new(Type.DATA_USER,0,req.body.data.user);
    let post_stat = Data_Logic.get_new(Type.DATA_STAT,0,{type:Type.STAT_REGISTER});
    let post_device = req.body.data.device;
    let post_geo_key = GEO_KEY;
    let post_ip_address = IP_ADDRESS;
    */
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
        async function(call){
            const [biz_error,biz_data] = await User_Data.register(database,{user:post_user,ip_address:post_ip_address,geo_key:post_geo_key,device:post_device},option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.user =biz_data.user;
                data.stat.user_id = data.user.id;
                data[FIELD_RESULT_OK_EMAIL] =biz_data[FIELD_RESULT_OK_EMAIL] ;
                data[FIELD_RESULT_OK_TITLE] =biz_data[FIELD_RESULT_OK_TITLE];
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_login
// required data = {user:user,device:{}};
router.post('/login', function(req, res, next) {
    let error = null;
    let database = {};
    let data = Data_Logic.get_new(Type.DATA_USER,0,{data:req.body.user});
    data[Type.FIELD_RESULT_OK_USER] = false;
    let stat = Data_Logic.get_new(Type.DATA_STAT,0,{data:{type:Type.STAT_LOGIN}});
    let device = req.body.device;
    let option = req.body.option ? req.body.option : {};
    let geo_key = GEO_KEY;
    let ip_address = IP_ADDRESS;
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        async function(call){
            const [biz_error,biz_data] = await User_Data.login(database,data,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
                //data.stat.user_id = data.user.id;
                data[Type.FIELD_RESULT_OK_USER] = biz_data[Type.FIELD_RESULT_OK_USER];
            }
        },
        //persist user
        /*
        async function(call){
            if(!data[Type.FIELD_RESULT_OK_USER]  && APP_ENV == !App_Logic.ENVIRONMENT_TESTING){
                data.user_post_server = true;
                User_Logic.post_request_user(req,data.user);
            }
        },
        */
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_logout
// - require:_form_data = none
router.post('/logout', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {};
    data.user = User_Logic.get_request_user(req);
    data.user_logout = false;
    async.series([
        async function(call){
            User_Logic.delete_request_user(req);
            data.user_logout = true;
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
