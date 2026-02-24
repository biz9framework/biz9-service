/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Service - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Log} = require("biz9-utility");
const {Service_Logic,Url} = require("./index");
/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-feb17';
/* --- DATA CONFIG START --- */
const DATA_CONFIG ={
    APP_ID:APP_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let error=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                Log.w('99_biz_data',Service_Logic.get_url(DATA_CONFIG.APP_ID,'cool','Url.GET'));
            },
        ],
            function(error, result){
                console.log('CONNECT-DONE');
                done();
            });
    });
});

