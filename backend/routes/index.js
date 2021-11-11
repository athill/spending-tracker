const express = require('express');
const mysql = require('mysql');

const router = express.Router();

let solution;

/* GET home page. */
router.get('/', function(req, res, next) {
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : '6603',
    user     : 'root',
    password : 'spending',
    database : 'spending'
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });
  
  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    solution = results[0].solution;
    console.log('The solution is: ', results[0].solution);
  });
   
  connection.end();  
  res.json({ solution });
});

module.exports = router;
