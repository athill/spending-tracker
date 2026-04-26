import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import AddItemForm from './AddItemForm';
import TransactionTable from './TransactionTable';
import { get } from '../../../utils/fetch';

const filterTransactions = (transactions, filter, search) => {
  if (!filter && !search) {
    return transactions;
  }
  const upperCaseFilter = filter.toUpperCase();
  return transactions.filter(transaction => {
    return (!search.lb || parseFloat(transaction.price) >= parseFloat(search.lb))
    && (!search.ub || parseFloat(transaction.price) <= parseFloat(search.ub))
    && (!search.category || search.category.includes(transaction.category))
    && (!search.store || search.store.includes(transaction.store))
    && (!search.item || search.item.includes(transaction.item))
    && (transaction.store.toUpperCase().includes(upperCaseFilter)
      || transaction.item.toUpperCase().includes(upperCaseFilter)
      || transaction.category.toUpperCase().includes(upperCaseFilter));
  });
}

const HomePage = ({ addToast }) => {
  const [ editing, setEditing ] = useState(null);
  const [lists, setLists] = useState({ categories: [], items: [], stores: [] });
  const [ transactions, setTransactions ] = useState([]);
  const [ filter, setFilter ] = useState('');
  const [ search, setSearch ] = useState({});
  const [ searchParams ] = useSearchParams();


  const fetchData = useCallback(async () => {
    let url = '/api';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const transactions = await get(url);
    setTransactions(transactions);
    const lists = await get('/api/lists');
    setLists(lists);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // searchParams, fetchData

  return (
       <div className="App">
        <AddItemForm lists={lists} refreshData={fetchData} addToast={addToast} />
        <TransactionTable
          addToast={addToast}
          lists={lists}
          editing={editing}
          filter={filter}
          refreshData={fetchData}
          setEditing={setEditing}
          setFilter={setFilter}
          setSearch={setSearch}
          transactions={filterTransactions(transactions, filter, search)} />
      </div>
  )

}

export default HomePage;
