import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem/dist/esm';
import './VehicleControl.css';

function VehicleControl() {
    const [plate, setPlate] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await Filesystem.readFile({
                path: 'corridas.txt',
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const trips = JSON.parse(result.data) || [];
            if (trips.some(trip => trip.vehiclePlate === plate)) {
                setIsRegistered(true);
            }
        } catch (e) {
            console.error('Error reading file', e);
            setError('Erro ao carregar os dados do veículo.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlateChange = (event) => {
        setPlate(event.target.value);
        setIsRegistered(false); // Reset registration status on plate change
    };

    const handleSubmit = async () => {
        await loadTrips(); // Check registration on submit
    };

    const renderContent = () => {
        if (loading) {
            return <p>Carregando...</p>;
        }

        if (error) {
            return <p style={{ color: 'red' }}>{error}</p>;
        }

        if (isRegistered) {
            return <p>Veículo já registrado.</p>;
        }

        return (
            <>
                <input type="text" value={plate} onChange={handlePlateChange} placeholder="Digite a placa do veículo" />
                <button onClick={handleSubmit} disabled={plate.length <= 7} style={{ width: '100%', marginBottom: '10px', backgroundColor: '#007bff' }}>Enviar Placa</button>
            </>
        );
    };

    return (<div className="container">
        <h1>Registrar Veículo</h1>
        {renderContent()}
    </div>);
}

export default VehicleControl;