const mysql = require('promise-mysql');

class MySqlService {
    dbInfo = {
        host     : 'localhost',
        port     : '6603',
        user     : 'root',
        password : process.env.SPENDING_DB_PASSWORD,
        database : 'spending'
    };

    async session(callback) {
        let connection;
        try {
            connection = await mysql.createConnection(this.dbInfo);
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