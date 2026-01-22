let express=require('express');
let router=express.Router();
/* -- biz9_start -- */
const {Database,Page_Data,Portal,Product_Data,Blog_Post_Data,Faq_Data,Review_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/code");
const {Type,User_Logic,Data_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-logic/code");
const {Scriptz}=require("biz9-scriptz");
const {Project_Logic}=require("../project_logic");
const {Log}=require("biz9-utility");
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
    let app_dev_field ={field:{id:1,title:1,title_url:1,type:1,category:1,image_filename:1,cost:1,featured:1,delivery_time:1,hot:1,rating_avg:1,review_count:1,view_count:1}};
    let option = req.body.option ? req.body.option : {field_value:true};
    //next
    let app_dev_search_option ={field:{id:1,title:1,title_url:1,type:1,category:1,image_filename:1,cost:1,featured:1,delivery_time:1,hot:1,rating_avg:1,review_count:1,view_count:1}};
    //
    data.user = req.body.user_id ? Data_Logic.get(Type.DATA_USER,req.body.user_id): User_Logic.get_guest();
    //
    data.page = Data_Logic.get(Type.DATA_PAGE,'home');
    //
    data.favorites = [];
    //
    data.popular_products = [];
    data.latest_products = [];
    data.top_products = [];
    data.trending_products = [];
    //
    data.categorys = [];
    //
    data.category_product_titles = [];
    //
    data.blog_posts = [];
    //
    data.products_explore_1 = [];
    data.products_explore_2 = [];
    data.products_explore_3 = [];
    data.products_explore_4 = [];
    data.products_explore_5 = [];
    //
    data.reviews = [];
    //
    data.faqs = [];
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
            let option_page = {id_field:Type.FIELD_TITLE_URL};
            const [biz_error,biz_data] = await Page_Data.get(database,data.page.id,option_page);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //products - popular
        async function(call){
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{view_count:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{view_count:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.popular_products = biz_data.products;
            }
        },
        //products - latest
        async function(call){
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.latest_products =  biz_data.products;
            }
        },
        //products - rating_avg
        async function(call){
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter ,{rating_avg:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{} ,{rating_avg:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.top_products =  biz_data.products;
            }
        },
        //products - trending
        async function(call){
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter ,{date_create:-1,view_count:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{} ,{date_create:-1,view_count:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.trending_products = biz_data.products;
            }
        },
        //categorys
        async function(call){
            let foreign_search_1 = Data_Logic.get_search_foreign(Type.TITLE_COUNT,Type.DATA_PRODUCT,Type.FIELD_CATEGORY,Type.FIELD_TITLE,{field:{id:1},title:'product_count'});
            let option_category = {foreigns:[foreign_search_1],distinct:{field:'title'},field:{title:1,title_url:1,product_count:1}};
            let search = Data_Logic.get_search(Type.DATA_CATEGORY,{category:Type.DATA_PRODUCT},{title:1},1,0);
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option_category);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.categorys = biz_data.items;
            }
        },
        async function(call){
            data.category_product_titles.sort((a, b) => b.count - a.count);
        },
        //category_product_titles - 0
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_titles[0].title);
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_titles[0].products = biz_data.products;
            }
        },
        //category_product_titles - 1
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_titles[1].title);
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_titles[1].products = biz_data.products;
            }
        },
        //category_product_titles - 2
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_titles[2].title);
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_titles[2].products = biz_data.products;
            }
        },
        //category_product_titles - 3
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_titles[3].title);
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_titles[3].products = biz_data.products;
            }
        },
        //category_product_titles - 4
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_titles[4].title);
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_titles[4].products = biz_data.products;
            }
        },
        //category_product_titles - 5
        async function(call){
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.category_product_titles[5].title);
            //let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_search_option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.category_product_titles[5].products = biz_data.products;
            }
        },
        //blog_posts
        async function(call){
            let search = Data_Logic.get_search(Type.DATA_BLOG_POST,{},{},1,12);
            let option_blog = {field:{id:1,title:1,title_url:1,category:1,date_create:1,image_filename:1,description:1,author:1}};
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option_blog);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_posts = biz_data.blog_posts;
            }
        },
        //products_explore_1
        async function(call){
            let query = {};
            query.category = data.category_product_titles[6].title;
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{date_create:-1},1,6);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_field);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products_explore_1 = biz_data.products;
            }
        },
        //products_explore_2
        async function(call){
            let query = {};
            query.category = data.category_product_titles[7].title;
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_field);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products_explore_2 = biz_data.products;
            }
        },
        //products_explore_3
        async function(call){
            let query = {};
            query.category = data.category_product_titles[8].title;
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_field);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products_explore_3 = biz_data.products;
            }
        },
        //products_explore_4
        async function(call){
            let query = {};
            query.category = data.category_product_titles[9].title;
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_field);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products_explore_4 = biz_data.products;
            }
        },
        //products_explore_5
        async function(call){
            let query = {};
            query.category = data.category_product_titles[10].title;
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,query,{date_create:-1,date_create:-1},1,6);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,app_dev_field);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products_explore_5 = biz_data.products;
            }
        },
        //business reviews
        async function(call){
            const [biz_error,biz_data] = await Review_Data.get(database,Type.DATA_PRODUCT,'1',{date_create:-1},1,12);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.reviews = biz_data.reviews;
            }
        },
        //faqs
        async function(call){
            let query = {};
            let key = 'primary';
            const [biz_error,biz_data] = await Faq_Data.get(database,key,{question_count:6});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.faqs = biz_data;
            }
        },
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
    data.page = Data_Logic.get(Type.DATA_PAGE,0);
    let option = req.body.option ? req.body.option : {field_value:true};
    data.faqs = [];
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
        //faqs
        async function(call){
            let query = {};
            let key = 'primary';
            const [biz_error,biz_data] = await Faq_Data.get(database,key,{question_count:99});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.faqs = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_about
// - required_form_data = n/a
router.post('/about', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.page = Data_Logic.get(Type.DATA_PAGE,0);
    let option = req.body.option ? req.body.option : {field_value:true};
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
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_ABOUT,option);
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
//9_contact
// - required_form_data = none
router.post('/contact', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.page = Data_Logic.get(Type.DATA_PAGE,0);
    let option = req.body.option ? req.body.option : {field_value:true};
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
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_CONTACT,option);
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_BLOG_POST,{},{},1,6);
    data.blog_post = Data_Logic.get(Type.DATA_BLOG_POST,0,{data:{key:req.body.key}});
    data.blog_posts = [];
    data.page = Data_Logic.get(Type.DATA_BLOG_POST,0);
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
        //blog_posts
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_posts = biz_data.blog_posts;
            }
        },
        async function(call){
            data.blog_posts = data.blog_posts.filter(item=>item.id!==data.blog_post.id);
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_BLOG_POST,{},{},1,6);
    data.page  = Data_Logic.get(Type.DATA_PAGE,0);
    data.blog_posts = [];
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
        //blog_posts
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_posts = biz_data.blog_posts;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_BLOG_POST,{},{},1,6);
    data.blog_posts = [];
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
        //items
        async function(call){
            const [biz_error,biz_data] = await Blog_Post_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.blog_posts=biz_data.blog_posts;
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
    let option = req.body.option ? req.body.option : {get_favorite:false,get_image:true,get_item:true,post_stat:false,user_id:0,field_value:true};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,6);
    data.product = Data_Logic.get(Type.DATA_PRODUCT,0,{data:{key:req.body.key}});
    data.products = [];
    data.hosting_products = [];
    data.cms_products = [];
    data.reviews = [];
    data.page = Data_Logic.get(Type.DATA_PRODUCT,0);
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
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{type:key},{title:-1},1,3);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.hosting_products = biz_data.products;
            }
        },
        //product_cms
        async function(call){
            let key = "Content Management System";
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,{type:key},{title:-1},1,3);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.cms_products = biz_data.products;
            }
        },
        //products
        async function(call){
            let query = {};
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter(data.product.category?data.product.category :"");
            let search = Data_Logic.get_search(Type.DATA_PRODUCT,app_dev_search_query_filter,{date_create:-1},1,12);
            let option = {get_field:true,fields:'id,title,title_url,image_filename'};
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products = biz_data.products;
                data.products.filter(item=>item.id!==data.product.id);
            }
        },
        //reviews
        async function(call){
            let query = {};
            const [biz_error,biz_data] = await Review_Data.get(database,data.product.data_type,data.product.id,{date_create:-1},1,0);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.reviews = biz_data.reviews;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,6);
    data.page  = Data_Logic.get(Type.DATA_PAGE,0);
    data.types = [];
    /*
    data.categorys = [];
    data.products = [];
    */

    data.products = [];
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
        //types
        async function(call){
            let query = {};
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_type_product_query_filter();
            let search = Data_Logic.get_search(Type.DATA_TYPE,app_dev_search_query_filter,{date_create:-1},1,4);
            let option = {get_join:true,field_keys:[{foreign_data_type:Type.DATA_PRODUCT,foreign_field:'type',item_field:'title',title:'product_count',type:Type.COUNT}]};
            const [biz_error,biz_data] = await  Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.types = biz_data.items;
            }
        },
        //categorys
        async function(call){
            let query = {};
            let app_dev_search_query_filter = Project_Logic.get_query_application_development_product_type_query_filter();
            let search = Data_Logic.get_search(Type.DATA_CATEGORY,app_dev_search_query_filter,{date_create:-1},1,0);
            let option = {get_join:true,get_distinct:true,distinct_field:'title',field_keys:[{foreign_data_type:Type.DATA_PRODUCT,foreign_field:'category',item_field:'title',title:'product_count',type:Type.COUNT}]};
            const [biz_error,biz_data] = await  Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.categorys = biz_data.items;
            }
        },
        /*
        //products
        async function(call){
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products = biz_data.products;
            }
        },
        */
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_product_search
// - required_form_data = search
router.post('/product_search', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,6);
    data.products = [];
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
        //items
        async function(call){
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products=biz_data.products;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_search
// - required_form_data = search_obj
router.post('/search', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {};
    if(APP_ENV !=App_Logic.TYPE_ENV_TEST){
        let user = User_Logic.get_request_user(req);
    }else{
        let user = Data_Logic.get(Type.DATA_USER,USER_ID);
    }
    data.favorites = [];
    data.product_search = req.body.search;
    data.products = [];
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
        //favorites
        async function(call){
            if(!user.is_guest){
                const [biz_error,biz_data] = await Favorite_Data.get(database,Type.DATA_PRODUCT,user.id,{date_create:-1},1,0);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.favorites = biz_data;
                }
            }
        },
        //products
        async function(call){
            const [biz_error,biz_data] = await Product_Data.search(database,data.product_search.filter,data.product_search.sort_by,data.product_search.page_current,data.product_search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.products=data.items;
                data.product_count=data.item_count;
                data.product_page_count=data.page_count;
                /*
                if(!user.is_guest){
                    if(data.favorites.length>0){
                        data.products = Favorite_Logic.get_favorite_by_list(data.favorites,data.products);
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_EVENT,{},{},1,6);
    data.event = Data_Logic.get(Type.DATA_EVENT,0,{data:{key:req.body.key}});
    data.events = [];
    data.page = Data_Logic.get(Type.DATA_EVENT,0);
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
        //events
        async function(call){
            const [biz_error,biz_data] = await Event_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.events = biz_data.events;
            }
        },
        async function(call){
            data.events.filter(item=>item.id!==data.event.id);
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_EVENT,{},{},1,6);
    data.page  = Data_Logic.get(Type.DATA_PAGE,0);
    data.events = [];
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
        //events
        async function(call){
            const [biz_error,biz_data] = await Event_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.events = biz_data.events;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_EVENT,{},{},1,6);
    data.events = [];
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
        //items
        async function(call){
            const [biz_error,biz_data] = await Event_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.events=biz_data.events;
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
    let search = req.body.search;
    let option = req.body.option ? req.body.option : {};
    data.reviews = [];
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
        //reviews
        async function(call){
            const [biz_error,biz_data] = await Review_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.reviews = biz_data.reviews;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_GALLERY,{},{},1,6);
    data.gallery = Data_Logic.get(Type.DATA_GALLERY,0,{data:{key:req.body.key}});
    data.gallerys = [];
    data.page = Data_Logic.get(Type.DATA_GALLERY,0);
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
        //gallerys
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallerys = biz_data.gallerys;
            }
        },
        async function(call){
            data.gallerys.filter(item=>item.id!==data.gallery.id);
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
    let option = req.body.option ? req.data.option : {};
    let search = req.body.search ? req.data.search : Data_Logic.get_search(Type.DATA_GALLERY,{},{},1,6);
    data.page  = Data_Logic.get(Type.DATA_PAGE,0);
    data.gallerys = [];
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
        //gallerys
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallerys = biz_data.gallerys;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_GALLERY,{},{},1,6);
    data.gallerys = [];
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
        //items
        async function(call){
            const [biz_error,biz_data] = await Gallery_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.gallerys=biz_data.gallerys;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_SERVICE,{},{},1,6);
    data.service = Data_Logic.get(Type.DATA_SERVICE,0,{data:{key:req.body.key}});
    data.services = [];
    data.page = Data_Logic.get(Type.DATA_SERVICE,0);
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
        //services
        async function(call){
            const [biz_error,biz_data] = await Service_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.services = biz_data.services;
            }
        },
        async function(call){
            data.services.filter(item=>item.id!==data.service.id);
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_SERVICE,{},{},1,6);
    data.page  = Data_Logic.get(Type.DATA_PAGE,0);
    data.services = [];
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
        //services
        async function(call){
            const [biz_error,biz_data] = await Service_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.services = biz_data.services;
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
    let option = req.body.option ? req.body.option : {};
    let search = req.body.search ? req.body.search : Data_Logic.get_search(Type.DATA_SERVICE,{},{},1,6);
    data.services = [];
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
        //items
        async function(call){
            const [biz_error,biz_data] = await Service_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.services=biz_data.services;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_login
// - required_form_data = n/a
router.post('/login', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.page = Data_Logic.get(Type.DATA_PAGE,0);
    let option = req.body.option ? req.body.option : {field_value:true};
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
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_LOGIN,option);
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


//9_blank
// - required_form_data = n/a
router.post('/blank', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.page = Data_Logic.get(Type.DATA_PAGE,0);
    //let option = req.body.option ? req.body.option : {field_value:true};
    let option = req.body.option ? req.body.option : {};
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
            const [biz_error,biz_data] = await Page_Data.get(database,Type.PAGE_BLANK,option);
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

module.exports = router;
