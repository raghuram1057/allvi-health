import { Routes, Route } from 'react-router-dom';
import Phase1Upload from './components/Phase1Upload';
import Phase1Review from './components/Phase1Review';

function App() {
  return (
    <Routes>
      {/* Page 1: The Upload screen */}
      <Route path="/" element={<Phase1Upload />} />
      
      {/* Page 2: The Review/Parsing screen */}
      <Route path="/review" element={<Phase1Review />} />
      
      {/* Phase 2: Dashboard (Placeholder for now) */}
      <Route path="/dashboard" element={<div className="p-10">Dashboard Coming Soon...</div>} />
    </Routes>
  );
}

export default App;