const MySqlService = require('../backend/service/MySqlService');

const tablesToCreate = {
  'transactions': `CREATE TABLE transactions(
    id INT NOT NULL AUTO_INCREMENT,
    date DATE,
    store VARCHAR(255),
    quantity VARCHAR(255),
    item VARCHAR(255),
    price DECIMAL(10, 2),
    category VARCHAR(255),
    PRIMARY KEY ( id )
  )`,
  'paychecks' :  `CREATE TABLE paychecks(
    date DATE,
    fed_wthld DECIMAL(10, 2),
    med_wthld DECIMAL(10, 2),
    ss_wthld DECIMAL(10, 2),
    in_wthld DECIMAL(10, 2),
    co_wthld DECIMAL(10, 2),
    med_plan_ded DECIMAL(10, 2),
    dent_plan_ded DECIMAL(10, 2),
    tsb_ded DECIMAL(10, 2),
    hsa_ded DECIMAL(10, 2),
    disablity_ins_ded DECIMAL(10, 2),
    med_plan DECIMAL(10, 2),
    dent_plan DECIMAL(10, 2),
    life_ins DECIMAL(10, 2),
    base_retire DECIMAL(10, 2),
    ttl_gross DECIMAL(10, 2),
    fed_tax_gross DECIMAL(10, 2),
    ttl_tax DECIMAL(10, 2),
    ttl_ded DECIMAL(10, 2),
    net_pay DECIMAL(10, 2),
    PRIMARY KEY(date))`,
    // Transaction Number	Date	Description	Memo	Amount Debit	Amount Credit	Balance	Check Number	Fees
    'bank': `CREATE TABLE bank(
      transaction_number VARCHAR(500),
      date DATE,
      description VARCHAR(255),
      memo VARCHAR(255),
      debit DECIMAL(10, 2),
      credit DECIMAL(10, 2),
      balance DECIMAL(10, 2),
      check_number INT,
      fees DECIMAL(10, 2)
    )`,
    'taxes': `CREATE TABLE taxes(
      year INT NOT NULL,
      ss_wages DECIMAL(10, 2),
      wages DECIMAL(10, 2),
      fed_withheld DECIMAL(10, 2),
      ss_withheld DECIMAL(10, 2),
      medicare_withheld DECIMAL(10, 2),
      state_tax DECIMAL(10, 2),
      local_tax DECIMAL(10, 2),
      PRIMARY KEY ( year )
    )`,
    'annual_categories': `CREATE TABLE annual_categories(
      id INT NOT NULL AUTO_INCREMENT,
      category VARCHAR(255),
      month INT NOT NULL,
      recurrence INT DEFAULT 1,
      PRIMARY KEY ( id )
    )`,
    'annual': `CREATE TABLE annual(
      year INT NOT NULL,
      category_id INT NOT NULL,
      amount DECIMAL(10, 2)
    )
    `
};



const main = async () => {
    const mysqlService = new MySqlService();
    // tables
    const tables = await mysqlService.tables();
    Object.keys(tablesToCreate).forEach(async tableName => {
      if (!tables.includes(tableName)) {
        const result = await mysqlService.sql(tablesToCreate[tableName]);
      } else {
          console.log(`table ${tableName} exists`);
      }
    });
    // views
    const queries = [
        'CREATE OR REPLACE VIEW categories AS SELECT DISTINCT category FROM transactions ORDER BY category',
        'CREATE OR REPLACE VIEW items AS SELECT DISTINCT item FROM transactions ORDER BY item',
        'CREATE OR REPLACE VIEW stores AS SELECT DISTINCT store FROM transactions ORDER BY store',
        unitV(),
        'CREATE OR REPLACE VIEW ppu_v AS SELECT *, IF(multiplier IS NULL, price / q, price / (q * multiplier)) AS ppu FROM unit_v'

    ];
    console.log(queries)
    await mysqlService.session(queries);
}



const unitV = () => {
  const multiplier = () => {
    // if the quatity contains an asterisk, rerturn what is before the *
    return "IF(quantity LIKE '%*%', SUBSTRING_INDEX(quantity, ' * ', 1), 1)";
  }

  const unit = () => {
    // The unit should be any string in the quantity (e.g., gallon, oz, etc.)
    return "REGEXP_SUBSTR(quantity, '[a-z A-Z.]+$')";
  }

  const q = () => {
    // if format is 'x * y unit', q is y, if format is 'x unit', q is x, if quantity is a digit, q is that digit; otherwise, q is 1
    return "IF(quantity LIKE '%*%', REGEXP_SUBSTR(SUBSTRING_INDEX(quantity, ' * ', -1), '[0-9.]*'), " +
        "IF(quantity REGEXP '.*[0-9.]+.*', REGEXP_SUBSTR(quantity, '[0-9.]+'), 1))";
  }
  const sql = `CREATE OR REPLACE VIEW unit_v AS SELECT id, store, item, price, category, date, ${multiplier()} AS multiplier,
    ${unit()} AS unit,
    ${q()} AS q,
      quantity FROM transactions`;
    return sql;
};

main();
