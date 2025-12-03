let express=require('express');
let router=express.Router();
/* -- biz9-start -- */
const {Admin,Business,Data,Database,Portal,Product_Data,Page_Data,Category_Data,Blog_Post_Data,Content_Data,Template_Data,Business_Data,Review_Data,Faq_Data,Favorite_Data}=require("biz9-data");
const {Scriptz}=require("biz9-scriptz");
const {DataType,DataItem}=require("biz9-logic");
const {Log,Form,Str}=require("biz9-utility");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let error=null;
    let data={};
    data="service-ping";
    console.log(data);
    res.send({error:error,data:data});
    res.end();
});
module.exports = router;
