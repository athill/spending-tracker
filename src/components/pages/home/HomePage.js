import React, { Component } from 'react';

import AddItemForm from './AddItemForm';
import TransactionTable from './TransactionTable';
import { get } from '../../../utils/fetch';

class HomePage extends Component {
  state = {
    transactions: [],
  };

  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  async getItems() {
    const response = await get('/api');
    this.setState({ transactions: response });
  }

  render() {
    return (
      <div className="App">
        <AddItemForm refreshData={this.getItems} addToast={this.props.addToast} />
        <TransactionTable addToasts={this.props.addToast} refreshData={this.getItems} transactions={this.state.transactions} />
      </div>
    );
  }
}

export default HomePage;
