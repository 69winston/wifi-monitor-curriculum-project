import React, { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Fetch search history from server when component mounts
    fetch('/PORT/get-users')
      .then(response => response.json())
      .then(data => {
        setSearchHistory(data.results);
      })
      .catch(error => {
        console.error('Error fetching search history:', error);
      });
  }, []); // Empty dependency array to run this effect only once when the component mounts

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newSearchHistory = [...searchHistory, `${selectedOption}: ${searchTerm}`];
    setSearchHistory(newSearchHistory);

    // POST new search term to the server
    fetch('/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: selectedOption,
        rating: searchTerm
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle response if needed
      console.log('Response from server:', data);
    })
    .catch(error => {
      console.error('Error posting search term:', error);
    });

    setSearchTerm('');
    setSelectedOption('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <select id="followersDropdown" onChange={handleDropdownChange} value={selectedOption}>
            <option value="">Select an option</option>
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
