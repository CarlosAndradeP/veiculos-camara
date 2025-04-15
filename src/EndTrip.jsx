import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem/dist/esm';
import { Toast } from '@capacitor/toast';

function EndTrip() {
    const [openTrips, setOpenTrips] = useState([]);
    const [selectedTripIndex, setSelectedTripIndex] = useState(null);
    const [finalOdometer, setFinalOdometer] = useState('');
    const [destination, setDestination] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    
    // Load trips on component mount
    useEffect(() => {
        loadTrips();
    }, []);

    // Function to load trips from file
    const loadTrips = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            const result = await Filesystem.readFile({
                path: 'corridas.txt',
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const trips = JSON.parse(result.data) || [];
            setOpenTrips(trips.filter(trip => !trip.endOdometer));            
            setError('');            
        } catch (e) {
            console.error('Falha ao ler o arquivo', e);
            setError('Falha ao carregar as corridas.');
            setOpenTrips([]);            
        } finally {
            setIsLoading(false); // Set loading state to false when done
        }
    };

    // Function to handle form submission
    const handleSave = async () => {
        setError(''); // Clear previous errors
        setIsLoading(true); // Set loading state to true

        if (selectedTripIndex === null) {
            setError('Por favor, selecione uma corrida para finalizar.');
            setIsLoading(false); // Set loading state to false
            return;
        }

        if (!finalOdometer || !destination) {
            setError('Por favor, preencha todos os campos.');
            setIsLoading(false); // Set loading state to false
            return;
        }

        try {
            const result = await Filesystem.readFile({
                path: 'corridas.txt',
                directory: Directory.Data,
                encoding: Encoding.UTF8
            });
            let updatedTrips = JSON.parse(result.data) || [];

            // Find the selected trip
            const selectedTrip = updatedTrips[selectedTripIndex];

            if (!selectedTrip) {
                setError('Corrida selecionada não encontrada.');
                return;
            }

            // Validate final odometer
            if (parseInt(finalOdometer, 10) < selectedTrip.initialOdometer) {
                setError('O odômetro final não pode ser menor que o odômetro inicial.');
                return;
            }

            // Update the trip with end details
            updatedTrips[selectedTripIndex] = {
                ...selectedTrip,
                destination,
                endOdometer: parseInt(finalOdometer, 10),
                endDate: new Date().toLocaleDateString(),
                endTime: new Date().toLocaleTimeString(),
            };

            // Write the updated trips back to the file
            await Filesystem.writeFile({
                path: 'corridas.txt',
                data: JSON.stringify(updatedTrips),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });

            // Show success toast
            await Toast.show({
                text: 'Corrida finalizada com sucesso!',
            });

            // Reset form fields
            setSelectedTripIndex(null);
            setDestination('');
            setFinalOdometer('');

            // Refresh the list of open trips
            setOpenTrips(updatedTrips.filter(trip => !trip.endOdometer));
        } catch (e) {
            console.error('Falha ao finalizar corrida:', e);
            setError('Failed to end trip. Please try again.');
            await Toast.show({
                text: 'Failed to end trip.',
            });
        } finally {
            setIsLoading(false); // Set loading state to false when done
        }
    };

    return (
        <div>
            <h2>Finalizar Corrida</h2>
            {isLoading ? (
                <p>Carregando corridas...</p>
            ) : (
                <>
                    {error && <p style={{ color: 'red' }}>{error}</p>}                    

                    <div>
                        <label htmlFor="tripSelect">Select Trip:</label>
                        <select
                            id="tripSelect"
                            value={selectedTripIndex !== null ? selectedTripIndex : ''}
                            onChange={(e) => setSelectedTripIndex(e.target.value !== '' ? Number(e.target.value) : null)}
                        >
                            <option value="">-- Select a Trip --</option>
                            {openTrips.map((trip, index) => (
                                <option key={index} value={index}>
                                    {`Veículo: ${trip.vehiclePlate}, Início: ${trip.startDate} ${trip.startTime}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="destination">Destino:</label>
                        <input
                            type="text"
                            id="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="finalOdometer">Odômetro Final:</label>
                        <input
                            type="number"
                            id="finalOdometer"
                            value={finalOdometer}
                            onChange={(e) => setFinalOdometer(e.target.value)}
                            required
                        />
                    </div>

                    <button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Finalizar Corrida'}
                    </button>
                </>
            )}
            <Link to="/"><button>Voltar ao Menu Principal</button></Link>
        </div>
    );
}
export default EndTrip;