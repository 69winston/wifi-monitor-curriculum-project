import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Retrieve search history from localStorage when component mounts
    const savedSearchHistory = localStorage.getItem('searchHistory');
    if (savedSearchHistory) {
      setSearchHistory(JSON.parse(savedSearchHistory));
    }
  }, []); // Empty dependency array to run this effect only once when the component mounts

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newSearchHistory = [...searchHistory, searchTerm];
    setSearchHistory(newSearchHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory)); // Update localStorage
    setSearchTerm('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <select id="followersDropdown">
            <option value="MLK">MLK</option>
            <option value="Moffit">Moffit</option>
            <option value="Mainstacks">Mainstacks</option>
          </select>
          <input 
            id="searchInput" 
            placeholder="Enter search term" 
            value={searchTerm} 
            onChange={handleInputChange} 
          />
          <button type="submit">Submit</button>
        </form>
        <div>
          <h2>Search History</h2>
          <table>
            <thead>
              <tr>
                <th>Search Terms</th>
              </tr>
            </thead>
            <tbody>
              {searchHistory.map((term, index) => (
                <tr key={index}>
                  <td>{term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
