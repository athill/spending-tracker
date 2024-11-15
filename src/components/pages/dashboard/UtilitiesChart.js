import React from 'react';
import Chart from "react-google-charts";

const getNextYearMonth = (monthYear) => {
    const [year, month] = monthYear.split('-');

    const nextMonthInt = (Number(month) % 12) + 1

    const nextMonth = nextMonthInt < 10 ? '0' + nextMonthInt : nextMonthInt;

    const nextYear = nextMonthInt === 1 ? Number(year) + 1 : year;
    return `${nextYear}-${nextMonth}`;
}

const UtilitiesChart = ({ utilities: { stores, data : results } }) => {
    stores = stores.map(store => store.store);
    const months = {};
    results.forEach(({ month, price, store }) => {
        if (! (month in months)) {
            months[month] = {};
        }
        // if more than one entry in month, push it to the next month
        if (store in months[month]) {
            const nextMonth = getNextYearMonth(month);
            if (! (nextMonth in months)) {
                months[nextMonth] = {};
            }
            months[nextMonth][store] = price;
        } else {
            months[month][store] = price;
        }

    });
    const data = [["Month"].concat(stores)];
    Object.keys(months).forEach(month => {
        data.push([month].concat(stores.map(store => (store in months[month]) ? months[month][store] : 0)));
    });
    return (<Chart
        width={'900px'}
        height={'300px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          title: 'Utilities'
        }}/>)
};

export default UtilitiesChart;
