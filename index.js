/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Service
*/
const {Log}=require("biz9-utility");
class Url {
    //crud
    static PING="biz9/data/ping";
    static COPY="biz9/data/copy";
    static DELETE="biz9/data/delete";
    static DELETE_SEARCH="biz9/data/delete_search";
    static GET="biz9/data/get";
    static POST="biz9/data/post";
    static POST_ITEMS="biz9/data/post_items";
    static SEARCH="biz9/data/search";
}
class Service_Logic {
    static get_url = (app_id,host,url,param) => {
        if(!param){
            param='';
        }
        var app_id_url='?app_id='+app_id;
        return host+"/"+url+app_id_url + param;
    };
}
module.exports = {
    Service_Logic,
    Url
};
