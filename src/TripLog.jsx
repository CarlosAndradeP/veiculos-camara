import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StartTrip() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      .then(data => {
        setVehicles(data);
        if (data.length > 0) setSelectedVehicle(data[0]);
      })
      .catch(error => console.error("Error loading vehicles:", error));
      
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const [initialOdometer, setInitialOdometer] = useState('');
  const [finalOdometer, setFinalOdometer] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const now = new Date();
    const newTrip = {
      vehiclePlate: selectedVehicle,
      initialOdometer,
      finalOdometer,
      destination,
      submissionTime: now.toLocaleString(),
    };

    // Update state
    const updatedTrips = [...trips, newTrip];
    setInitialOdometer('');
    setFinalOdometer('');
    setDestination('');
  };

  const handleBackToMainMenu = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Start a Trip</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vehicleSelect">Select Vehicle:</label>
          <select
            id="vehicleSelect"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            {vehicles.map((vehicle, index) => (
              <option key={index} value={vehicle}>{vehicle}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="initialOdometer">Initial Odometer:</label>
          <input
            type="number"
            id="initialOdometer"
            value={initialOdometer}
            onChange={(e) => setInitialOdometer(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="finalOdometer">Final Odometer:</label>
          <input
            type="number"
            id="finalOdometer"
            value={finalOdometer}
            onChange={(e) => setFinalOdometer(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={handleBackToMainMenu}>
          Back to Main Menu
        </button>
      </form>

      <h3>Trip Logs</h3>
      <ul>
        {trips.map((trip, index) => (
          <li key={index}>
            <strong>Vehicle Plate:</strong> {trip.vehiclePlate}, 
            <strong>Initial Odometer:</strong> {trip.initialOdometer}, 
            <strong>Final Odometer:</strong> {trip.finalOdometer}, 
            <strong>Destination:</strong> {trip.destination}, 
            <strong>Submission Time:</strong> {trip.submissionTime}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StartTrip;