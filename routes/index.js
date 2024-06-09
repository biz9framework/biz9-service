var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-service':'ping'});
    res.end();
});
//9_blank
router.get('/blank',function(req, res) {
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
            sql = {type:DT_BLOG_POST};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.page = data_list[0];
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
//9_contact
router.get('/contact_detail_old',function(req, res) {
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
router.get('/login_check', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.g_app_title=APP_TITLE;
    helper.user = biz9.get_new_item(DT_USER,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            sql_obj={email:helper.email,password:helper.password};
            biz9.get_sql(db,DT_USER, sql_obj,{}, function(error,data_list) {
                if(data_list.length>0){
                    helper.user = data_list[0];
                }else{
                    helper.validation_message = 'In Correct Login';
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
});
///9_sql
router.get('/sql',function(req, res) {
    var helper = biz9.get_helper(req, biz9.get_helper(req));
    helper.render='index';
    helper.page_title = APP_TITLE +': Home';
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
            helper.item=biz9.get_test_item(DT_BLANK,0);
            biz9.update_item(db,DT_BLANK,helper.item,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            biz9.get_sql(db,DT_BLANK,sql,sort,function(error,data_list) {
                helper.blank_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={date_create:-1};
            page_current=1;
            page_size=12;
            biz9.get_sql_paging(db,DT_PRODUCT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                helper.item_list=data_list;
                helper.total_item_count=total_item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_BLANK,helper.item.tbl_id,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.item.data_type,helper.item.tbl_id,function(error,data) {
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_setting
router.get('/setting_detail_old',function(req, res) {
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

//9_setting_update
router.post('/setting_update_old',function(req, res) {
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

router.post('/send_mail_message',function(req, res) {
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
            title_url='mobile';
            sub_page='primary';
            biz9.get_sub_page(db,title_url,sub_page,{},function(error,data){
                helper.primary=data;
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.info = data_list[0];
                }
                call();
            });
        },
        function(call){
            form_send={};
            customer=set_customer(helper);
            mail_notification=set_mail_message_notification(helper.info,customer);
            send_in_blue_obj=get_mail_message_send_in_blue(mail_notification,helper);
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
    set_mail_message_notification=function(info,customer){
        mail_notification={};

        mail_notification.subject=info.send_in_blue_form_send_subject;
        mail_notification.template_id = info.send_in_blue_form_send_template_id;

        mail_notification.copyright='Copyright @ '+info.business_name;
        mail_notification.sender={name:info.business_name,email:info.send_in_blue_email};
        mail_notification.replyTo={name:info.business_name,email:info.business_email};
        mail_notification.to_list=[];
        mail_notification.to_list.push({name:customer.name,email:customer.email});
        mail_notification.to_list.push({name:info.business_name,email:info.send_in_blue_email});
        return mail_notification;
    }
    get_mail_message_send_in_blue=function(mail,helper){
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

module.exports = router;
