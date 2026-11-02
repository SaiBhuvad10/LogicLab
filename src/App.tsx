import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import { Dashboard } from './pages/Dashboard';
import { GateSimulator } from './pages/GateSimulator';
import { CircuitDesigner } from './pages/CircuitDesigner';
import { TruthTable } from './pages/TruthTable';
import { BooleanSolver } from './pages/BooleanSolver';
import { KMapSolver } from './pages/KMapSolver';
import { NumberSystem } from './pages/NumberSystem';
import { CombinationalCircuits } from './pages/CombinationalCircuits';
import { FlipFlopSimulator } from './pages/FlipFlopSimulator';
import { CounterSimulator } from './pages/CounterSimulator';
import { ShiftRegisterSimulator } from './pages/ShiftRegisterSimulator';
import { LearningCentre } from './pages/LearningCentre';
import { Quiz } from './pages/Quiz';
import { SavedCircuits } from './pages/SavedCircuits';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gates" element={<GateSimulator />} />
          <Route path="designer" element={<CircuitDesigner />} />
          <Route path="truth-table" element={<TruthTable />} />
          <Route path="boolean-solver" element={<BooleanSolver />} />
          <Route path="kmap-solver" element={<KMapSolver />} />
          <Route path="number-system" element={<NumberSystem />} />
          <Route path="combinational" element={<CombinationalCircuits />} />
          <Route path="flip-flop" element={<FlipFlopSimulator />} />
          <Route path="counter" element={<CounterSimulator />} />
          <Route path="shift-register" element={<ShiftRegisterSimulator />} />
          <Route path="learning" element={<LearningCentre />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="saved-circuits" element={<SavedCircuits />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

