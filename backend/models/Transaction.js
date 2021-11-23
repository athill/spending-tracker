const MySqlService = require("../service/MySqlService");

class Transaction {

    constructor(date, store, quantity, item, price, category) {
        this.date = date;
        this.store = store;
        this.quantity = quantity;
        this.item = item;
        this.price = price;
        this.category = category;
    }

    static of(data) {
        return new Transaction(data.date, data.store, data.quantity, data.item, data.price, data.category);
    }

    static async delete(id) {
        const mysqlService = new MySqlService();
        await mysqlService.delete('transactions', `id=${id}`);
    }

    map() {
        return {
            date:  this.date,
            store:  this.store,
            quantity:  this.quantity,
            item:  this.item,
            price:  this.price,
            category:  this.category,
        };
    }

    async create() {
        const mysqlService = new MySqlService();
        await mysqlService.insert('transactions', this.map());
    }
}

module.exports = Transaction;

// const main = async () => {
//     const transaction = Transaction.of({
//         date:  '2021-11-13',
//         store:  'roadside',
//         quantity:  '12',
//         item:  'eggs',
//         price:  '3.50',
//         category:  'grocery',
//     });
//     await transaction.create();
// };

// main();
