import { useState, type ChangeEvent } from 'react';
import { getCodeSandboxHost } from "@codesandbox/utils";

type Hotel = { _id: string, chain_name: string; hotel_name: string; city: string, country: string };
type City = { name: string };
type Country = { country: string };

const codeSandboxHost = getCodeSandboxHost(3001)
const API_URL = codeSandboxHost ? `https://${codeSandboxHost}` : 'http://localhost:3001'

const fetchAndFilter = async (endpoint: string, value: string) => {
  const response = await fetch(`${API_URL}/${endpoint}?query=${value}`);
  return response.json();
}

function App() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showClearBtn, setShowClearBtn] = useState(false);

  const fetchData = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setHotels([]);
      setCities([]);
      setCountries([]);
      setShowClearBtn(false);
      return;
    }

    const [filteredHotels, filteredCities, filteredCountries] = await Promise.all([
      fetchAndFilter('hotels', value),
      fetchAndFilter('cities', value),
      fetchAndFilter('countries', value)
    ]);

    setShowClearBtn(true);
    setHotels(filteredHotels);
    setCities(filteredCities);
    setCountries(filteredCountries);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  onChange={fetchData}
                />
                {showClearBtn && (
                  <span className="left-pan" onClick={() => fetchData({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                <h2>Hotels</h2>
                {hotels.length ? hotels.map((hotel, index) => (
                  <li key={index}>
                    <a href={`/hotels/${hotel._id}`} className="dropdown-item">
                      <i className="fa fa-building mr-2"></i>
                      {hotel.hotel_name}
                    </a>
                    <hr className="divider" />
                  </li>
                )) : <p>No hotels matched</p>}
                <h2>Countries</h2>
                {countries.length ? countries.map((country, index) => (
                  <li key={index}>
                    <a href={`/countries/${country.country}`} className="dropdown-item">
                      <i className="fa fa-flag mr-2"></i>
                      {country.country}
                    </a>
                    <hr className="divider" />
                  </li>
                )) : <p>No countries matched</p>}
                <h2>Cities</h2>
                {cities.length ? cities.map((city, index) => (
                  <li key={index}>
                    <a href={`/cities/${city.name}`} className="dropdown-item">
                      <i className="fa fa-map-marker mr-2"></i>
                      {city.name}
                    </a>
                    <hr className="divider" />
                  </li>
                )) : <p>No cities matched</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;