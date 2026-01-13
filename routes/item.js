let express=require('express');
let router=express.Router();
const path = require('path');
//const FormData = require('form-data');
/* -- biz9_start -- */
const {Portal,Database,Favorite_Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/code");
const {Data_Logic,App_Logic,Favorite_Logic,Type,Field_Logic}=require("biz9-logic");
const {Scriptz}=require("biz9-scriptz");
const {Log,Str,Num}=require("biz9-utility");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error=null;
    let data="cms-ping";
    res.send({data:data});
    res.end();
});
//9_get_custom_field -- 9_custom_field
//required form_data = data_type, id
router.post('/custom_field', function(req, res, next) {
    let error = null;
    let database = {};
    let option = req.body.option ? req.body.option : {};
    data.org_custom_fields = [];
    data.custom_fields = [];
    data.item=Data_Logic.get(req.data.data_type,{data:req.body.id});
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
        async function(call){
            const [biz_error,biz_data] = await Portal.get(database,data.item.data_type,data.item.id);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.item = biz_data;
            }
        },
        async function(call){
            let search = Data_Logic.get_search(Type.DATA_CUSTOM_FIELD,{category_type:data.item.item_data_type?data.item.item_data_type:data.item.data_type},{},1,0);
            const [biz_error,biz_data] = await Portal.search(database,search.data_type,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.org_custom_fields = biz_data.items;
            }
        },
        async function(call){
            for(let a=0;a<data.org_custom_fields.length;a++){
                let custom_field = {
                    key: Num.get_id(333),
                    title:data.org_custom_fields[a].title,
                    selected:data.item[Str.get_title_url(data.org_custom_fields[a].title.toLowerCase())],
                    items:[],
                };
                for(let b=0;b<19;b++){
                    if(!Str.check_is_null(data.org_custom_fields[a]['field_'+b]))   {
                        custom_field.items.push(
                            {
                                label:data.org_custom_fields[a]['field_'+b],
                                value:JSON.stringify({
                                    key:custom_field.key,
                                    field: Str.get_title_url(data.org_custom_fields[a].title.toLowerCase()),
                                    title:data.org_custom_fields[a].title,
                                    value:data.org_custom_fields[a]['field_'+String(b)]
                                })
                            });
                    }
                }
                data.custom_fields.push(custom_field);
            }
        },
    ],
        function(err,result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_delete_cart - 9_cart
// - required form_data = id
router.post('/cart_delete', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.data.option ? req.data.option : {};
    data.cart = Data_Logic.get(Type.DATA_CART,req.body.id);
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
        async function(call){
            const [biz_error,biz_data] = await Cart_Data.delete(database,data.cart.id,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }
            data.cart = biz_data;
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_get_cart - 9_cart - 9_cart_get - 9_get_cart
// - required form_data = cart_number
router.post('/cart', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.cart = Data_Logic.get(Type.DATA_CART,0,{data:{cart_number:req.data.cart_number}});
    let option = req.body.option ? req.data.option : {};
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
        async function(call){
            const [biz_error,biz_data] = await Cart_Data.get(database,data.cart.cart_number,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }
            data.cart = biz_data;
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_post_cart - 9_cart - 9_cart_post
// - required form_data = cart
router.post('/cart_post', function(req, res, next) {
    let error = null;
    let database,data = {};
    let post_cart = req.body.cart;
    let option = req.body.option ? req.body.option : {};
    data = Data_Logic.get(Type.DATA_CART,0);
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
        async function(call){
            const [biz_error,biz_data] = await Cart_Data.post(database,post_cart,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
            data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_order_post - 9_order - 9_order_post
// - required form_data = data_order
router.post('/order_post', function(req, res, next) {
    let error = null;
    let database,data = {};
    let post_order = req.body.order;
    let post_order_payments = req.body.order_payments;
    let option = req.body.option ? req.data.option : {};
    data = Data_Logic.get(Type.DATA_ORDER,0);
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
        async function(call){
            const [biz_error,biz_data] = await Order_Data.post(database,post_order,post_order_payments,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_order_delete - 9_order
// - required form_data = id
router.post('/order_delete', function(req, res, next) {
    let error = null;
    let database,data = {};
    let delete_order = Data_Logic.get(Type.DATA_ORDER,req.body.id);
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
        async function(call){
            const [biz_error,biz_data] = await Order_Data.delete(database,delete_order.id,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }
            data.order = biz_data;
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_get_order - 9_order - 9_order_get
// - required form_data = order_number
router.post('/order', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.order = Data_Logic.get(Type.DATA_ORDER,0,{data:{order_number:req.body.order_number}});
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
        async function(call){
            const [biz_error,biz_data] = await Order_Data.get(database,data.order.order_number,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }
            data = biz_data;
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_favorite_post
// - required form_data = parent_data_type,parent_id,user_id
router.post('/favorite_post', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.option ? req.body.option : {};
    data.is_unique = false;
    data.favorite = Favorite_Logic.get_new(req.body.parent_data_type,req.body.parent_id,req.body.user_id);
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
        async function(call){
            const [biz_error,biz_data] = await Favorite_Data.post(database,data.favorite.parent_data_type,data.favorite.parent_id,data.favorite.user_id,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.favorite = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_review_post
// - required form_data = parent_data_type, parent_id, review_obj
router.post('/review_post', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {};
    data.review = Data_Logic.get(Type.DATA_REVIEW,0,{data:req.body.review});
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
        async function(call){
            const [biz_error,biz_data] = await Review_Data.post(database,data.review.parent_data_type,data.review.parent_id,data.review.user_id,data.review,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_review_delete
// - required form_data = parent_data_type, parent_id, review_id
router.post('/review_delete', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {};
    data.review = Form.set_item(Type.DATA_REVIEW,0,req.body,{parent_data_type:req.body.parent_data_type,item_id:req.body.item_id,user_id:req.body.user_id});
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
        async function(call){
            const [biz_error,biz_data] = await Review_Data.post(database,data.review.parent_data_type,data.review.item_id,data.review.user_id,data.review);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_review_search
router.post('/review_search', function(req, res, next) {
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
        //reviews
        async function(call){
            const [biz_error,biz_data] = await Review_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_post_field_value
// - required form_data = item_data_type,item_id,item_field_value,value_items
router.post('/field_value_post',function(req,res,next){
    let error=null;
    let database,data={};
    let option = req.body.option ? req.body.option : {};
    data.item=Data_Logic.get(req.body.item_data_type,req.body.item_id);
    data.item_field_value = req.body.item_field_value;
    data.src_item = Data_Logic.get(req.body.item_data_type,req.body.item_id);
    data.delete_cache_item=Data_Logic.get(req.body.item_data_type,req.body.item_id);
    data.field_value_items=req.body.field_value_items ? req.body.field_value_items : [];
    async.series([
        async function(call){
            const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null}));
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                database = biz_data;
            }
        },
        //delete cache item
        async function(call){
            if(data.item_field_value.value_type == Type.FIELD_VALUE_ITEMS){
                const [biz_error,biz_data] = await Portal.delete_cache(database,data.delete_cache_item.data_type,data.delete_cache_item.id);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.delete_cache_item = biz_data;
                }
            }
        },
        //src_item
        async function(call){
            if(data.item_field_value.value_type == Type.FIELD_VALUE_ITEMS){
                const [biz_error,biz_data] = await Portal.get(database,data.src_item.data_type,data.src_item.id);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.src_item = biz_data;
                }
            }
        },
        //clear_src_old_field_value_items
        async function(call){
            if(data.item_field_value.value_type == Type.FIELD_VALUE_ITEMS){
                for(let a=1;a<30;a++){
                    if(!Str.check_is_null(data.src_item[Field_Logic.get_field_value_title(Type.FIELD_VALUE_ITEMS,data.item_field_value.value_id,a+1)])){
                        delete data.src_item[Field_Logic.get_field_value_title(Type.FIELD_VALUE_ITEMS,data.item_field_value.value_id,a+1)];
                    }
                }
                //overwrite orignal data item
                const [biz_error,biz_data] = await Portal.post(database,data.src_item.data_type,data.src_item,{overwrite_obj:true});
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.src_item = biz_data;
                }
            }
        },
        //post publish
        async function(call){
            if(data.item_field_value.value_type == Type.FIELD_VALUE_TEXT || data.item_field_value.value_type == Type.FIELD_VALUE_IMAGE ){
                data.item[Field_Logic.get_field_value_title(data.item_field_value.value_type,data.item_field_value.value_id)] = data.item_field_value.value;
                const [biz_error,biz_data] = await Portal.post(database,data.item.data_type,data.item);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.item = biz_data;
                }
            }else if(data.item_field_value.value_type == Type.FIELD_VALUE_ITEMS){
                for(let a=0;a<data.item_field_value.value_items.length;a++){
                    data.item[Field_Logic.get_field_value_title(Type.FIELD_VALUE_ITEMS,data.item_field_value.value_id,a+1)] = data.item_field_value.value_items[a].value;
                }
                const [biz_error,biz_data] = await Portal.post(database,data.item.data_type,data.item);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.item = biz_data;
                }
            }
        },
        //get_item
        async function(call){
            const [biz_error,biz_data] = await Portal.get(database,data.item.data_type,data.item.id);
                if(biz_error){
                    error=Log.append(error,biz_error);
                }else{
                    data.item = biz_data;
                }
        },
    ],
        function(err,result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_template - 9_get_template
// - required form_data = key
router.post('/template', function(req, res, next) {
    let error = null;
    let database,data = {};
    data.template = Data_Logic.get(Type.DATA_TEMPLATE,0,{data:{key:req.body.key}});
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
        //template
        async function(call){
            const [biz_error,biz_data] = await Template_Data.get(database,data.template.key,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_get_content 9_content
// - required form_data = key
router.post('/content', function(req, res, next) {
    let error = null;
    let database,data = {};
    let option = req.body.option ? req.body.option : {};
    data.content = Data_Logic.get(Type.DATA_CONTENT,0,{data:{key:req.body.key}});
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
        async function(call){
            const [biz_error,biz_data] = await Content_Data.get(database,data.content.key,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data.content = data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
//9_search_stat - 9_stat
// - required form_data = search obj
router.post('/stat_search', function(req, res, next) {
    let error = null;
    let database = {};
    let data = {data_type:Type.DATA_STAT,item_count:0,page_count:1,filter:{},stats:[],app_id:null};
    let search = req.body.search;
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
        async function(call){
            const [biz_error,biz_data] = await Stat_Data.search(database,search.filter,search.sort_by,search.page_current,search.page_size,option);
            if(biz_error){
                error=Log.append(error,biz_error);
            }else{
                data = biz_data;
            }
        },
    ],
        function(err, result){
            res.send({error:error,data:data});
            res.end();
        });
});
module.exports = router;
