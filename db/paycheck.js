const fs = require('fs');

const lines = fs.readFileSync(__dirname + '/paycheck.txt').toString().split('\n');

const getMatch = (matches, line, data) => {
  for (const match of matches) {
    const regex = new RegExp(`${match.label}\\s*(\\S+)\\s?.*`);
    if (regex.test(line)) {
      const matches1 = regex.exec(line);
      data[match.field] = matches1[1];
    }
  }
  return data;
}

const sections = {
  'START': (line, data) => {
    const matches = [
      { field: 'date', label: 'Pay Begin Date:' }
    ];
    return getMatch(matches, line, data);
  },
  'HOURS AND EARNINGS': (line, data) => {
    const matches = [
      { field: 'fed_wthld', label: 'Fed Withholdng' },
      { field: 'med_wthld', label: 'Fed MED/EE' },
      { field: 'ss_wthld', label: 'Fed OASDI/EE' },
      { field: 'in_wthld', label: 'IN Withholdng' },
      { field: 'co_wthld', label: 'IN MONROE Withholdng' },
    ];
    return getMatch(matches, line, data);
  },
  'BEFORE-TAX DEDUCTIONS':  (line, data) => {
    const matches = [
      { field: 'med_plan_ded', label: 'Medical  Plan' },
      { field: 'dent_plan_ded', label: 'Dental Plan' },
      { field: 'retire_ded', label: 'IU 457(b) Retirement Plan' },
      { field: 'tsb_ded', label: 'TSB Health Care Reim.' },
      { field: 'hsa_ded', label: 'Health Savings Account' },
    ];
    return getMatch(matches, line, data);

  },
  'AFTER-TAX DEDUCTIONS': (line, data) => {
    const matches = [
      { field: 'disablity_ins_ded', label: 'Long-Term Disability Ins' }
    ];
    return getMatch(matches, line, data);
  },
  'EMPLOYER PAID BENEFITS': (line, data) => {
    const matches = [
      { field: 'med_plan', label: 'Medical  Plan' },
      { field: 'dent_plan', label: 'Dental Plan' },
      { field: 'life_ins', label: 'Basic Life Ins' },
      { field: 'base_retire', label: 'Base Retirement Plan' },
    ];
    return getMatch(matches, line, data);

  },
  'TOTAL GROSS FED TAXABLE GROSS TOTAL TAXES TOTAL DEDUCTIONS NET PAY': (line, data) => {
    if (/^Current/.test(line)) {
      const [_, ttl_gross, fed_tax_gross, ttl_tax, ttl_ded, net_pay] = line.split(/\s/).map(item => item.replace(',', ''));
      return {
        ...data,
        ttl_gross,
        fed_tax_gross,
        ttl_tax,
        ttl_ded,
        net_pay
      };
    } else {
      return data;
    }
  }
};

let section = 'START';
let data = {};
lines.forEach(line => {
  if (Object.keys(sections).includes(line)) {
    section = line;
  }
  data = sections[section](line, data);

});
console.log(data);

// console.log(lines);
