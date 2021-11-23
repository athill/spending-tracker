module.exports = {
    host     : process.env.SPENDING_DB_HOST || 'localhost',
    port     : process.env.SPENDING_DB_PORT || '6603',
    user     : process.env.SPENDING_DB_USER || 'root', // yeah, I know
    password : process.env.SPENDING_DB_PASSWORD,
    database : process.env.SPENDING_DB_DATABASE || 'spending'
};