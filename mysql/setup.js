const MySqlService = require('./MySqlService');

const dbInfo = {
    host     : 'localhost',
    port     : '6603',
    user     : 'root',
    password : process.env.SPENDING_DB_PASSWORD,
    database : 'spending'
};



const main = async () => {
    const tableName = 'transactions';
    const mysqlService = new MySqlService();
    const result = await mysqlService.sql('SHOW TABLES');
    const tables = result.map(row => row[`Tables_in_${dbInfo.database}`]);
    if (!tables.includes(tableName)) {
        const sql = 'CREATE TABLE transactions(id INT NOT NULL AUTO_INCREMENT, date DATE, store VARCHAR(255),	' + 
            'quantity VARCHAR(255), item VARCHAR(255), price DECIMAL, category VARCHAR(255), PRIMARY KEY ( id ))';
        const result = await mysqlService.sql(sql);
        console.log(result);
    } else {
        console.log('table exists');
    }
}

main();
