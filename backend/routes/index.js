const express = require('express');
const mysql = require('mysql');
const MySqlService = require('../../mysql/MySqlService');
const Transaction = require('../models/Transaction');

const mysqlService = new MySqlService();
const router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {
  const results = await mysqlService.sql('SELECT * FROM transactions ORDER BY date, store, category, item');
  res.json(results);
});

router.post('/transactions', function(req, res, next) {
  const transaction = Transaction.of(req.body);
  transaction.create();
  res.json(req.body);
});

module.exports = router;
