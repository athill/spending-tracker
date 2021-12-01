const parse  = require('csv-parse/lib/sync');
const fs = require('fs');

const MySqlService = require('../backend/service/MySqlService');
const Transaction = require('../backend/models/Transaction');

// input validation
const usage = 'Usage: node seed.js <csv-file>';
if (process.argv.length != 3) {
    console.log(usage);
    process.exit(1);
}

// let's roll

// parse csv
const csvFile = process.argv[2];
const data = fs.readFileSync(csvFile).toString();
// const lines = data.split('\n').map(line => line.split(',').map(value => value.trim()));
// const [headers, ...rows] = lines;

// const records = rows.map((row) => {
//     const map = {};
//     row.forEach((value, i) => map[`'${headers[i]}'`] = value);
//     return map;
// });


const records = parse(data, {
    columns: true,
    skip_empty_lines: true
});

console.log(records[0].store);

// console.log(records[0]["'date"]);

// add to database
// const transactions = records.map(record => Transaction.of(record));
// const callback = async (connection) => {
//     transactions.forEach(transaction => transaction.create());
// };
// const mysqlService = new MySqlService();
// mysqlService.session(callback);

