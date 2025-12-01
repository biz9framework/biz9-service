let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Admin,Business,Data,Database,Portal,Product_Data,Gallery_Data,Page_Data,Category_Data,Blog_Post_Data,Content_Data,Template_Data,Business_Data,Review_Data,Faq_Data,Favorite_Data,Service_Data,Event_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {DataType,DataItem,User_Logic,Favorite_Logic,App_Logic,Type}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Scriptz}=require("biz9-scriptz");
const {Project_Logic}=require("../project_logic");
const {Error,Log,Form,Str}=require("/home/think2/www/doqbox/biz9-framework/biz9-utility/code");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error={};
    let data="cms-ping";
    res.send({data:data});
    res.end();
});
//9_home
// - required_form_data = user_id
router.post('/home', function(req, res, next) {
    let error = null;
    let database,data = {};
    let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter();
    let app_dev_search_option = {fields:'id,title,title_url,type,category,image_filename,cost,featured,delivery_time,hot,category,rating_avg,review_count,view_count,is_favorite',get_favorite:true,user_id:req.body.data.user_id};
    let app_dev_search_explore_option = {get_field:true,fields:'id,title,title_url,type,category,image_filename,cost,featured,delivery_time,hot,category,rating_avg,review_count,view_count'};
    let option = req.body.data.option ? req.body.data.option : {get_field_value_list:true};
    //
    data.user = req.body.data.user_id ? DataItem.get_new(DataType.USER,req.body.data.user_id): User_Logic.get_guest();
    //
    data.page = DataItem.get_new(DataType.PAGE,0,{key:Type.PAGE_HOME});
    //
    data.favorite_list = [];
    //
    data.product_popular_list = [];
    data.product_latest_list = [];
    data.product_top_list = [];
    data.product_trending_list = [];
    //
    data.category_list = [];
    //
    data.category_product_title_list = [];
    //
    data.partner_list = [];
    //
    data.blog_post_list = [];
    //
    data.product_explore_list_1 = [];
    data.product_explore_list_2 = [];
    data.product_explore_list_3 = [];
    data.product_explore_list_4 = [];
    //
    data.faq_list = [];
    //
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,data.page.key,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //product_list - popular
        async function(call){
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{view_count:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_popular_list = biz_data.product_list;
            }
        },
        //product_list - latest
        async function(call){
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_latest_list =  biz_data.product_list;
            }
        },
        //product_list - rating_avg
        async function(call){
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter ,{rating_avg:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_top_list =  biz_data.product_list;
            }
        },
        //product_list - trending
        async function(call){
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter ,{date_create:-1,view_count:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_trending_list = biz_data.product_list;
            }
        },
        //category_list
        async function(call){
            let search = App_Logic.get_search(DataType.CATEGORY,{},{title:1},1,0);
            let option = {get_distinct:true,distinct_field:'title',distinct_sort:'asc',get_join:true,field_key_list:[{foreign_data_type:DataType.PRODUCT,foreign_field:'category',item_field:'title',title:'product_count',type:Type.COUNT}]};
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_list = biz_data.data_list;
                biz_data.data_list.forEach(item => {
                    data.category_product_title_list.push({title:item.title,count:Number(item.item_count),product_list:[]});
                });
            }
        },
        async function(call){
            data.category_product_title_list.sort((a, b) => b.count - a.count);
        },
        //category_product_title_list - 0
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_title_list[0].title);
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_title_list[0].product_list = biz_data.product_list;
            }
        },
        //category_product_title_list - 1
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_title_list[1].title);
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_title_list[1].product_list = biz_data.product_list;
            }
        },
        //category_product_title_list - 2
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_title_list[2].title);
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_title_list[2].product_list = biz_data.product_list;
            }
        },
        //category_product_title_list - 3
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_title_list[3].title);
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_title_list[3].product_list = biz_data.product_list;
            }
        },
        //category_product_title_list - 4
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_title_list[4].title);
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_title_list[4].product_list = biz_data.product_list;
            }
        },
        //category_product_title_list - 5
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_title_list[5].title);
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = app_dev_search_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_title_list[5].product_list = biz_data.product_list;
            }
        },
        //blog_post_list
        async function(call){
            let query = {};
            let search = App_Logic.get_search(DataType.BLOG_POST,query,{},1,12);
            let option = {get_field:true,fields:'id,title,title_url,category,date_create,image_filename,description,author'};
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_post_list = biz_data.blog_post_list;
            }
        },
        //product_explore_list_1
        async function(call){
            let query = {};
            query.category = data.category_product_title_list[6].title;
            let search = App_Logic.get_search(DataType.PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            let option = app_dev_search_explore_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_explore_list_1 = biz_data.product_list;
            }
        },
        //product_explore_list_2
        async function(call){
            let query = {};
            query.category = data.category_product_title_list[7].title;
            let search = App_Logic.get_search(DataType.PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            let option = app_dev_search_explore_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_explore_list_2 = biz_data.product_list;
           }
        },
        //product_explore_list_3
        async function(call){
            let query = {};
            query.category = data.category_product_title_list[8].title;
            let search = App_Logic.get_search(DataType.PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            let option = app_dev_search_explore_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_explore_list_3 = biz_data.product_list;
            }
        },
        //product_explore_list_4
        async function(call){
            let query = {};
            query.category = data.category_product_title_list[9].title;
            let search = App_Logic.get_search(DataType.PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            let option = app_dev_search_explore_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_explore_list_4 = biz_data.product_list;
            }
        },
        //product_explore_list_5
        async function(call){
            let query = {};
            query.category = data.category_product_title_list[10].title;
            let search = App_Logic.get_search(DataType.PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            let option = app_dev_search_explore_option;
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_explore_list_5 = biz_data.product_list;
            }
        },
        //partner_list
        async function(call){
            let key = 'partners';
            const [biz_error,biz_data] = await Content_Data.get(database,key,{get_item:true});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.partner_list = biz_data.items;
            }
        },

        /*
        //business review list
        //async function(call){
            //let query = {};
            //let search = App_Logic.get_search(DataType.REVIEW,query,{date_create:-1,date_create:-1},1,6);
            //const [biz_error,biz_data] = await Review_Data.get(database,DataType.PRODUCT,data.business.id,{date_create:-1},1,12);
            //if(biz_error){
                //error=Log.append(error,biz_error);
            //}else{
                //data.review_list = data.item_list;
            //}
        //},
        //faq_list
        async function(call){
            let query = {};
            let key = 'primary';
            const [biz_error,biz_data] = await Faq_Data.get(database,key,{question_count:6});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.faq_list = biz_data;
            }
        },
       */
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_faq
// - required_form_data = key
router.post('/faq', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.page = DataItem.get_new(DataType.PAGE,0);
    let option = req.body.data.option ? req.body.data.option : {get_field_value_list:true};
    data.faq_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_FAQ,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //faq_list
        async function(call){
            let query = {};
            let key = 'primary';
            const [biz_error,biz_data] = await Faq_Data.get(database,key,{question_count:99});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.faq_list = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
// - required_form_data = n/a
router.post('/about', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.about = DataItem.get_new(DataType.PAGE);
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            let key = Type.PAGE_ABOUT;
            const [biz_error,biz_data] = await Page_Data.get(database,key);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = data.item;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_contact
// - required_form_data = none
router.post('/contact', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.page = DataItem.get_new(DataType.PAGE);
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            let key = Type.PAGE_CONTACT;
            const [biz_error,biz_data] = await Page_Data.get(database,key);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_blog_post
// - required_form_data = key
router.post('/blog_post', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.BLOG_POST,{},{},1,6);
    data.blog_post = DataItem.get_new(DataType.BLOG_POST,0,{key:req.body.data.key,items:[],images:[]});
    data.blog_post_list = [];
    data.page = DataItem.get_new(DataType.BLOG_POST,0,{items:[],images:[]});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_BLOG_POST);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //blog_post
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.get(database,data.blog_post.key);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_post = biz_data;
            }
        },
        //blog_post_list
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_post_list = biz_data.blog_post_list;
            }
        },
        async function(call){
            data.blog_post_list.filter(item=>item.id!==data.blog_post.id);
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_blog_post_home
router.post('/blog_post_home', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.BLOG_POST,{},{},1,6);
    data.page  = DataItem.get_new(DataType.PAGE,0);
    data.blog_post_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_BLOG_POST_HOME);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
       //blog_post_list
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_post_list = biz_data.blog_post_list;
            }
        },
     ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_blog_post_search
// - required_form_data = search
router.post('/blog_post_search', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.BLOG_POST,{},{},1,6);
   data.blog_post_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //data_list
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_post_list=biz_data.blog_post_list;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_product_detail
// - required_form_data = key
router.post('/product', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {get_favorite:false,get_image:true,get_item:true,post_stat:false,user_id:0,get_field_value_list:true};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.PRODUCT,{},{},1,6);
    data.product = DataItem.get_new(DataType.PRODUCT,0,{key:req.body.data.key,items:[],images:[]});
    data.product_list = [];
    data.product_hosting_list = [];
    data.product_cms_list = [];
    data.review_list = [];
    data.page = DataItem.get_new(DataType.PRODUCT,0,{items:[],images:[]});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_PRODUCT,{get_item:true});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //product
        async function(call){
            const [biz_error,biz_data] = await Product_Data.get(database,data.product.key,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product = biz_data;
            }
        },
        //product_hosting
        async function(call){
            let key = "Hosting";
            let search = App_Logic.get_search(DataType.PRODUCT,{type:key},{title:-1},1,3);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_hosting_list = biz_data.product_list;
            }
        },
        //product_cms
        async function(call){
            let key = "Content Management System";
            let search = App_Logic.get_search(DataType.PRODUCT,{type:key},{title:-1},1,3);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_cms_list = biz_data.product_list;
            }
        },
        //product_list
        async function(call){
            let query = {};
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.product.category?data.product.category :"");
            let search = App_Logic.get_search(DataType.PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = {get_field:true,fields:'id,title,title_url,image_filename'};
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_list = biz_data.product_list;
                data.product_list.filter(item=>item.id!==data.product.id);
            }
        },
        //review_list
        async function(call){
            let query = {};
            const [biz_error,biz_data] = await Review_Data.get(database,data.product.data_type,data.product.id,{date_create:-1},1,0);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.review_list = biz_data.review_list;
            }
        }
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_product_home
router.post('/product_home', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.PRODUCT,{},{},1,6);
    data.page  = DataItem.get_new(DataType.PAGE,0);
    data.type_list = [];
    /*
    data.category_list = [];
    data.product_list = [];
    data.budget_list = [];
    */

    data.product_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_PRODUCT_HOME);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //type_list
        async function(call){
            let query = {};
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_type_product_query_filter();
            let search = App_Logic.get_search(DataType.TYPE,app_dev_search_query_filter,{date_create:-1},1,4);
            let option = {get_join:true,field_key_list:[{foreign_data_type:DataType.PRODUCT,foreign_field:'type',item_field:'title',title:'product_count',type:Type.COUNT}]};
            const [biz_error,biz_data] = await  Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.type_list = biz_data.data_list;
            }
        },
        //category_list
        async function(call){
            let query = {};
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter();
            let search = App_Logic.get_search(DataType.CATEGORY,app_dev_search_query_filter,{date_create:-1},1,0);
            let option = {get_join:true,get_distinct:true,distinct_field:'title',field_key_list:[{foreign_data_type:DataType.PRODUCT,foreign_field:'category',item_field:'title',title:'product_count',type:Type.COUNT}]};
            const [biz_error,biz_data] = await  Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_list = biz_data.data_list;
            }
        },
        /*
       //product_list
        async function(call){
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_list = biz_data.product_list;
            }
        },
        */
     ],
        function(err, result){
            //Log.w('page_home',data);
            res.send({error:error,data:data});
            res.end();
        });
});
//9_product_search
// - required_form_data = search
router.post('/product_search', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.PRODUCT,{},{},1,6);
   data.product_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //data_list
        async function(call){
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_list=biz_data.product_list;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
/*
//9_home //9_app
// - required_form_data = none
router.post('/', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {};
    data.category_list = [];
    data.product_list = [];
    data.type_list = [];
    data.budget_list = [];
    data.page = DataItem.get_new(DataType.PAGE,0);
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            let key = Type.PAGE_PRODUCT;
            const [biz_error,biz_data] = await Page_Data.get(database,key,{get_item:true});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //type_list
        async function(call){
            const [biz_error,biz_data] = await Portal.get(database,DataType.CUSTOM_FIELD,'application_type');
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                let application_type=biz_data;
                for(let a=0;a<5;a++){
                    if(application_type['field_'+a]){
                        data.type_list.push(DataItem.get_new(DataType.PRODUCT,1,{title:application_type['field_'+a]}));
                    }
                }
            }
        },
        //budget_list
        async function(call){
            data.budget_list.push(DataItem.get_new(DataType.BLANK,1,{title:'Any',sub_title:'',description:''}));
            data.budget_list.push(DataItem.get_new(DataType.BLANK,1,{title:'250',sub_title:'Value',description:'Under',}));
            data.budget_list.push(DataItem.get_new(DataType.BLANK,1,{title:'750',sub_title:'Mid-Range',description:'Under',}));
            data.budget_list.push(DataItem.get_new(DataType.BLANK,1,{title:'1500',sub_title:'High-End',description:'Under',}));
        },
        //type_item_list - count
        async function(call){
            let search = App_Logic.get_search(DataType.PRODUCT,{product_type:"Application"},{},1,0);
            let option = {group_parent_field:'title', group_child_field:'application_type'};
            let group_search = App_Logic.get_search(DataType.PRODUCT,{product_type:"Application"},{title:1},1,0);
            const [biz_error,biz_data] = await Data_Logic.get_child_list(database,data.type_list,group_search.data_type,group_search.filter,group_search.sort_by, group_search.page_current,group_search.page_size,option);
            data.type_list = data.item_list;
        },
        //product_list
        async function(call){
            let query = {category:'Application'};
            let search = App_Logic.get_search(DataType.CATEGORY,query,{title:1},1,0);
             let option = {
                get_item_count:true,
                item_count_data_type:DataType.PRODUCT,
                item_count_field:'category',
                item_count_value:'title',
             };
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_list=data.item_list;
            }
        },
        //category_list
        async function(call){
            let query = {category:'Application'};
            //here
            let search = App_Logic.get_search(DataType.CATEGORY,query,{title:1},1,13);
            let option = {
                get_item_count:true,
                item_count_data_type:DataType.PRODUCT,
                item_count_field:'category',
                item_count_value:'title',
            };
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_list=data.item_list;
                for(let a = 0; a < data.item_list.length;a++){
                    data.category_product_title_list.push({title:data.item_list[a].title,count:Number(data.item_list[a].item_count),items:[]});
                }
            }
        },
                ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
*/
//9_search
// - required_form_data = search_obj
router.post('/search', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {};
    if(APP_ENV !=App_Logic.TYPE_ENV_TEST){
        let user = User_Logic.get_request_user(req);
    }else{
        let user = DataItem.get_new(DataType.USER,USER_ID);
    }
    data.favorite_list = [];
    data.product_search = req.body.data.search;
    data.product_list = [];
    data.product_count = 0;
    data.product_page_count = 0;
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //favorite_list
        async function(call){
            if(!user.is_guest){
                const [biz_error,biz_data] = await Favorite_Data.get(database,DataType.PRODUCT,user.id,{date_create:-1},1,0);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.favorite_list = biz_data;
                }
            }
        },
        //product_list
        async function(call){
            const [biz_error,biz_data] = await Product_Data.search(database,data.product_search.filter,data.product_search.sort_by,data.product_search.page_current,data.product_search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_list=data.item_list;
                data.product_count=data.item_count;
                data.product_page_count=data.page_count;
                /*
                if(!user.is_guest){
                    if(data.favorite_list.length>0){
                        data.product_list = Favorite_Logic.get_favorite_by_list(data.favorite_list,data.product_list);
                    }
                }
                */
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});

//9_event
// - required_form_data = key
router.post('/event', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.EVENT,{},{},1,6);
    data.event = DataItem.get_new(DataType.EVENT,0,{key:req.body.data.key,items:[],images:[]});
    data.event_list = [];
    data.page = DataItem.get_new(DataType.EVENT,0,{items:[],images:[]});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_EVENT);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //event
        async function(call){
            const [biz_error,biz_data] = await Event_Data.get(database,data.event.key);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.event = biz_data;
            }
        },
        //event_list
        async function(call){
            const [biz_error,biz_data] = await Event_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.event_list = biz_data.event_list;
            }
        },
        async function(call){
            data.event_list.filter(item=>item.id!==data.event.id);
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_event_home
router.post('/event_home', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.EVENT,{},{},1,6);
    data.page  = DataItem.get_new(DataType.PAGE,0);
    data.event_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_EVENT_HOME);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
       //event_list
        async function(call){
            const [biz_error,biz_data] = await Event_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.event_list = biz_data.event_list;
            }
        },
     ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_event_search
// - required_form_data = search
router.post('/event_search', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.EVENT,{},{},1,6);
   data.event_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //data_list
        async function(call){
            const [biz_error,biz_data] = await Event_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.event_list=biz_data.event_list;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_review_home
router.post('/review_home',function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    data.page  = DataItem.get_new(DataType.PAGE,0);
    data.testimonial_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_REVIEW_HOME);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
       //gallery_list
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallery_list = biz_data.gallery_list;
            }
        },
     ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});


//9_gallery
// - required_form_data = key
router.post('/gallery', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.GALLERY,{},{},1,6);
    data.gallery = DataItem.get_new(DataType.GALLERY,0,{key:req.body.data.key,items:[],images:[]});
    data.gallery_list = [];
    data.page = DataItem.get_new(DataType.GALLERY,0,{items:[],images:[]});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_GALLERY);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //gallery
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.get(database,data.gallery.key);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallery = biz_data;
            }
        },
        //gallery_list
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallery_list = biz_data.gallery_list;
            }
        },
        async function(call){
            data.gallery_list.filter(item=>item.id!==data.gallery.id);
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_gallery_home
router.post('/gallery_home', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.GALLERY,{},{},1,6);
    data.page  = DataItem.get_new(DataType.PAGE,0);
    data.gallery_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_GALLERY_HOME);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
       //gallery_list
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallery_list = biz_data.gallery_list;
            }
        },
     ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});

//9_gallery_search
// - required_form_data = search
router.post('/gallery_search', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.GALLERY,{},{},1,6);
   data.gallery_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //data_list
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallery_list=biz_data.gallery_list;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_service
// - required_form_data = key
router.post('/service', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.SERVICE,{},{},1,6);
    data.service = DataItem.get_new(DataType.SERVICE,0,{key:req.body.data.key,items:[],images:[]});
    data.service_list = [];
    data.page = DataItem.get_new(DataType.SERVICE,0,{items:[],images:[]});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_SERVICE);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //service
        async function(call){
            const [biz_error,biz_data] = await Service_Data.get(database,data.service.key);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.service = biz_data;
            }
        },
        //service_list
        async function(call){
            const [biz_error,biz_data] = await Service_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.service_list = biz_data.service_list;
            }
        },
        async function(call){
            data.service_list.filter(item=>item.id!==data.service.id);
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_service_home
router.post('/service_home', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.SERVICE,{},{},1,6);
    data.page  = DataItem.get_new(DataType.PAGE,0);
    data.service_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //page
        async function(call){
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_SERVICE_HOME);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
       //service_list
        async function(call){
            const [biz_error,biz_data] = await Service_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.service_list = biz_data.service_list;
            }
        },
     ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_service_search
// - required_form_data = search
router.post('/service_search', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.data.option ? req.body.data.option : {};
    let search = req.body.data.search ? req.body.data.search : App_Logic.get_search(DataType.SERVICE,{},{},1,6);
   data.service_list = [];
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [biz_error,biz_data] = await Database.get(biz9_config);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //data_list
        async function(call){
            const [biz_error,biz_data] = await Service_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.service_list=biz_data.service_list;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});






module.exports = router;
