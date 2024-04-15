'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/update', function (req, res) {
  res.render('update', { title: 'Update Flower' });
});

module.exports = router;
