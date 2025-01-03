/* --- REQUIRE START -- */
async=require("async");
//compression=require('compression');
busboy=require("busboy");
cors=require("cors")
//detect=require('detect-file-type');
express=require("express");
//fs=require('fs-extra')
mp3Duration=require('mp3-duration');
path=require("path");
session=require("express-session");
biz9_app_config=require("./biz9_app_config");
/* --- REQUIRE END -- */
/* --- CONFIG START --- */
TITLE=biz9_app_config.TITLE;
PROJECT_ID=biz9_app_config.PROJECT_ID;
VERSION="1.0.3";
PORT_ID=biz9_app_config.PORT_ID;
/*--- CONFIG END ---*/

/* --- BIZ9-START -- */
/* --- BIZ9-END -- */

/* --- DEFAULT START --- */
ENV=process.env.NODE_ENV;
/*--- DEFAULT END ---*/
/* --- MONGO START --- */
MONGO_IP=biz9_app_config.MONGO_IP;
MONGO_PORT_ID=biz9_app_config.MONGO_PORT_ID;
MONGO_URL=biz9_app_config.MONGO_URL;
/* --- MONGO END --- */
/* --- EMAILZ START --- */
EMAIL_TO=biz9_app_config.EMAIL_TO;
EMAIL_FROM=biz9_app_config.EMAIL_FROM;
/* --- EMAILZ START --- */
/* --- FILE START --- */
FILE_SAVE_PATH=biz9_app_config.FILE_SAVE_PATH;
FILE_URL=biz9_app_config.FILE_URL;
/* --- FILE END --- */
/* --- DATA_TYPE-START --- */
DT_ADMIN='admin_biz';
DT_BLANK="blank_biz";
DT_BLOG_POST="blog_post_biz";
DT_CART_ITEM="cart_item_biz";
DT_CATEGORY="category_biz";
DT_GALLERY="gallery_biz";
DT_ITEM="item_biz";
DT_ORDER="order_biz";
DT_ORDER_ITEM="order_item_biz";
DT_PHOTO="photo_biz";
DT_PRODUCT="product_biz";
DT_USER="user_biz";
DT_SERVICE="service_biz";
/* --- DATA_TYPE-END --- */
/* --- PHOTO-SIZE-START --- */
PHOTO_SIZE_ALBUM={title_url:"",size:0};
PHOTO_SIZE_THUMB={title_url:"thumb_size_",size:250};
PHOTO_SIZE_MID={title_url:"mid_size_",size:720};
PHOTO_SIZE_LARGE={title_url:"large_size_",size:1000};
PHOTO_SIZE_SQUARE_THUMB={title_url:"square_thumb_size_",size:250};
PHOTO_SIZE_SQUARE_MID={title_url:"square_mid_size_",size:720};
PHOTO_SIZE_SQUARE_LARGE={title_url:"square_large_size_",size:1000};
/* --- PHOTO-SIZE-END --- */
/* --- APP URL START  -- */
const crud=require("./routes/main/crud");
const test=require("./routes/main/test");
const mail=require("./routes/main/mail");
const file=require("./routes/main/file");
const index=require("./routes/index");
//const blog_post=require("./routes/blog_post");
//const item=require("./routes/item");
/* --- APP URL END  -- */
/* --- APP EXPRESS START --- */
app = express();
app.use(cors());
app.use(session({
    secret: "secret_key_cms",
    cookieName: "session_cms",
    secret: "eg[isfd-8yF9-7w2315df{}+Ijsli;;to8",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    resave:false,
    saveUninitialized:false
}));
//app.use(compression())
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb",extended:false}));
app.use(express.static(path.join(__dirname, "public")));
/* --- APP EXPRESS END --- */
/* --- APP ROUTES START --- */
app.use("/", index);
//app.use("/item", item);
app.use("/index", index);
app.use("/main/crud",crud);
app.use("/main/mail",mail);
app.use("/main/file",file);
app.use("/main/test",test);
/* --- APP ROUTES END --- */
/* --- APP ERROR START --- */
app.use(function(err, req, res, next) {
    //res.locals.message = err.message;
    //res.locals.error =  err;
    //res.status(err.status || 500);
    //res.render("error");
});
/* --- APP ERROR END --- */
module.exports = app;
