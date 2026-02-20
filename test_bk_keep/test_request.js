G_ENV='test'; //test,stage,prod
var request = require('request')
    , _ = require('underscore')
    , async = require('async')
    ,lineReader = require('line-reader')
    ,fs = require('fs')
    ,cheerio = require('cheerio')
    ,got = require('got')
    ,fs = require('fs')
    ,os = require('os')
    ,nReadlines = require('n-readlines')
    ,readline = require('readline')
    ,stripe = require('stripe')
    ,https = require('https');
biz9_app_config=require("./biz9_app_config");
/* --- APP CONFIG START  --- */
const PROJECT_ID=biz9_app_config.PROJECT_ID;
const APP_TITLE_ID=biz9_app_config.APP_TITLE_ID;
const APP_TITLE=biz9_app_config.APP_TITLE;
const APP_PORT=biz9_app_config.APP_PORT;
const APP_CLOUD_BUCKET=biz9_app_config.APP_CLOUD_BUCKET;
const APP_VERSION=biz9_app_config.APP_VERSION;
/* --- APP CONFIG END  --- */
/* --- TEST USER START  --- */
const EMAIL_ID=biz9_app_config.EMAIL_ID;
const PASSWORD_ID=biz9_app_config.PASSWORD_ID;
/* --- TEST USER END  --- */
/* --- TEST CONFIG START --- */
RUN_URL=biz9_app_config.RUN_URL;
TEST_CLOUD_APP_URL=biz9_app_config.TEST_CLOUD_APP_URL;
PHOTO_RESIZE_PUBLISH_FOLDER=biz9_app_config.PHOTO_RESIZE_PUBLISH_FOLDER;
/* --- TEST CONFIG END --- */
/* --- MONGO START --- */
MONGO_IP=biz9_app_config.MONGO_IP;
MONGO_PORT=biz9_app_config.MONGO_PORT;
MONGO_URL=biz9_app_config.MONGO_URL;
/* --- MONGO END --- */
/* --- AWS START --- */
AWS_S3_SAVE=biz9_app_config.AWS_S3_SAVE;
AWS_S3_BUCKET=biz9_app_config.AWS_S3_BUCKET;
AWS_KEY=biz9_app_config.AWS_KEY;
AWS_SECRET=biz9_app_config.AWS_SECRET;
AWS_REGION=biz9_app_config.AWS_REGION;
/* --- AWS END --- */
/* --- EMAILZ START --- */
EMAIL_TO=biz9_app_config.EMAIL_TO;
EMAIL_FROM=biz9_app_config.EMAIL_FROM;
/* --- EMAILZ START --- */
/* --- FILE START --- */
FILE_SAVE_PATH=biz9_app_config.FILE_SAVE_PATH;
FILE_URL=biz9_app_config.FILE_URL;
/* --- FILE END --- */
//-BREVO-START
BREVO_KEY=biz9_app_config.BREVO_KEY;
BREVO_ORDER_SEND_TEMPLATE_ID=biz9_app_config.BREVO_ORDER_SEND_TEMPLATE_ID;
BREVO_FORM_SEND_TEMPLATE_ID=biz9_app_config.BREVO_FORM_SEND_TEMPLATE_ID;
//-BREVO-END
//

var data_config={
    mongo_server_user:biz9_app_config.MONGO_SERVER_USER,
    mongo_username_password:biz9_app_config.MONGO_USERNAME_PASSWORD,
    mongo_ip:biz9_app_config.MONGO_IP,
    mongo_port:biz9_app_config.MONGO_PORT,
    mongo_config_file:biz9_app_config.MONGO_CONFIG_FILE,
    ssh_key:biz9_app_config.SSH_KEY,
    redis_url:biz9_app_config.REDIS_URL,
    redis_port:biz9_app_config.REDIS_PORT,
};
biz9data=require("biz9-data")(data_config);

PHOTO_SIZE_ALBUM={title_url:"",size:0};
PHOTO_SIZE_THUMB={title_url:"thumb_size_",size:250};
PHOTO_SIZE_MID={title_url:"mid_size_",size:720};
PHOTO_SIZE_SQUARE_THUMB={title_url:"square_thumb_size_",size:250};
PHOTO_SIZE_SQUARE_MID={title_url:"square_mid_size_",size:720};


/* testz
 * ping
 * report
 * run
 * uptime
 * photo_rename
 * admin_update_local_system
 * admin_update_production_system
 * admin_order_product_cart_add
 * admin_order_service_cart_add
 * admin_order_event_cart_add
 * admin_order_cart_detail
 * admin_vendor_order_checkout_free
 * admin_vendor_order_checkout_cashapp
 * admin_vendor_order_checkout_striperedirecturl
 * admin_order_checkout_pay_on_delivery
 * admin_order_checkout_stripe_card
 * admin_order_checkout_zelle
 * bucket_update
 * bucket_get_data
 * bucket_file_update
 * write_file
 * send_mail
* stripe_make_payment
 * brevo_mail_message_send
 * server_read_file
 * blue_send_maili
 * s2_photo_backup
 * s3_photo_backup
 * parse_themeforest
 * photo_resize
 * firebase_send_message
*/


//9_photo_rename
describe('photo_rename', function(){ this.timeout(25000);
    it("_photo_rename", function(done){
        var folder_loc='photo_rename_folder';
        var folder_loc_final='photo_rename_publish_folder';
        var file_list=[];
        //FILE_SAVE_PATH
        async.series([
            //file_list
            function(call){
                fs.readdirSync(folder_loc).forEach(file => {
                    ext=biz9.get_file_ext(folder_loc+"/"+file);
                    if(!ext){
                        ext='.jpg';
                    }
                    file_list.push({ file_ext:ext, file_full:folder_loc+"/"+file })
                });
                call();
            },
            function(call){
                async.forEachOf(file_list,(item,key,go)=>{
                    item.new_photofilename=biz9.get_guid()+item.file_ext;
                    go();
                }, error => {
                    call();
                });
            },
            function(call){
                let date_ob = new Date();
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                let hours = date_ob.getHours();
                let minutes = date_ob.getMinutes();
                let seconds = date_ob.getSeconds();
                full_date = year + "-" + month + "-" + date + "-" + hours + "-" + minutes + "-" + seconds;
                folder_loc_final = folder_loc_final+"/" + full_date;
                if (!fs.existsSync(folder_loc_final)){
                    fs.mkdirSync(folder_loc_final, { recursive: true });
                }
                call();
            },
            function(call){
                // current minutes
                async.forEachOf(file_list,(item,key,go)=>{
                    item.new_file_full=folder_loc_final+"/"+item.new_photofilename;
                    fs.rename(item.file_full,folder_loc_final+"/"+item.new_photofilename, (err) => {
                        go();
                    });
                }, error => {
                    call();
                });
            },
            function(call){
                var show_list=[];
                for(a=0;a<file_list.length;a++){
                    show_list.push(file_list[a].new_photofilename);
                }
                console.log('COPY-PHOTO-FILE-LIST-START');
                console.log(full_date);
                console.log('-----------------------');
                console.log(show_list);
                console.log('COPY-PHOTO-FILE-LIST-END');
                call();
            },
        ],
            function(err, results){
                //done();
            });
    });
});

describe('admin_update_local_system', function(){ this.timeout(25000);
    it("_admin_update_local_system", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                function get_local_cloud_url(url){
                    var test_query='?app_title_id='+APP_TITLE_ID;
                    return "http://localhost:"+APP_PORT+url+test_query;
                }
                helper.cloud_url=get_local_cloud_url('/admin/update_system');
                helper.user={};
                helper.email=EMAIL_ID;
                helper.password=PASSWORD_ID;
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});
describe('admin_update_production_system', function(){ this.timeout(25000);
    it("_admin_update_production_system", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url('/admin/update_system');
                helper.user={};
                helper.email=EMAIL_ID;
                helper.password=PASSWORD_ID;
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});


// ------------------------------------------------------------------ ORDER-PROCESSING-START --------------------------------------------------------------------------- //
// 9_order_product_cart_add 9_cart_add 9_product_cart_add
describe('admin_order_product_cart_add', function(){ this.timeout(25000);
    it("_admin_order_product_cart_add", function(done){
        PRODUCT_COUNT=biz9.get_id(5);
        PRODUCT_QUANTITY=biz9.get_id(9);
        var product_list=[];
        var order_list=[];
        var product_option_item_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_PRODUCT_CART_ADD_START---');
                biz9.get_connect_db(APP_TITLE_ID,function(error,_db){
                    db=_db;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                biz9.get_sql(db,DT_PRODUCT,sql,sort,function(error,data_list) {
                    product_list = data_list;
                    call();
                });
            },
            function(call){
                sql = {top_data_type:DT_PRODUCT,parent_data_type:DT_ITEM};
                sort={};
                biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                    product_option_item_list = data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<PRODUCT_COUNT;a++){
                    order_list.push(
                        {
                            item:product_list[biz9.get_id(product_list.length-1)],
                            option_1:product_option_item_list[biz9.get_id(product_option_item_list.length-1)],
                            option_2:product_option_item_list[biz9.get_id(product_option_item_list.length-1)],
                            option_3:product_option_item_list[biz9.get_id(product_option_item_list.length-1)],
                            option_4:product_option_item_list[biz9.get_id(product_option_item_list.length-1)]
                        });
                }
                call();
            },
            function(call){
                async.forEachOf(order_list,(item,key,go)=>{
                    helper = {};
                    helper.app_title_id=APP_TITLE_ID;

                    //option_item_list
                    if(item.option_1){
                        helper.option_item_1_tbl_id=item.option_1.tbl_id;
                    }
                    if(item.option_2){
                        helper.option_item_2_tbl_id=item.option_2.tbl_id;
                    }
                    if(item.option_3){
                        helper.option_item_3_tbl_id=item.option_3.tbl_id;
                    }
                    if(item.option_4){
                        helper.option_item_4_tbl_id=item.option_4.tbl_id;
                    }
                    //service_time
                    //helper.start_date='my_test_start_date_'+biz9.get_id(555);
                    //helper.start_time='my_test_start_time_'+biz9.get_id(555);

                    helper.cloud_url=get_cloud_url('/order/cart_add/'+item.item.data_type+'/'+item.item.tbl_id+'/'+CUSTOMER_ID + "/"+PRODUCT_QUANTITY);
                    request.post({url:helper.cloud_url,
                        form:helper
                    },
                        function(err,req,server_cloud) {
                            report_show(err,server_cloud,helper.cloud_url);
                            go();
                        })
                }, error => {
                    call();
                });
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CART_ADD_END---');
                done();
            });
    });
});
// 9_order_service_cart_add 9_cart_service_add 9_cart_service_add
describe('admin_order_service_cart_add', function(){ this.timeout(25000);
    it("_admin_order_service_cart_add", function(done){
        PRODUCT_COUNT=biz9.get_id(5);
        PRODUCT_QUANTITY=biz9.get_id(9);
        var product_list=[];
        var service_list=[];
        var event_list=[];
        var order_list=[];
        var product_option_item_list=[];
        var event_option_item_list=[];
        var service_option_item_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_CART_ADD_START---');
                biz9.get_connect_db(APP_TITLE_ID,function(error,_db){
                    db=_db;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                biz9.get_sql(db,DT_PRODUCT,sql,sort,function(error,data_list) {
                    product_list = data_list;
                    call();
                });
            },
            function(call){
                sql = {top_data_type:DT_PRODUCT,parent_data_type:DT_ITEM};
                sort={};
                biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                    product_option_item_list = data_list;
                    call();
                });
            },

            function(call){
                sql = {};
                sort={};
                biz9.get_sql(db,DT_SERVICE,sql,sort,function(error,data_list) {
                    service_list = data_list;
                    call();
                });
            },
            function(call){
                sql = {top_data_type:DT_SERVICE,parent_data_type:DT_ITEM};
                sort={};
                biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                    service_option_item_list = data_list;
                    call();
                });
            },

            function(call){
                sql = {};
                sort={};
                biz9.get_sql(db,DT_EVENT,sql,sort,function(error,data_list) {
                    event_list = data_list;
                    call();
                });
            },
            function(call){
                sql = {top_data_type:DT_EVENT,parent_data_type:DT_ITEM};
                sort={};
                biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                    event_option_item_list = data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<PRODUCT_COUNT;a++){
                    order_list.push(
                        {
                            item:product_list[biz9.get_id(product_list.length-1)],
                            option_1:product_option_item_list[biz9.get_id(product_option_item_list.length-1)],
                            option_2:product_option_item_list[biz9.get_id(product_option_item_list.length-1)],
                            option_3:product_option_item_list[biz9.get_id(product_option_item_list.length-1)],
                            option_4:product_option_item_list[biz9.get_id(product_option_item_list.length-1)]
                        });
                    order_list.push(
                        {
                            item:service_list[biz9.get_id(service_list.length-1)],
                            option_1:service_option_item_list[biz9.get_id(service_option_item_list.length-1)],
                            option_2:service_option_item_list[biz9.get_id(service_option_item_list.length-1)],
                            option_3:service_option_item_list[biz9.get_id(service_option_item_list.length-1)],
                            option_4:service_option_item_list[biz9.get_id(service_option_item_list.length-1)]
                        });
                    order_list.push(
                        {
                            item:event_list[biz9.get_id(event_list.length-1)],
                            option_1:event_option_item_list[biz9.get_id(event_option_item_list.length-1)],
                            option_2:event_option_item_list[biz9.get_id(event_option_item_list.length-1)],
                            option_3:event_option_item_list[biz9.get_id(event_option_item_list.length-1)],
                            option_4:event_option_item_list[biz9.get_id(event_option_item_list.length-1)]
                        });
                }
                call();
            },
            function(call){
                async.forEachOf(order_list,(item,key,go)=>{
                    helper = {};
                    helper.app_title_id=APP_TITLE_ID;

                    //option_item_list
                    if(item.option_1){
                        helper.option_item_1_tbl_id=item.option_1.tbl_id;
                    }
                    if(item.option_2){
                        helper.option_item_2_tbl_id=item.option_2.tbl_id;
                    }
                    if(item.option_3){
                        helper.option_item_3_tbl_id=item.option_3.tbl_id;
                    }
                    if(item.option_4){
                        helper.option_item_4_tbl_id=item.option_4.tbl_id;
                    }
                    //service_time
                    //helper.start_date='my_test_start_date_'+biz9.get_id(555);
                    //helper.start_time='my_test_start_time_'+biz9.get_id(555);

                    helper.cloud_url=get_cloud_url('/order/cart_add/'+item.item.data_type+'/'+item.item.tbl_id+'/'+CUSTOMER_ID + "/"+PRODUCT_QUANTITY);
                    request.post({url:helper.cloud_url,
                        form:helper
                    },
                        function(err,req,server_cloud) {
                            report_show(err,server_cloud,helper.cloud_url);
                            go();
                        })
                }, error => {
                    call();
                });
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CART_ADD_END---');
                done();
            });
    });
});

// 9_order_event_cart_add 9_cart_event_add 9_cart_event_add
describe('admin_order_event_cart_add', function(){ this.timeout(25000);
    it("_admin_order_event_cart_add", function(done){
        EVENT_COUNT=biz9.get_id(5);
        EVENT_QUANTITY=biz9.get_id(9);
        var event_list=[];
        var order_list=[];
        var event_option_item_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_EVENT_CART_ADD_START---');
                biz9.get_connect_db(APP_TITLE_ID,function(error,_db){
                    db=_db;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                biz9.get_sql(db,DT_EVENT,sql,sort,function(error,data_list) {
                    event_list = data_list;
                    call();
                });
            },
            function(call){
                sql = {top_data_type:DT_EVENT,parent_data_type:DT_ITEM};
                sort={};
                biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                    event_option_item_list = data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<EVENT_COUNT;a++){
                    order_list.push(
                        {
                            item:event_list[biz9.get_id(event_list.length-1)],
                            option_1:event_option_item_list[biz9.get_id(event_option_item_list.length-1)],
                            option_2:event_option_item_list[biz9.get_id(event_option_item_list.length-1)],
                            option_3:event_option_item_list[biz9.get_id(event_option_item_list.length-1)],
                            option_4:event_option_item_list[biz9.get_id(event_option_item_list.length-1)]
                        });
                }
                call();
            },
            function(call){
                async.forEachOf(order_list,(item,key,go)=>{
                    helper = {};
                    helper.app_title_id=APP_TITLE_ID;
                    //option_item_list
                    if(item.option_1){
                        helper.option_item_1_tbl_id=item.option_1.tbl_id;
                    }
                    if(item.option_2){
                        helper.option_item_2_tbl_id=item.option_2.tbl_id;
                    }
                    if(item.option_3){
                        helper.option_item_3_tbl_id=item.option_3.tbl_id;
                    }
                    if(item.option_4){
                        helper.option_item_4_tbl_id=item.option_4.tbl_id;
                    }
                    helper.cloud_url=get_cloud_url('/order/cart_add/'+item.item.data_type+'/'+item.item.tbl_id+'/'+CUSTOMER_ID + "/"+EVENT_QUANTITY);
                    request.post({url:helper.cloud_url,
                        form:helper
                    },
                        function(err,req,server_cloud) {
                            report_show(err,server_cloud,helper.cloud_url);
                            go();
                        })
                }, error => {
                    call();
                });
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CART_EVENT_ADD_END---');
                done();
            });
    });
});
//9_cart_detail 9_order_cart_detail 9_cart_detail
describe('admin_order_cart_detail', function(){ this.timeout(25000);
    it("_admin_order_cart_detail", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_CART_DETAIL_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url('/order/cart_detail/'+CUSTOMER_ID);
                request.get({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        biz9.o('cart',obj.helper.cart);
                        //report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CART_DETAIL_END---');
                done();
            });
    });
});
//9_cart_cashapp 9_order_cart_free 9_cashapp_cart_detail
describe('admin_vendor_order_checkout_free', function(){ this.timeout(25000);
    it("_admin_vendor_order_checkout_free", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_VENDOR_ORDER_CHECKOUT_FREE_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.checkout_app_title='app_title_'+biz9.get_id(9999);
                helper.checkout_app_category='app_category_'+biz9.get_id(9999);
                helper.checkout_app_content='app_content_'+biz9.get_id(9999);
                helper.checkout_app_duration='1 year';
                helper.checkout_app_tags='tag1,tag2,tag3';
                helper.app_package='app_package_'+biz9.get_id(9999);
                helper.customer_id=biz9.get_id(99999);
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='billing_card_number_'+biz9.get_id(99999);
                helper.billing_card_month='billing_card_month_'+biz9.get_id(99999);
                helper.billing_card_cvc='billing_card_cvc_'+biz9.get_id(99999);
                helper.billing_card_year='billing_card_year_'+biz9.get_id(99999);
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='FREE [with ads]';
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/package_checkout/free/'+PRODUCT_TITLE_URL);
                console.log('start');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_VENDOR_ORDER_CHECKOUT_FREE_END---');
                done();
            });
    });
});


//9_cart_cashapp 9_order_cart_cashapp 9_cashapp_cart_detail
describe('admin_vendor_order_checkout_cashapp', function(){ this.timeout(25000);
    it("_admin_vendor_order_checkout_cashapp", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_VENDOR_ORDER_CHECKOUT_CASHAPP_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.checkout_app_title='app_title_'+biz9.get_id(9999);
                helper.checkout_app_category='app_category_'+biz9.get_id(9999);
                helper.checkout_app_content='app_content_'+biz9.get_id(9999);
                helper.checkout_app_duration='1 year';
                helper.checkout_app_tags='tag1,tag2,tag3';
                helper.app_package='app_package_'+biz9.get_id(9999);
                helper.customer_id=biz9.get_id(99999);
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='billing_card_number_'+biz9.get_id(99999);
                helper.billing_card_month='billing_card_month_'+biz9.get_id(99999);
                helper.billing_card_cvc='billing_card_cvc_'+biz9.get_id(99999);
                helper.billing_card_year='billing_card_year_'+biz9.get_id(99999);
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='CASHAPP billing_payment_type_'+biz9.get_id(99999);
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/package_checkout/cashapp/'+PRODUCT_TITLE_URL);
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_VENDOR_ORDER_CHECKOUT_CASHAPP_END---');
                done();
            });
    });
});

//9_cart_cashapp 9_order_cart_cashapp 9_cashapp_cart_detail
describe('admin_vendor_order_checkout_striperedirecturl', function(){ this.timeout(25000);
    it("_admin_vendor_order_checkout_striperedirecturl", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_VENDOR_ORDER_CHECKOUT_STRIPE_REDIRECT_URL_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.checkout_app_title='app_title_'+biz9.get_id(9999);
                helper.checkout_app_category='app_category_'+biz9.get_id(9999);
                helper.checkout_app_content='app_content_'+biz9.get_id(9999);
                helper.checkout_app_duration='1 year';
                helper.checkout_app_tags='tag1,tag2,tag3';
                helper.app_package='app_package_'+biz9.get_id(9999);
                helper.customer_id=biz9.get_id(99999);
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                //helper.customer_email='customer_email_'+biz9.get_id(99999) + "@gmail.com";
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='billing_card_number_'+biz9.get_id(99999);
                helper.billing_card_month='billing_card_month_'+biz9.get_id(99999);
                helper.billing_card_cvc='billing_card_cvc_'+biz9.get_id(99999);
                helper.billing_card_year='billing_card_year_'+biz9.get_id(99999);
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='CASHAPP billing_payment_type_'+biz9.get_id(99999);
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/package_checkout/striperedirecturl/'+PRODUCT_TITLE_URL);
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        report_show(err,server_cloud,helper.cloud_url);
                        biz9.o('STRIPE_REDIRECT_URL',obj.helper.stripe_redirect_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_VENDOR_ORDER_CHECKOUT_STRIPE_REDIRECT_URL_END---');
                done();
            });
    });
});

//9_cart_cashapp 9_order_cart_cashapp 9_cashapp_cart_detail
describe('admin_order_checkout_cashapp', function(){ this.timeout(25000);
    it("_admin_order_checkout_cashapp", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_CHECKOUT_CASHAPP_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                //helper.customer_email='customer_email_'+biz9.get_id(99999) + "@gmail.com";
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='billing_card_number_'+biz9.get_id(99999);
                helper.billing_card_month='billing_card_month_'+biz9.get_id(99999);
                helper.billing_card_cvc='billing_card_cvc_'+biz9.get_id(99999);
                helper.billing_card_year='billing_card_year_'+biz9.get_id(99999);
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='CASHAPP billing_payment_type_'+biz9.get_id(99999);
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/checkout/cashapp/'+CUSTOMER_ID);
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CHECKOUT_CASHAPP_END---');
                done();
            });
    });
});

//9_cart_pay_on_delivery 9_order_cart_payondelivery 9_pay_on_delivery_cart_detail ///9_payondelivery
describe('admin_order_checkout_pay_on_delivery', function(){ this.timeout(25000);
    it("_admin_order_checkout_pay_on_delivery", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_CHECKOUT_PAY_ON_DELIVERY_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                //helper.customer_email='customer_email_'+biz9.get_id(99999) + "@gmail.com";
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='billing_card_number_'+biz9.get_id(99999);
                helper.billing_card_month='billing_card_month_'+biz9.get_id(99999);
                helper.billing_card_cvc='billing_card_cvc_'+biz9.get_id(99999);
                helper.billing_card_year='billing_card_year_'+biz9.get_id(99999);
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='PAY_ON_DELIVERY_billing_payment_type_'+biz9.get_id(99999);
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/checkout/payondelivery/'+CUSTOMER_ID);
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        biz9.o('obj',obj);
                        //report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CHECKOUT_PAY_ON_DELIVERY_END---');
                done();
            });
    });
});
//9_cart_stripe_card 9_order_cart_stripe_card 9_pay_on_stripe_card ///9_payondelivery
describe('admin_order_checkout_stripe_card', function(){ this.timeout(25000);
    it("_admin_order_checkout_stripe_card", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_CHECKOUT_STRIPE_CARD_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                //helper.customer_email='customer_email_'+biz9.get_id(99999) + "@gmail.com";
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='4242424242424242';
                helper.billing_card_month='2';
                helper.billing_card_cvc='233';
                helper.billing_card_year='2024';
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='STRIPE_CARD_billing_payment_type_'+biz9.get_id(99999);
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/checkout/stripecard/'+CUSTOMER_ID);
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        biz9.o('obj',obj);
                        //report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CHECKOUT_STRIPE_CARD_END---');
                done();
            });
    });
});
//9_cart_cashapp 9_order_cart_cashapp 9_cashapp_cart_detail
describe('admin_order_checkout_zelle', function(){ this.timeout(25000);
    it("_admin_order_checkout_zelle", function(done){
        var product_list=[];
        var product_order_list=[];
        async.series([
            function(call){
                console.log('---ADMIN_ORDER_CHECKOUT_ZELLE_START---');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.customer_name='customer_name_'+biz9.get_id(99999);
                //helper.customer_email='customer_email_'+biz9.get_id(99999) + "@gmail.com";
                helper.customer_email='bossappz6@gmail.com';
                helper.shipping_first_name='shipping_first_name_'+biz9.get_id(99999);
                helper.shipping_last_name='shipping_last_name_'+biz9.get_id(99999);
                helper.shipping_company='shipping_company_'+biz9.get_id(99999);
                helper.shipping_address='shipping_address_'+biz9.get_id(99999);
                helper.shipping_city='shipping_city_'+biz9.get_id(99999);
                helper.shipping_state='shipping_state_'+biz9.get_id(99999);
                helper.shipping_zip='shipping_zip_'+biz9.get_id(99999);
                helper.shipping_country='shipping_country_'+biz9.get_id(99999);
                helper.shipping_phone='shipping_phone_'+biz9.get_id(99999);
                helper.billing_card_number='billing_card_number_'+biz9.get_id(99999);
                helper.billing_card_month='billing_card_month_'+biz9.get_id(99999);
                helper.billing_card_cvc='billing_card_cvc_'+biz9.get_id(99999);
                helper.billing_card_year='billing_card_year_'+biz9.get_id(99999);
                helper.billing_card_country='billing_card_country_'+biz9.get_id(99999);
                helper.billing_payment_type='ZELLE billing_payment_type_'+biz9.get_id(99999);
                helper.billing_sub_note='billing_sub_note_'+biz9.get_id(99999);
                helper.billing_note='billing_note_'+biz9.get_id(99999);
                helper.billing_link='billing_link_'+biz9.get_id(99999);
                helper.cloud_url=get_cloud_url('/order/checkout/cashapp/'+CUSTOMER_ID);
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        const obj = JSON.parse(server_cloud);
                        biz9.o('obj',obj);
                        report_show(err,server_cloud,helper.cloud_url);
                        call();
                    })
            },
        ],
            function(err, results){
                console.log('---ADMIN_ORDER_CHECKOUT_ZELLE_END---');
                done();
            });
    });
});






// ------------------------------------------------------------------ SERVICE-ORDER-PROCESSING-END --------------------------------------------------------------------------- //
//9_report
describe('report', function(){ this.timeout(25000);
    it("_report", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url('/cloud/test/report');
                request.get({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});


describe('bucket_update', function(){ this.timeout(25000);
    it("_bucket_update", function(done){
        async.series([
            function(call){
                helper = {};
                helper.title=BUCKET_TITLE;
                helper.cloud_url=get_cloud_url('/cloud/test/bucket_update');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();
                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});

describe('bucket_get_data', function(){ this.timeout(25000);
    it("_bucket_get_data", function(done){
        async.series([
            function(call){
                helper = {};
                helper.bucket_title=BUCKET_TITLE;
                helper.cloud_url=get_cloud_url('/cloud/test/bucket_get_data');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();
                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    })
});
describe('bucket_file_update', function(){ this.timeout(25000);
    it("_bucket_file_update", function(done){
        async.series([
            function(call){
                helper = {};
                helper.title=BUCKET_TITLE;
                helper.cloud_url=get_cloud_url('/cloud/test/bucket_file_update');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();
                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    })
});
describe('write_file', function(){ this.timeout(25000);
    it("_write_file", function(done){
        async.series([
            function(call){
                helper = {};
                helper.title=BUCKET_TITLE;
                helper.cloud_url=get_cloud_url('/cloud/test/write_file');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();
                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});
describe('send_mail', function(){ this.timeout(25000);
    it("_send_mail", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.email=EMAIL_SUPPORT;
                helper.cloud_url=get_cloud_url('/cloud/test/send_mail');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
            });
    });
});
//9_uptime
describe('uptime', function(){ this.timeout(25000);
    it("_uptime", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url('/cloud/test/uptime');
                request.get({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
            });
    });
});
//9_ping
describe('ping', function(){ this.timeout(25000);
    it("_ping", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url('/cloud/test/ping');
                request.get({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
            });
    });
});
describe('stripe_make_payment', function(){ this.timeout(25000);
    it("_stripe_make_payment", function(done){
        async.series([
            function(call){
                retail_line_items=[];
                const run = async function(a, b) {
                    retail_line_items.push({
                        price_data: {
                            currency: 'usd',
                            unit_amount: 2000,
                            product_data: {
                                name: 'T-shirt',
                                description: 'Comfortable cotton t-shirt',
                                quantity:1,
                                images: ['https://s.aolcdn.com/dims-global/dims3/GLOB/legacy_thumbnail/640x400/quality/80/https://s.aolcdn.com/commerce/autodata/images/USD20FOC051B021001.jpg','https://www.applesfromny.com/wp-content/uploads/2020/05/20Ounce_NYAS-Apples2.png'],
                            },
                        },
                        quantity: 1,
                    });
                    const stripe = require('stripe')('sk_test_51MCo2HGRzqmjqRkc7RoZvsnPnDW4tUHpi0n8a73PDUcw7dWJo41nYfjWhTLtGVpeT7uTmxtMB7mhwYf1zwKkWvHO00R9xKHKdz');
                    try {
                        const items = retail_line_items.map((item, a) => {
                            return {
                                price_data: {
                                    currency: 'usd',
                                    unit_amount: retail_line_items[a].price_data.unit_amount,
                                    product_data: {
                                        name: retail_line_items[a].price_data.product_data.name,
                                        description: retail_line_items[a].price_data.product_data.description,
                                        images:  retail_line_items[a].price_data.product_data.images,
                                    },
                                },
                                quantity: retail_line_items[a].price_data.product_data.quantity,
                            };
                        });
                        const session = await stripe.checkout.sessions.create({
                            payment_method_types: ['card'],
                            line_items: items,
                            mode: 'payment',
                            success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
                            cancel_url: 'https://example.com/cancel',
                        });
                        console.log(session.url);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        console.log(session.url);
                        console.log('We do cleanup here');
                    }
                    console.log('end');
                    //helper.checkout_redirect_url = session.url;
                    //call();
                }
                run();
            },
            function(call){
                call();
            }
        ],
            function(err, results){
            });
    });
});
//9_run
describe('run', function(){ this.timeout(25000);
    it("_run", function(done){
        async.series([
            function(call){
                biz9.o('RUN_URL',get_cloud_url(RUN_URL));
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url(RUN_URL);

                helper.form_title='Form Title '+biz9.get_id();
                helper.customer_name='Customer Name '+biz9.get_id();
                helper.customer_email="bossappz6@gmail.com";
                helper.location='Location '+biz9.get_id();
                helper.comment='Comment '+biz9.get_id();
                helper.rating=biz9.get_id(4);



                //--FORM TEST START -- //
                /*
                helper.form_title='Form Title '+biz9.get_id();
                helper.customer_name='Customer Name '+biz9.get_id();
                helper.customer_email="bossappz6@gmail.com";
                helper.location='Location '+biz9.get_id();
                helper.message='Message '+biz9.get_id();

                helper.field_count=3;
                helper.field_title_1='Name';
                helper.field_value_1='Field 1 value '+biz9.get_id();
                helper.field_title_2='Email';
                helper.field_value_2='Field 2 value '+biz9.get_id();
                helper.field_title_3='Message';
                helper.field_value_3='Field 3 value '+biz9.get_id();
                */
                //--FORM TEST END -- //

                request.get({url:helper.cloud_url,
                    form:helper
                }, function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();
                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
            });
    });
});
//9_brevo_mail_message_send
describe('brevo_mail_message_send', function(){ this.timeout(25000);
    it("_brevo_mail_message_send", function(done){
        async.series([
            function(call){
                biz9.o('BREVO_MAIL_MESSAGE_SEND','START');
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.cloud_url=get_cloud_url('/cloud/mail/send_brevo_mail_message');

                //--FORM TEST START -- //
                helper.form_title='Form Title '+biz9.get_id();
                helper.customer_name='Customer Name '+biz9.get_id();
                helper.customer_email="bossappz6@gmail.com";
                helper.location='Location '+biz9.get_id();
                helper.message='Message '+biz9.get_id();

                helper.field_count=3;
                helper.field_title_1='Name';
                helper.field_value_1='Field 1 value '+biz9.get_id();
                helper.field_title_2='Email';
                helper.field_value_2='Field 2 value '+biz9.get_id();
                helper.field_title_3='Message';
                helper.field_value_3='Field 3 value '+biz9.get_id();
                //--FORM TEST END -- //
                biz9.o('BREVO_MAIL_MESSAGE_SEND','END');
                request.post({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();
                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
            });
    });
});

describe('server_read_file', function(){ this.timeout(25000);
    it("_server_read_file", function(done){
        async.series([
            function(call){
                helper = {};
                helper.app_title_id=APP_TITLE_ID;
                helper.email=EMAIL_SUPPORT;
                helper.cloud_url=get_cloud_url('/cloud/test/read_file');
                request.get({url:helper.cloud_url,
                    form:helper
                },
                    function(err,req,server_cloud) {
                        report_show(err,server_cloud,helper);
                        call();

                    })
            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});
describe('blue_send_mail', function(){ this.timeout(25000);
    it("_blue_send_mail", function(done){
        async.series([
            function(call){
                var key= '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';
                console.log(key);
                var SibApiV3Sdk = require('sib-api-v3-sdk');
                SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = key;
                new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
                    {
                        'templateId':5,
                        'subject':'Hello from the Node SDK!',
                        'sender' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
                        'replyTo' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
                        'to' : [{'name': 'John Doe', 'email':'coderz@bossappz.com'}],
                        //'htmlContent' : '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>',
                        'params':{"order_id":"123","order_date":"January 1, 2023","app_email":"myemail@gmail.com","app_title":"My App Title","app_category":"App Category","app_package":"App Package","app_cost":"$5.99", "app_duration":"My Duration Time","app_tag":"tag,tag2,tag3","app_content":"App Content Here", "vendor_logo":"https://img.mailinblue.com/4816415/images/content_library/original/6390c3c4e6df0441306e9702.png","vendor_img_1":"https://img.mailinblue.com/4816415/images/content_library/original/6390d6be53b9254ad3643dc7.png","vendor_title":"My BoSS App","vendor_website":"https://google.com"}

                    }
                ).then(function(data) {
                    console.log(data);
                }, function(error) {
                    console.error(error);
                });

            },
            function(call){
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});

//mobile
describe('s2_photo_backup', function(){ this.timeout(25000);
    it("s2_photo_backup", function(done){
        var photo_list=[];
        //album
        //thumb
        //mid
        //large
        async.series([
            function(call){
                biz9.get_connect_db(APP_TITLE_ID,function(err,_db){
                    db=_db;
                    call();
                });
            },
            //-----------------MOBILE-BACK-UP START --------------------------------/
            //-----------------------------------------------------------------
            function(call){
                data_type='blog_post_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='category_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='document_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='gallery_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='item_map_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='photo_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='product_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='product_cart_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='service_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='team_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='user_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            //-----------------MOBILE-BACK-UP END --------------------------------/
            //-----------------------------------------------------------------
            function(call){
                biz9.o('PHOTO_LIST',photo_list);
                biz9.o('PHOTO_COUNT',photo_list.length);
                call();
            },
            function(call){
                const fs = require('fs');
                const https = require('https');
                var a=0;
                const download = (url, path) => {
                    try {
                        //if (fs.existsSync(path)) {
                        //console.log(url);
                        //console.log('FILE EXIST');
                        //}else{
                        https.get(url, (res) => {
                            console.log(url);
                            const stream = fs.createWriteStream(path);
                            res.pipe(stream);
                            stream.on('finish', () => {
                                stream.close();
                                a=a+1;
                                console.log(a);
                                console.log(url);
                                console.log('Image downloaded');
                            });
                        }).on('error', (err) => {
                            // handle error
                            console.log(err);
                        });
                        //}
                    } catch(err) {
                        console.error(err)
                    }
                };
                photo_list.forEach((url) => {
                    const file_folder='s3_photo_backup';
                    const fileName = url.split('/').pop();
                    //console.log(url);
                    //console.log(fileName);
                    //console.log(file_folder+"/"+APP_TITLE_ID+`/${fileName}`);
                    //if(fileName!='no_image.png'){
                    download(url, file_folder+"/"+APP_TITLE_ID+`/${fileName}`);
                    //}
                });
            },
            function(call){
                console.log('S3 Download Complete');
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});

//website
describe('_s3_photo_backup', function(){ this.timeout(25000);
    it("_s3_photo_backup", function(done){
        var photo_list=[];
        //album
        //thumb
        //mid
        //large
        async.series([
            function(call){
                biz9.get_connect_db(APP_TITLE_ID,function(err,_db){
                    db=_db;
                    call();
                });
            },
            //-----------------WEBSITE-BACK-UP START --------------------------------/
            //-----------------------------------------------------------------
            function(call){
                data_type='about';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='appointment';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='blog';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='blog_post_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='contact';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='faq';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='gallery';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='gallery_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='home';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='item_map_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='partner';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='photo_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='primary';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='product';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='product_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='service';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='service_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='service_detail';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='sub_blog_post_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='sub_service_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='team_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            function(call){
                data_type='user_biz';
                sql={};
                sort={order:1};
                biz9.get_sql(db,data_type,sql,sort,function(error,data_list){
                    biz9.o(data_type+'_length',data_list.length);
                    biz9.o(data_type+'_data',data_list);
                    for(a=0;a<data_list.length;a++){
                        photo_list.push(data_list[a].album_photo_url);
                        photo_list.push(data_list[a].thumb_photo_url);
                        photo_list.push(data_list[a].mid_photo_url);
                        photo_list.push(data_list[a].large_photo_url);
                    }
                    call();
                });
            },
            //-----------------WEBSITE-BACK-UP END --------------------------------/
            //-----------------------------------------------------------------
            function(call){
                biz9.o('PHOTO_LIST',photo_list);
                biz9.o('PHOTO_COUNT',photo_list.length);
                call();
            },
            function(call){
                const fs = require('fs');
                const https = require('https');
                var a=0;
                const download = (url, path) => {
                    try {
                        //if (fs.existsSync(path)) {
                        //console.log(url);
                        //console.log('FILE EXIST');
                        //}else{
                        https.get(url, (res) => {
                            console.log(url);
                            const stream = fs.createWriteStream(path);
                            res.pipe(stream);
                            stream.on('finish', () => {
                                stream.close();
                                a=a+1;
                                console.log(a);
                                console.log(url);
                                console.log('Image downloaded');
                            });
                        }).on('error', (err) => {
                            // handle error
                            console.log(err);
                        });
                        //}
                    } catch(err) {
                        console.error(err)
                    }
                };
                photo_list.forEach((url) => {
                    const file_folder='s3_photo_backup';
                    const fileName = url.split('/').pop();
                    //console.log(url);
                    //console.log(fileName);
                    //console.log(file_folder+"/"+APP_TITLE_ID+`/${fileName}`);
                    //if(fileName!='no_image.png'){
                    download(url, file_folder+"/"+APP_TITLE_ID+`/${fileName}`);
                    //}
                });
            },
            function(call){
                console.log('S3 Download Complete');
                call();
            }
        ],
            function(err, results){
                done();
            });
    });
});
describe('parse_themeforest', function(){ this.timeout(25000);
    it("_parse_themeforest", function(done){
        var template_source_list=[];
        var template_parse_list=[];
        var template_photo_url_list=[];
        template_title='';
        template_photo_url='';
        async.series([
            function(call){
                lineReader.eachLine('theme_forest_parse/template_list.sh', function(line, last) {
                    if(line){
                        template_source_list.push(line);
                    }
                    if(last) {
                        call();
                    }
                });
            },
            function(call){
                var itemsProcessed = 0;
                template_source_list.forEach((url, index, array) => {
                    parse_template=function(url,callback){
                        try {
                            got(url).then(response => {
                                //template title - start //
                                const $ = cheerio.load(response.body);
                                const info = $('h1').html()
                                const template_title=info.trim();;
                                //template title - end //
                                //template sale_count - start //
                                const $b = cheerio.load(response.body);
                                const info2 = $b('strong').html()
                                const template_sale_count=info2.trim();
                                //template sale_count - end //
                                //template photo_url - start //
                                const $c = cheerio.load(response.body);
                                const template_photo_url=$c('img')[4]['attribs']['src'].trim();
                                template_photo_url_list.push({url:$c('img')[4]['attribs']['src'].trim(),template_title:template_title} );
                                //template photo_url - end //
                                callback({title:template_title,sale_count:template_sale_count,photo_url:template_photo_url,url:url})
                            }).catch(err => {
                                console.log(err);
                            });
                        } catch(err) {
                            console.error(err)
                        }
                    }
                    parse_template(url,function(item,callback){
                        console.log('--item start--');
                        console.log(itemsProcessed);
                        console.log(item);
                        console.log('--item end--');

                        itemsProcessed++;
                        if(itemsProcessed === array.length) {
                            call();
                        }

                    });
                });
            },
            function(call){
                var a=0;
                const download = (url) => {
                    try {
                        var path='theme_forest_parse/photo_download/'+url.template_title+'.png';
                        https.get(url.url, (res) => {
                            console.log(path);
                            const stream = fs.createWriteStream(path);
                            res.pipe(stream);
                            stream.on('finish', () => {
                                stream.close();
                                a=a+1;
                                console.log(a);
                                console.log(path);
                                console.log('Image downloaded');
                            });
                        }).on('error', (err) => {
                            // handle error
                            console.log(err);
                        });
                    } catch(err) {
                        console.error(err)
                    }
                };
                var itemsProcessed = 0;
                console.log('c3');
                console.log(template_photo_url_list);
                console.log('c4');
                template_photo_url_list.forEach((url) => {
                    console.log('c4');
                    console.log(url);
                    download(url);
                    itemsProcessed++;
                    if(itemsProcessed == template_parse_list.length) {
                        console.log('done3');
                        //call();
                    }
                });
            },

            function(call){
                /*
               parse_template(url,function(url,callback){
            //parse_template = (url) => {
                    try {
                        console.log(url);
                        got(url).then(response => {
                            //template title - start //
                            const $ = cheerio.load(response.body);
                            const info = $('h1').html()
                            const template_title=info.trim();;
                        //console.log(template_title);
                        //template title - end //
                        //template sale_count - start //
                            const $b = cheerio.load(response.body);
                            const info2 = $b('strong').html()
                            const template_sale_count=info2.trim();
                //console.log(info2);
                //template sale_count - end //
                //template photo_url - start //
                            const $c = cheerio.load(response.body);
                            const template_photo_url=$c('img')[4]['attribs']['src'].trim();
                            //console.log(template_photo_url);
                            //template photo_url - end //
                            //template_parse_list.push({title:template_title,sale_count:template_sale_count,photo_url:template_photo_url});
                            callback({title:template_title,sale_count:template_sale_count,photo_url:template_photo_url})
                            //console.log(template_parse_list);
                            //console.log('ffff');
                        }).catch(err => {
                            console.log(err);
                        });

                    } catch(err) {
                        console.error(err)
                    }
            //};
               });
    /*
                    parse_template(url);
                    itemsProcessed++;
                    if(itemsProcessed === array.length) {
                        call();
                    }
                    */
},
    function(call){
        console.log('rrr');
        console.log('cool_bean2');
        console.log(template_parse_list);
        call();
    },
    function(call){
        var a=0;
        path='theme_forest_parse/photo_download/'+a+'.png';
        const download = (url) => {
            try {
                https.get(url, (res) => {
                    console.log(url);
                    const stream = fs.createWriteStream(path);
                    res.pipe(stream);
                    stream.on('finish', () => {
                        stream.close();
                        a=a+1;
                        console.log(a);
                        console.log(path);
                        console.log('Image downloaded');
                    });
                }).on('error', (err) => {
                    // handle error
                    console.log(err);
                });
            } catch(err) {
                console.error(err)
            }
        };
        var itemsProcessed = 0;
        console.log('c3');
        console.log(template_parse_list);
        console.log('c4');
        template_parse_list.forEach((url) => {
            console.log('c4');
            download(url.photo_url);
            itemsProcessed++;
            if(itemsProcessed == template_parse_list.length) {
                console.log('done3');
                call();
            }
        });
    },
    function(call){
        const vgmUrl= 'https://themeforest.net/item/ulina-fashion-ecommerce-responsive-html-template/39472609';
        got(vgmUrl).then(response => {
            //template title - start //
            const $ = cheerio.load(response.body);
            const info = $('h1').html()
            template_title=info.trim();;
            console.log(template_title);
            //template title - end //
            k       //template sale_count - start //
            const $b = cheerio.load(response.body);
            const info2 = $b('strong').html()
            template_sale_count=info2.trim();
            console.log(info2);
            //template sale_count - end //
            //template photo_url - start //
            const $c = cheerio.load(response.body);
            template_photo_url=$c('img')[4]['attribs']['src'].trim();
            console.log(template_photo_url);
            //template photo_url - end //
            call();
        }).catch(err => {
            console.log(err);
        });
    },
    function(call){
        photo_list=[];
        const vgmUrl= 'https://themeforest.net/item/ulina-fashion-ecommerce-responsive-html-template/39472609';
        got(vgmUrl).then(response => {
            const $ = cheerio.load(response.body);
            console.log('START');
            console.log($('img')[4]['attribs']['src']);
            photo_list.push($('img')[4]['attribs']['src']);
            console.log('END');
            call();
        }).catch(err => {
            console.log(err);
        });
    },
    function(call){
        console.log('PHOTO_LIST_START');
        console.log(photo_list);
        console.log('PHOTO_LIST_END');
        call();
    },
    function(call){
        const fs = require('fs');
        const https = require('https');
        var a=0;
        const download = (url, path) => {
            try {
                if (fs.existsSync(path)) {
                    console.log('FILE EXIST');
                }else{
                    https.get(url, (res) => {
                        console.log(url);
                        const stream = fs.createWriteStream(path);
                        res.pipe(stream);
                        stream.on('finish', () => {
                            stream.close();
                            a=a+1;
                            console.log(a);
                            console.log(path);
                            console.log('Image downloaded');
                        });
                    }).on('error', (err) => {
                        // handle error
                        console.log(err);
                    });
                }
            } catch(err) {
                console.error(err)
            }
        };
        photo_list.forEach((url) => {
            const fileName = url.split('/').pop();
            console.log(url);
            console.log(APP_TITLE_ID+`/${fileName}`);
            download(url, APP_TITLE_ID+`/${fileName}`);
        });
    },
        ],
            function(err, results){
                done();
            });
});

});
//9_resize
describe('photo_resize', function(){ this.timeout(25000);
    it("_photo_resize", function(done){
        //var folder_loc='photo_folder';
        //var folder_loc_final='photo_loc_folder/2023-03-31-16-34-44/';
        var folder_loc_final='/home/mama/www/doqbox/biz9/biz9-test/src/unstable/photo_rename_publish_folder/'+PHOTO_RESIZE_PUBLISH_FOLDER+'/';
        var file_list=[];
        //FILE_SAVE_PATH
        async.series([
            function(call){
                fs.readdirSync(folder_loc_final).forEach(file => {
                    ext=biz9.get_file_ext(folder_loc_final+"/"+file);
                    if(!ext){
                        ext='.jpg';
                    }
                    file_list.push({ photofilename:file })
                });
                call();
            },
            //save with new filename size thumb_size
            function(call){
                async.forEachOf(file_list,(item,key,go)=>{
                    var sizes = [{
                        path:folder_loc_final+PHOTO_SIZE_THUMB.title_url+item.photofilename,
                        xy: PHOTO_SIZE_THUMB.size
                    },{
                        path:folder_loc_final+PHOTO_SIZE_MID.title_url+item.photofilename,
                        xy: PHOTO_SIZE_MID.size
                    },];
                    biz9.set_resize_photo_file(folder_loc_final+item.photofilename,sizes,function(error,data) {
                        go();
                    });
                }, error => {
                    call();
                });
            },
            function(call){
                async.forEachOf(file_list,(item,key,go)=>{
                    var sizes = [{
                        path:folder_loc_final+PHOTO_SIZE_SQUARE_THUMB.title_url+item.photofilename,
                        xy: PHOTO_SIZE_THUMB.size
                    },{
                        path:folder_loc_final+PHOTO_SIZE_SQUARE_MID.title_url+item.photofilename,
                        xy: PHOTO_SIZE_MID.size
                    },];
                    biz9.set_resize_photo_file(folder_loc_final+item.photofilename,sizes,function(error,data) {
                        go();
                    });
                }, error => {
                    call();
                });
            },

        ],
            function(err, results){
                console.log('complete');
                done();
            });
    });
});
//9_firebase
describe('firebase_send_message', function(){ this.timeout(25000);
    it("_firebase_send_message", function(done){
        async.series([
            function(call){
                var gcm = require('node-gcm');
                // Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
                var sender = new gcm.Sender('AAAADIuziRY:APA91bHZUZHhdt0P1A2BKYveUzvvDe7M9DScO7wfMfYh4nvq3nzyRtTPcb_opaaYUlTBeFvFeguzkpIQrl_xfb_qiaJpA9wk5AEiHbagoAJdEw6z6iWPtdLUBcIAC4n9bIy7T4SY-gEZ');
                // Prepare a message to be sent
                var message = new gcm.Message({
                    data: {
                        title: 'Apple Pie',
                        body: 'Be Da Best'
                    }
                });
                // Specify which registration IDs to deliver the message to
                var _regTokens = ['cUNhhmBHRqagbCO16QTnrY:APA91bHRExayJrr-IARsfUjqUrnWGfr0oti20B05vWJ95hkZCogGFqJuK9Rsu5u9tAgT9c6TnO83ug_u_QqQLiMyHTiueXyfHo-Kp8AmZNjbr3gUnD2UDnaucCDX8XmlYkqmy8tPdyBy'];
                //.var _topic ='/topics/mobile_all';
                var _topic ='/topics/mobile_admin';
                // Actually send the message
                //sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                sender.send(message, { to: _topic }, function (err, response) {
                    if (err) console.error(err);
                    else console.log(response);
                });
                call();
            },
            function(call){
            },
            function(call){
            },
        ],
            function(err, results){
                console.log('complete');
                done();
            });
    });
});


function get_cloud_url(url){
    var test_query='?app_title_id='+APP_TITLE_ID;
    return TEST_CLOUD_APP_URL+url+test_query;
}
function report_show(error,item,helper){
    if(error){
        console.log('ERROR HAS OCCORED START------------------------------------');
        console.log('-----------------------------------');
        console.log(helper.cloud_url);
        console.log('-----------------------------------');
        console.log(error);
        console.log('ERROR HAS OCCORED END------------------------------------');

    }
    else{
        console.log('TEST_CLOUD_URL------------------------------------');
        console.log(helper.cloud_url);
        console.log('--------------------------------------------------------------------');
        console.log('TEST DATA RESULT START --------------------------------------------');
        console.log('--------------------------------------------------------------------');
        console.log(item);
        console.log('--------------------------------------------------------------------');
        console.log('TEST DATA RESULT END --------------------------------------------');
    }
}

