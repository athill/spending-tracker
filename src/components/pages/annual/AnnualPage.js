import React, { useEffect, useState } from "react";

import { monthMap } from '../../../utils';
import { get } from '../../../utils/fetch';
import AddAnnualCategoryForm from './AddAnnualCategoryForm';
import AddAnnualItemForm from './AddAnnualItemForm';
import AnnualTable from "./AnnualTable";

const categoryLists = {
  months: [...Array(12).keys().map(key => ({ value: key, label: monthMap[key] }))]
};

const startYear = 2024;
const endYear = new Date().getFullYear();
const years = [];
for (let i = startYear; i <= endYear; i++) {
  years.push(i);
}

const AnnualPage = ({ addToast }) => {
  const [ data, setData ] = useState({ categories: [], items: [] });
  const [lists, setLists] = useState({ categories: [], years });
  const fetchData = async () => {
    let url = '/api/annual';
    const response = await get(url);
    setData(response.data);
    setLists({
      ...lists,
      categories: response.data.categories.map(category => ({ label: category.category, value: category.id })),
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <>
    <AddAnnualCategoryForm refreshData={fetchData} addToast={addToast} lists={categoryLists} />
    <AddAnnualItemForm refreshData={fetchData} addToast={addToast} lists={lists} />
    <AnnualTable years={years} data={data} />
  </>;

}

export default AnnualPage;
