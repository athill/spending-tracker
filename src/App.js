import logo from './logo.svg';
import './App.css';

import mysql from 'mysql';

let solution;

var connection = mysql.createConnection({
  host     : 'localhost',
  port: '6603',
  user     : 'root',
  password : 'spending',
  database : 'spending'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  solution = results[0].solution;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. { solution }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
