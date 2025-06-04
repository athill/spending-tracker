import React from 'react';
import Chart from "react-google-charts";

const CategoryChart = ({ categories }) => {
  const data = [['Category', 'Total']];
  categories.forEach(({ category, total }) => data.push([category, parseFloat(total)]));

  return  (
    <Chart
      width={'650px'}
      height={'450px'}
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
