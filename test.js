async = require('async')
const axios = require('axios');
const {Database,Data,Portal} = require("/home/think1/www/doqbox/biz9-framework/biz9-data/code");
const {Scriptz} = require("biz9-scriptz");
const {Type,Data_Logic,App_Logic,Url} = require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const assert = require('node:assert');
const {Log,Num,Str} = require("biz9-utility");
/*
 * availble tests
- connect
- post_user
*/
//-env-test - start //
let APP_ID = "test-stage-jan14";
let URL = "http://localhost:1904";
let PORT_ID = "1904";
//-env-test - end //
/*
    //-env-stage - start //
let APP_ID = "test-stage-dec11";
let URL = "http://service.bossappz.com";
let PORT_ID = "1904";
//-env-stage - end //
*/

/* user - start */
let TITLE = 'ceo';
let TITLE_URL = 'ceo';
let EMAIL = 'ceo@bossappz.com';
let PASSWORD = '123456789Ab!';
let ROLE = Type.USER_ROLE_SUPER_ADMIN;
/* user - end */

/* --- TEST CONFIG START --- */
DATA_CONFIG = {
    APP_ID:APP_ID,
    PORT_ID:PORT_ID,
    URL:URL,
    HAS_MONGO_DB:'true',
    MONGO_IP:"0.0.0.0",
    MONGO_USERNAME_PASSWORD:"",
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:"admin",
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27020"
}
/* --- TEST DATA CONFIG END --- */
//9_test connect 9_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        console.log('TEST-CONNECT-START');
        let error=null;
        let db_connect = {};
        async.series([
            function(call){
                console.log('CONNECT-START');
                let new_data_type = Type.DATA_PRODUCT;
                //let id = '246';
                let id = 'home';
                let user_id = '246';
                //-->
                //let parent = Data_Logic.get(new_data_type,0,{test:true});
                let parent = Data_Logic.get(new_data_type,id);
                let user = Data_Logic.get(Type.DATA_USER,0,{test:true,data:{email:'ceo@bossappz.com',password:'123456789Ab!'}});
                //Log.w('parent',parent);
                //Log.w('user',user);
                //-->
                let search = {};
                //let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,0);
                //let search = Data_Logic.get_search(Type.DATA_CATEGORY,{category:Type.DATA_PRODUCT},{title:1},1,0);
                //let foreign_search_1 = Data_Logic.get_search_foreign(Type.TITLE_LIST,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{title:'product_count'});
                let option = {};
                //let option = {distinct:{field:'title'},field:{title:1},foreigns:[foreign_search_1]};

                //let option = {get_distinct:true,distinct_field:'title',distinct_sort:'asc',get_join:true,field_keys:[{foreign_data_type:Type.DATA_PRODUCT,foreign_field:'category',item_field:'title',title:'product_count',type:Type.COUNT}]};
                //-->
                let post_data = {};
                //let post_data = {id:parent.id,data_type:parent.data_type,data:parent};
                //let post_data = {id:user.id,data_type:user.data_type,user:user};
                //let post_data = {id:parent.id,data_type:parent.data_type,option:{field_value:true,id_field:Type.FIELD_TITLE_URL}};
                //let post_data = {search:search,option:option};
                //-->
                //let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
                //let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.GET);
                //let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.LOGIN);
                //let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.SEARCH);
                //let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.DELETE);
                let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_HOME);
                Log.w('search',search);
                Log.w('option',option);
                Log.w('url',url);
                //-- URL END --//
                axios.post(url,
                    post_data
                )
                    .then(function (response) {
                        Log.w('post_data',response.data);
                        Log.w('post_data',response.data.data);
                        console.log('CONNECT-SUCCESS');
                        call();
                    })
                    .catch(function (error) {
                        console.log('CONNECT-END');
                    });
            }
        ],
            function(error, result){
                if(error){
                    Log.error("CONNECT-REMOTE-ERROR",error);
                }else{
                    console.log('CONNECT-DONE');
                }
                done();
            });
    });
});
//9_post_user
describe('post_user', function(){ this.timeout(25000);
    it("_post_user", function(done){
        let cloud_error=null;
        console.log('POST-USER-START');
        async.series([ function(call){
            let biz9_config = Scriptz.get_biz9_config();
            let user = Data_Logic.get(Type.DATA_USER,0,{test:true,data:{email:EMAIL,password:PASSWORD,role:Type.USER_ROLE_SUPER_ADMIN}});
            let url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
            axios.post(url, {
                data:user
            })
                .then(function (response) {
                    if(response.data.cloud_error){
                        cloud_error=Log.append(cloud_error,response.data.error);
                    }else{
                        Log.w('cloud',response.data);
                        console.log('POST-USER-SUCCESS');
                    }
                    call();
                })
                .catch(function (error) {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
        }
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("POST-USER-ERROR-DONE",cloud_error);
                }else{
                    console.log('POST-USER-SUCCESS-DONE');
                }
                done();
            });
    });
});
//9_post_app
describe('post_app', function(){ this.timeout(25000);
    it("_post_app", function(done){
        let cloud_error=null;
        let database = {};
        let product_count = 30;
        let blog_post_count = 10;
        let review_count = 10;

        let user_list = [];
        let data = [];
        let data_2 = [];
        console.log('POST-APP-START');
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    database = biz_data;
                }
            },
            async function(call){
                //let parent = Data_Logic.get(new_data_type,0,{test:true});
                let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST_ITEMS);
                let page_list = ['Home','About','Contact','FAQs','Blog Posts'];
                let type_list = ['Admin Panel','Landing Page','Mobile','Website'];
                let delivery_time = ['1 week','3 weeks','1 month','1 year'];
                let category_list = ['Beauty','Church','Fashion','Food Trucks','Health Care','Music','Pets','Services','Service Repair','Sports','Transportation'];
                let feature_list = ['true','false'];
                let hot_list = ['true','false'];
                //page
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_ABOUT,url:Url.PAGE_ABOUT},title:Type.TITLE_PAGE_ABOUT}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_BLOG_POST,url:Url.PAGE_BLOG_POST},title:Type.TITLE_PAGE_BLOG_POST}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_CONTACT,url:Url.PAGE_CONTACT},title:Type.TITLE_PAGE_CONTACT}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_FAQ,url:Url.PAGE_FAQ},title:Type.TITLE_PAGE_FAQ}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_HOME,url:Url.PAGE_HOME},title:Type.TITLE_PAGE_HOME}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_HOME,url:Url.PAGE_GALLERY},title:Type.TITLE_PAGE_GALLERY}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_LOGIN,url:Url.PAGE_LOGIN},title:Type.TITLE_PAGE_LOGIN}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_PRODUCT,url:Url.PAGE_PRODUCT},title:Type.TITLE_PAGE_PRODUCT}));
                data.push(Data_Logic.get(Type.DATA_PAGE,0,{data:{type:Type.TITLE_PAGE_REGISTER,url:Url.PAGE_REGISTER},title:Type.TITLE_PAGE_REGISTER}));
                //type
                for(a = 0; a < type_list.length; a++){
                    data.push(Data_Logic.get(Type.DATA_TYPE,0,{title:type_list[a],test:true}));
                    //category
                    for(b = 0; b < category_list.length; b++){
                        data.push(Data_Logic.get(Type.DATA_CATEGORY,0,{title:category_list[b],test:true,data:{type:type_list[a],category:Type.DATA_PRODUCT}}));
                    }
                }
                //product
                for(a = 0; a < product_count; a++){
                    data.push(Data_Logic.get(Type.DATA_PRODUCT,0,
                        {test:true,
                            data:{
                                view_count:Num.get_id(999),
                                review_count:Num.get_id(999),
                                rating_avg:Num.get_id(5),
                                type:type_list[Num.get_id(type_list.length)],
                                category:category_list[Num.get_id(category_list.length)],
                                delivery_time:delivery_time[Num.get_id(delivery_time.length)],
                                feature:feature_list[Num.get_id(feature_list.length)],
                                hot:hot_list[Num.get_id(hot_list.length)],
                            }
                        }
                    ));
                }
                //blog_post
                data.push(...Data_Logic.get(Type.DATA_BLOG_POST,0,{test:true,count:9}));
                //user
                data.push(...Data_Logic.get(Type.DATA_USER,0,{test:true,count:9}));
                const [biz_error,biz_data] = await Portal.post_items(database,data);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data = biz_data;
                    Log.w('data',data);
                }
            },
            async function(call){
                let user_list = data.filter(item_find=>item_find.data_type===Type.DATA_USER);
                for(a = 0; a < review_count; a++){
                    data_2.push(Data_Logic.get(Type.DATA_REVIEW,0,
                        {test:true,
                            data:{
                                user_id:user_list[Num.get_id(user_list.length)].id,
                                parent_data_type:Type.DATA_BLANK,
                                parent_id:'1',
                            }
                        }
                    ));
                }
                const [biz_error,biz_data] = await Portal.post_items(database,data_2);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data_2 = biz_data;
                    Log.w('data_2',data_2);
                }
            },
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("POST-APP-ERROR-DONE",cloud_error);
                }else{
                    console.log('POST-APP-SUCCESS-DONE');
                }
                done();
            });
    });
});
//9_blank
describe('blank', function(){ this.timeout(25000);
    it("_blank", function(done){
        let cloud_error=null;
        console.log('BLANK-START');
        async.series([ function(call){
            let biz9_config = Scriptz.get_biz9_config();
            let parent = Data_Logic.get(new_data_type,0,{test:true});
            let post_data = {id:parent.id,data_type:parent.data_type,option:{}};
            let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
            axios.post(url, {
                post_data
            })
                .then(function (response) {
                    if(response.data.cloud_error){
                        cloud_error=Log.append(cloud_error,response.data.error);
                    }else{
                        Log.w('cloud',response.data);
                        console.log('BLANK-SUCCESS');
                    }
                    call();
                })
                .catch(function (error) {
                    cloud_error=Log.append(cloud_error,error);
                    call();
                });
        }
        ],
            function(error, result){
                if(cloud_error){
                    Log.error("BLANK-ERROR-DONE",cloud_error);
                }else{
                    console.log('BLANK-SUCCESS-DONE');
                }
                done();
            });
    });
});
