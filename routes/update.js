'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/update', function (req, res) {
  res.render('update', { title: 'Update Flower' });
});

module.exports = router;
