import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { get } from '../../../utils/fetch';
import PricePerUnitTable from './PricePerUnitTable';


const filterPpu = (items, filter) => {
  if (!filter) {
    return items;
  }
  const upperCaseFilter = filter.toUpperCase();
  return items.filter(({ category, item }) => {
    return  item.toUpperCase().includes(upperCaseFilter)
      || category.toUpperCase().includes(upperCaseFilter);
  });
}

const PricePerUnitPage = () => {
  const [ searchParams ] = useSearchParams();
  const [ppu, setPpu] = useState([]);
  const [ filter, setFilter ] = useState('');
  const fetchData = useCallback(async () => {
    let url = '/api/ppu';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const result = await(get(url));
    const data = {};
    result.data.forEach(record => {
      const key = `${record.category}|${record.item}`
      if (!(key in data)) {
        data[key] = [];
      }
      data[key].push(record);
    });
    const finalData = Object.keys(data).map(key => {
      const [ category, item ] = key.split('|');
      return { category, item, purchases: data[key] }
    });
    setPpu(finalData);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return <PricePerUnitTable data={filterPpu(ppu, filter)} filter={filter} setFilter={setFilter} />

}

export default PricePerUnitPage;
