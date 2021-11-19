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

router.post('/transactions', async function(req, res, next) {
  const transaction = Transaction.of(req.body);
  await transaction.create();
  res.json(req.body);
});

router.delete('/transactions/:id', async function(req, res, next) {
  await Transaction.delete(req.params.id);
  res.sendStatus(204);
}); 

router.get('/lists', async function(req, res, next) {
  const categories = (await mysqlService.sql('SELECT category FROM categories ORDER BY category')).map(row => row.category);
  const items = (await mysqlService.sql('SELECT item FROM items ORDER BY item')).map(row => row.item);
  const stores = (await mysqlService.sql('SELECT store FROM stores ORDER BY store')).map(row => row.store);
  const lists = {
    categories,
    items,
    stores
  };
  res.json(lists);
});

router.get('/search/categories', async (req, res, next) => {
  let where = '1=1 ';
  if (req.query.startDate) {
    where += `AND date >= ${req.query.startDate}`;
  } if (req.query.endDate) {
    where += `AND date < ${req.query.endDate}`;
  }
  const sql = `SELECT category, SUM(price) AS total FROM transactions WHERE ${where} GROUP BY category ORDER BY category`;
  const result = await mysqlService.sql(sql);
  res.json(result);
});

module.exports = router;
