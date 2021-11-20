
export const currencyFormat = (value) => {
    return new Intl.NumberFormat(`en-US`, {
        currency: `USD`,
        style: 'currency',
    }).format(value);
};
