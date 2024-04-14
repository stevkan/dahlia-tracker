'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/create', function (req, res) {
  res.render('create', { title: 'Create New Flower' });
});

module.exports = router;
