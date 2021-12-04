import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import AddItemForm from './AddItemForm';
import TransactionTable from './TransactionTable';
import { get } from '../../../utils/fetch';

const HomePage = ({ addToast }) => {
  const [ transactions, setTransactions ] = useState([]);
  const [ searchParams ] = useSearchParams();

  const fetchData = useCallback(async () => {
    let url = '/api';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const transactions = await get(url);
    setTransactions(transactions);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // searchParams, fetchData

  return (
       <div className="App">
        <AddItemForm refreshData={fetchData} addToast={addToast} />
        <TransactionTable addToast={addToast} refreshData={fetchData} transactions={transactions} />
      </div>
  )

}

export default HomePage;
