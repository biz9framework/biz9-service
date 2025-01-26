var request = require('request') , async = require('async')
const { get_db_connect,close_db_connect,check_db_connect,update_item,update_item_list,get_item,delete_item,get_item_list,delete_item_list,count_item_list } = require("./");
const {get_new_item}  = require("biz9-app");
const { get_id } = require("biz9-utility");
const assert = require('node:assert');
const APP_TITLE_ID = 'mobile-jan25';
const ID = 'b6b28f87-5049-4ab5-8d7b-74ac650829adff';
const DATA_TYPE = 'blank_biz';
const SQL = {};
/*
test_connect
test_item_update
test_item_again_update
test_item_get
test_item_delete
test_item_update_list
test_item_get_list
test_item_delete_list
test_item_list_count
*/
/* --- BiZ9_CORE_CONFIG-END --- */
describe('test_connect', function(){ this.timeout(25000);
    it("_test_connect", function(done){
        let db_connect = {};
        async.series([
            function(call){
                console.log('--TEST-GET-DB-CONNECT-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-CLIENT-DB-- '+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log(data);
                    console.log('--TEST-GET-DB-CONNECT-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-DB-CONNECT-2-START--');
                check_db_connect(db_connect).then((data)=> {
                    if(error){
                        throw '--TEST-GET-CLIENT-DB-CONNECT-CHECK-- '+ error;
                    }
                    console.log(data);
                    console.log('--TEST-GET-DB-CONNECT-2-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-DB-CONNECT-3-END--');
                close_db_connect(db_connect).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-CLIENT-DB-CHECK-CLOSE-- '+ error;
                    }
                    db_connect = data;
                    assert.equal(db_connect,null);
                    console.log(data);
                    console.log('--TEST-GET-DB-CONNECT-4-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
        ],
            function(error, result){
                console.log('--TEST-GET-DB-CONNECT--DONE--');
                done();
            });
    });
});
//9_item_update 9_update
describe('test_item_update', function(){ this.timeout(25000);
    it("_test_item_update", function(done){
        let db_connect = {};
        let item_test = get_test_item();
        let options={get_count:false,get_mp3:false,get_photo:false,get_date:false};
        //let options={get_count:true,get_mp3:true,get_photo:true,get_date:true};
        async.series([
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE--START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-ERROR '+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-GET-ITEM-UPDATE--END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-2--START--');
                update_item(db_connect,DATA_TYPE,item_test,options).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-2--ERROR '+ error;
                    }
                    item_test = data;
                    assert.notEqual(data,null);
                    console.log(item_test);
                    console.log('--TEST-GET-ITEM-UPDATE-2--END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-GET-ITEM-UPDATE-3--START--');
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-3-- '+ error;
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('--TEST-GET-ITEM-UPDATE-3--END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-Assert--START--');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('--TEST-GET-ITEM-UPDATE-Assert--END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-GET-ITEM-UPDATE--DONE--');
                done();
            });
    });
});
//9_item_again_update 9_again_update
describe('test_item_again_update', function(){ this.timeout(25000);
    it("_test_item_again_update", function(done){
        let db_connect = {};
        let item_test = get_new_item(DATA_TYPE,ID);
        let options={get_count:false,get_mp3:false,get_photo:false,get_date:false};
        //let options={get_count:true,get_mp3:true,get_photo:true,get_date:true};
        async.series([
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE--START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-ERROR '+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-GET-ITEM-UPDATE--END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-2--START--');
                item_test.first_name = 'cool_bean_first';
                item_test.last_name = 'cool_bean_last';
                update_item(db_connect,DATA_TYPE,item_test,options).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-2--ERROR '+ error;
                    }
                    item_test = data;
                    console.log(item_test);
                    console.log('--TEST-GET-ITEM-UPDATE-2--END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-GET-ITEM-UPDATE-3--START--');
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-3-- '+ error;
                    }
                    db_connect=data;
                    console.log('--TEST-GET-ITEM-UPDATE-3--END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-Assert--START--');
                assert.notEqual(item_test,null);
                assert.equal(item_test.first_name,'cool_bean_first');
                assert.equal(item_test.last_name,'cool_bean_last');
                assert.equal(item_test.id,ID);
                assert.equal(item_test.data_type,DATA_TYPE);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('--TEST-GET-ITEM-UPDATE-Assert--END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-GET-ITEM-UPDATE--DONE--');
                done();
            });
    });
});

//9_update_list //9_list
describe('test_item_list_update', function(){ this.timeout(25000);
    it("_test_item_list_update", function(done){
        let db_connect = {};
        let item_test_list = [];
        let options={get_count:false,get_mp3:false,get_photo:false,get_date:false};
        //let options={get_count:true,get_mp3:true,get_photo:true,get_date:true};
        async.series([
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-LIST-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-LIST-ERROR--'+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-GET-ITEM-UPDATE-LIST-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-LIST-2-START--');
                test_group_id=get_id();
                for(a=0;a<10;a++){
                    item_test=get_test_item();
                    item_test.test_group_id=test_group_id;
                    item_test_list.push(item_test);
                }
                update_item_list(db_connect,item_test_list,options).then(([error,data])=> {
                    if(error){
                        throw '--TEST-INSERT-LIST-2-ERROR '+ error;
                    }
                    console.log(data);
                    assert.notEqual(0,data.length);
                    assert.strictEqual(10,data.length);
                    assert.notEqual(0,data[0].id);
                    console.log('--TEST-GET-ITEM-UPDATE-LIST-2-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-GET-ITEM-UPDATE-LIST-3-START--');
                    if(error){
                        throw '--TEST-GET-ITEM-UPDATE-3-- '+ error;
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('--TEST-GET-ITEM-UPDATE-LIST-3-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--Error--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-UPDATE-LIST-Assert--START');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('--TEST-GET-ITEM-UPDATE-LIST-Assert--END');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-GET-ITEM-UPDATE-LIST--DONE--');
                done();
            });
    });
});
//9_get_item
describe('test_item_get', function(){ this.timeout(25000);
    it("_test_item_get", function(done){
        let db_connect = {};
        let item_test = get_new_item(DATA_TYPE,ID);
        let options={get_count:false,get_mp3:false,get_photo:false,get_date:false};
        // let options={get_count:true,get_mp3:true,get_photo:true,get_date:true};
        async.series([
            function(call){
                console.log('--TEST-GET-ITEM-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-ERROR--'+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-GET-ITEM-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-GET-ITEM-2-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-2-START--');
                get_item(db_connect,DATA_TYPE,item_test.id,options).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-2-ERROR--'+ error;
                    }
                    item_test = data;
                    console.log(item_test);
                    assert.notEqual(0,data.id);
                    assert.equal(DATA_TYPE,data.data_type);
                    console.log('--TEST-GET-ITEM-2-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-GET-ITEM-3-ERROR--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-GET-ITEM-BLANK-TITLE-4-START--');
                    if(error){
                        throw '--TEST-GET-ITEM-BLANK-TITLE-4-ERROR--'+ error;
                    }
                    db_connect=data;
                    assert.equal(db_connect,null);
                    console.log('--TEST-GET-ITEM-BLANK-TITLE-4-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-GET-ITEM-BLANK-TITLE-4-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-ASSERT-START--');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('--TEST-GET-ITEM-BLANK-TITLE-ASSERT-END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-DONE--');
                done();
            });
    });
});
//9_blank
describe('test_blank', function(){ this.timeout(25000);
    it("_test_blank", function(done){
        let db_connect = {};
        let item_test_list = [];
        async.series([
            function(call){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-BLANK-TITLE-ERROR--'+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-GET-ITEM-BLANK-TITLE-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-GET-ITEM-BLANK-TITLE-2-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-2-START--');
                go(db_connect,item).then(([error,data])=> {
                    if(error){
                        throw '--TEST-GET-ITEM-BLANK-TITLE-3-ERROR--'+ error;
                    }
                    assert.notEqual(0,data.length);
                    assert.strictEqual(10,data.length);
                    assert.notEqual(0,data[0].id);
                    console.log('--TEST-GET-ITEM-BLANK-TITLE-2-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-GET-ITEM-BLANK-TITLE-3-ERROR--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-GET-ITEM-BLANK-TITLE-3-START--');
                    if(error){
                        throw '--TEST-GET-ITEM-BLANK-TITLE-4-ERROR--'+ error;
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('--TEST-GET-ITEM-BLANK-TITLE-3-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-GET-ITEM-BLANK-TITLE-4-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-ASSERT-START--');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('--TEST-GET-ITEM-BLANK-TITLE-ASSERT-END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-DONE--');
                done();
            });
    });
});
//9_delete_item
describe('test_item_delete', function(){ this.timeout(25000);
    it("_test_item_delete", function(done){
        let db_connect = {};
        let item_test = get_new_item(DATA_TYPE,ID);
        async.series([
            function(call){
                console.log('--TEST-DELETE-ITEM-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-DELETE-ITEM-ERROR--'+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-DELETE-ITEM-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-DELETE-ITEM-2-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-GET-DELETE-2-START--');
                delete_item(db_connect,DATA_TYPE,item_test.id).then(([error,data])=> {
                    if(error){
                        throw '--TEST-DELETE-ITEM-2-ERROR--'+ error;
                    }
                    item_test = data;
                    console.log(item_test);
                    console.log('--TEST-DELETE-ITEM-2-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-DELETE-ITEM-3-ERROR--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-DELETE-ITEM-4-START--');
                    if(error){
                        throw '--TEST-DELETE-ITEM-4-ERROR--'+ error;
                    }
                    db_connect=data;
                    assert.equal(db_connect,null);
                    console.log('--TEST-DELETE-ITEM-4-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-DELETE-ITEM-4-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-DELETE-ITEM-ASSERT-START--');
                assert.equal(item_test.cache_del,true);
                assert.equal(item_test.db_del,true);
                console.log('--TEST-GET-ITEM-BLANK-TITLE-ASSERT-END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-GET-ITEM-BLANK-TITLE-DONE--');
                done();
            });
    });
});
//9_item_list 9_sql test_item_get_list
describe('list_get_item', function(){ this.timeout(25000);
    it("_list_get_item", function(done){
        let db_connect = {};
        let item_test_list = [];
        let sort_by = {};
        let page_current = 0;
        let page_size = 5;
        let options={get_count:false,get_mp3:false,get_photo:false,get_date:false};
        //let options={get_count:true,get_mp3:true,get_photo:true,get_date:true};
        async.series([
            function(call){
                console.log('--TEST-ITEM-LIST-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-ITEM-LIST-ERROR--'+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-ITEM-LIST-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-ITEM-LIST-2-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-ITEM-LIST-2-START--');
                get_item_list(db_connect,DATA_TYPE,SQL,sort_by,page_current,page_size,options).then(([error,item_data_list,item_data_count,page_count])=> {
                    if(error){
                        throw '--TEST-ITEM-LIST-3-ERROR--'+ error;
                    }
                    console.log(item_data_list);
                    console.log("Total Count: " +item_data_count);
                    console.log("Page Count: " +page_count);
                    console.log('--TEST-ITEM-LIST-2-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-ITEM-LIST-4-ERROR--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-ITEM-LIST-3-START--');
                    if(error){
                        throw '--TEST-ITEM-LIST-5SQL-GET-PAGING-5-ERROR--'+ error;
                    }
                    db_connect=data;
                    console.log('--TEST-ITEM-LIST-3-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-SQL-GET-PAGING-6-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-ITEM-LIST-ASSERT-START--');
                assert.equal(null,db_connect);
                assert.notEqual(item_test_list.count,0);
                console.log('--TEST-ITEM-LIST-ASSERT-END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-ITEM-LIST-DONE--');
                done();
            });
    });
});
//9_delete_item_list 9_sql test_item_delete_list 9_delete_list
describe('test_delete_list_item', function(){ this.timeout(25000);
    it("_test_delete_list_item", function(done){
        let db_connect = {};
        let item_test_list = [];
        async.series([
            function(call){
                console.log('--TEST-ITEM-DELETE-LIST-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-ITEM-DELETE-LIST-ERROR--'+ error;
                    }
                    db_connect = data;
                    console.log('--TEST-ITEM-DELETE-LIST-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-ITEM-DELETE-LIST-2-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-ITEM-DELETE-LIST-2-START--');
                delete_item_list(db_connect,DATA_TYPE,SQL).then(([error,data_list])=> {
                    if(error){
                        throw '--TEST-ITEM-DELETES-LIST-3-ERROR--'+ error;
                    }
                    item_test_list = data_list;
                    console.log('--TEST-ITEM-DELETE-LIST-3-START--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-ITEM-DELETES-LIST-4-ERROR--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-ITEM-DELETE-LIST-3-START--');
                    if(error){
                        throw '--TEST-ITEM-DELETE-LIST-5-ERROR--'+ error;
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('--TEST-ITEM-DELETE-LIST-4-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-ITEM-DELETE-LIST-6-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-ITEM-DELETE-LIST-ASSERT-START--');
                assert.notEqual(item_test_list.length,0);
                assert.notEqual(0,item_test_list.length);
                assert.equal(null,db_connect);
                console.log('--TEST-ITEM-DELETE-LIST-ASSERT-START--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-ITEM-LIST-DONE--');
                done();
            });
    });
});
//9_count
describe('test_count_list', function(){ this.timeout(25000);
    it("_test_count_list", function(done){
        let db_connect = {};
        let item_list_count = 0;
        async.series([
            function(call){
                console.log('--TEST-COUNT-LIST-START--');
                get_db_connect(APP_TITLE_ID).then(([error,data])=> {
                    if(error){
                        throw '--TEST-COUNT-LIST-ERROR--'+ error;
                    }
                    db_connect = data;
                    assert.notEqual(db_connect,null);
                    console.log('--TEST-COUNT-LIST-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-COUNT-LIST-2-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-COUNT-LIST-2-START--');
                count_item_list(db_connect,DATA_TYPE,SQL).then(([error,data])=> {
                    if(error){
                        throw '--TEST-COUNT-LIST-3-ERROR--'+ error;
                    }
                    console.log(data);
                    /*
                    assert.notEqual(0,data.length);
                    assert.strictEqual(10,data.length);
                    assert.notEqual(0,data[0].id);
                    */
                    console.log('--TEST-COUNT-LIST-3-END--');
                    //call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-COUNT-LIST-3-ERROR--",error);
                }
            },
            function(call){
                close_db_connect(db_connect).then(([error,data])=> {
                    console.log('--TEST-COUNT-LIST-3-START--');
                    if(error){
                        throw '--TEST-COUNT-LIST-4-ERROR--'+ error;
                    }
                    db_connect=data;
                    assert.equal(data,null);
                    console.log('--TEST-COUNT-LIST-3-END--');
                    call();
                }).catch(error => handleError(error))
                function handleError(error) {
                    console.error("--TEST-COUNT-LIST-4-ERROR--",error);
                }
            },
            function(call){
                console.log('--TEST-COUNT-LIST-ASSERT-START--');
                assert.notEqual(item_test.first_name,0);
                assert.notEqual(item_test.first_name,null);
                assert.notEqual(item_test.id,0);
                assert.notEqual(item_test.id,null);
                assert.equal(null,db_connect);
                console.log('--TEST-COUNT-LIST-ASSERT-END--');
                call();
            },
        ],
            function(error, result){
                console.log('--TEST-COUNT-LIST-DONE--');
                done();
            });
    });
});

function report_show(error,item,cloud_url){
    if(error){
        console.log('ERROR HAS OCCORED------------------------------------');
        console.log(error);
    }
    if(String(typeof(item))=='object'){
        p = JSON.parse(item);
        console.log(p);
        return p;
    }
    else{
        console.log(item);
        return false;
    }
}
function get_test_item(){
    item_test = get_new_item(DATA_TYPE,0);
    _id=get_id(999);
    item_test.title='title_'+_id;
    item_test.first_name='first_name_'+_id;
    item_test.last_name='last_name_'+_id;
    item_test.user_name='user_name_'+_id;
    item_test.test_group_id=_id;
    return item_test;
}
