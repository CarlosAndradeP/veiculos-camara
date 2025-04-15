import React, { useState, useEffect } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

const EndTrip = () => {
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [endOdometer, setEndOdometer] = useState('');
    const [endTime, setEndTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [openTrips, setOpenTrips] = useState([]);
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const now = new Date();
        setEndTime(now.toLocaleTimeString());
        setEndDate(now.toLocaleDateString());
        loadTrips();
    }, []);

    useEffect(() => {
        setOpenTrips(trips.filter(trip => !trip.endOdometer));
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

    const updateTrip = async (tripIndex, updatedTrip) => {
        try {
            const updatedTrips = [...trips];
            updatedTrips[tripIndex] = updatedTrip;
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            if (!vehiclePlate || !endOdometer) {
                setError('Por favor, preencha todos os campos.');
                return;
            }
            const tripIndex = trips.findIndex(trip => trip.vehiclePlate === vehiclePlate && !trip.endOdometer);
            if (tripIndex === -1) {
                setError('Corrida não encontrada para esta placa.');
                return;
            }

            if (parseInt(endOdometer, 10) < parseInt(trips[tripIndex].initialOdometer, 10)) {
                setError('O odômetro final não pode ser menor que o inicial.');
                return;
            }

            const updatedTrip = {
                ...trips[tripIndex],
                endOdometer,
                endTime,
                endDate,
            };
            await updateTrip(tripIndex, updatedTrip);
            await Toast.show({
                text: 'Corrida finalizada com sucesso!',
            });
            setVehiclePlate('');
            setEndOdometer('');
        } catch (e) {
                console.error('Error ending trip:', e);
                setError('Falha ao finalizar corrida. Por favor, tente novamente.');
                await Toast.show({
                    text: 'Falha ao finalizar corrida. Por favor, tente novamente.',
                });
        }
    };

    const handleTripSelect = (event) => {
        const selectedPlate = event.target.value;
        setVehiclePlate(selectedPlate);
    };

    return (
        <div>
            <h2>Finalizar Corrida</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="openTrip">Corrida em Aberto:</label>
                    <select id="openTrip" onChange={handleTripSelect} value={vehiclePlate}>
                        <option value="">Selecione uma corrida</option>
                        {openTrips.map((trip, index) => (
                            <option key={index} value={trip.vehiclePlate}>{trip.vehiclePlate} - {trip.destination} - {trip.startDate} - {trip.startTime}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="endOdometer">Odômetro Final:</label>
                    <input type="number" id="endOdometer" value={endOdometer} onChange={e => setEndOdometer(e.target.value)} />
                </div>
                <button type="submit">Finalizar Corrida</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default EndTrip;