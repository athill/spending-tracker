const MySqlService = require("../service/MySqlService");

class Bank {

    constructor(transaction_number, date, description, memo, debit, credit, balance, check_number, fees) {
      this.transaction_number = transaction_number;
      this.date = date;
      this.description = description;
      this.memo = memo;
      this.debit = debit;
      this.credit = credit;
      this.balance = balance;
      this.check_number = check_number;
      this.fees = fees;
    }

    static async createFrom(row) {
      //	Date	Description	Memo			Balance		Fees
      const map = {
        transaction_number: row['Transaction Number'],
        date: new Date(row.Date).toISOString().split('T')[0],
        description: row.Description,
        memo: row.Memo,
        debit: row['Amount Debit'] || 0,
        credit: row['Amount Credit'] || 0,
        balance: row.Balance,
        check_number: row['Check Number'] || 0,
        fees: row.Fees || 0,
      };
      console.log(map);
      const mysqlService = new MySqlService();
      await mysqlService.insert('bank', map);
      console.log('inserted');
    }


    map() {
        return {
          transaction_number: this.transaction_number,
          date: this.date,
          description: this.description,
          memo: this.memo,
          debit: this.debit,
          credit: this.credit,
          balance: this.balance,
          check_number: this.check_number,
          fees: this.fees,
        };
    }

    async create() {
        const mysqlService = new MySqlService();
        await mysqlService.insert('bank', this.map());
    }
}

module.exports = Bank;
