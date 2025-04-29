const MySqlService = require("../service/MySqlService");

class Taxes {

    constructor(year, ss_wages, wages, fed_withheld, ss_withheld, medicare_withheld, state_tax, local_tax) {
        this.year = year;
        this.ss_wages = ss_wages;
        this.wages = wages;
        this.fed_withheld = fed_withheld;
        this.ss_withheld = ss_withheld;
        this.medicare_withheld = medicare_withheld;
        this.state_tax = state_tax;
        this.local_tax = local_tax;
    }

    static of(data) {
        return new Taxes(data.year, data.ss_wages, data.wages, data.fed_withheld, data.ss_withheld, data.medicare_withheld, data.state_tax, data.local_tax);
    }

    static async delete(year) {
        const mysqlService = new MySqlService();
        return await mysqlService.delete('taxes', `year=${year}`);
    }

    static async update(year, values) {
      const mysqlService = new MySqlService();
      return await mysqlService.update('taxes', values, ['year=?', year]);
    }

    map() {
        return {
            year:  this.year,
            ss_wages:  this.ss_wages,
            wages:  this.wages,
            fed_withheld:  this.fed_withheld,
            ss_withheld: this.ss_withheld,
            medicare_withheld:  this.medicare_withheld,
            state_tax:  this.state_tax,
            local_tax:  this.local_tax,
        };
    }
    // year, ss_wages, wages, fed_withheld, ss_withheld, medicare_withheld, state_tax, local_tax

    async create() {
        const mysqlService = new MySqlService();
        await mysqlService.insert('taxes', this.map());
    }
}

module.exports = Taxes;

