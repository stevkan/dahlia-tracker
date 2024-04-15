'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('main', { title: 'Dahlia Tracker' });
});

module.exports = router;
