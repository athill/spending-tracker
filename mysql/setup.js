const MySqlService = require('../backend/service/MySqlService');

const dbInfo = require('../backend/configuration/database');

const main = async () => {
    const tableName = 'transactions';
    const mysqlService = new MySqlService();
    const tables = await mysqlService.tables();
    // tranasction table
    if (!tables.includes(tableName)) {
        const sql = `CREATE TABLE transactions(
            id INT NOT NULL AUTO_INCREMENT,
            date DATE,
            store VARCHAR(255),
            quantity VARCHAR(255),
            item VARCHAR(255),
            price DECIMAL(10, 2),
            category VARCHAR(255),
            PRIMARY KEY ( id )
        )`;
        const result = await mysqlService.sql(sql);
        console.log(result);
    } else {
        console.log('table exists');
    }
    // views
    const callback = (connection) => {
        connection.query('CREATE OR REPLACE VIEW categories AS SELECT DISTINCT category FROM transactions ORDER BY category');
        connection.query('CREATE OR REPLACE VIEW items AS SELECT DISTINCT item FROM transactions ORDER BY item');
        connection.query('CREATE OR REPLACE VIEW stores AS SELECT DISTINCT store FROM transactions ORDER BY store');
    }
    await mysqlService.session(callback);
}

main();
