import React, { useEffect, useState } from 'react';

import { get } from '../../../utils/fetch';
import LineChart from './LineChart';
import PieChart from './PieChart';
const PaychecksPage = () => {
  const [data, setData] = useState({
    pie: [],
    line: []
  });


  useEffect(() => {
    const getData = async () => {
      let url = '/api/paychecks';
      const data = await get(url);
      setData(data);
    }
    getData();
  }, []);
  return (
  <>
    <h1>Paychecks</h1>
    <PieChart pieData={data.pie.length ? data.pie[0] : []} />
    <LineChart lineData={data.line} />
  </>
  )
};

export default PaychecksPage;
