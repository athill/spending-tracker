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
    PRIMARY KEY(date))`
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
        'CREATE OR REPLACE VIEW ppu_v AS SELECT *, IF(multiplier IS NULL, price * q, price * multiplier * q) AS ppu FROM unit_v'

    ];
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
