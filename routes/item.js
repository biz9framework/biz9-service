var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
// ITEM-START //////////////////////////////////////////
// 9_update_item
router.post("/update_item/:send_notification", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(helper.data_type,helper.tbl_id,req.body);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.stat = biz9.get_new_item(DT_STAT,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            if(helper.info.firebase_notification_visible=='true' && helper.send_notification=='true'){
                message={title:get_firebase_notification_title(helper.data_type,helper.tbl_id),body:helper.item.title};
                topic=FIREBASE_TOPIC_MOBILE_ALL;
                biz9.send_mobile_notification_topic(FIREBASE_KEY_FILE+helper.app_title_id+'.json',message,topic,function(error,data) {
                    helper.firebase=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sql = {item_tbl_id:helper.item.tbl_id,type_id:STAT_POST_ID};
            sort={};
            biz9.get_sql(db,DT_STAT,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.stat = data_list[0];
                }else{
                    helper.stat = biz9.get_new_item(DT_STAT,0);
                    helper.stat.item_tbl_id=helper.item.tbl_id;
                    helper.stat.item_data_type=helper.item.data_type;
                    helper.stat.type_id=STAT_POST_ID;
                }
                call();
            });
        },
        function(call){
            if(helper.stat.tbl_id==0){
                biz9.update_item(db,DT_STAT,helper.stat,function(error,data) {
                    helper.stat=data;
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
    function get_firebase_notification_title(data_type,tbl_id){
        if(!tbl_id){
            tbl_id='0';
        }
        var title='';
        switch(data_type){
            case DT_BLOG_POST:
                if(!tbl_id){
                    title='New Blog Post'
                }else{
                    title='Blog Post Update'
                }
                break;
            case DT_GALLERY:
                if(tbl_id=='0'){
                    title='New Gallery'
                }else{
                    title='Gallery Update'
                }
                break;
            case DT_EVENT:
                if(tbl_id=='0'){
                    title='New Event'
                }else{
                    title='Event Update'
                }
                break;
            case DT_SERVICE:
                if(tbl_id=='0'){
                    title='New Service'
                }else{
                    title='Service Update'
                }
                break;
            case DT_PRODUCT:
                if(tbl_id=='0'){
                    title='New Product'
                }else{
                    title='Product Update'
                }
                break;
            case DT_ORDER:
                if(tbl_id=='0'){
                    title='New Order'
                }else{
                    title='Order Update'
                }
                break;
        }
        return title;
    }
});
// 9_delete_item
router.post("/delete_item/:data_type/:tbl_id",function(req, res) {
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
            biz9.delete_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                call();
            });
        },
        function(call){
            sql = {item_tbl_id:helper.tbl_id};
            sort={};
            biz9.delete_sql(db,DT_STAT,sql,function(error,data_list) {
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
//9_copy_
router.post("/copy_item/:data_type/:tbl_id",function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.item_copy = biz9.get_new_item(helper.data_type,0);
    helper.org_sub_item_list=[];
    helper.new_sub_item_list=[];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.copy_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item_copy=data;
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
//9_sub_item_copy
router.post("/copy_sub_item/:parent_data_type/:parent_tbl_id/:sub_tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper(req);
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.sub_item = biz9.get_new_item(DT_ITEM,helper.sub_tbl_id);
    helper.sub_item_list = [];
    helper.top_sub_item_list = [];
    helper.p1_org_sub_item_list = [];
    helper.p2_org_sub_item_list = [];
    helper.p3_org_sub_item_list = [];
    helper.p4_org_sub_item_list = [];
    helper.p5_org_sub_item_list = [];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_item.data_type,helper.parent_item.tbl_id,function(error,data) {
                helper.parent_item = data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.sub_item.data_type,helper.sub_item.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            if(helper.sub_item.parent_tbl_id==helper.parent_item.tbl_id){
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
            }else{
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
            }
            helper.sub_item.is_parent=true;
            helper.sub_item_copy =biz9.set_new_sub_item(helper.sub_item.data_type,helper.sub_item);
            biz9.update_item(db,helper.sub_item.data_type,helper.sub_item_copy,function(error,data) {
                helper.sub_item_copy=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.sub_item.tbl_id};
            sort={};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.sub_item_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item_list[a].is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.sub_item_copy.tbl_id;//top
                helper.top_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.sub_item_list[a]));
            }
            call();
        },
        function(call){
            if(helper.top_sub_item_list.length>0){
                biz9.update_list(db,helper.top_sub_item_list,function(error,data_list) {
                    helper.top_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sql = {};
            sort={};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.top_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.top_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.top_sub_item_list[a].tbl_id;
                        helper.p1_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p1_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p1_org_sub_item_list,function(error,data_list) {
                    helper.p1_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p1_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p1_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p1_org_sub_item_list[a].tbl_id;
                        helper.other_list[b].is_parent=false;
                        helper.p2_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p2_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p2_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p2_org_sub_item_list[a].tbl_id;
                        helper.p3_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p3_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p3_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p3_org_sub_item_list[a].tbl_id;
                        helper.p4_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p3_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p3_org_sub_item_list=data_list;
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
//9_delete_sub_item
router.post("/delete_sub_item/:data_type/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper(req);
    helper.sub_item = biz9.get_new_item(DT_ITEM,helper.tbl_id);
    helper.del_list=[];
    helper.copy_sub_item_list = [];
    helper.p1_org_sub_item_list = [];
    helper.p2_org_sub_item_list = [];
    helper.p3_org_sub_item_list = [];
    helper.p4_org_sub_item_list = [];
    helper.p5_org_sub_item_list = [];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.sub_item.data_type,helper.sub_item.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.sub_item.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.del_list = data_list;
                call();
            });
        },
        function(call){
            async.forEachOf(helper.del_list,function(value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p1_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p1_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p2_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p2_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p3_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p3_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p4_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p4_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            biz9.delete_list(db,helper.sub_item.data_type,helper.del_list,function(error,data) {
                helper.del_list=data;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.sub_item.data_type,helper.tbl_id,function(error,data) {
                helper.sub_item = data;
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

// ITEM-END //////////////////////////////////////////

// LIKE-START //////////////////////////////////////////

//9_like_update 9_like_add
router.post('/like_update/:item_data_type/:item_tbl_id/:customer_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            biz9.update_item_like_count(db,helper.item_data_type,helper.item_tbl_id,helper.customer_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },

        function(call){
            if(helper.info.firebase_notification_visible=='true'){
            }
            call();
        },
        function(call){
            sql = {item_tbl_id:helper.item.tbl_id,type_id:STAT_LIKE_ID};
            sort={};
            biz9.get_sql(db,DT_STAT,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.stat = data_list[0];
                }else{
                    helper.stat = biz9.get_new_item(DT_STAT,0);
                    helper.stat.item_tbl_id=helper.item.tbl_id;
                    helper.stat.item_data_type=helper.item.data_type;
                    helper.stat.type_id=STAT_POST_ID;
                }
                call();
            });
        },
        function(call){
            biz9.update_item(db,DT_STAT,helper.stat,function(error,data) {
                helper.stat=data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
// LIKE-END //////////////////////////////////////////
// REVIEW-START //////////////////////////////////////////
//9_item_review_update 9_review_add
router.post('/review_update/:item_data_type/:item_tbl_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.review_obj = biz9.get_new_item(DT_REVIEW,0);
    helper.review = biz9.set_item_data(DT_REVIEW,0,req.body);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    helper.update_item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            biz9.update_item(db,DT_REVIEW,helper.review,function(error,data) {
                helper.review=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_data_type,helper.item_tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            appz.get_review_obj(db,helper.item_tbl_id,function(error,data){
                review_obj=data;
                call();
            });
        },
        function(call){
            helper.update_item.review_count=review_obj.review_list.length;
            helper.update_item.rating_avg=review_obj.rating_avg;
            biz9.update_item(db,helper.update_item.data_type,helper.update_item,function(error,data) {
                helper.update_item=data;
                helper.update_item.review_obj=review_obj;
                call();
            });
        },
        function(call){
            customer_review=set_review_customer(helper);
            mail_notification=set_review_update_mail_notification(helper.info,customer);
            helper.brevo_obj=set_mail_message(mail_notification,customer_review);
            call();
        },
        function(call){
            if(helper.info.brevo_visible=='true'){
                biz9.send_brevo_mail(helper.info.brevo_key,helper.brevo_obj,function(error,data) {
                    if(error){
                        helper.validation_message=error;
                    }
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
    set_mail_message=function(mail,customer_review){
        form_send={};
        form_send.customer_name=customer_review.customer_name;
        form_send.customer_rating=customer_review.customer_rating;
        form_send.customer_comment=customer_review.customer_comment;
        form_send.item_title=customer_review.item_title;
        form_send.business_name=mail.sender.name;
        form_send.copyright=mail.sender.name;
        return {
            'templateId':parseInt(mail.template_id),
            'subject':mail.subject,
            'sender' : {'email':mail.sender.email,'name':mail.sender.name},
            'replyTo' : {'email':mail.replyTo.email,'name':mail.replyTo.name},
            'to':mail.to_list,
            'params':form_send
        }
    }
});
//9_comment //9_review_list
router.get('/review_list/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
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
            sql = {};
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_sql_paging(db,DT_REVIEW,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.review_list=data_list;
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
//9_item_review_delete
router.post('/review_delete/:review_tbl_id/:item_data_type/:item_tbl_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.review_obj = biz9.get_new_item(DT_REVIEW,0);
    helper.review = biz9.set_item_data(DT_REVIEW,0,req.body);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    helper.update_item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.delete_item(db,DT_REVIEW,helper.review_tbl_id,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_data_type,helper.item_tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            appz.get_review_obj(db,helper.item_tbl_id,function(error,data){
                review_obj=data;
                call();
            });
        },
        function(call){
            helper.update_item.review_count=review_obj.review_list.length;
            helper.update_item.rating_avg=review_obj.rating_avg;
            biz9.update_item(db,helper.update_item.data_type,helper.update_item,function(error,data) {
                helper.update_item=data;
                helper.update_item.review_obj=review_obj;
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
set_review_customer=function(item){
    customer = biz9.get_new_item(DT_BLANK,0);
    customer.customer_name=item.customer_name ? (item.customer_name) : "customer";
    customer.customer_comment=item.customer_comment ? (item.customer_comment) : " ";
    customer.customer_location=item.customer_location ? (item.customer_location) : " ";
    customer.customer_rating=item.customer_rating ? (item.customer_rating) : 1;
    customer.customer_id=item.customer_id;
    customer.item_title=item.item.title;
    customer.customer_email=item.customer_email ? (item.customer_email) : "certifiedcoderz@gmail.com";
    return customer;
}
get_new_review_update_send_mail_notification=function(info,customer_review,mail,item,callback){
    var item_list=[];
    async.series([
        function(call){
            send_in_blue_obj=
                {
                    'templateId':parseInt(info.send_in_blue_item_review_update_template_id),
                    'subject':mail.subject,
                    'sender' : {'email':mail.sender.email,'name':mail.sender.name},
                    'replyTo' : {'email':mail.replyTo.email,'name':mail.replyTo.name},
                    'to':mail.to_list,
                    'params':{
                        "business_name":mail.sender.name,
                        "customer_email":customer.email,
                        "customer_name":customer.name,
                        "item_title":item.title,
                        "customer_location":customer_review.location,
                        "customer_comment":customer_review.comment,
                        "customer_rating":customer_review.rating,
                    }
                }
            call();
        }
    ],
        function(err, result){
            callback(send_in_blue_obj);
        });
}
// REVIEW-START //////////////////////////////////////////



router.post('/send_contact_form',function(req, res) {
    /*--default_start--*/
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end--*/
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            biz9.get_page(db,title_url,{},function(error,page){
                if(page){
                    helper.mobile=page;
                }
                call();
            });
        },
        function(call){
            form_send={};
            customer=set_customer({customer_name:helper.customer_name,customer_email:helper.customer_email});
            mail_notification=set_form_send_mail_notification(helper.info,customer);
            send_in_blue_obj=get_form_submission_send_in_blue(mail_notification,helper);
            call();
        },
        function(call){
            biz9.send_mail(helper.info.send_in_blue_key,send_in_blue_obj,function(error,data) {
                if(error){
                    helper.validation_message=error;
                }
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
    set_customer=function(item){
        customer = biz9.get_new_item(DT_BLANK,0);
        customer.email=item.customer_email ? (item.customer_email) : "email_not_found@gmail.com";
        customer.name=item.customer_name ? (item.customer_name) : "Customer";
        return customer;
    }
    set_form_send_mail_notification=function(info,customer){
        mail_notification={};

        mail_notification.subject=info.send_in_blue_form_send_subject;
        mail_notification.template_id=info.send_in_blue_form_send_template_id;

        mail_notification.copyright='Copyright @ '+info.business_name;
        mail_notification.sender={name:info.business_name,email:info.business_email};
        mail_notification.replyTo={name:info.business_name,email:info.business_email};
        mail_notification.to_list=[];
        mail_notification.to_list.push({name:customer.name,email:customer.email});
        mail_notification.to_list.push({name:info.business_name,email:info.business_email});
        return mail_notification;
    }
    get_form_submission_send_in_blue=function(mail,helper){
        form_send={};
        form_send.business_name=mail.sender.name;
        form_send.copyright=mail.sender.name;
        for(a=1;a<parseInt(helper.field_count)+1;a++){
            form_send['form_title_'+a]=helper['field_title_'+a];
            form_send['form_value_'+a]=helper['field_value_'+a];
        }
        return {
            'templateId':parseInt(mail.template_id),
            'subject':mail.subject,
            'sender' : {'email':mail.sender.email,'name':mail.sender.name},
            'replyTo' : {'email':mail.replyTo.email,'name':mail.replyTo.name},
            'to':mail.to_list,
            'params':form_send
        }
    }
});
set_review_update_mail_notification=function(info,customer){
    mail_notification={};
    mail_notification.customer_name
    mail_notification.subject=info.brevo_item_review_update_subject;
    mail_notification.template_id = info.brevo_item_review_update_template_id;
    mail_notification.copyright='Copyright @ '+info.business_name;
    mail_notification.sender={name:info.business_name,email:info.business_email};
    mail_notification.replyTo={name:info.business_name,email:info.business_email};
    mail_notification.to_list=[];
    mail_notification.to_list.push({name:customer.customer_name,email:customer.customer_email});
    mail_notification.to_list.push({name:info.business_name,email:info.business_email});
    return mail_notification;
}

module.exports = router;
