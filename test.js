async = require('async')
const axios = require('axios');
const {Data} = require("biz9-data");
const {Scriptz} = require("biz9-scriptz");
const {DataType,DataItem,Page_Logic,App_Logic,Url,Type,Demo_Logic,Review_Logic,Favorite_Logic} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
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
- ping
- post_data
- post_user_data
- admin_add
- admin_update
*/

//-env-test - start //
let APP_ID = "test-stage-dec11";
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
describe('connect', function(){ this.timeout(25000);
	it("_connect", function(done){
		console.log('TEST-CONNECT-START');
		let error=null;
		let db_connect = {};
		async.series([
			function(call){
				console.log('CONNECT-START');
				//-- Database Info START --//
				let key = 'item_5350';
				let option = {};
				let data = {};
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.DATABASE_INFO);
				Log.w('url_22',url);
				//-- Database Info END --//

				//-- FAVORITE START --//
				//
				/*
				console.log('FAVORITE-START');
				let parent_data_type = DataType.PRODUCT;
				let parent_id = "604f0e31-816e-47f4-a411-0c507b859460";
				let user_id = "80009d4a-1df4-421a-9105-d9450ebc5e01";
				let favorite = Favorite_Logic.get_new(parent_data_type,parent_id,user_id);
				let option = {post_stat:true,user_id:user_id};
				let data = {parent_data_type:parent_data_type,parent_id:parent_id,user_id:user_id,option:option};
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.FAVORITE_POST);
				Log.w('url_22',url);
				*/
				//-- REVIEW END --//

				/*
					//-- SEARCH START --//
				let key = 'item_5350';
				let search = App_Logic.get_search(DataType.APP,{},{title:1},1,0);
				let option = {get_join:true,field_key_list:[
					{primary_data_type:DataType.PRODUCT,primary_field:'id',item_field:'product_id',title:'product'},
					{primary_data_type:DataType.PRODUCT,primary_field:'id',item_field:'cms_id',title:'cms'}
				]};
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.SEARCH);
				let data = {key:key,search:search,option:option};
				Log.w('url_22',url);
		//-- SEARCH END --//
		*/

		/*
			//-- URL START --//
				let key = 'admin_panel_product_14';
				let search = App_Logic.get_search(DataType.PRODUCT,{},{},1,0);
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_PRODUCT);
				let option = {get_image:true,get_item:true,get_favorite:true,user_id:"63e7b9ea-7bf8-4780-bf90-5050e501f44c",post_stat:true,post_unique:true};
				let data = {key:key,option:option};
				Log.w('url_22',url);
		//-- URL END --//
		*/

		/*
			//-- REVIEW START --//
				console.log('REVIEW-START');
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.REVIEW_POST);
				let parent_data_type = DataType.PRODUCT;
				let parent_id = "604f0e31-816e-47f4-a411-0c507b859460";
				let user_id = "80009d4a-1df4-421a-9105-d9450ebc5e01";
				let review = Review_Logic.get_new(parent_data_type,parent_id,user_id,Num.get_id()+"_My_Title",Num.get_id()+"_Comment_",Num.get_id(5));
				let option = {post_stat:true,user_id:user_id};
				let data = {parent_data_type:parent_data_type,parent_id:parent_id,parent_id:parent_id,review:review,option:option};
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
		Log.w('RESPONSE_DATA',response.data.data);
		Log.w('URL',url);
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
			let user_id = "b01f49f3-d8e8-4161-8d6e-c467c330f8a9";
			//let user_id = "8065d0f4-253d-444f-b46e-c50575691993";
			//let item_data_type = DataType.BLOG_POST;
			//let item_id = "9a9aaa2e-320a-4603-8f44-ef592e1f25ef";
			//let cloud_url = Item_Url.template(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,'primary',"&get_item=true");
			//let cloud_url = "http://localhost:1904/product/detail?app_id=test-stage";
			//let cloud_url = "http://localhost:1904/cms/item_parent_top_type_category?app_id=test-stage";
			//let cloud_url = "http://localhost:1904/cms/item_parent_top_type_category?app_id=test-stage";
			//let data = {data_type:DataType.PRODUCT,id:0};
			//let cloud_url = Product_Url.home(DATA_CONFIG.APP_ID,DATA_CONFIG.URL);
			//let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PRODUCT_DETAIL);
			//let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.REVIEW_SEARCH);
			let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_HOME);
			//let cloud_url = Url.get(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,DataType.BLOG_POST,'blog_post_6');
			let search = App_Logic.get_search(DataType.BLOG_POST,{},{title:1},1,0);

			Log.w('cloud_url',cloud_url);
			axios.post(cloud_url, {
				data: {
					search: search,
					user_id: user_id,
					key: "item_25344dddaaa",
					option:{get_field_value_list:true}
				}
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.cloud_error);
					}
					Log.w('cloud_response',response.data);
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
			let user_id = "b01f49f3-d8e8-4161-8d6e-c467c330f8a9";
			//let cloud_url = Url.url(DATA_CONFIG,'main/crud/update_item_photo_list/'+data_type+"/"+0);
			//let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PRODUCT_DETAIL);

			/* -- login-start -- */
			let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.LOGIN);
			let user = DataItem.get_new(DataType.USER,0,{email:'ceo@bossappz.com',password:'123456789Ab!',last_login:Date.now()});
			let data = {user:user};
			/* -- login-end -- */

			//let data = {key:'admin_panel_product_9'};
			//Log.w('data',data);
			//let cloud_url = User_Url.login(DATA_CONFIG.APP_ID,DATA_CONFIG.URL);
			//let cloud_url = Item_Url.post_cdn_photo(DATA_CONFIG.APP_ID,DATA_CONFIG.URL);
			//let data = [];
			//let cloud_url = "http://localhost:1904/item/activity?app_id=test-stage";
			//let user = DataItem.get_new(DataType.USER,0,{email:"ceo@bossappz.com",password:"1234567"});
			//let data = Review_Logic.get_new(DataType.PRODUCT,1,user_id,'val_review_title','val_review_comment',4);
			//super_admin - add - end
			//DEMO-POST-END
			//super_admin - add - start
			Log.w('cloud_url',cloud_url);
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

//9_ping_get
describe('ping_get', function(){ this.timeout(25000);
	it("_ping_get", function(done){
		let cloud_error=null;
		console.log('PING-GET-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PING_GET);
			Log.w('cloud_url',cloud_url);
			axios.get(cloud_url, {
				data: {data:'send_ping_get_data'}
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.error);
					}else{
						Log.w('cloud',response.data);
						console.log('PING-GET-SUCCESS');
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
					Log.error("PING-GET-ERROR-DONE",cloud_error);
				}else{
					console.log('PING-GET-SUCCESS-DONE');
				}
				done();
			});
	});
});
//9_ping_post
describe('ping_post', function(){ this.timeout(25000);
	it("_ping_post", function(done){
		let cloud_error=null;
		console.log('PING-POST-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PING_POST);
			Log.w('cloud_url',cloud_url);
			axios.post(cloud_url, {
				data: {data:'send_ping_post_data'}
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.error);
					}else{
						Log.w('cloud',response.data);
						console.log('PING-POST-SUCCESS');
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
					Log.error("PING-POST-ERROR-DONE",cloud_error);
				}else{
					console.log('PING-POST-SUCCESS-DONE');
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
			let data = DataItem.get_new(DataType.USER,0,{title:TITLE,title_url:TITLE_URL,email:EMAIL,password:PASSWORD,role:ROLE});
			let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
			Log.w('cloud_url_99',cloud_url);
			Log.w('data_22',data);
			axios.post(cloud_url, {
				data: {data:data}
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
			axios.get(cloud_url, {
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

