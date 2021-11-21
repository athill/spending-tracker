import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";

import { get } from '../../../utils/fetch';

const MonthlyChart = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const { categories, data : results } = await get('/api/search/monthly');
      const headers = ['Month'].concat(categories);
      // create helper data structure
      const transformed = {};
      results.forEach(({ category, month, total }) => {
        if (!(month in transformed)) {
          transformed[month] = {};
        };
        transformed[month][category] = total;
      });
      // build final data structure
      const months = Object.keys(transformed);
      months.sort();
      const data = [headers].concat(months.map((month) => {
        return [month].concat(categories.map((category, i) => {
          const value = transformed[month][category];
          return  value || 0;
        }));
      }));
      setData(data);
    }
    getData();
  }, []);
  return (<Chart
    width={'500px'}
    height={'300px'}
    chartType="ColumnChart"
    loader={<div>Loading Chart</div>}
    data={data}
    options={{
      title: 'Monthly spending',
      chartArea: { width: '50%' },
      isStacked: true,
      hAxis: {
        title: 'Month',
        minValue: 0,
      },
      vAxis: {
        title: 'Spending',
      },
    }}
    // For tests
    rootProps={{ 'data-testid': '3' }}
  />)
};

export default MonthlyChart;
