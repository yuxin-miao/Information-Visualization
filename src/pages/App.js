import './App.css';
import { Routes, Route } from "react-router-dom";

import { Main } from '../components/main';
import { About } from './About/about';
import { Team } from './Team/team';
import { Demo } from './Demo/demo';
import { Sidebar } from '../components/sidebar';

function App() {
  
  return (
    <div className="h-screen w-screen bg-main grid gap-4 grid-cols-12 grid-rows-1">
      <Sidebar className="col-span-2" />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About className="col-start-3"/>} />
        <Route path="/team" element={<Team className="col-start-3"/>} />
        <Route path="/demo" element={<Demo className="col-start-3"/>} />
      </Routes>
    </div>
  );
}

export default App;
