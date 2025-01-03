/* --- APP CONFIG START  --- */
const PROJECT_ID='19';
const APP_TITLE_ID='';
const TITLE='BiZ9-Service';
const PORT_ID="1901";
/* --- APP CONFIG START  --- */
/* --- CONFIG END --- */
/* --- FILE START --- */
const FILE_SAVE_PATH=__dirname+"/public/uploads/";//prod
const FILE_URL="http://localhost:1901/uploads/"; //prod
/* --- FILE END --- */
/* --- BIZ9 CONFIG START --- */
const BIZ_MAP=false;
/* --- BIZ9 CONFIG END --- */
/* --- EMAILZ START --- */
const EMAIL_SENDER="notifications@biz9framework.com";
const EMAIL_REPLY="notifications@biz9framework.com";
/* --- EMAILZ START --- */
/* --- MONGO START --- */
const MONGO_IP='0.0.0.0';  // OS_ENV = process.env.BIZ9_BOX_IP_217; local = 'localhost'; ip_address = '0.0.0.0'
const MONGO_USERNAME_PASSWORD=''; // local = ''; remote = 'ban:1234567@'
const MONGO_PORT_ID="27019";
const MONGO_SERVER_USER='admin';
const MONGO_CONFIG_FILE_PATH='/etc/mongod.conf';
const SSH_KEY="";
/* --- MONGO END --- */
/* --- REDIS START --- */
const REDIS_URL="0.0.0.0";
const REDIS_PORT_ID="27019";
/* --- REDIS END --- */
exports.PROJECT_ID = PROJECT_ID;
exports.APP_TITLE_ID = APP_TITLE_ID;
exports.TITLE = TITLE;
exports.PORT_ID = PORT_ID;
exports.MONGO_USERNAME_PASSWORD = MONGO_USERNAME_PASSWORD;
exports.MONGO_PORT_ID = MONGO_PORT_ID;
exports.MONGO_IP = MONGO_IP;
exports.MONGO_SERVER_USER = MONGO_SERVER_USER;
exports.MONGO_CONFIG_FILE_PATH = MONGO_CONFIG_FILE_PATH;
exports.SSH_KEY = SSH_KEY;
exports.REDIS_URL = REDIS_URL;
exports.REDIS_PORT_ID = REDIS_PORT_ID;
exports.EMAIL_SENDER = EMAIL_SENDER;
exports.EMAIL_REPLY = EMAIL_REPLY;
exports.FILE_SAVE_PATH = FILE_SAVE_PATH;
exports.FILE_URL = FILE_URL;
exports.BIZ_MAP = BIZ_MAP;
