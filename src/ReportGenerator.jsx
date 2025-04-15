import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem/dist/esm';
import jsPDF from 'jspdf';


function ReportGenerator() {
    const [startDate, setStartDate] = useState('');    
    const [endDate, setEndDate] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Load trips on component mount
    useEffect(() => {
        loadTrips();
    }, []);

    // Function to load trips from file
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
        let y = 20;

        doc.setFontSize(20);
        doc.text("Relatório de Corridas", 20, y);
        y += 20;

        if (filteredLogs.length === 0) {
            doc.setFontSize(12);
            doc.text("Nenhuma corrida encontrada para o período selecionado.", 20, y);
        } else {
            filteredLogs.forEach((log, index) => {
                doc.setFontSize(16);
                doc.text(`Corrida ${index + 1}`, 20, y);
                y += 10;

                doc.setFontSize(12);
                doc.text(`Placa do Veículo: ${log.vehiclePlate}`, 20, y); y += 10;
                doc.text(`Odômetro Inicial: ${log.initialOdometer}`, 20, y); y += 10;
                doc.text(`Odômetro Final: ${log.endOdometer !== undefined ? log.endOdometer : 0}`, 20, y); y += 10;
                doc.text(`Destino: ${log.destination}`, 20, y); y += 10;
                doc.text(`Data Inicial: ${log.startDate} ${log.startTime}`, 20, y); y += 10;
                doc.text(`Data Final: ${log.endDate} ${log.endTime}`, 20, y); y += 10;
                if (log.violations && log.violations.length > 0) {
                    doc.text(`Violações: ${log.violations.join(', ')}`, 20, y); y += 10;
                }
                y += 10; // Add space after each log
            });
        }
        doc.save("relatorio_corridas.pdf");
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

            <button onClick={handleGenerateReport} disabled={isLoading}>Gerar Relatório</button>
            {filteredLogs.length > 0 && <button onClick={exportToPDF}>Exportar para PDF</button>}

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
}
export default ReportGenerator;