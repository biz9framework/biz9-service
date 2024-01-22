/* --- APP CONFIG START  --- */
const PROJECT_ID='19'; // your project id.
const APP_TITLE_ID=''; // app title id. title of database name.
const APP_TITLE='BiZ9-Service'; // your application title.
const APP_CLOUD_BUCKET='bappz'; // your aws bucket title
/* --- APP CONFIG START  --- */
/
/* --- FILE END --- */
/* --- BIZ9 CONFIG START --- */
const BIZ_MAP=true; // convert field titles field_1, field_2 with value_1, value_2
/* --- BIZ9 CONFIG END --- */
/* --- EMAILZ START --- */
/* --- EMAILZ START --- */
/* --- MONGO START --- */
const MONGO_IP='localhost';  // OS_ENV = process.env.BIZ9_BOX_IP_217; local = 'localhost'; ip_address = '0.0.0.0'
const MONGO_USERNAME_PASSWORD=''; // local = ''; remote = 'ban:1234567@'
const MONGO_PORT="27019";
const MONGO_SERVER_USER='admin';
const MONGO_CONFIG='/etc/mongod.conf';
const SSH_KEY=""; // used to restart remote server on mongo fail.
/* --- MONGO END --- */
/* --- REDIS START --- */
const REDIS_URL="0.0.0.0";
const REDIS_PORT="27019";
/* --- REDIS END --- */
/* --- AWS START --- */
const AWS_S3_SAVE=true;
const AWS_S3_BUCKET=APP_CLOUD_BUCKET;
const AWS_KEY="";
const AWS_SECRET="";
const AWS_REGION='us-east-2';
/* --- AWS END --- */

data_config={
    mongo_server_user:MONGO_SERVER_USER,
    mongo_username_password:MONGO_USERNAME_PASSWORD,
    mongo_ip:MONGO_IP,
    mongo_port:MONGO_PORT,
    mongo_config:MONGO_CONFIG,
    ssh_key:SSH_KEY,
    redis_url:REDIS_URL,
    redis_port:REDIS_PORT,
};
app_config={
    app_title_id:APP_TITLE_ID,
    app_version:APP_VERSION,
    app_title:APP_TITLE,
    project_id:PROJECT_ID,
    file_url:FILE_URL,
    biz_map:BIZ_MAP
}
biz9=require("biz9-core")(app_config,data_config);
