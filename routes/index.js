var express = require('express');
var router = express.Router();
var service = require('../services/product-services');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/t', function (req, res, next) {
    service.Insert().then(data => res.json(data)).catch(err => res.send(err));
});



module.exports = router;
