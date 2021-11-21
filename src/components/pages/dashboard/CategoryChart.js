import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";

import { get } from '../../../utils/fetch';

const CategoryChart = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const results = await get('/api/search/categories');
      const data = [['Category', 'Total']];
      results.forEach(({ category, total }) => data.push([category, total]));
      console.log({data});
      setData(data);
    }
    getData();
  }, []);

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
