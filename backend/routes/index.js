const express = require('express');
const mysql = require('mysql');
const MySqlService = require("../service/MySqlService");
const Transaction = require('../models/Transaction');

const mysqlService = new MySqlService();
const router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {
  const where = getWhere(req);
  const sql = `SELECT * FROM transactions WHERE ${where} ORDER BY date, store, category, item`;
  console.log(sql);
  const results = await mysqlService.sql(sql);
  res.json(results);
});

router.post('/transactions', async function(req, res, next) {
  const transaction = Transaction.of(req.body);
  await transaction.create();
  res.json(req.body);
});

router.patch('/transactions/:id', async (req, res, next) => {
  console.log(`transaction ${req.params.id} updated`, req.body);
  await Transaction.update(req.params.id, req.body);
  res.sendStatus(204);
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

const categoriesQuery = (where) => `SELECT category, SUM(price) AS total FROM transactions WHERE ${where} GROUP BY category ORDER BY category`;

router.get('/search/categories', async (req, res, next) => {
  const where = getWhere(req);
  const sql = categoriesQuery(where);
  const result = await mysqlService.sql(sql);
  res.json(result);
});

const monthlyQuery = (where) => `SELECT DATE_FORMAT(date, "%m-%Y") AS month, category,  SUM(price) AS total FROM transactions WHERE ${where} GROUP BY DATE_FORMAT(date, "%m-%Y"), category`;

router.get('/search/monthly', async (req, res, next) => {
  const where = getWhere(req);
  const sql = monthlyQuery(where);
  const data = await mysqlService.sql(sql);
  const categories = (await mysqlService.sql('SELECT category FROM categories ORDER BY category')).map(row => row.category);
  res.json({categories, data});
});

router.get('/dashboard', async (req, res, next) => {
  const where = getWhere(req);
  const queries = [
    categoriesQuery(where),
    monthlyQuery(where),
    'SELECT category FROM categories ORDER BY category'
  ];

  const [ categories, monthly, allCategories ] = await mysqlService.session(queries);
  return res.json({
    categories: categories,
    monthly: {
      data: monthly,
      categories: allCategories.map(row => row.category)
    }
  });
});

router.get('/paychecks', async (req, res, next) => {
  const pieSql = 'SELECT fed_wthld, med_wthld, ss_wthld, in_wthld, co_wthld, med_plan_ded, dent_plan_ded, hsa_ded, net_pay FROM paychecks WHERE date=(SELECT MAX(date) FROM paychecks)';

  const lineSql = 'SELECT date, ttl_tax, ttl_ded, net_pay FROM paychecks';
  const pieData = await mysqlService.sql(pieSql);
  const lineData = await mysqlService.sql(lineSql);
  res.json({pie: pieData, line: lineData});

});

const getWhere = (req) => {
  let where = '1=1 ';
  if (req.query.startDate) {
    where += `AND date >= '${req.query.startDate}' `;
  } if (req.query.endDate) {
    where += `AND date < '${req.query.endDate}'`;
  }
  return where;
}

module.exports = router;
