import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { jsPDF } from 'jspdf';

const ReportGenerator = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await Filesystem.readFile({
                path: 'corridas.txt',
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const loadedTrips = JSON.parse(result.data) || [];
            setTrips(loadedTrips);
            setFilteredLogs(loadedTrips);
        } catch (e) {
            console.error('Error reading or parsing trip data', e);
            setError('Falha ao carregar os dados da corrida.');
            setTrips([]);
            setFilteredLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        if (password !== '123') {
            setError('Senha incorreta!');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await Filesystem.deleteFile({
                path: 'corridas.txt',
                directory: Directory.Data,
            });
            await Filesystem.deleteFile({
                path: 'vehicles.txt',
                directory: Directory.Data,
            });
            loadTrips();
        } catch (e) {
            setError('Erro ao limpar os dados.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleGenerateReport = () => {
        setIsLoading(true);
        setError('');
        try {
            let filtered = trips;

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);

                filtered = trips.filter(trip => {
                    if (trip.startDate) {
                        const [day, month, year] = trip.startDate.split('/');
                        const tripDate = new Date(`${year}-${month}-${day}`);
                        return tripDate >= start && tripDate <= end;
                    }
                    return false;
                });
            }

            setFilteredLogs(filtered);
        } catch (e) {
            console.error('Error generating report', e);
            setError('Erro ao gerar o relatório.');
            setFilteredLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const start = new Date(startDate);
        const end = new Date(endDate);

        doc.text(`Relatório de ${start.toLocaleDateString()} até ${end.toLocaleDateString()}`, 10, 10);
        let y = 20;
        filteredLogs.forEach((log, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.text(`Corrida ${index + 1}:`, 10, y);
            y += 10;
            doc.text(`Placa do Veículo: ${log.vehiclePlate}`, 10, y);
            y += 10;
            doc.text(`Odômetro Inicial: ${log.initialOdometer}`, 10, y);
            y += 10;
            doc.text(`Odômetro Final: ${log.endOdometer !== undefined ? log.endOdometer : 0}`, 10, y);
            y += 10;
            doc.text(`Destino: ${log.destination}`, 10, y);
            y += 10;
            doc.text(`Data Inicial: ${log.startDate} ${log.startTime}`, 10, y);
            y += 10;
            doc.text(`Data Final: ${log.endDate} ${log.endTime}`, 10, y);
            y += 20;
        });
        doc.save('report.pdf');
    };

    return (
        <div>
            <h2>Gerador de Relatórios</h2>

            <div>
                <label htmlFor="startDate">Data Inicial: {startDate}</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>

            <div>
                <label htmlFor="endDate">Data Final:</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>

            <div>
                <input type="text" id="password" placeholder="Digite a senha" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button onClick={handleClearData} disabled={isLoading}>Limpar Dados</button>
            <button onClick={handleGenerateReport} disabled={isLoading}>Gerar Relatório</button>
            {filteredLogs.length > 0 && <button onClick={exportToPDF}>Exportar PDF</button>}

            {isLoading && <p>Carregando...</p>}

            {filteredLogs.length > 0 && (
                <div>
                    <h3>Relatório</h3>
                    <ul>
                        {filteredLogs.map((log, index) => (
                            <li key={index}>
                                <p>Placa do Veículo: {log.vehiclePlate}</p>
                                <p>Odômetro Inicial: {log.initialOdometer}</p>
                                <p>Odômetro Final: {log.endOdometer !== undefined ? log.endOdometer : 0}</p>
                                <p>Destino: {log.destination}</p>
                                <p>Data Inicial: {log.startDate} {log.startTime}</p>
                                <p>Data Final: {log.endDate} {log.endTime}</p>
                                {log.violations && log.violations.length > 0 && (
                                    <p>Violações: {log.violations.join(', ')}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Link to="/">Voltar ao Menu Principal</Link>
        </div>
    );
};

export default ReportGenerator;