let express=require('express');
let router=express.Router();
const os = require('os');
/* -- biz9-start -- */
const {Scriptz}=require("biz9-scriptz");
const {Portal,Database}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {Type}=require("biz9-logic");
const {Str,Obj}=require("biz9-utility");
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
    let data = {user:DataItem.get_new(Type.DATA_USER,req.body.data.id),email_resultOK:false,title_resultOK:false};
    let post_user = DataItem.get_new(Type.DATA_USER,req.body.data.id,req.body.data.data);
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
                data.email_resultOK =biz_data.email_resultOK;
                data.title_resultOK =biz_data.title_resultOK;
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
    let data = {user:DataItem.get_new(Type.DATA_USER,0),email_resultOK:false,title_resultOK:false,stat:DataItem.get_new(Type.DATA_STAT,0)};
    let post_user = DataItem.get_new(Type.DATA_USER,0,req.body.data.user);
    let post_stat = DataItem.get_new(Type.DATA_STAT,0,{type:Type.STAT_REGISTER});
    let post_device = req.body.data.device;
    let option = {post_stat:true,post_ip_address:true,post_device:true};
    let post_geo_key = GEO_KEY;
    let post_ip_address = IP_ADDRESS;
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
                data.email_resultOK =biz_data.email_resultOK;
                data.title_resultOK =biz_data.title_resultOK;
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
    let data = {user:DataItem.get_new(Type.DATA_USER,0),user_resultOK:false,stat:DataItem.get_new(Type.DATA_STAT,0)};
    let post_user = DataItem.get_new(Type.DATA_USER,0,req.body.data.user);
    let post_stat = DataItem.get_new(Type.DATA_STAT,0,{type:Type.STAT_LOGIN});
    let post_device = req.body.data.device;
    let option = req.body.data.option ? req.body.data.option : {};
    let post_geo_key = GEO_KEY;
    let post_ip_address = IP_ADDRESS;
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
            const [biz_error,biz_data] = await User_Data.login(database,{user:post_user,ip_address:post_ip_address,geo_key:post_geo_key,device:post_device},option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.user =biz_data.user;
                data.stat.user_id = data.user.id;
                data.user_resultOK =biz_data.user_resultOK;
            }
        },
        //persist user
        /*
        async function(call){
            if(!data.user_resultOK && APP_ENV == !App_Logic.ENVIRONMENT_TESTING){
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
