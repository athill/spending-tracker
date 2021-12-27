const mysql = require('promise-mysql');

const dbInfo = require('../configuration/database');

class MySqlService {

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

  async sql(query, args) {
    return await this.session([query], args);
  }

  async insert(table, values) {
    const sql = `INSERT INTO ${table} (${Object.keys(values).join(', ')}) VALUES(${Object.keys(values).map(key => `"${values[key]}"`).join(', ')})`;
    this.sql(sql);

  }

  async delete(table, where) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    return this.sql(sql);
  }

  async update(table, values, where) {
    const sets = [];
    let vals = [];
    Object.keys(values).forEach(key => {
      sets.push(`${key}=?`);
      vals.push(values[key]);
    });
    const [ whereSql, whereValues ] = this.getWhere(where);
    vals = vals.concat(whereValues);
    const sql = `UPDATE ${table} SET ${sets.join(', ')} WHERE ${whereSql}`;
    return this.sql(sql, vals);
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
