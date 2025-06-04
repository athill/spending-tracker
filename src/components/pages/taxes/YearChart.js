import React, { useState } from 'react';
import Chart from "react-google-charts";

const YearChart = ({ years }) => {
  const [currentYear, setCurrentYear] = useState(2024);
  if (!years.length) {
    return <></>;
  }
  const data = [['Category', 'Total']];
  const yearData = years ? years.filter(yr => yr.year === currentYear)[0] : [];
  const fields = [  'fedWithheld', 'ssWithheld', 'medicareWithheld', 'stateTax', 'localTax' ];
  fields.forEach((field) => {
    const value = yearData[field];
    data.push([field, parseFloat(value)]);
  });
  data.push(['Mine', parseFloat(yearData.wages)]);
  const onYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  }

  return  (
    <>
      <select onChange={onYearChange} value={currentYear}>
        {
          years.map(year => <option key={year.year}>{year.year}</option>)
        }
      </select>
      <Chart
        width={'650px'}
        height={'450px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
            title: 'Tax Withholdings',
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </>
  );
};

/*
gross - adjusted: 12075.11
gross: 80500.79
gross - fed taxable: 12075.11
*/

export default YearChart;
