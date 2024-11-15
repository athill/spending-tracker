const parse  = require('csv-parse/lib/sync');
const fs = require('fs');

const Transaction = require('../backend/models/Transaction');
const Bank = require('../backend/models/Bank');

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
        test: (record) => inMemo(record, /^SXM/),
        category: 'entertainment',
        item: 'SiriusXM',
        store: 'SiriusXM'
    },
    {
      test: (record) => inMemo(record, /^DIGITALOCEAN/),
      category: 'web',
      item: 'digitalocean',
      store: 'DigitalOcean'
    },
    {
        test: (record) => inDescription(record, /^DUKE/),
        category: 'utilities',
        item: 'electricity',
        store: 'Duke Energy'
    },
    {
        test: (record) => inDescription(record, /^2D VECTRENENERGY UTIL PAYMT/),
        category: 'utilities',
        item: 'gas',
        store: 'Centerpoint'
    },
    {
        test: (record) => inDescription(record, /^COMCAST/),
        category: 'utilities',
        item: 'internet',
        store: 'Comcast'
    },
    {
        test: (record) => inDescription(record, /^VERIZON WIRELESS PAYMENTS/),
        category: 'utilities',
        item: 'phone',
        store: 'Verizon'
    },
    // Dropbox 4S7K77J San Francisco CA POINT OF SALE DEBIT
    {
      test: (record) => inMemo(record, /^Dropbox/),
      category: 'web',
      item: 'storage',
      store: 'Dropbox'
    },
    // COMMUNITY KITCHE ACH Temp
    {
      test: (record) => inDescription(record, /^COMMUNITY KITCHE/),
      category: 'charity',
      item: 'donation',
      store: 'Community Kitchen'
  },
  // GIGABITNOW INDI TUKWILA WA
  {
    test: (record) => inMemo(record, /^GIGABITNOW/),
    category: 'utilities',
    item: 'internet',
    store: 'GigabitNow'
  },
  // Smithville Commu WEB PMTS
  {
    test: (record) => inDescription(record, /^Smithville/),
    category: 'utilities',
    item: 'internet',
    store: 'Smithville'
  },
  {
    test: (record) => inMemo(record, /^AAA/),
    category: 'transportation',
    item: 'membership',
    store: 'AAA'
  },
  // AVA'S WASTE REMO PAYMENT
  {
    test: (record) => inDescription(record, /^AVA'S WASTE REMO PAYMENT/),
    category: 'utilities',
    item: 'trash',
    store: 'Avas'
  },
];

const main = () => {
    records.forEach(async record => {
        await Bank.createFrom(record);
        bills.forEach(async ({ category, item, store, test }) => {
            if (test(record)) {
              const price = -parseFloat(record['Amount Debit']);
              if (price) {
                const transaction = Transaction.of({
                    category,
                    date: new Date(record.Date).toISOString().substring(0, 10),
                    item,
                    store,
                    price: price
                });
                console.log(transaction);
                await transaction.create();
              }
            }
        });
    });
};

main();
