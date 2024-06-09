var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
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
            biz9.get_member(db,helper.tbl_id,function(error,data) {
                if(data){
                    helper.item=data;
                }
                call();
            });
        },
        function(call){
            if(helper.item.category){
                sql={category:helper.item.category};
                sort={date_create:-1};
                page_current=1;
                page_size=PAGE_SIZE_ITEM_DOUBLE_SLIDE_SHOW;
                biz9.get_memberz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                    loc_item_list = data_list;
                    call();
                });
            }
        },
        function(call){
            for(a=0;a<loc_item_list.length;a++){
                found=false;
                if(loc_item_list[a].tbl_id==helper.item.tbl_id){
                    found=true;
                   break;
                }
                if(!found){
                    helper.item_list.push(loc_item_list[a]);
                }
            }
            call();
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
            if(helper.item.type){
                sql = {type:helper.item.type};
                sort={};
                biz9.get_sql(db,DT_MEMBER,sql,sort,function(error,data_list) {
                    if(data_list.length>0){
                        loc_footer_list = data_list;
                    }
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<loc_footer_list.length;a++){
                found=false;
                if(loc_footer_list[a].tbl_id==helper.item.tbl_id){
                    found=true;
                   break;
                }else{
                for(b=0;b<helper.item_list.length;b++){
                    if(loc_footer_list[a].tbl_id==helper.item_list[b].tbl_id){
                        found=true;
                        break;
                    }
                }
                }
                if(!found){
                    helper.footer_list.push(loc_footer_list[a]);
                }
            }
            call();
        },
        function(call){
            if(helper.item.type){
                member_type_list=biz9.get_member_type_list();
                for(a=0;a<member_type_list.length;a++){
                    if(member_type_list[a].title==helper.item.type){
                        helper.member_type=member_type_list[a];
                        break;
                    }
                }
                call();
            }else{
                helper.member_type=null;
                call();
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
