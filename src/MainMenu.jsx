import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaCar, FaPlay, FaStop, FaFileAlt } from 'react-icons/fa';
import VeicleControl from './VeicleControl';
import StartTrip from './StartTrip';
import EndTrip from './EndTrip';
import ReportGenerator from './ReportGenerator';
import './MainMenu.css';
function MainMenu() {

  return (    
    <div className="main-menu">
      <nav>
        <Link to="/register-vehicle" className="menu-button"><FaCar />Registrar Veículo</Link>
        <Link to="/start-trip" className="menu-button"><FaPlay />Iniciar Corrida</Link>
        <Link to="/end-trip" className="menu-button"><FaStop />Finalizar Corrida</Link>
        <Link to="/generate-reports" className="menu-button"><FaFileAlt />Gerar Relatórios</Link>
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