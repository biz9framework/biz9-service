async = require('async')
const axios = require('axios');
const {Data} = require("biz9-data");
const {Scriptz} = require("biz9-scriptz");
const {Type,Data_Logic,App_Logic,Url} = require("/home/think2/www/doqbox/biz9-framework/biz9-logic/code");
const assert = require('node:assert');
const {Log,Num,Str} = require("biz9-utility");
/*
 * availble tests
- connect
- get
- ping
- post
- post_user
- admin_add
- admin_update
*/

//-env-test - start //
let APP_ID = "test-stage-jan1";
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
				let new_data_type = Type.DATA_PRODUCT;
				//-->
				//let parent = Data_Logic.get(new_data_type,0,{test:true,generate_title:true});
				//let parent = Data_Logic.get(new_data_type,0,{test:true});
				let parent = Data_Logic.get(new_data_type,'3105ca56-67ab-4c6d-91e7-4a9a7720a417');
				//let parent = Data_Logic.get(Type.DATA_CATEGORY,0);
				//-->
				//let post_data = {id:parent.id,data_type:parent.data_type,data:parent};
				let post_data = {id:parent.id,data_type:parent.data_type};
				//-->
				//let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.GET);
				Log.w('url',url);
				//-- URL END --//
				axios.post(url,
					{data:post_data}
				)
					.then(function (response) {
						Log.w('post_data',response.data);
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
				let cloud_url = Url.update_item(Scriptz.get_biz9_config(),Type.DATA_ADMIN,0);
				let admin = Data_Logic.get(Type.DATA_ADMIN,0);
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
//9_get
describe('get', function(){ this.timeout(25000);
	it("_get", function(done){
		let cloud_error=null;
		let cloud_url="";
		console.log('GET-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();

			// -->
			//let parent_item = Data_Logic.get(Type.DATA_PRODUCT,0);
			let parent_item = Data_Logic.get(Type.DATA_PRODUCT,'40602742-90e6-40bb-ac59-b62e8c54b1c7');

			// -->
			let join_type = App_Logic.get_join(Data_Logic.get_search(Type.DATA_TYPE,{},{},1,0),'types',Type.TITLE_LIST,{});
			let category_type = App_Logic.get_join(Data_Logic.get_search(Type.DATA_CATEGORY,{},{},1,0),'categorys',Type.TITLE_LIST,{});
			// -->
			//let option = {};
			let option = {field:{title_url:0},joins:[join_type,category_type]};
			// -->
			let post_data = {id:parent_item.id,data_type:parent_item.data_type,option:option};

			// -->
			let cloud_url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.GET);

			Log.w('cloud_url',cloud_url);
			Log.w('option',option);
			Log.w('option_joins',option.joins);
			Log.w('post',post_data);
			axios.post(cloud_url, {
				data: post_data
			})
				.then(function (response) {
					if(response.data.cloud_error){
						cloud_error=Log.append(cloud_error,response.data.cloud_error);
					}
					Log.w('_cloud_response',response.data);
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
//9_post
describe('post', function(){ this.timeout(25000);
	it("_post", function(done){
		let cloud_error=null;
		console.log('POST-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			// -->
			let parent_item = Data_Logic.get(Type.DATA_PRODUCT,0);

			// -->
			let title_value = 'product '+ Num.get_id();
			let post_data = {id:parent_item.id,data_type:parent_item.data_type,data:{title:title_value,title_url:Str.get_title_url(title_value),field_1:'field_1',field_2:'field_2'}};

			// -->
			let cloud_url =  App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);

			Log.w('cloud_url',cloud_url);
			Log.w('post',post_data);
			axios.post(cloud_url, {
				data: post_data
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
		} ],
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
describe('post_user', function(){ this.timeout(25000);
	it("_post_user", function(done){
		let cloud_error=null;
		console.log('POST-USER-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
			//super_admin - add - start
			let data_type = Type.DATA_PRODUCT;
			let id = 0;
			let data = Data_Logic.get(Type.DATA_USER,0,{title:TITLE,title_url:TITLE_URL,email:EMAIL,password:PASSWORD,role:ROLE});
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

/*
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
*/


