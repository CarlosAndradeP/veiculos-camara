import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function StartTrip() {
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [initialOdometer, setInitialOdometer] = useState('');

  const handleVehiclePlateChange = (event) => {
    setVehiclePlate(event.target.value);
  };

  const handleInitialOdometerChange = (event) => {
    setInitialOdometer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (vehiclePlate && initialOdometer) {
      console.log('Vehicle Plate:', vehiclePlate);
      console.log('Initial Odometer:', initialOdometer);
      // Here you would typically handle the form submission,
      // e.g., send data to an API or update the application state.
      // For this example, we'll just clear the form.
      setVehiclePlate('');
      setInitialOdometer('');
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <div>
      <h2>Start Trip</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vehiclePlate">Vehicle Plate:</label>
          <input
            type="text"
            id="vehiclePlate"
            value={vehiclePlate}
            onChange={handleVehiclePlateChange}
            required
          />
        </div>
        <div>
          <label htmlFor="initialOdometer">Initial Odometer:</label>
          <input
            type="number"
            id="initialOdometer"
            value={initialOdometer}
            onChange={handleInitialOdometerChange}
            required
          />
        </div>
        <button type="submit">Start Trip</button>
      </form>
      <Link to="/">
        <button>Back to Main Menu</button>
      </Link>
    </div>
  );
}

export default StartTrip;