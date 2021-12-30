import React from 'react';
import Chart from "react-google-charts";

const LineChart = ({ lineData }) => {
  const data = [['Date', 'Taxes', 'Deductions', 'Net Pay']];
  lineData.forEach(line => {
    // ttl_tax, ttl_ded, net_pay
    data.push([line.date.substring(0, 7), line.ttl_tax, line.ttl_ded, line.net_pay])
  });

  console.log(lineData);

  return  (
    <Chart
      width={'750px'}
      height={'450px'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
          title: 'Paycheck Distribution Over Time',
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  );
};

export default LineChart;
