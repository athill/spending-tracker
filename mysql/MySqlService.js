const mysql = require('promise-mysql');
const dbInfo = require('./config');

class MySqlService {

    async session(callback) {
        let connection;
        try {
            connection = await mysql.createConnection(dbInfo);
            return callback(connection);
    
        } finally {
          if (connection && connection.end) connection.end();
        }        
    }

    async sql(query) {
        const callback = async (connection) => {
            const result = await connection.query(query);
            return result;
        };
        return await this.session(callback);
    }

    async insert(table, values) {
        const sql = `INSERT INTO ${table} (${Object.keys(values).join(', ')}) VALUES(${Object.keys(values).map(key => `"${values[key]}"`).join(', ')})`;
        this.sql(sql);

    }

    async delete(table, where) {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        return this.sql(sql);
    }

    async tables() {
        const result = await this.sql('SHOW TABLES');
        console.log({result});
        return result.map(row => row[`Tables_in_${dbInfo.database}`]);
    }
}

module.exports = MySqlService;

// const main = async () => {
//     const mysqlService = new MySqlService();
//     const values = {
//         'foo': 'bar',
//         'baz': 2
//     };
//     mysqlService.insert('transactions', values);
// };

// main();