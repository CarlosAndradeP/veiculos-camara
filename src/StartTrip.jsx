import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem/dist/esm';
import { Toast } from '@capacitor/toast';
function StartTrip() {
  // State variables
  const [trips, setTrips] = useState([]);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [initialOdometer, setInitialOdometer] = useState('');
  const [error, setError] = useState('');

  // Load trips on component mount
  useEffect(() => {
    loadTrips();
  }, []);

  // Function to load trips from file
  const loadTrips = async () => {
    try {
      const result = await Filesystem.readFile({
        path: 'corridas.txt',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      setTrips(JSON.parse(result.data));
    } catch (e) {
      console.error('Error reading file', e);
      setError('Failed to load previous trips.');
      setTrips([]); // Initialize trips to an empty array in case of error
    }
  };

  const handleVehiclePlateChange = (event) => {
    setVehiclePlate(event.target.value);
  };

  // Function to check if a trip is already started for a given vehicle plate
  const isTripAlreadyStarted = (plate) => {
    return trips.some(trip => trip.vehiclePlate === plate && !trip.endOdometer);
  };

  const handleInitialOdometerChange = (event) => {
    setInitialOdometer(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(''); // Clear previous errors

    if (!vehiclePlate || !initialOdometer) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (isTripAlreadyStarted(vehiclePlate)) {
      setError('A trip for this vehicle is already in progress.');
      return;
    }

    try {
      const now = new Date();
      const startDate = now.toLocaleDateString();
      const startTime = now.toLocaleTimeString();

      const newTrip = {
        vehiclePlate,
        initialOdometer: parseInt(initialOdometer, 10), // Ensure initialOdometer is a number
        startDate,
        startTime,
      };

      const updatedTrips = [...trips, newTrip];
      setTrips(updatedTrips);

      await Filesystem.writeFile({
        path: 'corridas.txt',
        data: JSON.stringify(updatedTrips),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      await Toast.show({
        text: 'Corrida iniciada com sucesso!',
      });

      // Reset form fields on success
      setVehiclePlate('');
      setInitialOdometer('');
    } catch (e) {
      console.error('Error starting trip:', e);
      setError('Falha ao iniciar corrida. Por favor, tente novamente.');
      await Toast.show({
        text: 'Falha ao iniciar corrida. Por favor, tente novamente.',
      });
    }
  }

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
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Link to="/">        
        <button>Back to Main Menu</button>        
      </Link>      
    </div>    
  );
}

export default StartTrip;