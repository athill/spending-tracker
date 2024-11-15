import React from 'react';
import Chart from "react-google-charts";

const MonthlyBankChart = ({ results }) => {
  const data = [["Month", "Max", "Avg", "Min"]];
  if (results) {
    results.forEach((result) => {
        const {month, maximum, average, minimum} = result;
        console.log(result);
        data.push([month, maximum, average, minimum]);
    });
  }
  console.log({data});
  return (<Chart
      width={'500px'}
      height={'300px'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        title: 'Monthly Bank'
      }}/>)
};

export default MonthlyBankChart;
