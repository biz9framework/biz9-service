let express=require('express');
let router=express.Router();
/* -- biz9-start -- */
const {Scriptz}=require("biz9-scriptz");
const {Portal,Database,Page_Data,Stat_Data,Data_Logic,Stat_Logic,Content_Data,Review_Data,Favorite_Data,Product_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {DataType,DataItem,User_Logic,App_Logic,Review_Logic,Favorite_Logic,Type}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Log,Form,Str,Num}=require("biz9-utility");
const stripe = require('stripe')('sk_test_51RkvILBLx49RFzHwqq12TwN0zYMBUbQEbmpVsNapnyIlkgtLL4TUCKSqI6lTx4IGdHRxggScXRyg9pzZu8tJPxEQ00s7YEtaQt');
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error={};
    let data="product-ping";
    console.log(data);
    res.send({error:biz_error,biz_data:data});
    res.end();
});
//9_detail
// - required_form_data = key
router.post('/detail', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {product:DataItem.get_new(DataType.PRODUCT,0,{key:req.body.data.key}),page:DataItem.get_new(DataType.PAGE,0),product_list:[]};
    let option = req.body.data.option ? req.body.data.option : {};
    data.product_sub_hosting_type_list = [];
    data.product_sub_cms_type_list = [];
    data.product_list = [];
    data.review_list = [];
    async.series([
        async function(call){
            console.log('1111111111111');
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
            let key = Type.PAGE_PRODUCT_DETAIL;
            const [biz_error,biz_data] = await Page_Data.get(database,key,{get_item:true});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.page = biz_data;
            }
        },
        //product
        async function(call){
            const [biz_error,biz_data] = await Product_Data.get(database,data.product.key,{get_image:true,get_item:true});
            if(biz_error){
                Log.w('biz_data_product',biz_data);
                error=Log.append(error,biz_error);
            }else{
                data.product = biz_data;
            }
            Log.w('data',data);
        },
        /*
        //post_item_view_count
        async function(call){
            let stat = Stat_Logic.get_new(cloud.product.data_type,let user.id,Stat_Logic.TYPE_STAT_VIEW,[DataItem.get_new(DataType.STAT,0,{item_data_type:cloud.product.data_type,item_id:cloud.product.id})]);
            const [biz_error,biz_data] = await Stat_Data.post(database,stat.item_data_type,stat.user_id,stat.stat_type_id,stat.item_list,{});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                   cloud.stat_new = data.stat_new;
                   cloud.stat_count = data.stat_count;
                   cloud.stat_item_list = data.stat_item_list;
                   cloud.stat_item_list = data.stat_item_list;
            }
        },
        //review_list
        async function(call){
            if(!Str.check_is_null(cloud.product.id)){
                let search = App_Logic.get_search(DataType.REVIEW,Review_Logic.get_search_filter(cloud.product.data_type,cloud.product.id),{date_create:-1},1,0);
                const [biz_error,biz_data] = await Review_Data.get(database,data.product.data_type,cloud.product.id,search.sort_by,search.page_current,search.page_size);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    cloud.review_list=data.item_list;
                    cloud.review_count=data.item_count;
                    cloud.review_page_count=data.page_count;
                }
            }
        },
        */
        /*
        //product_hosting_type
        async function(call){
            let key = "product_hosting_type";
            const [biz_error,biz_data] = await Content_Data.get(database,key,{get_item:true});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_sub_hosting_type_list = data.items;
            }
        },
        //product_cms_type
        async function(call){
            let key = "product_cms_type";
            const [biz_error,biz_data] = await Content_Data.get(database,key,{get_item:true});
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_sub_cms_type_list = data.items;
            }
        },
        //product_list
        async function(call){
            let query = { $and:[
                { application_type: { $regex:data.product.application_type, $options: "i" } },
                { category: { $regex:data.product.category, $options: "i" } }
            ] };
            let search = App_Logic.get_search(DataType.PRODUCT,query,{title:1},1,12);
            const [biz_error,biz_data] = await Product_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.product_list=data.product_list;
            }
        },
        */
     ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
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
                if(!user.is_guest){
                    if(data.favorite_list.length>0){
                        data.product_list = Favorite_Logic.get_favorite_by_list(data.favorite_list,data.product_list);
                    }
                }
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
