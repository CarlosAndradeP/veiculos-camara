import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  
    const dummyLogs = [
    {
      vehiclePlate: 'ABC1234',
      initialOdometer: 10000,
      finalOdometer: 10500,
      destination: 'City A',
      submissionTime: '2024-01-15T10:00:00.000Z',
    },
    {
      vehiclePlate: 'XYZ5678',
      initialOdometer: 25000,
      finalOdometer: 25250,
      destination: 'City B',
      submissionTime: '2024-01-20T14:30:00.000Z',
    },
    {
      vehiclePlate: 'DEF9012',
      initialOdometer: 5000,
      finalOdometer: 5150,
      destination: 'City C',
      submissionTime: '2024-02-01T09:15:00.000Z',
    },
  ];

  const handleGenerateReport = () => {
    let filtered = dummyLogs;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = dummyLogs.filter(dummyLog => {
        const logDate = new Date(dummyLog.submissionTime);
        return logDate >= start && logDate <= end;
      });
    }

    setFilteredLogs(filtered);
  };  const handleExportPdf = () => {
    console.log("PDF generated");
    alert('PDF generated');
  };

  return (
    <div>
      <h2>Report Generator</h2>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <button onClick={handleGenerateReport}>Generate Report</button>
      <button onClick={handleExportPdf}>Export PDF</button>
      <Link to="/">Back to Main Menu</Link>

      {filteredLogs.length > 0 && (
        <div>
          <h3>Filtered Logs</h3>
          <ul>
            {filteredLogs.map((log, index) => (
              <li key={index}>
                <p>Vehicle Plate: {log.vehiclePlate}</p>
                <p>Initial Odometer: {log.initialOdometer}</p>
                <p>Final Odometer: {log.finalOdometer}</p>
                <p>Destination: {log.destination}</p>
                <p>Submission Time: {log.submissionTime}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;