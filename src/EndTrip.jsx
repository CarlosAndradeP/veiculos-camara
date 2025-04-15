import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EndTrip() {
  const [finalOdometer, setFinalOdometer] = useState('');

  const handleSave = () => {
    // In a real application, you would update the trip log here,
    // likely by sending the final odometer to a server.
    console.log('Final odometer:', finalOdometer);
    // For this example, we'll just clear the value.
    setFinalOdometer('');
  };

  return (
    <div>
      <h2>End Trip</h2>
      <div>
        <label htmlFor="finalOdometer">Final Odometer:</label>
        <input
          type="number"
          id="finalOdometer"
          value={finalOdometer}
          onChange={(e) => setFinalOdometer(e.target.value)}  
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <Link to="/">
        <button>Back to Main Menu</button>
      </Link>
    </div>
  );
}

export default EndTrip;