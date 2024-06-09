var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-biz-display':'ping'});
    res.end();
});
//-- HOME START -- //////////////////////////
//9_home
router.get('/home_detail',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.home = biz9.get_new_item(DT_BLANK,0);
    helper.card_banner_list = [];
    helper.card_double_list = [];
    helper.card_popular_list = [];
    helper.card_category_list = [];
    helper.card_buy_list = [];
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
                call();
            });
        },
        function(call){
            title_url='home';
            biz9.get_page(db,title_url,{},function(error,data){
                helper.home=data;
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
            sql = {type_id:STAT_LIKE_ID,customer_id:helper.customer_id};
            sort={};
            biz9.get_sql(db,DT_STAT,sql,sort,function(error,data_list) {
                helper.customer_like_list = data_list;
                call();
            });
        },
        //card_banner
        function(call){
            helper.card_banner_list=[];
            page_current=1;
            page_size=PAGE_SIZE_HOME_SLIDE_SHOW;
            sort={date_create:-1};
            if(helper.home.card_banner_visible=='true'){
                if(helper.home.card_banner_order=='category'){
                    sql={category:helper.home.card_banner_category};
                }else{
                    sql={};
                }
                if(helper.home.card_banner_data_type==DT_BLOG_POST){
                    biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.home.card_banner_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.home.card_banner_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.home.card_banner_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.home.card_banner_data_type==DT_GALLERY){
                    biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) { helper.card_banner_list = data_list;
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else{
                    call();
                }
            }else{
                call();
            }
        },
        function(call){
            biz9.get_customer_item_like_list(helper.customer_like_list,helper.card_banner_list,function(error,data_list){
                helper.card_banner_list = data_list;
                call();
            });
        },
        //card_popular
        function(call){
            if(helper.home.card_popular_visible=='true'){
                sql = {};
                if(helper.home.card_popular_order=='all'){
                    sort={date_create:-1};
                }else{
                    sort={view_count:-1};
                }
                page_current=1;
                page_size=PAGE_SIZE_HOME_LIST;
                if(helper.home.card_popular_data_type==DT_BLOG_POST){
                    biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.home.card_popular_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.home.card_popular_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.home.card_popular_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.home.card_popular_data_type==DT_GALLERY){
                    biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }
                else{
                    call();
                }
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.mobile.page_list.items.length;a++){
                if(helper.mobile.page_list.items[a].type==helper.home.card_popular_data_type){
                    helper.home.page_popular=helper.mobile.page_list.items[a];
                    break;
                }
            }
            call();
        },
        function(call){
            biz9.get_customer_item_like_list(helper.customer_like_list,helper.card_popular_list,function(error,data_list){
                helper.card_popular_list = data_list;
                call();
            });
        },
        //card_category
        function(call){
            if(helper.home.card_category_visible=='true'){
                if(!helper.home.card_category_data_type){
                    helper.home.card_category_data_type =DT_PRODUCT;
                }
                sql = {};
                sort={title:-1};
                page_current=1;
                page_size=PAGE_SIZE_HOME_CATEGORY_LIST;
                biz9.get_category_biz_list(db,helper.home.card_category_data_type,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                    helper.card_category_list = data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.mobile.page_list.items.length;a++){
                if(helper.mobile.page_list.items[a].type==helper.home.card_category_data_type){
                    helper.home.page_category=helper.mobile.page_list.items[a];
                    break;
                }
            }
            call();
        },
        //card_buy
        function(call){
            if(helper.home.card_buy_visible=='true'){
                if(helper.home.card_buy_category){
                    if(helper.home.card_buy_category=='all' || helper.home.card_buy_category==''){
                        sql={};
                    }else{
                        sql={category:helper.home.card_buy_category};
                    }
                }else{
                    sql={category:DT_PRODUCT};
                }
                sort={date_create:-1};
                page_current=1;
                page_size=PAGE_SIZE_HOME_SLIDE_SHOW;
                if(helper.home.card_buy_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_buy_list = data_list;
                        call();
                    });
                }else if(helper.home.card_buy_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_buy_list = data_list;
                        call();
                    });
                }else if(helper.home.card_buy_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_buy_list = data_list;
                        call();
                    });
                }
                else{
                    call();
                }
            }else{
                call();
            }
        },
        function(call){
            biz9.get_customer_item_like_list(helper.customer_like_list,helper.card_buy_list,function(error,data_list){
                helper.card_buy_list = data_list;
                call();
            });
        },
        //card_double
        function(call){
            if(helper.home.card_double_visible=='true'){
                if(helper.home.card_double_category=='all'){
                    sql={};
                }else{
                    sql={category:helper.home.card_double_category};
                }
                sort={date_create:-1};
                page_current=1;
                page_size=PAGE_SIZE_HOME_SLIDE_SHOW;
                if(helper.home.card_double_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_double_list = data_list;
                        call();
                    });
                }else if(helper.home.card_double_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_double_list = data_list;
                        call();
                    });
                }else if(helper.home.card_double_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_double_list = data_list;
                        call();
                    });
                }
                else{
                    call();
                }
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.mobile.page_list.items.length;a++){
                if(helper.mobile.page_list.items[a].type==helper.home.card_double_data_type){
                    helper.home.page_double=helper.mobile.page_list.items[a];
                    break;
                }
            }
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
//9_home_edit
router.get('/home_edit',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.data_type_list = [];
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
                call();
            });
        },
        function(call){
            title_url='home';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.home=page;
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
            helper.data_type_list.push({title:'Blog Posts',value:DT_BLOG_POST});
            helper.data_type_list.push({title:'Events',value:DT_EVENT});
            helper.data_type_list.push({title:'Galleries',value:DT_GALLERY});
            helper.data_type_list.push({title:'Products',value:DT_PRODUCT});
            helper.data_type_list.push({title:'Services',value:DT_SERVICE});
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
//-- HOME END -- //////////////////////////
//-- ITEM START -- //////////////////////////
// /9_item_home
router.get('/item_home/:data_type',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.page = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category_list =[];
    helper.item_list = [];
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
            title_url='mobile';
            sub_url='mobile';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.mobile=page;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.mobile.page_list.items.length;a++){
                if(helper.mobile.page_list.items[a].type==helper.data_type){
                    helper.page=helper.mobile.page_list.items[a];
                    break;
                }
            }
            call();
        },
        function(call){
            sort={date_create:1};
            page_current=0;
            page_size=PAGE_SIZE_HOME_CATEGORY_LIST;
            biz9.get_category_biz_list(db,helper.data_type,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.category_list = data_list;
                call();
            });
        },
        function(call){
            switch(helper.data_type){
                case DT_PRODUCT:
                    sql={};
                    sort={date_create:-1};
                    page_current=1;
                    page_size=PAGE_SIZE_HOME_LIST;
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.item_list = data_list;
                        call();
                    });
                    break;
                case DT_SERVICE:
                    sql={};
                    sort={date_create:-1};
                    page_current=1;
                    page_size=PAGE_SIZE_HOME_LIST;
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.item_list = data_list;
                        call();
                    });
                    break;
                case DT_EVENT:
                    sql={};
                    sort={date_create:-1};
                    page_current=1;
                    page_size=PAGE_SIZE_HOME_LIST;
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.item_list = data_list;
                        call();
                    });
                    break;
                default:
                    sql={};
                    sort={date_create:-1};
                    page_current=1;
                    page_size=PAGE_SIZE_HOME_LIST;
                    biz9.get_itemz(db,helper.data_type,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.item_list = data_list;
                        call();
                    });
                    break;
            }
        },
        function(call){
            sql = {type_id:STAT_LIKE_ID,customer_id:helper.customer_id};
            sort={};
            biz9.get_sql(db,DT_STAT,sql,sort,function(error,data_list) {
                helper.customer_like_list = data_list;
                call();
            });
        },
        function(call){
            biz9.get_customer_item_like_list(helper.customer_like_list,helper.item_list,function(error,data_list){
                helper.item_list = data_list;
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
//9_item_list_update //9_update
router.post('/item_list_update/:data_type/:tbl_id/:parent_field_id/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item = biz9.set_item_data(helper.data_type,helper.tbl_id,req.body);
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.data_type_info=biz9.get_data_type_info(helper.data_type);
    helper.active_list = [];
    helper.full_list = [];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                item_check=data;
                if(item_check[helper.parent_field_id]==helper.parent_tbl_id){
                    helper.item_found='true';
                }
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
            if(helper.item_found!='true'){
                biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                    helper.item=data;
                    call();
                });
            }else{
                call();
            }
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
//9_item_list 9_list 9_edit_list
router.get('/item_list_edit/:data_type/:parent_data_type/:parent_tbl_id/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.data_type_info=biz9.get_data_type_info(helper.data_type);
    helper.active_list = [];
    helper.full_list = [];
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
            sql = {};
            switch(helper.search_type){
                case "Player":
                    sql = {type:helper.search_type};
                    break;
                case "Coach":
                    sql = {type:helper.search_type};
                    break;
                case "Team":
                    sql = {type:helper.search_type};
                    break;
                default:
                    break;
            }
            sort={};
            biz9.get_sql(db,helper.data_type,sql,sort,function(error,data_list) {
                helper.full_list = data_list;
                call();
            });
        },
        function(call){
            sql = {};
            switch(helper.search_type){
                case "Player":
                    sql = {team_player_tbl_id:helper.parent_tbl_id};
                    break;
                case "Coach":
                    sql = {team_coach_tbl_id:helper.parent_tbl_id};
                    break;
            }
            sort={};
            biz9.get_sql(db,helper.data_type,sql,sort,function(error,data_list) {
                helper.active_list = data_list;
                call();
            });
        },
        function(call){
            switch(helper.parent_data_type){
                case DT_TEAM:
                    if(helper.search_type=='Player'){
                        helper.parent_field_id='team_player_tbl_id';
                        helper.full_list_title="All " + helper.search_type+'s';
                        helper.active_list_title=helper.parent_item.title + " Active Players";
                    }
                    if(helper.search_type=='Coach'){
                        helper.parent_field_id='team_coach_tbl_id';
                        helper.full_list_title='All Coaches';
                        helper.active_list_title=helper.parent_item.title + " Active Coaches";
                    }
                    break;
                case DT_COACH:
                    helper.parent_field_id='team_coach_tbl_id';
                    helper.active_list_title=helper.parent_item.title + " " + helper.data_type_info.titlez;
                    break;
                default:
                    break;
            }
            call();
        },
        function(call){
            helper.data_type_info.titlez=helper.parent_item.title + " " + helper.data_type_info.titlez;
            call();
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
//
//9_item_list 9_list
router.get('/item_list/:data_type/:category_title/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item_list = [];
    helper.data_type_info=biz9.get_data_type_info(helper.data_type);
    helper.category=biz9.get_new_item(DT_CATEGORY,0);
    helper.parent_item=biz9.get_new_item(helper.data_type,0);
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
            if(helper.category_title=='all'){
                sql = {title:helper.category_title};
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
            if(!helper.category_title||helper.category_title=='all'){
                sql={};
            }else{
                sql={category:helper.category_title};
            }
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            switch(helper.data_type){
                case DT_EVENT:
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_SERVICE:
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_PRODUCT:
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_CATEGORY:
                    biz9.get_category_biz_list(db,'all',sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_GALLERY:
                    biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_GAME:
                    biz9.get_gamez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_BLOG_POST:
                    biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_SPORT:
                    biz9.get_sportz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                case DT_TEAM:
                    if(helper.parent_data_type==DT_SPORT){
                        sql={sport_tbl_id:helper.parent_tbl_id}
                    }
                    biz9.get_teamz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
                default:
                    biz9.get_itemz(db,helper.data_type,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.item_list = data_list;
                        helper.item_count=item_count;
                        helper.page_count=page_count;
                        call();
                    });
                    break;
            }
        },
        function(call){
            if(helper.parent_tbl_id && helper.parent_tbl_id!='false'){
                biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.parent_item=data;
                        helper.data_type_info.titlez=helper.parent_item.title + " " + helper.data_type_info.titlez;
                    }
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sql = {type_id:STAT_LIKE_ID,customer_id:helper.customer_id};
            sort={};
            biz9.get_sql(db,DT_STAT,sql,sort,function(error,data_list) {
                helper.customer_like_list = data_list;
                call();
            });
        },
        function(call){
            biz9.get_customer_item_like_list(helper.customer_like_list,helper.item_list,function(error,data_list){
                helper.item_list = data_list;
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
////9_edit
router.get('/item_edit/:data_type/:tbl_id',function(req, res) {
    /*--default_start */
    var helper=biz9.get_helper(req);
    helper.mobile=biz9.get_new_item(DT_BLANK,0);
    helper.info=biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item=biz9.get_new_item(helper.data_type,0);
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.category_list=[];
    helper.item_list=[];
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
            if(helper.parent_item.tbl_id){
                biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.parent_item=data;
                    }
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            switch(helper.data_type){
                case DT_BLOG_POST:
                    biz9.get_blog_post(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_MEMBER:
                    biz9.get_member(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_SERVICE:
                    biz9.get_service(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_PRODUCT:
                    biz9.get_product(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_EVENT:
                    biz9.get_event(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_GALLERY:
                    biz9.get_gallery(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_GAME:
                    biz9.get_game(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_SPORT:
                    biz9.get_sport(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_TEAM:
                    biz9.get_team(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
            }
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
////9_detail
router.get('/item_detail/:data_type/:tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item = biz9.get_new_item(helper.data_type,0);
    helper.category = biz9.get_new_item(DT_CATEGORY,0);
    helper.category_list = [];
    helper.item_list = [];
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
            switch(helper.data_type){
                case DT_BLOG_POST:
                    biz9.get_blog_post(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_MEMBER:
                    biz9.get_member(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_SERVICE:
                    biz9.get_service(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_PRODUCT:
                    biz9.get_product(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_EVENT:
                    biz9.get_event(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_GALLERY:
                    biz9.get_gallery(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_GAME:
                    biz9.get_game(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_SPORT:
                    biz9.get_sport(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
                case DT_TEAM:
                    biz9.get_team(db,helper.tbl_id,function(error,data) {
                        if(data){
                            helper.item=data;
                        }
                        call();
                    });
                    break;
            }
        },
        function(call){
            sql = {type_id:STAT_LIKE_ID,item_tbl_id:helper.item.tbl_id,customer_id:helper.customer_id};
            sort={};
            biz9.get_sql(db,DT_STAT,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.item.customer_like ='true';
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
                switch(helper.data_type){
                    case DT_BLOG_POST:
                        biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_BLOG_POST:
                        biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_SERVICE:
                        biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_PRODUCT:
                        biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_EVENT:
                        biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_GALLERY:
                        biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_MEMBER:
                        biz9.get_memberz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_SPORT:
                        biz9.get_sportz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    case DT_TEAM:
                        biz9.get_teamz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                            helper.item_list = data_list;
                            call();
                        });
                        break;
                    default:
                        break;
                }
            }else{
                call();
            }
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
            if(helper.item.title_url){
                biz9.update_item_view_count(db,helper.data_type,helper.tbl_id,helper.customer_id,function(error,data) {
                    call();
                });
            }else{
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
//-- ITEM END -- //////////////////////////
//-- CATEGORY START -- //////////////////////////
//9_category_detail
////9_category
router.get('/edit_category/:tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.data_type_info =biz9.get_data_type_info(DT_CATEGORY);
    helper.category = biz9.get_new_item(DT_CATEGORY,0);
    helper.category_list=[];
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
            biz9.get_category(db,helper.tbl_id,function(error,data) {
                helper.category=data;
                call();
            });
        },
        function(call){
            helper.category_list=biz9.get_category_type_list();
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

//-- CATEGORY END -- //////////////////////////


//-- PHOTO START -- //////////////////////////
//9_photo_list
router.get('/item_photo_list/:data_type/:tbl_id/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.photo_list = [];
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
                if(data.tbl_id){
                    helper.item=data;
                }
                call();
            });
        },
        function(call){
            if(helper.item.parent_data_type && helper.item.parent_tbl_id){
                biz9.get_item(db,helper.item.parent_data_type,helper.item.parent_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.parent_item=data;
                    }
                    call();
                });
            }else{
                helper.parent_item=helper.item;
                helper.item.parent_data_type=helper.item.data_type;
                helper.item.parent_tbl_id=helper.item.tbl_id;
                call();
            }
        },
        function(call){
            if(helper.item.top_data_type && helper.item.top_tbl_id){
                biz9.get_item(db,helper.item.top_data_type,helper.item.top_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.top_item=data;
                    }
                    call();
                });
            }else{
                helper.top_item=helper.item;
                helper.item.top_data_type=helper.item.parent_data_type;
                helper.item.top_tbl_id=helper.item.parent_tbl_id;
                call();
            }
        },
        function(call){
            sql = {parent_tbl_id:helper.tbl_id};
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_sql_paging(db,DT_PHOTO,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.photo_list = data_list;
                helper.item_count=item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            helper.item.parent_tbl_id=helper.parent_item.tbl_id;
            helper.item.parent_data_type=helper.parent_item.data_type;
            helper.item.top_tbl_id=helper.top_item.tbl_id;
            helper.item.top_data_type=helper.top_item.data_type;
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
//9_photo_detail
router.get('/item_photo_edit/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.photo = biz9.get_new_item(DT_PHOTO,helper.tbl_id);
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.top_item = biz9.get_new_item(DT_BLANK,0);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            biz9.get_item(db,DT_PHOTO,helper.tbl_id, function(error,data) {
                if(data.tbl_id){
                    helper.photo=data;
                }
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
            if(helper.parent_item.top_data_type && helper.parent_item.top_tbl_id){
                biz9.get_item(db,helper.parent_item.top_data_type,helper.parent_item.top_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.top_item=data;
                    }
                    call();
                });
            }else{
                helper.top_item=helper.parent_item;
                call();
            }
        },
        function(call){
            helper.photo.parent_tbl_id=helper.parent_item.tbl_id;
            helper.photo.parent_data_type=helper.parent_item.data_type;
            helper.photo.top_tbl_id=helper.top_item.tbl_id;
            helper.photo.top_data_type=helper.top_item.data_type;
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
//-- PHOTO END -- //////////////////////////

//-- SUB ITEM START -- //////////////////////////
//9_sub_item_edit_list sub_item_edit_list_a
router.get('/sub_item_edit/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id/:top_data_type/:top_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.top_item=biz9.get_new_item(helper.top_data_type,helper.top_tbl_id);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
                if(data.tbl_id){
                    helper.item=data;
                }
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
            biz9.get_item(db,helper.top_data_type,helper.top_tbl_id, function(error,data) {
                if(data.tbl_id){
                    helper.top_item=data;
                }
                call();
            });
        },
        function(call){
            helper.item.parent_tbl_id=helper.parent_item.tbl_id;
            helper.item.parent_data_type=helper.parent_item.data_type;
            helper.item.top_tbl_id=helper.top_item.tbl_id;
            helper.item.top_data_type=helper.top_item.data_type;
            call();
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
//9_sub_item_edit_list sub_item_edit_list_a
router.get('/sub_item_list/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.top_item=biz9.get_new_item(DT_BLANK,0);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
                if(data.tbl_id){
                    helper.item=data;
                }
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id,function(error,data) {
                helper.parent_item=data;
                call();
            });
        },
        function(call){
            if(helper.item.top_data_type && helper.item.top_tbl_id){
                biz9.get_item(db,helper.item.top_data_type,helper.item.top_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.top_item=data;
                    }
                    call();
                });
            }else if(helper.parent_item.top_data_type && helper.parent_item.top_tbl_id){
                biz9.get_item(db,helper.parent_item.top_data_type,helper.parent_item.top_tbl_id, function(error,data) {
                    if(data.tbl_id){
                        helper.top_item=data;
                    }
                    call();
                });
            }else{
                helper.top_item=helper.item;
                call();
            }
        },
        function(call){
            sql={parent_tbl_id:helper.item.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.item_list=data_list;
                call();
            });
        },
        function(call){
            helper.item.parent_tbl_id=helper.parent_item.tbl_id;
            helper.item.parent_data_type=helper.parent_item.data_type;
            helper.item.top_tbl_id=helper.top_item.tbl_id;
            helper.item.top_data_type=helper.top_item.data_type;
            call();
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

//9_detail_sub_item
router.get('/sub_item_detail/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id/:top_data_type/:top_tbl_id',function(req,res){
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.top_item=biz9.get_new_item(helper.top_data_type,helper.top_tbl_id);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id,function(error,data) {
                helper.parent_item=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.top_data_type,helper.top_tbl_id,function(error,data) {
                helper.top_item=data;
                call();
            });
        },
        function(call){
            helper.item.parent_tbl_id=helper.parent_item.tbl_id;
            helper.item.parent_data_type=helper.parent_item.data_type;
            helper.item.top_tbl_id=helper.top_item.tbl_id;
            helper.item.top_data_type=helper.top_item.data_type;
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

//--SUB ITEM END -- //////////////////////////


//-- CONTACT START -- //////////////////////////
//9_contact
router.get('/contact_detail',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.contact = biz9.get_new_item(DT_BLANK,0);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            title_url='contact';
            biz9.get_page(db,title_url,{},function(error,data){
                helper.contact=data;
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

//-- CONTACT END -- //////////////////////////

//-- SETTING START -- //////////////////////////
//9_setting
router.get('/setting_edit',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav = biz9.get_new_item(DT_BLANK,0);
    helper.data_type_list = [];
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
            biz9.get_page(db,title_url,{},function(error,data){
                if(data){
                    helper.mobile=data;
                    helper.primary=data.primary;
                    helper.left_nav=data.left_nav;
                }
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
//9_profile_update
router.post('/profile_update',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav = biz9.get_new_item(DT_BLANK,0);
    helper.data_type_list = [];
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
            biz9.get_page(db,title_url,{},function(error,data){
                if(data){
                    helper.mobile=data;
                    helper.primary=data.primary;
                    helper.left_nav=data.left_nav;
                }
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
            user_update = biz9.get_new_item(DT_USER,helper.user_tbl_id);
            user_update.first_name=helper.first_name;
            user_update.last_name=helper.last_name;
            user_update.email=helper.email;
            user_update.password=helper.password;
            biz9.update_item(db,DT_USER,user_update,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_USER,helper.user_tbl_id,function(error,data) {
                helper.user=data;
                call();
            });
        },
        function(call){
            business_update = biz9.get_new_item(helper.info.data_type,helper.info.tbl_id);
            business_update.business_name=helper.business_name;
            business_update.business_email=helper.business_email;
            business_update.business_phone=helper.business_phone;
            business_update.business_country=helper.business_country;
            business_update.business_address1=helper.business_address1;
            business_update.business_address2=helper.business_address2;
            business_update.business_city=helper.business_city;
            business_update.business_state=helper.business_state;
            business_update.business_zip=helper.business_zip;
            biz9.update_item(db,helper.info.data_type,business_update,function(error,data) {
                helper.business_update=data;
                call();
            });
        },
        function(call){
            social_update = biz9.get_new_item(helper.info.data_type,helper.info.tbl_id);
            social_update.social_website=helper.social_website;
            social_update.social_youtube=helper.social_youtube;
            social_update.social_instagram=helper.social_instagram;
            social_update.social_facebook=helper.social_facebook;
            social_update.social_twitter=helper.social_twitter;
            biz9.update_item(db,helper.info.data_type,social_update,function(error,data) {
                helper.social_update=data;
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

//9_setting_update
router.post('/setting_update',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav = biz9.get_new_item(DT_BLANK,0);
    helper.data_type_list = [];
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
            biz9.get_page(db,title_url,{},function(error,data){
                if(data){
                    helper.mobile=data;
                    helper.primary=data.primary;
                    helper.left_nav=data.left_nav;
                }
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
            primary_update = biz9.get_new_item(helper.mobile.title_url,helper.primary.tbl_id);
            primary_update.app_title=helper.primary_app_title;
            primary_update.app_color=helper.primary_app_color;
            primary_update.app_theme=helper.primary_app_theme;
            primary_update.button_color=helper.primary_button_color;
            primary_update=biz9.convert_biz_item(primary_update,['app_title','app_color','app_theme','button-color'])
            biz9.update_item(db,helper.mobile.title_url,primary_update,function(error,data) {
                helper.primary_update=data;
                call();
            });
        },
        function(call){
            left_nav_update = biz9.get_new_item(helper.mobile.title_url,helper.left_nav.tbl_id);
            left_nav_update.photofilename=helper.left_nav_photofilename;
            left_nav_update.left_nav_header=helper.left_nav_header;
            left_nav_update.left_nav_sub_note=helper.left_nav_sub_note;
            left_nav_update.left_nav_bar_title=helper.left_nav_bar_title;
            left_nav_update.left_nav_bar_social=helper.left_nav_bar_social;
            left_nav_update.left_nav_copyright=helper.left_nav_copyright;
            left_nav_update.left_nav_icon_page=helper.left_nav_icon_page;
            left_nav_update.left_nav_icon_about=helper.left_nav_icon_about;
            left_nav_update.left_nav_icon_contact=helper.left_nav_icon_contact;
            left_nav_update=biz9.convert_biz_item(left_nav_update,['left_nav_header','left_nav_sub_note','left_nav_bar_title','left_nav_bar_social','left_nav_copyright','left_nav_icon_page','left_nav_icon_about','left_nav_icon_contact'])
            biz9.update_item(db,helper.mobile.title_url,left_nav_update,function(error,data) {
                helper.left_nav_update=data;
                call();
            });
        },
        function(call){
            info_update = biz9.get_new_item(DT_ITEM,helper.info.tbl_id);
            //cashapp
            info_update.business_cashapp=helper.business_cashapp;
            info_update.business_cashapp_visible=helper.business_cashapp_visible;
            //in_app_purchase
            info_update.business_in_app_purchase_visible=helper.business_in_app_purchase_visible;
            //stripe
            info_update.business_stripe_key=helper.business_stripe_key;
            info_update.business_stripe_visible=helper.business_stripe_visible;
            //pay_on_delivery
            info_update.business_payondelivery_visible=helper.business_payondelivery_visible;
            //brevo_email
            info_update.brevo_email=helper.brevo_email;
            info_update.brevo_email_visible=helper.brevo_email_visible;
            info_update.brevo_email_key=helper.brevo_email_key;
            //firebase_notification
            info_update.firebase_server_key=helper.firebase_server_key;
            info_update.firebase_notification_visible=helper.firebase_notification_visible;
            biz9.update_item(db,DT_ITEM,info_update,function(error,data) {
                helper.info_update=data;
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

//-- SETTING END -- //////////////////////////
//-- ABOUT START -- //////////////////////////
//9_about
router.get('/about_detail',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.about = biz9.get_new_item(DT_BLANK,0);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            title_url='about';
            biz9.get_page(db,title_url,{},function(error,data){
                helper.about=data;
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

//-- ABOUT END -- //////////////////////////

//-- ACTIVITY START -- //////////////////////////
//9_activity
router.get('/activity/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.activity_list=[];
    var full_activity_list=[];
    var full_item_list=[];
    var blog_post_list=[];
    var event_list=[];
    var gallery_list=[];
    var product_list=[];
    var service_list=[];
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            sql = {type_id:STAT_POST_ID};
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=99;
            biz9.get_sql_paging(db,DT_STAT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                full_activity_list=data_list;
                helper.total_item_count=total_item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            async.forEachOf(full_activity_list,(item,key,go)=>{
                biz9.get_item(db,item.item_data_type,item.item_tbl_id,function(error,data) {
                    item.activity_type_id=item.type_id;
                    item.item=data;
                    go();
                });
            }, error => {
                if(error){
                    console.log(error);
                }
                call();
            });
        },
        function(call){
            call();
        },
        function(call){
            for(a=0;a<full_activity_list.length;a++){
                var r_item = biz9.get_new_item(full_activity_list[a].item.data_type,full_activity_list[a].item.tbl_id);
                r_item.title='A New '+biz9.get_data_type_info(full_activity_list[a].item.data_type).title + ": "+full_activity_list[a].item.title;
                r_item.sub_note=full_activity_list[a].item.sub_note;
                r_item.category=full_activity_list[a].item.category;
                r_item.view_count=full_activity_list[a].item.view_count;
                r_item.like_count=full_activity_list[a].item.like_count;
                r_item.visible=full_activity_list[a].item.visible;
                r_item.title_url=full_activity_list[a].item.title_url;
                r_item.date_obj=full_activity_list[a].item.date_obj;
                r_item.photo_obj=full_activity_list[a].item.photo_obj;
                helper.activity_list.push(r_item);
            }
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
//-- ACTIVITY END -- //////////////////////////
//-- PAGE START -- //////////////////////////
////9_page_list
router.get('/page_list',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.page_list =[];
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            title_url='mobile';
            sub_page=helper.title_url;
            biz9.get_sub_page(db,title_url,sub_page,{},function(error,data){
                helper.page=data;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.mobile.page_list.items.length;a++){
                var item={};
                item.tbl_id=helper.mobile.page_list.items[a].tbl_id;
                item.data_type=helper.mobile.page_list.items[a].data_type;
                item.visible=helper.mobile.page_list.items[a].visible;
                item.title_type=biz9.get_data_type_info(helper.mobile.page_list.items[a].type).title;
                item.title=helper.mobile.page_list.items[a].title;
                item.type=helper.mobile.page_list.items[a].type;
                item.title_url=helper.mobile.page_list.items[a].title_url;
                item.icon_footer=helper.mobile.page_list.items[a].icon_footer;
                item.photo_obj=helper.mobile.page_list.items[a].photo_obj;
                helper.page_list.push(item);
            }
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
////9_page_detail
router.get('/page_detail/:title_url',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item = biz9.get_new_item(DT_BLANK,0);
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
            biz9.get_page(db,title_url,{},function(error,data){
                helper.mobile=data;
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
            title_url='mobile';
            sub_page=helper.title_url;
            biz9.get_sub_page(db,title_url,sub_page,{},function(error,data){
                helper.item=data;
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

//-- PAGE END -- //////////////////////////

module.exports = router;
