const sqlite3 = require('sqlite3').verbose();

const dbInfo = require('../configuration/database');
const DbServiceInterface = require('./DbServiceeInterface');

class SqliteService extends DbServiceInterface {

  async session(queries, args) {
    let db;
    try {
      db = new sqlite3.Database(dbInfo.location);
        db.serialize(async () => {
        const results = await db.each(queries.join('; '), args);
        console.log(results);
        // results.forEach((err, row) => {

        // });
      });
    } finally {
      if (db && db.close) {
        db.close();
      }
    }
  }

  async tables() {
    const result = await this.sql('.tables');
    console.log({ result });
    return result.map(row => row[`Tables_in_${dbInfo.database}`]);
  }
}

module.exports = SqliteService;
