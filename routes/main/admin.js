var express=require('express');
var router=express.Router();
/* -- biz9_start -- */
const {Portal,Database,Product_Data}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {Scriptz}=require("biz9-scriptz");
const {DataType,Type,DataItem,Business_Logic,Template_Logic,Field_Logic,Item_Logic,Sub_Item_Logic,Page_Logic,Product_Logic,Service_Logic,Event_Logic,Blog_Post_Logic,Team_Logic,Faq_Logic,Category_Logic,Content_Logic,Review_Logic}=require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const {Error,Log,Form,Str,Num}=require("biz9-utility");
const assert = require('assert');
/* -- biz9_end -- */
router.get('/ping',function(req,res,next){
	console.log('Item','Ping');
	res.send({'BiZ-Admin':'admin'});
	res.end();
});
router.post('/post_update/',function(req,res,next){
	console.log("ADMIN-UPDATE-START");
	let param_obj = {};
	let error,database= null;
	let option = Field_Logic.get_option_admin(req);
	let data = {
		product_type_list:[],
		product_category_list:[],
		product_list:[],
	};
	let post_product_category_list = [];
	let post_product_type_list = [
		{title:"Add On",type:DataType.PRODUCT},
		{title:"Admin Panel",type:DataType.PRODUCT},
		{title:"Hosting",type:DataType.PRODUCT},
		{title:"Landing Page",type:DataType.PRODUCT},
		{title:"Mobile",type:DataType.PRODUCT},
		{title:"Website",type:DataType.PRODUCT},
		{title:"T-Shirt",type:DataType.PRODUCT}
	];
	let post_application_development_category = DataItem.get_new(DataType.CATEGORY,0);
	let post_application_development_product_type_list = [];
	let post_application_development_product_category_list = [];
	let post_application_development_product_list = [];

	let post_product_type_title_list = [
	Product_Logic.get_new_type('Admin Panel'),
	Product_Logic.get_new_type('Landing Page'),
	Product_Logic.get_new_type('Mobile'),
	Product_Logic.get_new_type('Website')];

	let post_application_development_product_category_title_list = [
		'Beauty',
		'Church',
		'Fashion',
		'Food Trucks',
		'Health Care',
		'Music',
		'Pets',
		'Services',
		'Service Repair',
		'Sports',
		'Trucking',
	];
	/*
	let post_category_list = [
		{title:"Template",type:"Industry",category:DataType.PRODUCT,category_field:DataType.CATEGORY}
	];
	let template_type_title_list = ['Mobile','Website','Landing Page','CMS'];
	let product_add_on_cms_title_list = ['Website','Mobile'];
	*/
	async.series([
		//database
		async function(call){
			console.log("ADMIN-UPDATE-DATABASE-START");
			const [biz_error,biz_data] = await Database.get(Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null}));
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				database = biz_data;
				//Log.w('database',database);
				console.log("ADMIN-UPDATE-DATABASE-SUCCESS");
			}
			console.log("ADMIN-UPDATE-DATABASE-DONE");
		},
		//product_type_list
		async function(call){
			console.log("ADMIN-PRODUCT-TYPE-LIST-START");
			Log.w('product_type_list',product_type_list);
		  const [biz_error,biz_data] = await Product_Data.demo_post(database,post_product_type_list);
               if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.product_type_list = biz_data;
				console.log("ADMIN-PRODUCT-TYPE-LIST-SUCCESS");
			}
				console.log("ADMIN-PRODUCT-TYPE-LIST-END");
			},
		/*
		async function(call){
			console.log("ADMIN-UPDATE-APPLICATION-DEVELOPMENT-PRODUCT-CATEGORY-LIST-START");
				for(let a=0;a<post_application_development_product_type_list.length;a++){
					for(let b=0;b<post_application_development_product_category_title_list.length;b++){
						post_application_development_product_category_list.push(
							DataItem.get_new(DataType.CATEGORY,0,
								{
									title:post_application_development_product_category_title_list[b],
									title_url:Str.get_title_url(post_application_development_product_category_title_list[b]),
									type:post_application_development_product_type_list[a].title,
									category:DataType.PRODUCT
								}));
							}
					}
			Log.w('post_application_development_product_category_list',post_application_development_product_category_list);
			const [biz_error,biz_data] = await Portal.post_list(database,post_application_development_product_category_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				post_application_development_product_category_list = biz_data;
				Log.w('post_application_development_product_category_list',post_application_development_product_category_list);
				console.log("ADMIN-UPDATE-APPLICATION-DEVELOPMENT-PRODUCT-CATEGORY-LIST-SUCCESS");
			}
			console.log("ADMIN-UPDATE-APPLICATION-DEVELOPMENT-PRODUCT-CATEGORY-LIST-END");
		},
		async function(call){
			console.log("ADMIN-APPLICATION-DEVELOPMENT-PRODUCT-LIST-START");
			let product_feature_list = ['true','false'];
			let product_hot_list = ['true','false'];
			for(let a=0;a<parseInt(option.product_count);a++){
				let group_id = Num.get_id(post_application_development_product_category_list.length);
				let group_id_2 = Num.get_id(post_application_development_product_type_list.length);
				let product = Product_Logic.get_test(post_application_development_product_category_list[group_id].title + " "+ post_application_development_product_type_list[group_id_2].title+" "+a);
				product.cost = Num.get_id(9000);
				//type
				product.type=post_application_development_product_type_list[group_id_2].title;
				//category
				product.category=post_application_development_product_category_list[group_id].title;
				//fields
				product.featured=product_feature_list[Num.get_id(product_feature_list.length)];
				product.hot=product_hot_list[Num.get_id(product_hot_list.length)];
				//values
				product.field_0 = "delivery_time";
				product.delivery_time = "2 days";
				product.field_1 = "video_link";
				product.video_link = "https://youtu.be/Zuj4A4yWzPc?si=9ozKaA9lMmZOgTNS";
				product.field_2 = "download_link";
				product.download_link = "https://google.com";
				post_application_development_product_list.push(product);
			}
			Log.w('post_application_development_product_list',post_application_development_product_list);
			const [biz_error,biz_data] = await Portal.post_list(database,post_application_development_product_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
			console.log("ADMIN-APPLICATION-DEVELOPMENT-PRODUCT-LIST-SUCCESS");
				post_application_development_product_list = biz_data;
				Log.w('post_application_development_product_list',post_application_development_product_list);
			}
			console.log("ADMIN-APPLICATION-DEVELOPMENT-PRODUCT-LIST-END");
		},
		async function(call){
			console.log("ADMIN-PRODUCT-REVIEW-LIST-START");
			if(option.get_product_review == 'true'){
				data.product_review_list = [];
				for(let a = 0; a < parseInt(option.product_review_count);a++){
					product_random_id = Num.get_id(data.product_template_list.length);
					let item_data_type = DataType.PRODUCT;
					let item_id = data.product_template_list[product_random_id].id;
					let user_id = Num.get_id();
					let review = Review_Logic.get_test(item_data_type,item_id,user_id);
					review.item_data_type = item_data_type;
					review.item_id = item_id;
					data.product_review_list.push(review);
					data.product_template_list[product_random_id].review_count = !Str.check_is_null(data.product_template_list[product_random_id].review_count) ? parseInt(data.product_template_list[product_random_id].review_count) + 1: 1;
					data.product_template_list[product_random_id].rating_count = !Str.check_is_null(data.product_template_list[product_random_id].rating_count) ? parseInt(data.product_template_list[product_random_id].rating_count) + parseInt(review.rating): parseInt(review.rating);
					data.product_template_list[product_random_id].rating_avg = parseInt(data.product_template_list[product_random_id].rating_count) / parseInt(data.product_template_list[product_random_id].review_count)
				}
				const [biz_error,biz_data] = await Portal.post_list(database,data.product_review_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					console.log("ADMIN-PRODUCT-REVIEW-LIST-START");
					data.product_review_list = biz_data;
					Log.w('product_review_list',data.product_review_list);
				}
			}
			console.log("ADMIN-PRODUCT-REVIEW-LIST-SUCCESS");
			console.log("ADMIN-PRODUCT-REVIEW-LIST-DONE");
		},
	//product review count post bind
		async function(call){
			console.log("ADMIN-PRODUCT-UPDATE-LIST-2-START");
			const [biz_error,biz_data] = await Portal.post_list(database,data.product_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				console.log("ADMIN-PRODUCT-UPDATE-LIST-2-SUCCESS");
				data.product_list = biz_data;
				Log.w('product_list',data.product_list);
			}
			console.log("ADMIN-PRODUCT-UPDATE-LIST-2-DONE");
		},
		async function(call){
			console.log("ADMIN-CONTENT-PRODUCT-CMS-TYPE-START");
			data.content_product_cms_type = Content_Logic.get_test('Product CMS Type');
			data.content_product_cms_type.setting_sort_order = "asc";
			data.content_product_cms_type.setting_sort_type = "order";
			const [biz_error,biz_data] = await Portal.post(database,DataType.CONTENT,data.content_product_cms_type);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.content_product_cms_type = biz_data;
				Log.w('content_product_cms_type',data.content_product_cms_type);
				console.log("ADMIN-CONTENT-PRODUCT-CMS-TYPE-SUCCESS");
			}
			console.log("ADMIN-CONTENT-PRODUCT-CMS-TYPE-END");
		},

		/*
		//custom_field
		async function(call){
			console.log("ADMIN-UPDATE-CUSTOM-FIELD-LIST-START");
			data.custom_field_list = [];
			let featured = "Featured";
			let hot = "Hot";
			let template_type = "Template Type";

			data.custom_field_list.push(DataItem.get_new(DataType.CUSTOM_FIELD,0,
				{title:featured,title_url:Str.get_title_url(featured),category_type:DataType.PRODUCT,field_0:"true",field_1:"false",true:"true",false:"false"}));

			data.custom_field_list.push(DataItem.get_new(DataType.CUSTOM_FIELD,0,
				{title:hot,title_url:Str.get_title_url(hot),category_type:DataType.PRODUCT,field_0:"true",field_1:"false",true:"true",false:"false"}));

			data.custom_field_list.push(DataItem.get_new(DataType.CUSTOM_FIELD,0,
				{
					title:template_type,
					title_url:Str.get_title_url(template_type),
					category_type:DataType.PRODUCT,
					field_0:"Mobile",
					mobile:"Mobile",
					field_1:"Website",
					website:"Website",
					field_2:"Landing Page",
					landing_page:"Landing Page",
					field_3:"Admin Panel",
					admin_panel:"Admin Panel"
				}));
			const [biz_error,biz_data] = await Portal.post_list(database,data.custom_field_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.custom_field_list = biz_data;
				console.log("ADMIN-UPDATE-CUSTOM-FIELD-LIST-SUCCESS");
				Log.w('custom_field_list',data.custom_field_list);
			}
			console.log("ADMIN-UPDATE-CUSTOM-FIELD-LIST-DONE");
		},
	async function(call){
			console.log("ADMIN-CONTENT-PRODUCT-CMS-TYPE-START");
			data.content_product_cms_type_list = [];
			let content_item_1 = Sub_Item_Logic.get_test('Web CMS',data.content_product_cms_type,data.content_product_cms_type);
			content_item_1.cost = "Free";
			content_item_1.field_0 = "cost";
			content_item_1.setting_order = "1";

			let content_item_2 = Sub_Item_Logic.get_test('Mobile App CMS',data.content_product_cms_type,data.content_product_cms_type);
			content_item_2.cost = "500";
			content_item_2.field_0 = "cost";
			content_item_2.setting_order = "2";

			data.content_product_cms_type_list.push(content_item_1);
			data.content_product_cms_type_list.push(content_item_2);
			Log.w('content_product_cms_type_list',data.content_product_cms_type_list);
			const [biz_error,biz_data] = await Portal.post_list(database,data.content_product_cms_type_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.content_product_cms_type_list = biz_data;
				Log.w('content_product_hosting_type_list',data.content_product_cms_type_list);
				console.log("ADMIN-CONTENT-PRODUCT-CMS-TYPE-SUCCESS");
			}
			console.log("ADMIN-CONTENT-PRODUCT-CMS-TYPE-END");
		},
		async function(call){
			console.log("ADMIN-CONTENT-PRODUCT-HOSTING-TYPE-START");
			data.content_product_hosting_type = Content_Logic.get_test('Product Hosting Type');
			data.content_product_hosting_type.setting_sort_order = "asc";
			data.content_product_hosting_type.setting_sort_type = "order";
			const [biz_error,biz_data] = await Portal.post(database,DataType.CONTENT,data.content_product_hosting_type);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.content_product_hosting_type = biz_data;
				Log.w('content_product_hosting_type',data.content_product_hosting_type);
				console.log("ADMIN-CONTENT-PRODUCT-HOSTING-TYPE-SUCCESS");
			}
			console.log("ADMIN-CONTENT-PRODUCT-HOSTING-TYPE-END");
		},
		async function(call){
			console.log("ADMIN-CONTENT-PRODUCT-HOSTING-TYPE-ITEM-START");
			data.content_product_hosting_type_list = [];
			let content_item_1 = Sub_Item_Logic.get_test('3 Month Hosting',data.content_product_hosting_type,data.content_product_hosting_type);
			content_item_1.cost = "Free";
			content_item_1.field_0 = "cost";
			content_item_1.setting_order = "1";

			let content_item_2 = Sub_Item_Logic.get_test('6 Month Hosting',data.content_product_hosting_type,data.content_product_hosting_type);
			content_item_2.cost = "250";
			content_item_2.field_0 = "cost";
			content_item_2.setting_order = "2";

			let content_item_3 = Sub_Item_Logic.get_test('1 Year Hosting',data.content_product_hosting_type,data.content_product_hosting_type);
			content_item_3.cost = "350";
			content_item_3.field_0 = "cost";
			content_item_3.setting_order = "3";

			data.content_product_hosting_type_list.push(content_item_1);
			data.content_product_hosting_type_list.push(content_item_2);
			data.content_product_hosting_type_list.push(content_item_3);
			Log.w('content_product_hosting_type_list',data.content_product_hosting_type_list);
			const [biz_error,biz_data] = await Portal.post_list(database,data.content_product_hosting_type_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.content_product_hosting_type_list = biz_data;
				Log.w('content_product_hosting_type_list',data.content_product_hosting_type_list);
				console.log("ADMIN-CONTENT-PRODUCT-HOSTING-TYPE-ITEM-SUCCESS");
			}
			console.log("ADMIN-CONTENT-PRODUCT-HOSTING-TYPE-ITEM-END");
		},
		//content list
		async function(call){
			console.log("ADMIN-CONTENT-LIST-START");
			data.content_partner_list = [];
			data.content_partner_list.push(Content_Logic.get_test('Partners'));
			Log.w('content_partner_list',data.content_partner_list);
			const [biz_error,biz_data] = await Portal.post_list(database,data.content_partner_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				data.content_partner_list = biz_data;
				Log.w('content_partner_list',data.content_partner_list);
				console.log("ADMIN-CONTENT-LIST-SUCCESS");

			}
			console.log("ADMIN-CONTENT-LIST-DONE");
		},
		//content - item - sub items
		async function(call){
			await Promise.all(data.content_partner_list.map(async (content_item) => {
				let content_row_item_list = Sub_Item_Logic.get_test_list(content_item,content_item);
				Log.w('content_row_item_list',content_row_item_list);
				const [biz_error,biz_data] = await Portal.post_list(database,content_row_item_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.content_row_item_list = biz_data;
					Log.w('content_row_item_list',data);
				}
			}));
		},
		async function(call){
			console.log("ADMIN-CUSTOM-FIELD-GALLERY-START");
			data.custom_field_gallery = DataItem.get_new(DataType.CUSTOM_FIELD,0,{title:'Portfolio',title_url:'portfolio',category_type:DataType.GALLERY,field_0:'true',true:'true',field_1:'false',false:'false'});
		   Log.w('custom_field_gallery',data.custom_field_gallery);
			const [biz_error,biz_data] = await Portal.post(database,data.custom_field_gallery.data_type,data.custom_field_gallery);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
			console.log("ADMIN-CUSTOM-FIELD-GALLERY-DONE");
				data.custom_field_gallery = biz_data;
				Log.w('category',data.custom_field_gallery);
			}
		},
		async function(call){
			console.log("ADMIN-CATEGORY-GALLERY-LIST-START");
			data.category_gallery_list = [
				DataItem.get_new(DataType.CATEGORY,0,{title:'Website Gallery',title_url:'website_gallery',type:DataType.GALLERY}),
				DataItem.get_new(DataType.CATEGORY,0,{title:'Mobile Gallery',title_url:'mobile_gallery',type:DataType.GALLERY}),
				DataItem.get_new(DataType.CATEGORY,0,{title:'Landing Page Gallery',title_url:'landing_page_gallery',type:DataType.GALLERY})
			];
		   Log.w('category_gallery',data.category_gallery_list);
			const [biz_error,biz_data] = await Portal.post_list(database,data.category_gallery_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				console.log("ADMIN-CATEGORY-GALLERY-LIST-DONE");
				data.category_list = biz_data;
				Log.w('category_list',data.category_list);
			}
		},
		async function(call){
			console.log("ADMIN-GALLERY-LIST-START");
			data.gallery_list = [

				DataItem.get_new(DataType.GALLERY,0,{title:'Website 1',title_url:'website_1',category:'Website Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Website 2',title_url:'website_2',category:'Website Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Website 3',title_url:'website_3',category:'Website Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Mobile 1',title_url:'mobile_1',category:'Mobile Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Mobile 2',title_url:'mobile_2',category:'Mobile Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Mobile 3',title_url:'mobile_3',category:'Mobile Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Landing Page 1',title_url:'landing_page_1',category:'Landing Page Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),
				DataItem.get_new(DataType.GALLERY,0,{title:'Landing Page 2',title_url:'landing_page_2',category:'Landing Page Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()}),

				DataItem.get_new(DataType.GALLERY,0,{title:'Landing Page 3',title_url:'landing_page_3',category:'Landing Page Gallery',portfolio:'true',type:'type_'+Num.get_id(),field_0:"Client",client:"HealthCo_"+Num.get_id(),field_1:"Date",date:"January 2024_"+Num.get_id(),field_2:"Website",website:"web.com_"+Num.get_id(),field_3:"Industry",industry:"Industry_"+Num.get_id(),
					field_4:"Challenge",challenge:"Challenge_"+Num.get_id(),
					field_5:"Project Scope",project_scope:"Project Scope_"+Num.get_id(),
					field_6:"Solution",solution:"Solution_"+Num.get_id(),
					field_7:"Solution 1",solution_1:"Solution_1_"+Num.get_id(),
					field_8:"Solution 2",solution_2:"Solution_2_"+Num.get_id(),
					field_9:"Solution 3",solution_3:"Solution_3_"+Num.get_id(),
					field_10:"Solution 4",solution_4:"Solution_4_"+Num.get_id(),
					field_11:"Solution 5",solution_5:"Solution_5_"+Num.get_id(),
					field_12:"Outcome",outcome:"Outcome_"+Num.get_id(),
					field_13:"Outcome_1",outcome_1:"Outcome_1_"+Num.get_id(),
					field_14:"Outcome_2",outcome_2:"Outcome_2_"+Num.get_id(),
					field_15:"Outcome_3",outcome_3:"Outcome_3_"+Num.get_id(),
					field_16:"Outcome_4",outcome_4:"Outcome_4_"+Num.get_id(),
					field_17:"Outcome_5",outcome_5:"Outcome_5_"+Num.get_id()})
			];
		   Log.w('gallery',data.gallery_list);
			const [biz_error,biz_data] = await Portal.post_list(database,data.gallery_list);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				console.log("ADMIN-GALLERY-LIST-DONE");
				data.gallery_list = biz_data;
				Log.w('gallery_list',data.gallery_list);
			}
		},
		*/
	],
		function(err,result){
			console.log('ADMIN_UPDATE_SERVER_DONE');
			//res.send({error,data});
			//res.end();
		});
});
router.post('/post_add/', function(req, res, next) {
	let error = null;
	let database,data = {};
	let option = Field_Logic.get_option_admin(req);
	//admin
	data.admin = Form.set_item(DataType.ADMIN,0,req.body.data);
	async.series([
		async function(call){
			console.log("ADMIN-ADD-CONNECT-START");
			let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
			const [biz_error,biz_data] = await Database.get(biz9_config);
			if(biz_error){
				error=Log.append(error,biz_error);
			}else{
				database = biz_data;
			}
			console.log("ADMIN-ADD-CONNECT-DONE");
		},
		//admin
		async function(call){
			console.log("ADMIN-ADD-ADMIN-START");
			if(option.get_admin == 'true'){
				const [biz_error,biz_data] = await Portal.post(database,data.admin.data_type,data.admin);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.admin = biz_data;
					Log.w('admin',data.admin);
					console.log("ADMIN-ADD-ADMIN-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-ADMIN-DONE");
		},
		//template
		async function(call){
			console.log("ADMIN-ADD-TEMPLATE-START");
			if(option.get_template){
				data.template = DataItem.get_new(DataType.TEMPLATE,0,{title:'Primary',title_url:'primary',setting_visible:'1'});
				data.template.edit_location="http://localhost:3000/contact";
				const [biz_error,biz_data] = await Portal.post(database,data.template.data_type,data.template);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.template = biz_data;
					Log.w('template_post',data.template);
					console.log("ADMIN-ADD-TEMPLATE-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-TEMPLATE-DONE");
		},
		//page -  home -
		async function(call){
			console.log("ADMIN-ADD-PAGE-HOME-START");
			if(option.get_page == 'true'){
				data.page_home = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_HOME),title_url:Str.get_title_url(Type.PAGE_HOME),setting_visible:'1'});
				data.page_home.edit_location="http://localhost:3000/index";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:2});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:4});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:5});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:6});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:7});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:8});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:9});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:10});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:11});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:12});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:12});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:13});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:17});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:18});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:19});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:20});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:21});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:22});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:23});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:24});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:25});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:26});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:27});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:28});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:29});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:30});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:31});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:32});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:33});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:35});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:36});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:37});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:38});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:39});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:3});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:14});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:15});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:16});
				for(let a=0;a<list_field_values.length;a++){
					data.page_home[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				Log.w('list_field_values',list_field_values);
				const [biz_error,biz_data] = await Portal.post(database,data.page_home.data_type,data.page_home);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.page_home = biz_data;
					Log.w('home_page_post',data.page_home);
					console.log("ADMIN-ADD-PAGE-HOME-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-HOME-END");
		},
		//page - product_detail
		async function(call){
			console.log("ADMIN-ADD-PAGE-PRODUCT-DETAIL-START");
			if(option.get_page == 'true'){
				data.page_product_detail = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_PRODUCT_DETAIL),title_url:Str.get_title_url(Type.PAGE_PRODUCT_DETAIL),setting_visible:'1'});
				data.page_product_detail.edit_location="http://localhost:3000/app/blank";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:2});
				for(let a=0;a<list_field_values.length;a++){
					data.page_product_detail[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.page_product_detail.data_type,data.page_product_detail);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.page_product_detail = biz_data;
					Log.w('page_detail_post',data.page_product_detail);
					console.log("ADMIN-ADD-PAGE-PRODUCT-DETAIL-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-PRODUCT-DETAIL-END");
		},
		/*
		//page - product_home
		async function(call){
			console.log("ADMIN-ADD-PAGE-PRODUCT-HOME-START");
			if(option.get_page == 'true'){
				data.search = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_PRODUCT_HOME),title_url:Str.get_title_url(Type.PAGE_PRODUCT),setting_visible:'1'});
				data.search.edit_location="http://localhost:3000/search";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:2});
				for(let a=0;a<list_field_values.length;a++){
					data.search[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.search.data_type,data.search);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.search = biz_data;
					Log.w('search_page_post',data.search);
					console.log("ADMIN-ADD-PAGE-PRODUCT-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-PRODUCT-END");
		},

	//page - about
		async function(call){
			console.log("ADMIN-ADD-PAGE-ABOUT-START");
			if(option.get_page == 'true'){
				data.about = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_ABOUT),title_url:Str.get_title_url(Type.PAGE_ABOUT),setting_visible:'1'});
				data.about.edit_location="http://localhost:3000/about";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				for(let a=0;a<list_field_values.length;a++){
					data.about[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.about.data_type,data.about);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.about = biz_data;
					Log.w('about_page_post',data.about);
					console.log("ADMIN-ADD-PAGE-ABOUT-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-ABOUT-END");
		},
	//page - gallery
		async function(call){
			console.log("ADMIN-ADD-PAGE-GALLERY-START");
			if(option.get_page == 'true'){
				data.gallery = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_GALLERY),title_url:Str.get_title_url(Type.PAGE_GALLERY),setting_visible:'1'});
				data.gallery.edit_location="http://localhost:3000/gallery";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				for(let a=0;a<list_field_values.length;a++){
					data.gallery[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.gallery.data_type,data.gallery);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.gallery = biz_data;
					Log.w('gallery_page_post',data.gallery);
					console.log("ADMIN-ADD-PAGE-GALLERY-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-GALLERY-END");
		},
	//page - blog_post
		async function(call){
			console.log("ADMIN-ADD-PAGE-BLOG_POST-START");
			if(option.get_page == 'true'){
				data.blog_post = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_BLOG_POST),title_url:Str.get_title_url(Type.PAGE_BLOG_POST),setting_visible:'1'});
				data.blog_post.edit_location="http://localhost:3000/blog_post";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				for(let a=0;a<list_field_values.length;a++){
					data.blog_post[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.blog_post.data_type,data.blog_post);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.blog_post = biz_data;
					Log.w('blog_post_page_post',data.blog_post);
					console.log("ADMIN-ADD-PAGE-BLOG_POST-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-GALLERY-END");
		},
	//page - contact
		async function(call){
			console.log("ADMIN-ADD-PAGE-CONTACT-START");
			if(option.get_page == 'true'){
				data.contact = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_CONTACT),title_url:Str.get_title_url(Type.PAGE_CONTACT),setting_visible:'1'});
				data.contact.edit_location="http://localhost:3000/contact";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:2});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:3});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:4});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:5});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:6});
				for(let a=0;a<list_field_values.length;a++){
					data.contact[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.contact.data_type,data.contact);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.contact = biz_data;
					Log.w('contact_page_post',data.contact);
					console.log("ADMIN-ADD-PAGE-CONTACT-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-CONTACT-END");
		},
	//page - faq
		async function(call){
			console.log("ADMIN-ADD-PAGE-FAQ-START");
			if(option.get_page == 'true'){
				data.faq = DataItem.get_new(DataType.PAGE,0,{title:Type.get_title(Type.PAGE_FAQ),title_url:Str.get_title_url(Type.PAGE_FAQ),setting_visible:'1'});
				data.faq.edit_location="http://localhost:3000/faq";
				let list_field_values = [];
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:1});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:2});
				list_field_values.push({type:Type.FIELD_VALUE_TEXT,value_id:3});
				for(let a=0;a<list_field_values.length;a++){
					data.faq[Field_Logic.get_field_value_title(list_field_values[a].type,list_field_values[a].value_id,1)] = "Test Data " + list_field_values[a].value_id;
				}
				const [biz_error,biz_data] = await Portal.post(database,data.faq.data_type,data.faq);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.faq = biz_data;
					Log.w('faq_page_post',data.faq);
					console.log("ADMIN-ADD-PAGE-FAQ-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-PAGE-CONTACT-END");
		},

	//category - blog_post list
		async function(call){
			if(option.get_blog_post == 'true' && option.get_category_blog_post == 'true'){
				data.blog_post_category_list = Category_Logic.get_test_list_by_type(DataType.BLOG_POST,{category_count:option.category_blog_post_count});
				const [biz_error,biz_data] = await Portal.post_list(database,data.blog_post_category_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.blog_post_category_list = biz_data;
					Log.w('blog_post_category_list',data.blog_post_category_list);
				}
			}
		},
	//blog_post list
		async function(call){
			console.log("ADMIN-ADD-BLOG-POST-LIST-START");
			if(option.get_blog_post == 'true'){
				data.blog_post_list = [];
				for(let a=0;a<option.blog_post_count;a++){
					let blog_post = Blog_Post_Logic.get_test("Blog Post "+String(parseInt(a+1)));
					if(option.get_category_blog_post == 'true'){
						blog_post.category = data.blog_post_category_list[Num.get_id(data.blog_post_category_list.length)].title;
					}else{
						blog_post.category = 'Category ' + Number.get_id();
					}
					data.blog_post_list.push(blog_post);
				}
				const [biz_error,biz_data] = await Portal.post_list(database,data.blog_post_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.blog_post_list = biz_data;
					Log.w('blog_post_list',data.blog_post_list);
					console.log("ADMIN-ADD-BLOG-POST-LIST-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-BLOG-POST-LIST-DONE");
		},
	//category - service list
		async function(call){
			console.log("ADMIN-ADD-CATEGORY-SERVICE-LIST-START");
			if(option.get_service == 'true' && option.get_category_service == 'true'){
				data.category_service_list = Category_Logic.get_test_list_by_type(DataType.SERVICE,{category_count:option.category_service_count});
				const [biz_error,biz_data] = await Portal.post_list(database,data.category_service_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.category_service_list = biz_data;
					Log.w('category_service_list',data.category_service_list);
					console.log("ADMIN-ADD-CATEGORY-SERVICE-LIST-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-CATEGORY-SERVICE-LIST-DONE");
		},
	//service list
		async function(call){
			console.log("ADMIN-ADD-SERVICE-LIST-START");
			if(option.get_service == 'true'){
				data.service_list = [];
				for(let a=0;a<option.service_count;a++){
					let service = Service_Logic.get_test("Service "+String(parseInt(a+1)));
					if(option.get_category_service == 'true'){
						service.category = data.category_service_list[Num.get_id(data.category_service_list.length)].title;
					}
					data.service_list.push(service);
				}
				const [biz_error,biz_data] = await Portal.post_list(database,data.service_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.service_list = biz_data;
					Log.w('service_list',data.service_list);
					console.log("ADMIN-ADD-SERVICE-LIST-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-SERVICE-LIST-DONE");
		},
	//category - event list
		async function(call){
			console.log("ADMIN-ADD-CATEGORY-EVENT-LIST-START");
			if(option.get_event == 'true' && option.get_category_event == 'true'){
				data.category_event_list = Category_Logic.get_test_list_by_type(DataType.EVENT,{category_count:option.category_event_count});
				const [biz_error,biz_data] = await Portal.post_list(database,data.category_event_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.category_event_list = biz_data;
					Log.w('category_event_list',data.category_event_list);
					console.log("ADMIN-ADD-CATEGORY-EVENT-LIST-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-CATEGORY-EVENT-LIST-DONE");
		},
	//event list
		async function(call){
			console.log("ADMIN-ADD-EVENT-LIST-START");
			if(option.get_event == 'true'){
				data.event_list = [];
				for(let a=0;a<option.event_count;a++){
					let event = Event_Logic.get_test("Event "+String(parseInt(a+1)));
					if(option.get_category_event == 'true'){
						event.category = data.category_event_list[Num.get_id(data.category_event_list.length)].title;
					}
					data.event_list.push(event);
				}
				const [biz_error,biz_data] = await Portal.post_list(database,data.event_list);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.event_list = biz_data;
					Log.w('event_list',data.event_list);
					console.log("ADMIN-ADD-EVENT-LIST-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-EVENT-LIST-DONE");
		},
	//faq list
		async function(call){
			console.log("ADMIN-ADD-FAQ-START");
			Log.w('faq_option',option);
			Log.w('faq_option_question_count',option.question_count);
			if(option.get_faq == 'true'){
				data.faq = Faq_Logic.get_test('Primary',{question_count:option.question_count});
				Log.w('faq',data.faq);
				const [er,data] = await Portal.post(database,DataType.FAQ,data.faq);
				if(biz_error){
					error=Log.append(error,biz_error);
				}else{
					data.faq = biz_data;
					Log.w('faq',data.faq);
					console.log("ADMIN-ADD-FAQ-SUCCESS");
				}
			}
			console.log("ADMIN-ADD-FAQ-LIST-DONE");
		}
*/
],
	function(err, result){
		console.log('ADMIN_ADD_SERVER_DONE');
		res.send({error,data});
		res.end();
	});
});
module.exports=router;
