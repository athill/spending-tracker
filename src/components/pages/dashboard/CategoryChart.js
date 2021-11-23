import React from 'react';
import Chart from "react-google-charts";

const CategoryChart = ({ categories }) => {
  const data = [['Category', 'Total']];
  categories.forEach(({ category, total }) => data.push([category, total]));

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
    />
  );
};

export default CategoryChart;
