const parse  = require('csv-parse/lib/sync');
const fs = require('fs');

// input validation
const usage = 'Usage: node income.js <csv-file>';
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
// INDIANA UNV CONS CP - descr

const bills = [
  {
      test: (record) => inDescription(record, /INDIANA UNV CON/),
      source: 'Indiana University'
  }
];



const main = () => {
  payroll = [];
  records.forEach(async record => {
    // console.log(record.Description);
      bills.forEach(async ({ source, test }) => {
          const amount = record['Amount Credit'];
          // console.log(amount);
          if (test(record)) {
            payroll.push({ date: record.Date, amount }) //price: -parseFloat(record['Amount Debit'])
          }
      });
  });
  payroll.sort((a, b) => new Date(a.Date) - new Date(b.Date));
  console.log(payroll);
};

main();



