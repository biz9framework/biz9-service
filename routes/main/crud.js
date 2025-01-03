let express = require('express');
let router = express.Router();
const { get_helper,get_new_item,set_item_data } = require(process.env.BIZ9_HOME + "/biz9-app/code");
const { get_db_connect,close_db_connect,update_item,get_item} = require(process.env.BIZ9_HOME + "/biz9-data/code");
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
                w('aaa',data);
                w('bbb',error);
                w('ccc',helper.app_title_id);

                //helper.item = data;
                //call();
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
/*
router.post("/delete/:data_type/:id", function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.data_type,helper.id,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update/:data_type/:id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(helper.data_type,helper.id,req.body);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update_biz/:data_type/:id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.org_item = biz9.get_new_item(helper.data_type,helper.id);
    helper.item = biz9.set_item_data(helper.data_type,helper.id,req.body);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
    function(call){
            biz9.get_item(db,helper.data_type,helper.id, function(error,data) {
                helper.org_item =data;
                call();
            });
        },
        function(call){
            helper.item=biz9.convert_biz_item_org(helper.org_item,helper.item,helper.biz_list.split(","));
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get("/get/:data_type/:id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.id, function(error,data) {
                helper.item =data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
*/
module.exports = router;
