var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    res.send({'app':'blank-service-index-ping'});
    res.end();
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
