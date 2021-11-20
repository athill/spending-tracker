import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";

const CategoryChart = () => {
    const [data, setData] = useState();
    useEffect(() => {
      const getData = async () => {
        const response = await fetch('/api/search/categories');
        const json = await response.json();
        console.log({json});
        const results = [['Category', 'Total']];
        json.forEach(item => results.push([item.category, item.total]));
        console.log({results});
        setData(results);
      }
      getData();
    }, []);

    return  (
        <Chart
            width={'500px'}
            height={'300px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
                title: 'Spending by Category',
            }}
            rootProps={{ 'data-testid': '1' }}
            />);
    };

const DashboardPage = () => {
    return (
        <CategoryChart />
    )
};

export default DashboardPage
