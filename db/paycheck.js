const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/paycheck.txt').toString().split('\n');

const sections = ['BEFORE-TAX DEDUCTIONS', 'AFTER-TAX DEDUCTIONS', 'EMPLOYER PAID BENEFITS',
  'TOTAL GROSS FED TAXABLE GROSS TOTAL TAXES TOTAL DEDUCTIONS NET PAY'];

let section = 'START';
sections.forEach(line => {
  if (sections.includes(line)) {
    console.log(line);
  }

});

// console.log(lines);
