var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
	res.send({'biz9-event-blog-post':'ping'});
	res.end();
});
module.exports = router;
