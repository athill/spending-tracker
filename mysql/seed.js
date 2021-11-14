const parse  = require('csv-parse/lib/sync'); 
const fs = require('fs');

const MySqlService = require('./MySqlService');

const usage = 'Usage: node seed.js <csv-file>';

if (process.argv.length != 3) {
    console.log(usage);
    process.exit(1);
}

const csvFile = process.argv[2];

const data = fs.readFileSync(csvFile).toString();

const records = parse(data, {
    columns: true,
    skip_empty_lines: true
});

// console.log({records});

const statements = records.map(record => {
    console.log(record);
    //  date	store	quantity	ittem	price	category
    return `INSERT INTO transactions(date, store, quantity, item, price, category)
        VALUES('${record.date}', '${record.store}', '${record.quantity}', '${record.item}', '${record.price}', '${record.category}')`;
})

// console.log(statements);


