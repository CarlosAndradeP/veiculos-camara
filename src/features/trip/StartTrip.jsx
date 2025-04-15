import React, { useState, useEffect } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

const StartTrip = () => {
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [initialOdometer, setInitialOdometer] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [startDate, setStartDate] = useState('');
    const [destination, setDestination] = useState('');
    const [error, setError] = useState('');
    const [trips, setTrips] = useState([]);
    const [vehiclePlates, setVehiclePlates] = useState([]);

    useEffect(() => {
        const now = new Date();
        setStartTime(now.toLocaleTimeString());
        setStartDate(now.toLocaleDateString());
        loadTrips();
        loadVehiclePlates(); 
    }, []);

    useEffect(() => {
        loadVehiclePlates();
    }, []);

    const loadVehiclePlates = async () => {
        try {
            const result = await Filesystem.readFile({
                path: 'vehicles.txt',
                 directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            setVehiclePlates(JSON.parse(result.data) || []);
        } catch (e) {
            setVehiclePlates([]);
        }
    };

     useEffect(() => {
         if (trips.length > 0) {
             setInitialOdometer(Math.max(...trips.map(trip => trip.endOdometer || trip.initialOdometer || 0)));
         }
     }, [trips]);

    const loadTrips = async () => {
        try {
            const result = await Filesystem.readFile({
                path: 'corridas.txt',
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const loadedTrips = JSON.parse(result.data) || [];
            setTrips(loadedTrips);
        } catch (e) {
            console.error('Error reading or parsing trip data', e);
        }
    };

    const saveTrip = async (tripData) => {
        try {
            const updatedTrips = [...trips, tripData];
            await Filesystem.writeFile({
                path: 'corridas.txt',
                data: JSON.stringify(updatedTrips),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            setTrips(updatedTrips);
        } catch (e) {
            console.error('Error saving trip data', e);
        }
    };

    const handleNewVehiclePlate = (event) => {
        setVehiclePlate(event.target.value);
    };

    const saveVehiclePlate = async (newPlate) => {
        try {
            if (!vehiclePlates.includes(newPlate)) {
                const updatedPlates = [...vehiclePlates, newPlate];
                await Filesystem.writeFile({
                    path: 'vehicles.txt',
                    data: JSON.stringify(updatedPlates),
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });
                setVehiclePlates(updatedPlates);
            }
        } catch (e) {}
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            if (!vehiclePlate || !initialOdometer || !destination) {
                setError('Por favor, preencha todos os campos.');
                return;
            }
            const newTrip = {
                vehiclePlate,
                initialOdometer,
                destination,
                startTime,
                startDate,
                endOdometer: undefined,
                endTime: undefined,
            };
            await saveVehiclePlate(vehiclePlate);
            await saveTrip(newTrip);
            await Toast.show({
                text: 'Corrida iniciada com sucesso!',
            });
            setVehiclePlate('');
            setInitialOdometer(0);
            setDestination('');
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
            <h2>Iniciar Corrida</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="vehiclePlate">Placa do Veículo:</label>
                    <select id="vehiclePlate" value={vehiclePlate} onChange={handleNewVehiclePlate}>
                        <option value="">Selecione uma placa</option>
                        {vehiclePlates.map((plate, index) => (
                            <option key={index} value={plate}>{plate}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Digite a nova placa"
                        onChange={handleNewVehiclePlate}
                    />
                </div>
                <div><label htmlFor="initialOdometer">Odômetro Inicial:</label>
                    <input type="number" id="initialOdometer" value={initialOdometer} onChange={e => setInitialOdometer(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="destination">Destino:</label>
                    <input type="text" id="destination" value={destination} onChange={e => setDestination(e.target.value)} />
                </div>
                <button type="submit">Iniciar Corrida</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
export default StartTrip;
