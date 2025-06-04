import React from 'react';
import Chart from "react-google-charts";

const PieChart = ({ pieData }) => {
  const data = [
    ['Type', 'Amount'],
    ['Net Pay', parseFloat(pieData.netPay)],
    ['Fed Withheld', parseFloat(pieData.fedWthld)],
    ['State Withheld', parseFloat(pieData.inWthld)],
    ['County Withheld', parseFloat(pieData.coWthld)],
    ['Dental Plan', parseFloat(pieData.dentPlanDed)],
    ['HSA', parseFloat(pieData.hsaDed)],
    ['Medical', parseFloat(pieData.medWthld)],
    ['Social Security', parseFloat(pieData.ssWthld)]
  ];

  return  (
    <Chart
      width={'750px'}
      height={'450px'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
          title: 'Paycheck Distribution',
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  );
};

export default PieChart;
