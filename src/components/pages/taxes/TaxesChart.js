import React from 'react';
import Chart from "react-google-charts";

const TaxesChart = ({ years }) => {
  if (!years.length) {
    return <></>;
  }
  const data = [['Year', 'Income', 'Tax']];
  years.forEach(year => {
    const income = parseFloat(year.ssWages);
    const tax = parseFloat(year.fedWithheld) + parseFloat(year.ssWithheld) +
      parseFloat(year.medicareWithheld) + parseFloat(year.stateTax) + parseFloat(year.localTax);
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
