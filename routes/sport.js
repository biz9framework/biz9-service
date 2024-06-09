var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-sport':'ping'});
    res.end();
});
////9_edit
router.get('/team_edit/:data_type/:tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category_list = [];
    helper.team = biz9.get_new_item(DT_TEAM,0);
    helper.coach_list = [];
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
            biz9.get_team(db,helper.tbl_id,function(error,data) {
                if(data){
                    helper.item=data;
                }
                call();
            });
        },
        function(call){
            sort={title:-1};
            page_current=1;
            page_size=99;
            biz9.get_categoryz(db,helper.data_type,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.category_list = data_list;
                call();
            });
        },
        function(call){
            switch(helper.data_type){
                case DT_TEAM:
                    sql={};
                    sort={title:-1};
                    page_current=1;
                    page_size=99;
                    biz9.get_sportz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.sport_list = data_list;
                        call();
                    });
                    break;
                default:
                    call();
                    break;
            }
        },
        function(call){
            switch(helper.data_type){
                case DT_EVENT:
                    helper.event_visible_option_list = biz9.get_event_visible_option_list();
                    call();
                    break;
                case DT_SERVICE:
                    helper.service_visible_option_list = biz9.get_service_visible_option_list();
                    call();
                    break;
                case DT_PRODUCT:
                    helper.product_visible_option_list = biz9.get_product_visible_option_list();
                    call();
                    break;
                case DT_MEMBER:
                    helper.type_list=biz9.get_member_type_list();
                    call();
                    break;
                case DT_SPORT:
                    helper.type_list=biz9.get_sport_type_list();
                    call();
                    break;
                default:
                    call();
                    break;
            }
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
