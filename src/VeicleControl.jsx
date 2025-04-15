import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
function VehicleControl() {
  const [plate, setPlate] = useState('');

  const handlePlateChange = (event) => {
    setPlate(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Plate submitted:', plate);
  };

    return (
        <div className="container">
            <h1>Register Vehicle</h1>
            <input
                type="text"
                value={plate}
                onChange={handlePlateChange}
                placeholder="Enter vehicle plate"
            />
            <button onClick={handleSubmit} disabled={plate.length <= 7}>
                Send Plate
            </button>
            <Link to="/" className="button">Back to Main Menu</Link>
        </div>
    );
}

export default VehicleControl;