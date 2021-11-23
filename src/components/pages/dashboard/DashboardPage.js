import React, { useEffect, useState } from 'react';

import CategoryChart from "./CategoryChart";
import MonthlyChart from "./MonthlyChart";
import { get } from '../../../utils/fetch';

const DashboardPage = () => {
  const [data, setData] = useState({
    categories: [],
    monthly: {
      data: [],
      categories: []
    }
  });
  useEffect(() => {
    const getData = async () => {
      const data = await get('/api/dashboard');

      setData(data);
    }
    getData();
  }, []);
  return (
  <>
    <CategoryChart categories={data.categories} />
    <MonthlyChart monthly={data.monthly} />
  </>
)};

export default DashboardPage;
