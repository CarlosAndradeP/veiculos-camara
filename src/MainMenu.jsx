import React from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import { FaCar, FaPlay, FaStop, FaFileAlt } from 'react-icons/fa';
import VehicleControl from './features/vehicle';
import StartTrip from './features/trip/StartTrip';
import EndTrip from './features/trip/EndTrip';
import ReportGenerator from './features/report/ReportGenerator';
import './MainMenu.css';
function MainMenu() {
    return (
        <div className="main-menu">
            <nav>
                <Link to="/start-trip" className="menu-button"><FaPlay />Iniciar Corrida</Link>
                <Link to="/end-trip" className="menu-button"><FaStop />Finalizar Corrida</Link>
                <Link to="/generate-reports" className="menu-button"><FaFileAlt />Gerar Relatórios</Link>
            </nav>
            <Routes>                
                <Route path="/start-trip" element={<StartTrip />} />
                <Route path="/end-trip" element={<EndTrip />} />
                <Route path="/generate-reports" element={<ReportGenerator />} />
                
            </Routes>            
        </div>
    );
}
export default MainMenu