const parse  = require('csv-parse/lib/sync');
const fs = require('fs');

const MySqlService = require('./MySqlService');
const Transaction = require('../backend/models/Transaction');

// input validation
const usage = 'Usage: node bank.js <csv-file>';
if (process.argv.length != 3) {
    console.log(usage);
    process.exit(1);
}

// let's roll

// parse csv
const csvFile = process.argv[2];
const data = fs.readFileSync(csvFile).toString();

const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
    from_line: 4,
});


// helpers
const inMemo = (record, regex) => regex.test(record.Memo);

const inDescription = (record, regex) => regex.test(record.Description);

const bills = [
    {
        test: (record) => inMemo(record, /^NETFLIX\.COM/),
        category: 'entertainment',
        item: 'Netflix',
        store: 'Netflix'
    },
    {
        test: (record) => inMemo(record, /^CITY OF BLOOMIN /),
        category: 'utilities',
        item: 'water',
        store: 'CBU'
    },
    {
        test: (record) => inDescription(record, /^AUTO-OWNERS INS. PREM/),
        category: 'insurance',
        item: 'insurance',
        store: 'Auto-Owners insurance'
    },
    {
        test: (record) => inMemo(record, /^DIGITALOCEAN/),
        category: 'web',
        item: 'digitalocean',
        store: 'DigitalOcean'
    },
];

const main = () => {
    records.forEach(async record => {
        bills.forEach(async ({ category, item, store, test }) => {
            if (test(record)) {
                const transaction = Transaction.of({
                    category,
                    date: new Date(record.Date).toISOString().substring(0, 10),
                    item,
                    store,
                    price: -parseFloat(record['Amount Debit'])
                });
                console.log(transaction);
                await transaction.create();
            }
        });
    });
};

main();
