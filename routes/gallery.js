var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-gallery':'ping'});
    res.end();
});
module.exports = router;
