import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import VeicleControl from './VeicleControl';
import StartTrip from './StartTrip';
import EndTrip from './EndTrip';
import ReportGenerator from './ReportGenerator';
import './MainMenu.css';
function MainMenu() {

  return (    
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/register-vehicle">Register Vehicle</Link>
            </li>
            <li>
              <Link to="/start-trip">Start Trip</Link>  
            </li>
            <li>
              <Link to="/end-trip">End Trip</Link>
            </li>
            <li>
              <Link to="/generate-reports">Generate Reports</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register-vehicle" element={<VeicleControl />} />
          <Route path="/start-trip" element={<StartTrip />} />
          <Route path="/end-trip" element={<EndTrip />} />
          <Route path="/generate-reports" element={<ReportGenerator />} />
          <Route path="*" element={<VeicleControl />} />
        </Routes>        
      </div>
  );
}

export default MainMenu;