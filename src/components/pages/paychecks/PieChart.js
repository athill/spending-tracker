import React from 'react';
import Chart from "react-google-charts";

const PieChart = ({ pieData }) => {
  const data = [
    ['Type', 'Amount'],
    ['Net Pay', pieData.net_pay],
    ['Fed Withheld', pieData.fed_wthld],
    ['State Withheld', pieData.in_wthld],
    ['County Withheld', pieData.co_wthld],
    ['Dental Plan', pieData.dent_plan_ded],
    ['HSA', pieData.hsa_ded],
    ['Medical', pieData.med_wthld],
    ['Social Security', pieData.ss_wthld]
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
