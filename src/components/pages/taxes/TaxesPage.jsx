import React, { useCallback, useEffect, useState } from 'react';

import AddYearForm from './AddYearForm';
import TaxesTable from './TaxesTable';
import YearChart from './YearChart';
import { get } from '../../../utils/fetch';
import TaxesChart from './TaxesChart';


const TaxesPage = ({ addToast }) => {
  const [ editing, setEditing ] = useState(null);
  const [ taxes, setTaxes ] = useState([]);


  const fetchData = useCallback(async () => {
    let url = '/api/taxes';
    const { data: taxes } = await get(url);
    setTaxes(taxes);
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
       <div className="App">
        <AddYearForm refreshData={fetchData} addToast={addToast} />
        <TaxesTable
          addToast={addToast}
          editing={editing}
          refreshData={fetchData}
          setEditing={setEditing}
          years={taxes} />
          <YearChart years={taxes} />
          <TaxesChart years={taxes} />
      </div>
  )

}

export default TaxesPage;
