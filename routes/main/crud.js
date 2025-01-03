let express = require('express');
let router = express.Router();
const { get_helper,get_new_item,set_item_data } = require(process.env.BIZ9_HOME + "/biz9-app/code");
const { get_db_connect,close_db_connect,update_item,get_item,delete_item} = require(process.env.BIZ9_HOME + "/biz9-data/code");
const { w,w_error,get_id } = require(process.env.BIZ9_HOME + "/biz9-utility/code");
router.get('/ping', function(req, res, next) {
    let helper = get_helper(req);
    helper.test = "crud-ping";
    res.send({helper:helper});
    res.end();
});
router.get('/get/:data_type/:id', function(req, res, next) {
    let db_connect = {};
    let helper = get_helper(req);
    helper.item = get_new_item(helper.data_type,helper.id);
    async.series([
        function(call){
            get_db_connect(helper.app_title_id).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Get",error);
                call([error,null]);
            });
        },
        function(call){
            get_item(db_connect,helper.data_type,helper.id).then(([error,data]) => {
                helper.item = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Get-2",error);
                call([error,null]);
            });
        },
         function(call){
            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Get-3",error);
                call([error,null]);
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/update/:data_type/:id', function(req, res, next) {
    let db_connect = {};
    let helper = get_helper(req);
    helper.item = set_item_data(helper.data_type,helper.id,req.body);
    async.series([
        function(call){
            get_db_connect(helper.app_title_id).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Update",error);
                call([error,null]);
            });
        },
        function(call){
            update_item(db_connect,helper.data_type,helper.item).then(([error,data]) => {
                helper.item = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Update-2",error);
                call([error,null]);
            });
        },
         function(call){
            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Update-3",error);
                call([error,null]);
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/delete/:data_type/:id', function(req, res, next) {
    let db_connect = {};
    let helper = get_helper(req);
    helper.item = get_new_item(helper.data_type,helper.id);
    async.series([
        function(call){
            get_db_connect(helper.app_title_id).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Delete",error);
                call([error,null]);
            });
        },
        function(call){
            delete_item(db_connect,helper.data_type,helper.id).then(([error,data]) => {
                helper.item = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Delete-2",error);
                call([error,null]);
            });
        },
         function(call){
            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                w_error("Biz9-Service-Main-Crud-Delete-3",error);
                call([error,null]);
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
