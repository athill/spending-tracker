// const service2 = require('./backend/service/MySqlService.js');

class DbServiceInterface {
  constructor() {
    const requiredMethods = [
      'session',
      'sql',
      'tables'
    ];
    requiredMethods.forEach(requiredMethod => {
      if(!this[requiredMethod]) {
        throw new Error(`DbServiceInterface missing method: ${requiredMethod}`);
      }
    })

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
}

module.exports = DbServiceInterface;
