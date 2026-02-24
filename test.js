async = require('async')
const axios = require('axios');
const assert = require('node:assert');
const {Database,Data} = require(".");
const {Log,Num,Str} = require("biz9-utility");
const {Store_Field,Store_Type,Store_Table,Store_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-store/source");
const {Cart_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-store-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Data_Logic,Data_Value_Type,Data_Table,Data_Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Website_Logic,Url}=require("/home/think1/www/doqbox/biz9-framework/biz9-website/source");

/*
 * availble tests
- connect
- post_user
*/
//-env-test - start //
let APP_ID = "test-stage-feb23";
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

                //-- FAVORITE-POST START --//
                let option = {};
                let parent = Data_Logic.get(Data_Table.BLANK,'247');
                let favorite = Favorite_Logic.get_search(Data_Table.BLANK,{},{},1,0);
                let post_data = {search:search,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.SEARCH);
                //-- FAVORITE-POST END --//

                //-- DATA-SEARCH START --//
                /*
                let option = {};
                let search = Data_Logic.get_search(Data_Table.BLANK,{},{},1,0);
                let post_data = {search:search,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.SEARCH);
                */
                //-- DATA-SEARCH END --//

                //-- DATA-COPY START --//
                /*
                let option = {};
                // -- parent --
                let parent = Data_Logic.get(Data_Table.BLANK,'247');
                let post_data = {id:parent.id,table:parent.table,data:parent,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.COPY);
                */
                //-- DATA-COPY END --//

                //-- DATA-DELETE-SEARCH START --//
                /*
                let option = {};
                let search = Data_Logic.get_search(Data_Table.BLANK,{},{},1,0);
                let post_data = {search:search,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.DELETE_SEARCH);
                */
                //-- DATA-DELETE-SEARCH END --//

                //-- DATA-DELETE START --//
                /*
                let option = {};
                let parent = Data_Logic.get(Data_Table.BLANK,'420');
                let post_data = {id:parent.id,table:parent.table,data:parent,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.DELETE);
                */
                //-- DATA-DELETE END --//

                //-- DATA-POST-ITEMS START --//
                /*
                let option = {};
                let parent_items = Data_Logic.get(Data_Table.BLANK,'0',{count:5});
                let post_data = {data:parent_items,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST_ITEMS);
                */
                //-- DATA-POST-ITEMS END --//

                //-- DATA-GET START --//
                /*
                let option = {};
                let parent = Data_Logic.get(Data_Table.BLANK,'420');
                //let post_data = {id:parent.id,table:parent.table,data:parent,option:option};
                //let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.GET);
                */
                //-- DATA-GET END --//

                //-- DATA-POST START --//
               /*
                let option = {};
                let parent = Data_Logic.get(Data_Table.BLANK,0,{data:{apple:'cool',butter:'bean'}});
                let post_data = {id:parent.id,table:parent.table,data:parent,option:option};
                let url = Website_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
                */
                //-- DATA-POST END --//

                //-- PRINT START --//
                Log.w('66_post_data',post_data);
                Log.w('66_url',url);
                //-- PRINT END --//

                //-- SERVICE-POST START --//
                axios.post(url,
                    post_data
                )
                .then(function (response) {
                    Log.w('post_data',response.data);
                    console.log('CONNECT-SUCCESS');
                    call();
                })
                .catch(function (error) {
                    console.log('CONNECT-END');
                });
                //-- SERVICE-POST END --//
   // -- POST-START --//
                /*
                let option = {};
                // -- parent --
                //Log.w('33_parent',parent);
                //let parent = Data_Logic.get(Project_Table.PRODUCT,0);
                //const [error,biz_data] = await Data.post(database,parent.table,parent,option);
                // -- sub items --
                //let sub_items = Data_Logic.get(Project_Table.BLANK,0,{count:10,parent:parent,data:{field_1:'value_'+Num.get_id(),field_2:'value_'+Num.get_id()}});
                let sub_items = Data_Logic.get(Project_Table.PRODUCT,0,{count:10,data:Store_Logic.get_test_product()});
                //let sub_items = Data_Logic.get(Project_Table.PRODUCT,0,{count:1,data:User_Logic.get_test_user()});
                const [error,biz_data] = await Data.post_items(database,sub_items);
                */
                // -- POST-END --//
                //-- GET START --//
                /*
                    //let foreign_2 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.IMAGE,Data_Field.PARENT_ID,Field.ID,{title:'images'});
                    //let join_search_1 = Data_Logic.get_search(Project_Table.BLANK,{},{},1,0,{});
                    //let join_1 = Data_Logic.get_join(Data_Value_Type.ITEMS,join_search_1,{foreigns:[foreign_2]});
                    //let foreign_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.BLANK,Data_Field.PARENT_ID,Field.ID);
                    //let group_1 = Data_Logic.get_group({foreigns:[foreign_2]});//Data_Logic.get_group();
                let option = {};
                //let option = {joins:[join_1]};//{groups:[group_1]};//{foreigns:[foreign_1]};
                let parent = Data_Logic.get(Project_Table.PRODUCT,'833');
                const [error,biz_data] = await Data.get(database,parent.table,parent.id,option);
                */
                //-- GET END --//
                //-->
                //-- SEARCH START --//
                /*
                let join_search_1 = Data_Logic.get_search(Project_Table.BLANK,{},{},1,0,{});
                let join_1 = Data_Logic.get_join(Data_Value_Type.ITEMS,join_search_1);
                let foreign_1 = Data_Logic.get_foreign(Data_Value_Type.ITEMS,Project_Table.BLANK,Data_Field.PARENT_ID,Field.ID);
                let group_1 = Data_Logic.get_group();
                let option = {groups:[group_1]};//{joins:[join_1],foreigns:[foreign_1]};
                */
                //let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                //const [error,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                //const [error,biz_data] = await Data.count(database,search.table,search.filter);
                //-- SEARCH START --//
                // -- DELETE-START --//
                /*
                let option = {};
                // -- parent --
                //let parent = Data_Logic.get(Project_Table.PRODUCT,'255');
                //const [error,biz_data] = await Data.delete(database,parent.table,parent.id,option);
                let search = Data_Logic.get_search(Project_Table.PRODUCT,{},{},1,0,{});
                const [error,biz_data] = await Data.delete_search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
                */
                // -- DELETE-END --//


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
        let product_count = 90;
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
                let type_list = ['Admin Panel','Landing Page','Mobile','Website','Hosting','Content Management System'];
                let delivery_time = ['1 week','3 weeks','1 month','1 year'];
                let category_list = ['Beauty','Church','Fashion','Food Trucks','Health Care','Music','Pets','Services','Service Repair','Sports','Transportation'];
                let featured_list = ['true','false'];
                let hot_list = ['true','false'];
                //template
                data.push(Data_Logic.get(Type.DATA_TEMPLATE,0,{title:Str.get_title(Type.TEMPLATE_PRIMARY)}));
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
                               view_post:Num.get_id(999),
                               order_post:Num.get_id(999),
                               favorite_post:Num.get_id(999),
                               review_post:Num.get_id(999),
                               rating_avg:Num.get_id(5),
                                /*
                                category:'Category 1',
                                delivery_time:'1 week',
                                type:'My Cool Type',
                                featured:true,
                                hot:true
                                */

                                category:category_list[Num.get_id(category_list.length)],
                                delivery_time:delivery_time[Num.get_id(delivery_time.length)],
                                type:type_list[Num.get_id(type_list.length)],
                                featured:featured_list[Num.get_id(featured_list.length)],
                                hot:hot_list[Num.get_id(hot_list.length)]
                            }
                        }
                    ));
                }
                //blog_post
                data.push(...Data_Logic.get(Type.DATA_BLOG_POST,0,{test:true,count:9}));
                //user
                data.push(Data_Logic.get(Type.DATA_USER,0,{test:true,data:{role:Type.USER_ROLE_SUPER_ADMIN,email:'ceo@bossappz.com',password:'123456789Ab!'}}));
                const [biz_error,biz_data] = await Portal.post_items(database,data);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data = biz_data;
                }
            },
            //review
            async function(call){
                let user_list = data.filter(item_find=>item_find.data_type===Type.DATA_USER);
                for(a = 0; a < review_count; a++){
                    data_2.push(Data_Logic.get(Type.DATA_REVIEW,0,
                        {test:true,
                            data:{
                                user_id:user_list[Num.get_id(user_list.length)].id,
                                parent_data_type:Type.DATA_PRODUCT,
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
