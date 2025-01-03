let express = require('express');
let router = express.Router();
const { get_helper,get_new_item } = require(process.env.BIZ9_HOME + "/biz9-app/code");
const { get_db_connect,close_db_connect,update_item,get_item } = require(process.env.BIZ9_HOME + "/biz9-data/code");
const { w,w_error,get_id } = require(process.env.BIZ9_HOME + "/biz9-utility/code");
router.get('/ping', function(req, res, next) {
    let helper = get_helper(req);
    helper.test = "test-test-ping";
    res.send({helper:helper});
    res.end();
});
router.get('/connect', function(req, res, next) {
    let db_connect = {};
    let helper = get_helper(req);
    helper.test = "test-test-connect";
    helper.item = get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            get_db_connect(helper.app_title_id).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Cloud-Main-Test-Connect",error);
                call([error,null]);
            });
        },
        function(call){
            helper.item.field_1=get_id();
            update_item(db_connect,DT_BLANK,helper.item).then(([error,data]) => {
                helper.item = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Cloud-Main-Test-Connect-2",error);
                call([error,null]);
            });
        },
        function(call){
            get_item(db_connect,DT_BLANK,helper.item.id).then(([error,data]) => {
                helper.item = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Cloud-Main-Test-Connect-3",error);
                call([error,null]);
            });
        },
         function(call){
            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                w_error("Biz9-Service-Cloud-Main-Test-Connect-4",error);
                call([error,null]);
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/uptime', function(req, res, next) {
    let db_connect = {};
    let helper = get_helper(req);
    helper.test = "test-test-uptime";
    async.series([
        function(call){
            get_db_connect(helper.app_title_id).then(([error,data]) => {
                db_connect = data;
                call();
            }).catch(error => {
                w_error("Biz9-Service-Cloud-Main-Test-Uptime",error);
                call([error,null]);
            });
        },
        function(call){
            close_db_connect(db_connect).then(([error,data]) => {
                call();
            }).catch(error => {
                w_error("Biz9-Service-Cloud-Main-Test-Report-2",error);
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
