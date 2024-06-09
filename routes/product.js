var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-service':'ping'});
    res.end();
});
module.exports = router;
