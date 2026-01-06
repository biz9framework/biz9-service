let express=require('express');
let router=express.Router();
/* -- biz9-start -- */
const {Database}=require("/home/think2/www/doqbox/biz9-framework/biz9-data/code");
const {Scriptz}=require("biz9-scriptz");
/* -- biz9-end -- */
router.get('/ping_get', function(req, res, next) {
    let error=null;
    let data = {status:'service-ping-get-resultOK',post_data:req.body.data};
    console.log('service-ping-get-start');
    console.log(data);
    console.log('service-ping-get-end');
    re.send({error:error,data:data});
    res.end();
});
router.post('/ping_post', function(req, res, next) {
    let error=null;
    let data = {status:'service-ping-post-resultOK',post_data:req.body.data.data};
    console.log('service-ping-post-start');
    console.log(data);
    console.log('service-ping-post-end');
    res.send({error:error,data:data});
    res.end();
});


module.exports = router;
