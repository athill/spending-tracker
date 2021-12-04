import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CategoryChart from "./CategoryChart";
import MonthlyChart from "./MonthlyChart";
import { get } from '../../../utils/fetch';
import DateRangeForm from '../../DateRangeForm';

const DashboardPage = () => {
  const [ searchParams ] = useSearchParams();
  const [data, setData] = useState({
    categories: [],
    monthly: {
      data: [],
      categories: []
    }
  });
  const getData = useCallback(async () => {
    let url = '/api/dashboard';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const data = await get(url);

    setData(data);
  }, [searchParams])

  useEffect(() => {
    getData();
  }, [getData]);
  return (
  <>
    <DateRangeForm />
    <CategoryChart categories={data.categories} />
    <MonthlyChart monthly={data.monthly} />
  </>
)};

export default DashboardPage;
