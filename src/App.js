import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const fetchhistory = async () => {
      try {
        const response = await fetch('http://localhost:2024/get-users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSearchHistory(data.results);
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };
    fetchhistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('http://localhost:2024/get-users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchHistory(data.results);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const deleteSubmission = async (id) => {
    try {
      await fetch(`http://localhost:2024/delete-user/?id=${id}`, { method: 'DELETE' });
      setSearchHistory(currentHistory => currentHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting search history item:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const now = new Date();

    const newItem = { 
      location: selectedOption, 
      rating: parseInt(searchTerm, 10),       
      date: now.toISOString() // Add the current date and time
    };

    try {
      const response = await fetch('http://localhost:2024/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedItem = await response.json();
      
      setSearchHistory(currentHistory => [...currentHistory, addedItem]);
      console.log(searchHistory)
    } catch (error) {
      console.error('Error posting search history item:', error);
    }
    setSearchTerm('');
    setSelectedOption('');
    fetchSearchHistory()
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Please submit how you thought the WiFi was
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          '& .MuiTextField-root': { my: 1, width: '100%' },
          '& .MuiButton-root': { mt: 2 },
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 1,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="location-dropdown-label">Select a location</InputLabel>
          <Select
            labelId="location-dropdown-label"
            id="locationDropdown"
            value={selectedOption}
            label="Select a location"
            onChange={handleDropdownChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Moffitt Library">Moffitt Library</MenuItem>
            <MenuItem value="Haas Courtyard">Haas Courtyard</MenuItem>
            <MenuItem value="East Asian Library">East Asian Library</MenuItem>
            <MenuItem value="Sather Gate">Sather Gate</MenuItem>
            <MenuItem value="Kresge Engineering Library">Kresge Engineering Library</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="ratingInput"
          label="Enter rating"
          type="number"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <Button type="submit" variant="contained">Submit</Button>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 1, p: 2 }}>
        <Typography variant="h6" component="h2">
          Past Submissions
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="search history table">
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...searchHistory].reverse().map((row, index) => (
                <TableRow key={index}>
                <TableCell component="th" scope="row">{row.location}</TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right"></TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
      
    </Container>
  );
}

export default App;
