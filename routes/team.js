var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-team':'ping'});
    res.end();
});
//9_detail
router.get('/detail/:tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item = biz9.get_new_item(helper.data_type,0);
    helper.category = biz9.get_new_item(DT_CATEGORY,0);
    helper.category_list = [];
    helper.item_list = [];
    helper.player_list = [];
    helper.coach_list = [];
    helper.footer_list = [];
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
            if(helper.item.category){
                sql = {title:helper.item.category};
                sort={};
                biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
                    if(data_list.length>0){
                        helper.category = data_list[0];
                    }
                   call();
                });
            }else{
                call();
            }
        },
        function(call){
            member_type_list=biz9.get_member_type_list();
            for(a=0;a<member_type_list.length;a++){
                if(member_type_list[a].title=='Team'){
                    helper.member_type=member_type_list[a];
                    break;
                }
            }
            call();
        },
        function(call){
            sql={team_tbl_id:helper.tbl_id,Type:'Player'};
            sort={date_create:-1};
            page_current=1;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_memberz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                helper.player_list = data_list;
                call();
            });
        },
        function(call){
            sql={team_tbl_id:helper.tbl_id,Type:'Coach'};
            sort={date_create:-1};
            page_current=1;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_memberz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                helper.coach_list = data_list;
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
////9_edit
router.get('/edit/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category_list = [];
    helper.team = biz9.get_new_item(DT_TEAM,0);
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.coach_list = [];
    helper.data_type_info=biz9.get_data_type_info(helper.data_type);
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
                biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.parent_item=data;
                    }
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
                    sql={};
                    sort={title:-1};
                    page_current=1;
                    page_size=99;
                    biz9.get_sportz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.sport_list = data_list;
                        call();
                    });
        },
        function(call){
            helper.type_list=biz9.get_sport_type_list();
            call();
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
