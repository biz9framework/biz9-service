async = require('async')
const axios = require('axios');
const {Data} = require("biz9-data");
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
let APP_ID = "test-stage-jan12";
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
				//let search = Data_Logic.get_search(Type.DATA_PRODUCT,{},{},1,0);
				//-->
				//let post_data = {id:parent.id,data_type:parent.data_type,data:parent};
				//let post_data = {id:user.id,data_type:user.data_type,user:user};
				let post_data = {id:parent.id,data_type:parent.data_type,option:{field_value:true,id_field:Type.FIELD_TITLE_URL}};
				//let post_data = {search};
				//-->
				//let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);
				//let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.GET);
				//let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.LOGIN);
				//let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.SEARCH);
				//let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.DELETE);
				let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.PAGE_HOME);
				Log.w('url',url);
				//-- URL END --//
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
		console.log('BLANK-START');
		async.series([ function(call){
			let biz9_config = Scriptz.get_biz9_config();
	        //let parent = Data_Logic.get(new_data_type,0,{test:true});
	        //let post_data = {id:parent.id,data_type:parent.data_type,option:{}};
			let url = App_Logic.get_url(DATA_CONFIG.APP_ID,DATA_CONFIG.URL,Url.POST);


            //product
            let data = Data_Logic.get(Type.DATA_PRODUCT,0,{test:true,count:2,data:{category:'cat1'}});

            Log.w('99_data',data);

            /*
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
            */
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
