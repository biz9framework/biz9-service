var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_category_list
router.get('/category_list/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category_list =[];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            title_url='mobile';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.mobile=page;
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.info = data_list[0];
                call();
            });
        },
        function(call){
            sort={date_create:1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_category_biz_list(db,DT_MEMBER,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.category_list = data_list;
                helper.item_count=item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_member_list
router.get('/member_list/:category/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category_list =[];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            title_url='mobile';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.mobile=page;
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.info = data_list[0];
                call();
            });
        },
        function(call){
            if(!helper.category||helper.category=='all'){
                sql={};
            }else{
                sql={category:helper.category};
            }
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_memberz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.member_list = data_list;
                helper.item_count=item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_member_detail 9_detail
////9_member
router.get('/member_detail/:tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.member = biz9.get_new_item(DT_MEMBER,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            title_url='mobile';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.mobile=page;
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.info = data_list[0];
                call();
            });
        },
        function(call){
            if(helper.tbl_id!="0"){
                biz9.get_member(db,helper.tbl_id,function(error,data) {
                    helper.member=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sort={title:-1};
            page_current=1;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_categoryz(db,DT_MEMBER,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.category_list = data_list;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
