// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [planets, setPlanets] = useState([]);
  const [residents, setResidents] = useState({});
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  useEffect(() => {
    // Fetch planets
    fetchPlanets('https://swapi.dev/api/planets/?format=json');
  }, []);

  const fetchPlanets = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setPlanets(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
      })
      .catch(error => console.error('Error fetching planets:', error));
  };

  const handleLoadMore = (pageUrl) => {
    fetchPlanets(pageUrl);
  };

  const handleCardClick = (planet) => {
    setSelectedPlanet(selectedPlanet === planet ? null : planet);
  };

  useEffect(() => {
    // Fetch residents for each planet
    const fetchResidents = async (residentURLs) => {
      const residentPromises = residentURLs.map(url => fetch(url).then(response => response.json()));
      return Promise.all(residentPromises);
    };

    const planetResidents = {};

    const fetchResidentsData = async () => {
      for (const planet of planets) {
        const residentData = await fetchResidents(planet.residents);
        planetResidents[planet.name] = residentData;
      }

      setResidents(planetResidents);
    };

    if (planets.length > 0) {
      fetchResidentsData();
    }
  }, [planets]);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">Star Wars Planets</h1>
      </header>
      <div className="content-container">
        <div className="planet-container">
          {planets.map(planet => (
            <div
              key={planet.name}
              className={`planet-card ${selectedPlanet === planet ? 'selected' : ''}`}
              onClick={() => handleCardClick(planet)}
            >
              <h2>{planet.name}</h2>
              {selectedPlanet === planet ? (
                <div className="planet-details">
                  <p><strong>Climate:</strong> {planet.climate}</p>
                  <p><strong>Population:</strong> {planet.population}</p>
                  <p><strong>Terrain:</strong> {planet.terrain}</p>
                  <h3>Residents:</h3>
                  <ul>
                    {residents[planet.name] &&
                      residents[planet.name].map(resident => (
                        <li key={resident.name}>
                          <strong>Name:</strong> {resident.name}<br />
                          <strong>Height:</strong> {resident.height}<br />
                          <strong>Mass:</strong> {resident.mass}<br />
                          <strong>Gender:</strong> {resident.gender}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handleLoadMore(prevPage)}
            disabled={!prevPage}  // Disable the button if there is no previous page
          >
            Previous
          </button>
          <button
            className="pagination-button"
            onClick={() => handleLoadMore(nextPage)}
            disabled={!nextPage}  // Disable the button if there is no next page
          >
            Next
          </button>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Star Wars Planets App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
