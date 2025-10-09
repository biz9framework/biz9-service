let express=require('express');
let router=express.Router();
/* -- biz9-start -- */
const {Scriptz}=require("biz9-scriptz");
const {Portal,Database,Service_Data}=require("biz9-data");
const {DataType,DataItem}=require("biz9-logic");
const {Log,Form,Str}=require("biz9-utility");
/* -- biz9-end -- */
router.get('/ping', function(req, res, next) {
    let cloud={};
    cloud.data="blank-ping";
    console.log(cloud);
    res.send({cloud:cloud});
    res.end();
});
router.get('/get/:key', function(req, res, next) {
    let cloud_error = null;
    let database,cloud = {};
    cloud.item = DataItem.get_new(DataType.SERVICE,0,{key:req.params.key});
    async.series([
        async function(call){
            let biz9_config = Scriptz.get_biz9_config({app_id:(req.query.app_id)?req.query.app_id:null});
            const [error,data] = await Database.get(biz9_config);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                database = data;
            }
        },
        async function(call){
            const [error,data] = await Service_Data.get(database,cloud.item.key);
            if(error){
                cloud_error=Log.append(cloud_error,error);
            }else{
                cloud.service = data;
            }
        },
    ],
        function(err, result){
            res.send({cloud_error,cloud});
            res.end();
        });
});
module.exports = router;
