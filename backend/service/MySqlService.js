const mysql = require('promise-mysql');

const dbInfo = require('../configuration/database');
const DbServiceInterface = require('./DbServiceeInterface');

class MySqlService extends DbServiceInterface {

  async session(queries, args) {
    let connection;
    try {
      connection = await mysql.createConnection({ ...dbInfo, multipleStatements: true });
      return connection.query(queries.join('; '), args);

    } finally {
      if (connection && connection.end)
        connection.end();
    }
  }

  async tables() {
    const result = await this.sql('SHOW TABLES');
    console.log({ result });
    return result.map(row => row[`Tables_in_${dbInfo.database}`]);
  }

  // general db utils

  getWhere(where) {
    // array
    if (Array.isArray(where)) {
      return [where[0], where[1] || []];
    // object
    } else if (where.sql) {
      return [ where.sql, where.values || [] ];
    }
    // string
    return [ where ];
  }
}
module.exports = MySqlService;
