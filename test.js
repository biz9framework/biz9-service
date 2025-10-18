async = require('async')
const axios = require('axios');
const {Data} = require("biz9-data");
const {Scriptz} = require("biz9-scriptz");
const {DataType,DataItem,Page_Logic,App_Logic,Url,Type,Demo_Logic,Review_Logic} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const assert = require('node:assert');
const {Log,Num,Str} = require("biz9-utility");
/*
 * availble tests
- connect
- item_update
- item_get
- item_delete
- item_list_update
- item_list_get
- item_list_delete
- get_data
- post_data
- admin_add
- admin_update
*/
/* --- TEST CONFIG START --- */
//const KEY='0'; // 0 = intialize new data item.
const KEY='title_1896';
const ID='ed5a88fe-6d74-45aa-9599-11fdd651870b';
const DATA_TYPE=DataType.ITEM;
const TITLE_URL="title_1896";
const PARENT_ID='86-49b3-8770-3d1c984dc0d3';
const PARENT_DATA_TYPE=DataType.BLANK;

/* --- TEST START --- */
const APP_ID='test-stage';
const EMAIL='ceo@bossappz.com';
const PASSWORD='1234567';
/* --- STAGE END --- */

/* --- ADMIN START --- */
let ADMIN_OPTION ={
	GET_ADMIN:true,
	GET_BUSINESS:true,

	GET_TEMPLATE:true,
	GET_PAGE:true,

	CATEGORY_BLOG_POST_COUNT:9,
	BLOG_POST_COUNT:19,
	PAGE_COUNT:1,
	SECTION_COUNT:19,
	VALUE_COUNT:19,

	GET_CATEGORY_BLOG_POST:true,
	GET_BLOG_POST:true,
	GET_PRODUCT:false,
	GET_CATEGORY_PRODUCT:false,
	CATEGORY_PRODUCT_COUNT:19,
	PRODUCT_COUNT:399,

	GET_SERVICE:false,
	GET_CATEGORY_SERVICE:false,
	CATEGORY_SERVICE_COUNT:19,
	SERVICE_COUNT:69,

	GET_EVENT:false,
	GET_CATEGORY_EVENT:false,
	CATEGORY_EVENT_COUNT:19,
	EVENT_COUNT:69,

	GET_TEAM:false,

	GET_BUSINESS_REVIEW:true,
	BUSINESS_REVIEW_COUNT:19,

	GET_PRODUCT_REVIEW:true,
	PRODUCT_REVIEW_COUNT:500,

	GET_FAQ:true,
	QUESTION_COUNT:19,
	//all start
	/*
	GET_PRODUCT:true,
	GET_CATEGORY_PRODUCT:true,
	CATEGORY_PRODUCT_COUNT:19,
	PRODUCT_COUNT:69,

	GET_SERVICE:true,
	GET_CATEGORY_SERVICE:true,
	CATEGORY_SERVICE_COUNT:19,
	SERVICE_COUNT:69,

	GET_EVENT:true,
	GET_CATEGORY_EVENT:true,
	CATEGORY_EVENT_COUNT:19,
	EVENT_COUNT:69,

	GET_TEAM:true,
	*/
	//all end

}

/*
let GET_ADMIN = true;
let GET_BUSINESS = true;
let GET_TEMPLATE = true;
let GET_PRODUCT = true;
let GET_BLOG_POST = true;
let GET_SERVICE = true;
let GET_EVENT = true;
let GET_PAGE = true;
*/




/* --- ADMIN END --- */
/* --- STAGE START --- */
/*
const APP_ID='901-stage';
const EMAIL='ceo@wrightinstalls.com';
const PASSWORD='1234567';
*/
/* --- STAGE END --- */

//const FILTER={group_id:'31775'};
const FILTER={data_type:'dt_blank'};
const PORT_ID="1904";
const CLOUD_URL="http://localhost:"+PORT_ID;

//const GET_URL=CLOUD_URL + "/main/biz_item/get/product_biz/";
//const GET_URL="http://localhost:1904/main/crud/get_item_parent_top/blog_post_biz/eae566e3-e8af-4291-a136-3f794db7aaed?app_id=test-may26";
//const GET_URL=CLOUD_URL + "/home?app_id=test-may26";
//const GET_URL="http://localhost:1904/custom_field/get/category_biz/174649f4-0a47-47df-90e9-b37a7d62f7e2?app_id=test-june7&parent_id=0&parent_data_type=category_biz";
//const GET_URL="http://localhost:1904/main/crud/copy/custom_field_biz/e56e73a7-e5cd-4bde-bc94-38dc964388f6?app_id=test-june7";
//const POST_URL="http://localhost:1902/main/crud/update/page_biz/0?dg-cms-feb-17";
/* --- TEST CONFIG END --- */

/* --- TEST MONGO START --- */
DATA_CONFIG = {
	APP_ID:APP_ID,
	PORT_ID:'1904',
	URL:"http://localhost:1904",
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
/* --- TEST MONGO END --- */

/* --- TEST DATA CONFIG END --- */
describe('connect', function(){ this.timeout(25000);
	it("_connect", function(done){
		console.log('TEST-CONNECT-START');
		let error=null;
		let db_connect = {};
		async.series([
			function(call){
				console.log('CONNECT-START');
				//let biz9_config = Scriptz.get_biz9_config();
				//Log.w('biz9_config',biz9_config);
				//let cloud_url = Url.connect(Scriptz.get_biz9_config({app_id:dynamic_app_id})); //dynamic
				//
				//let cloud_url = Url.get_connect(biz9_config); //single
				//let cloud_url = Url.get_connect(Scriptz.get_biz9_config({app_id:''})); //blank
				//let item_test = Item_Logic.get_test_item(DATA_TYPE,0);
				/*
				//-- SEARCH START --//
				let key = 'item_5350';
				let search = App_Logic.get_search(DataType.SERVICE,{},{},1,0);
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_SERVICE_SEARCH);
				let data = {key:key,search:search};
				Log.w('url_22',url);
				//-- SEARCH END --//
				*/
				//-- REVIEW START --//
				console.log('REVIEW-START');
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.REVIEW_POST);
                let parent_data_type = DataType.PRODUCT;
                let parent_id = "604f0e31-816e-47f4-a411-0c507b859460";
                let user_id = "80009d4a-1df4-421a-9105-d9450ebc5e01";
                let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,Num.get_id()+"_My_Title",Num.get_id()+"_Comment_",Num.get_id(5));
                let option = {post_stat:true,user_id:user_id};
				let data = {parent_data_type:parent_data_type,parent_id:parent_id,parent_id:parent_id,review:review,option:option};
				console.log('REVIEW-END');
				/*
				let key = 'item_5350';
				let search = App_Logic.get_search(DataType.SERVICE,{},{},1,0);
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_SERVICE_SEARCH);
				let data = {key:key,search:search};
				Log.w('url_22',url);
				//-- REVIEW END --//
				*/


				axios.post(url, {
					data: data
				})
					.then(function (response) {
						Log.w('RESPONSE_DATA',response.data);
						Log.w('URL',url);
						console.log('CONNECT-REMOTE-SUCCESS');
						call();
					})
					.catch(function (error) {
						Log.w('CONNECT-REMOTE-ERROR',error);
					});
			}

		],
			function(error, result){
				if(error){
					Log.error("CONNECT-REMOTE-ERROR",error);
				}else{
					console.log('CONNECT-LOCAL-SUCCESS-DONE');
					console.log('CONNECT-REMOTE-SUCCESS-DONE');
					console.log('CONNECT-DONE');
				}
				done();
			});
	});
});
describe('go_away', function(){ this.timeout(25000);
	it("go_away", function(done){
		let cloud_error=null;
		async.series([
			function(call){
				/*
				console.log('ADMIN-UPDATE-START');
				let cloud_url = Url.update_item(Scriptz.get_biz9_config(),DataType.ADMIN,0);
				let admin = DataItem.get_new(DataType.ADMIN,0);
				admin.email = EMAIL;
				admin.password = PASSWORD;
				let config = Scriptz.get_biz9_config();
				Log.w('test_update_test',admin);
				Log.w('config_here',config.TITLE);
				Log.w('config_here',config.APP_ID);
				Log.w('cloud_url',cloud_url);
				axios.post(cloud_url, {
					data: admin
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							let data = response.data.cloud;
							Log.w('cloud',response.data.cloud);
							console.log('ADMIN-UPDATE-SUCCESS');
						}
						call();
					})
					.catch(function (error) {
						cloud_error=Log.append(cloud_error,error);
						call();
					});
					*/
			}
		],
			function(error, result){
				if(cloud_error){
					Log.error("ITEM-UPDATE-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-UPDATE-SUCCESS-DONE');
				}
				done();
			});
	});
});
describe('admin_add', function(){ this.timeout(25000);
	it("_admin_add", function(done){
		let cloud_error=null;
		async.series([
			function(call){
				console.log('ADMIN-ADD-START');
				let data_config = Scriptz.get_biz9_config();
				data_config.APP_ID = APP_ID;
				//let cloud_url = Url.get(data_config,'admin/add');
				let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,'admin/post_add',

					"&get_product="+ADMIN_OPTION.GET_PRODUCT +
					"&get_category_product="+ADMIN_OPTION.GET_CATEGORY_PRODUCT +
					"&product_count="+ADMIN_OPTION.PRODUCT_COUNT +
					"&category_product_count="+ADMIN_OPTION.CATEGORY_PRODUCT_COUNT+

					"&get_event="+ADMIN_OPTION.GET_EVENT +
					"&get_category_event="+ADMIN_OPTION.GET_CATEGORY_EVENT +
					"&event_count="+ADMIN_OPTION.EVENT_COUNT +
					"&category_event_count="+ADMIN_OPTION.CATEGORY_EVENT_COUNT+

					"&get_business_review="+ADMIN_OPTION.GET_BUSINESS_REVIEW +
					"&business_review_count="+ADMIN_OPTION.BUSINESS_REVIEW_COUNT +

					"&get_blog_post="+ADMIN_OPTION.GET_BLOG_POST +
					"&get_category_blog_post="+ADMIN_OPTION.GET_CATEGORY_BLOG_POST +
					"&blog_post_count="+ADMIN_OPTION.BLOG_POST_COUNT +
					"&category_blog_post_count="+ADMIN_OPTION.CATEGORY_BLOG_POST_COUNT+

					"&get_service="+ADMIN_OPTION.GET_SERVICE +
					"&get_category_service="+ADMIN_OPTION.GET_CATEGORY_SERVICE +
					"&service_count="+ADMIN_OPTION.SERVICE_COUNT +
					"&category_service_count="+ADMIN_OPTION.CATEGORY_SERVICE_COUNT+

					"&value_count="+ADMIN_OPTION.VALUE_COUNT+
					"&section_count="+ADMIN_OPTION.SECTION_COUNT+
					"&question_count="+ADMIN_OPTION.QUESTION_COUNT+
					"&get_page="+ADMIN_OPTION.GET_PAGE+
					"&get_admin="+ADMIN_OPTION.GET_ADMIN+
					"&get_business="+ADMIN_OPTION.GET_BUSINESS+
					"&get_template="+ADMIN_OPTION.GET_TEMPLATE+
					"&get_faq="+ADMIN_OPTION.GET_FAQ+
					"&get_team="+ADMIN_OPTION.GET_TEAM
				);
				Log.w('data_config',data_config);
				Log.w('cloud_url',cloud_url);
				Log.w('option',ADMIN_OPTION);
				let admin = DataItem.get_new(DataType.ADMIN,0,{email:EMAIL,password:PASSWORD});
				admin.email = EMAIL;
				admin.password = PASSWORD;
				axios.post(cloud_url, {
					data: admin
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							let admin = response.data.cloud.item;
							console.log('ADMIN-ADD-SUCCESS');
						}
						call();
					})
					.catch(function (error) {
						cloud_error=Log.append(cloud_error,error);
						call();
					});
			},
		],
			function(error, result){
				if(cloud_error){
					Log.error("ADMIN-ADD-ERROR-DONE",cloud_error);
				}else{
					console.log('ADMIM-ADD-SUCCESS-DONE');
				}
				done();
			});
	});
});
describe('admin_update', function(){ this.timeout(25000);
	it("_admin_update", function(done){
		let cloud_error=null;
		async.series([
			function(call){
				console.log('ADMIN-UPDATE-START');
				let data_config = Scriptz.get_biz9_config();
				data_config.APP_ID = APP_ID;
				let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,'admin/post_update',
					"&get_product="+ADMIN_OPTION.GET_PRODUCT +
					"&get_category_product="+ADMIN_OPTION.GET_CATEGORY_PRODUCT +
					"&product_count="+ADMIN_OPTION.PRODUCT_COUNT +
					"&category_product_count="+ADMIN_OPTION.CATEGORY_PRODUCT_COUNT+

					"&get_event="+ADMIN_OPTION.GET_EVENT +
					"&get_category_event="+ADMIN_OPTION.GET_CATEGORY_EVENT +
					"&event_count="+ADMIN_OPTION.EVENT_COUNT +
					"&category_event_count="+ADMIN_OPTION.CATEGORY_EVENT_COUNT+

					"&get_blog_post="+ADMIN_OPTION.GET_BLOG_POST +
					"&get_category_blog_post="+ADMIN_OPTION.GET_CATEGORY_BLOG_POST +
					"&blog_post_count="+ADMIN_OPTION.BLOG_POST_COUNT +
					"&category_blog_post_count="+ADMIN_OPTION.CATEGORY_BLOG_POST_COUNT+

					"&get_service="+ADMIN_OPTION.GET_SERVICE +
					"&get_category_service="+ADMIN_OPTION.GET_CATEGORY_SERVICE +
					"&service_count="+ADMIN_OPTION.SERVICE_COUNT +
					"&category_service_count="+ADMIN_OPTION.CATEGORY_SERVICE_COUNT+

					"&get_product_review="+ADMIN_OPTION.GET_PRODUCT_REVIEW +
					"&product_review_count="+ADMIN_OPTION.PRODUCT_REVIEW_COUNT +

					"&value_count="+ADMIN_OPTION.VALUE_COUNT+
					"&section_count="+ADMIN_OPTION.SECTION_COUNT+
					"&get_page="+ADMIN_OPTION.GET_PAGE+
					"&get_admin="+ADMIN_OPTION.GET_ADMIN+
					"&get_business="+ADMIN_OPTION.GET_BUSINESS+
					"&get_template="+ADMIN_OPTION.GET_TEMPLATE+
					"&get_team="+ADMIN_OPTION.GET_TEAM
				);
				Log.w('data_config',data_config);
				Log.w('cloud_url',cloud_url);
				Log.w('option',ADMIN_OPTION);
				axios.post(cloud_url, {
					data: {}
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							let admin = response.data.cloud.item;
							console.log('ADMIN-UPDATE-SUCCESS');
						}
						call();
					})
					.catch(function (error) {
						cloud_error=Log.append(cloud_error,error);
						call();
					});
			},
		],
			function(error, result){
				if(cloud_error){
					Log.error("ITEM-UPDATE-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-UPDATE-SUCCESS-DONE');
				}
				done();
			});
	});
});


describe('item_update', function(){ this.timeout(25000);
	it("_item_update", function(done){
		let cloud_error=null;
		async.series([
			function(call){
				console.log('UPDATE-START');
				let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
				//let cloud_url = Url.update_delete_cache_item(Scriptz.get_biz9_config(),DATA_TYPE,KEY);
				/*
				let item_test = Item_Logic.get_test_item(DATA_TYPE,0);
				item_test.parent_id = PARENT_ID;
				item_test.parent_data_type = PARENT_DATA_TYPE;
				Log.w('item_update',item_test);
				Log.w('cloud_url',cloud_url);
				*/

				let data = Product_Logic.get_test();
				data.items = [];
				data.items.push(Product_Logic.get_test());
				data.items.push(Product_Logic.get_test());
				Log.w('data',data);
				axios.post(cloud_url, {
					data: data
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							Log.w('cloud',response.data.cloud);
							console.log('UPDATE-SUCCESS');
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
					Log.error("UPDATE-ERROR-DONE",cloud_error);
				}else{
					console.log('UPDATE-SUCCESS-DONE');
				}
				done();
			});
	});
});
describe('item_get', function(){ this.timeout(25000);
	it("_item_get", function(done){
		let cloud_error=null;
		console.log('ITEM-GET-START');
		async.series([ function(call){
			console.log('ITEM-GET-START');
			let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.GET);
			Log.w('cloud_url',cloud_url);
			axios.get(cloud_url, {
				data: {}
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.cloud_error);
					}else{
						Log.w('cloud',response.data.cloud);
						console.log('ITEM-GET-SUCCESS');
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
					Log.error("ITEM-GET-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-GET-SUCCESS-DONE');
				}
				done();
			});
	});
});
describe('item_delete', function(){ this.timeout(25000);
	it("_item_delete", function(done){
		let cloud_error=null;
		console.log('ITEM-DELETE-START');
		async.series([
			function(call){
				console.log('ITEM-DELETE-START');
				//let cloud_url = Url.update_delete_cache_item(Scriptz.get_biz9_config(),DATA_TYPE,KEY);
				let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.DELETE);

				Log.w('cloud_url',cloud_url);
				axios.delete(cloud_url, {
					data: {key:KEY}
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							Log.w('cloud',response.data.cloud);
							console.log('ITEM-DELETE-SUCCESS');
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
					Log.error("ITEM-DELETE-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-DELETE-SUCCESS-DONE');
				}
				done();
			});
	});
});
describe('item_list_update', function(){ this.timeout(25000);
	it("_item_list_update", function(done){
		let cloud_error=null;
		console.log('ITEM-UPDATE-LIST-START');
		async.series([
			function(call){
				console.log('ITEM-UPDATE-LIST-START');
				let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.UPDATE_LIST);
				Log.w('cloud_url',cloud_url);
				let item_list_test = [];
				let group_id = Num.get_id();
				item_list_test.push(Item_Logic.get_test_item(DATA_TYPE,0));
				item_list_test.push(Item_Logic.get_test_item(DATA_TYPE,0));
				item_list_test.push(Item_Logic.get_test_item(DATA_TYPE,0));
				for(let a=0;a<item_list_test.length;a++){
					item_list_test[a].group_id = group_id;
				}
				Log.w('test_update_list_test',item_list_test);
				axios.post(cloud_url, {
					data: item_list_test
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							Log.w('cloud',response.data.cloud);
							console.log('ITEM-UPDATE-LIST-SUCCESS');
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
					Log.error("ITEM-UPDATE-LIST-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-UPDATE-LIST-SUCCESS-DONE');
				}
				done();
			});
	});
});
describe('item_list_get', function(){ this.timeout(25000);
	it("_item_list_get", function(done){
		let cloud_error=null;
		console.log('TEST-ITEM-GET-LIST-START');
		async.series([
			function(call){
				console.log('ITEM-GET-LIST-START');
				let cloud_url = Url.get_list(Scriptz.get_biz9_config(),DATA_TYPE);
				Log.w('cloud_url',cloud_url);
				//let filter=FILTER;
				// let param_obj = {data_type:DATA_TYPE,filter:filter,sort_by,page_current:0,page_size:10};
				//let param_obj = {data_type:DataType.ITEM,filter:{parent_data_type:PARENT_DATA_TYPE },sort_by:{'title':-1},page_current:1,page_size:10};
				let param_obj = {data_type:DATA_TYPE,filter:{},sort_by:{'title':-1},page_current:1,page_size:10};
				//let param_obj = {data_type:DataType.BLANK,filter:{},sort_by:{'title':-1},page_current:1,page_size:10};
				let sort_by={'title':-1};
				Log.w('param_obj',param_obj);
				axios.post(cloud_url, {
					data: param_obj
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							Log.w('cloud',response.data.cloud);
							Log.w('param_obj',param_obj);
							Log.w('cloud_url',cloud_url);
							console.log('ITEM-LIST-GET-SUCCESS');

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
					Log.error("ITEM-GET-LIST-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-GET-LIST-SUCESS-DONE');
				}
				done();
			});
	});
});
describe('item_list_delete', function(){ this.timeout(25000);
	it("_item_list_delete", function(done){
		let cloud_error=null;
		console.log('ITEM-DELETE-LIST-START');
		async.series([
			function(call){
				console.log('ITEM-DELETE-LIST-START');
				let cloud_url = Url.delete_list(Scriptz.get_biz9_config(),DATA_TYPE);
				Log.w('cloud_url',cloud_url);
				let filter=FILTER;
				let sort_by={'title':-1};
				let param_obj = {data_type:DATA_TYPE,filter:filter,sort_by,page_current:0,page_size:10};
				Log.w('param_obj',param_obj);
				axios.get(cloud_url, {
					data: param_obj
				})
					.then(function (response) {
						if(response.data.cloud_error){
							cloud_error=Log.append(cloud_error,response.data.cloud_error);
						}else{
							Log.w('cloud',response.data.cloud);
							console.log('ITEM-LIST-DELETE-SUCCESS');
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
					Log.error("ITEM-DELETE-LIST-ERROR-DONE",cloud_error);
				}else{
					console.log('ITEM-DELETE-LIST-SUCESS-DONE');
				}
				done();
			});
	});
});
//9_get_Data
describe('get_data', function(){ this.timeout(25000);
	it("_get_data", function(done){
		let cloud_error=null;
		let cloud_url="";
		console.log('GET-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			biz9_config.APP_ID = APP_ID;

			//let user_id = "8065d0f4-253d-444f-b46e-c50575691993";
			//let item_data_type = DataType.BLOG_POST;
			//let item_id = "9a9aaa2e-320a-4603-8f44-ef592e1f25ef";
			//let cloud_url = Item_Url.template(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,'primary',"&get_item=true");
			//let cloud_url = "http://localhost:1904/product/detail?app_id=test-stage";
			//let cloud_url = "http://localhost:1904/cms/item_parent_top_type_category?app_id=test-stage";
			//let data = {data_type:DataType.PRODUCT,id:0};
			//let cloud_url = Product_Url.home(DATA_CONFIG.APP_ID,DATA_CONFIG.URL);
			//let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PRODUCT_DETAIL);
			let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_HOME);
			//let cloud_url = Url.get(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,DataType.BLOG_POST,'blog_post_6');
			Log.w('cloud_url',cloud_url);
			axios.post(cloud_url, {
				data: {user_id: "2a545946-3330-43b2-8ffa-99e40e201e99"}
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.cloud_error);
					}
					//Log.w('cloud_response',response.data);
					//Log.w('error',response.data.cloud_error);
					//Log.w('cloud_url_get',cloud_url);
					console.log('GET-SUCCESS');
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
					Log.error("GET-ERROR-DONE",cloud_error);
				}else{
					console.log('GET-SUCCESS-DONE');
				}
				done();
			});
	});
});
//9_post_data
describe('post_data', function(){ this.timeout(25000);
	it("_post_data", function(done){
		let cloud_error=null;
		console.log('POST-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();

			let data_type = DataType.PRODUCT;
			let id = 0;
			//let cloud_url = Url.url(DATA_CONFIG,'main/crud/update_item_photo_list/'+data_type+"/"+0);
			//let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PRODUCT_DETAIL);
			Log.w('cloud_url',cloud_url);
			let data = {key:'admin_panel_product_9'};
			Log.w('data',data);
			//let cloud_url = User_Url.login(DATA_CONFIG.APP_ID,DATA_CONFIG.URL);
			//let cloud_url = Item_Url.post_cdn_photo(DATA_CONFIG.APP_ID,DATA_CONFIG.URL);
			//let data = [];
			//let cloud_url = "http://localhost:1904/item/activity?app_id=test-stage";
			let user = DataItem.get_new(DataType.USER,0,{email:"ceo@bossappz.com",password:"1234567"});
			//super_admin - add - end
			//DEMO-POST-END
			//super_admin - add - start

			axios.post(cloud_url, {
				data: data
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.error);
					}else{
						Log.w('cloud',response.data);
						console.log('POST-SUCCESS');
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
					Log.error("POST-ERROR-DONE",cloud_error);
				}else{
					console.log('POST-SUCCESS-DONE');
				}
				done();
			});
	});
});

//9_post_user
describe('post_user_data', function(){ this.timeout(25000);
	it("_post_user_data", function(done){
		let cloud_error=null;
		console.log('POST-USER-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			//super_admin - add - start
			let data_type = DataType.PRODUCT;
			let id = 0;
			let data = DataItem.get_new(DataType.USER,0,{title:'ceo',title_url:'ceo',email:"ceo@bossappz.com",password:"123456789Ab!",role:Type.USER_ROLE_SUPER_ADMIN});
			let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
			Log.w('cloud_url',cloud_url);
			Log.w('data',data);
			axios.post(cloud_url, {
				data: data
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


describe('upload_file_dont_work', function(){ this.timeout(25000);
	it("_upload_file", function(done){
		//.field('extra_info', '{"in":"case you want to send json along with your file"}')
		//.attach('image', 'path/to/file.jpg')


		let cloud_error=null;
		console.log('UPLOAD-FILE-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			let cloud_url = Url.get_url(biz9_config,'main/file/upload_audio');
			Log.w('cloud_url',cloud_url);
			axios.post(cloud_url, {
				data: {}
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.cloud_error);
					}else{
						Log.w('cloud',response.data.cloud);
						console.log('POST-SUCCESS');
					}
					call();
				})
				.catch(function (error) {
					cloud_error=Log.append(cloud_error,error);
					call();
				});
			/*
			 request.post('/your/endpoint')
			  .field('extra_info', '{"in":"case you want to send json along with your file"}')
			  .attach('image', 'path/to/file.jpg')
			  .end(function(err, res) {
				  res.should.have.status(200); // 'success' status
				  done();
			  });
			  */
		}
		],
			function(error, result){
				if(cloud_error){
					Log.error("POST-ERROR-DONE",cloud_error);
				}else{
					console.log('UPLOAD-FILE-SUCCESS');
				}
				done();
			});
	});
});

