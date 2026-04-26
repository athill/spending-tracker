import React from 'react';
import Chart from "react-google-charts";

const TaxesChart = ({ years }) => {
  if (!years.length) {
    return <></>;
  }
  const data = [['Year', 'Income', 'Tax']];
  years.forEach(year => {
    const income = year.ss_wages;
    const tax = year.fed_withheld + year.ss_withheld + year.medicare_withheld + year.state_tax + year.local_tax;
    data.push([`${year.year}`, income, tax]);
  });

  return  (
    <>
      <Chart
        width={'950px'}
        height={'450px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
            title: 'Tax Over Time',
        }}
      />
    </>
  );
};

export default TaxesChart;
