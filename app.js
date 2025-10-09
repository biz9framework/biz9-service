/* --- REQUIRE START -- */
async=require("async");
compression=require("compression");
cors=require("cors")
express=require("express");
bodyParser=require("body-parser");
path=require("path");
session=require("express-session");
const {Scriptz}=require("biz9-scriptz");
const {Log}=require("biz9-utility");
biz9_config=Scriptz.get_biz9_config();
/* --- REQUIRE END -- */
/* --- CONFIG START --- */
TITLE=biz9_config.TITLE;
PROJECT_ID=biz9_config.PROJECT_ID;
VERSION=biz9_config.VERSION;
PORT_ID=biz9_config.PORT_ID;
APP_ID=biz9_config.APP_ID;
IP_ADDRESS = "168.244.193.23";
GEO_KEY = "4A2F0395D906CA7E334C0A332E06F473";
USER_ID="0d9793ae-04f1-4036-b589-dec56fbcc4d3";
CLOUD_FLARE_API_TOKEN="ZNnMMXR2MNhKhj1vskWbDbNjabJmiRX6FBIWKKUd";
CLOUD_FLARE_ACCOUNT_ID="d5141ab35f31b135fa3e3ceef222d3a8";
/*--- CONFIG END ---*/
/* --- DEFAULT START --- */
ENV=process.env.NODE_ENV;
/*--- DEFAULT END ---*/
/* --- APP URL-CUSTOM START  -- */
const blog_post=require("./routes/blog_post");
const cms=require("./routes/cms");
const gallery=require("./routes/gallery");
const item=require("./routes/item");
const index=require("./routes/index");
const page=require("./routes/page");
const product=require("./routes/product");
const user=require("./routes/user");
/* --- APP URL-CUSTOM END  -- */
/* --- APP URL START  -- */
const admin=require("./routes/main/admin");
const crud=require("./routes/main/crud");
const image=require("./routes/main/image");
/* --- APP URL END  -- */
/* --- APP EXPRESS START --- */
app=express();
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig))
app.use(session({
    secret:"secret_key_cms",
    secret:"eg[isfd-8yF9-7w2315df{}+Ijsli;;to8",
    resave:true,
    saveUninitialized:false
}));
//app.set('trust proxy', 1);
app.use(compression())
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:"50mb",extended:true,parameterLimit:50000}));
app.use(express.static(path.join(__dirname,"public")));
/* --- APP EXPRESS END --- */
/* --- APP ROUTES-CUSTOM START --- */
app.use("/blog_post",blog_post);
app.use("/cms",cms);
app.use("/gallery",gallery);
app.use("/item",item);
app.use("/page",page);
app.use("/product",product);
app.use("/user",user);
/* --- APP ROUTES-CUSTOM START --- */
/* --- APP ROUTES START --- */
app.use("/",index);
app.use("/admin",admin);
app.use("/main/crud",crud);
app.use("/main/image",image);
/* --- APP ROUTES END --- */
/* --- APP ERROR START --- */
app.use(function(err,req,res,next) {
    let cloud_error=err;
    let cloud_data={};
    Log.error("Service App",err);
    res.send({cloud_error,cloud_data});
    res.end();
});
/* --- APP ERROR END --- */
module.exports=app;
