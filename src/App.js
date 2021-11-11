import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  state = {solution: null}

  componentDidMount() {
    fetch('/api')
      .then(res => res.json())
      .then(response => {
        console.log(response);
        this.setState({ solution: response.solution });
      });
  }

  render() {
    return (
      <div className="App">
        solution: { this.state.solution }
      </div>
    );
  }
}

export default App;
