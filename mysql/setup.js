const MySqlService = require('./MySqlService');

const dbInfo = require('./config');

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
}

main();
