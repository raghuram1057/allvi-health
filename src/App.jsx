import { Routes, Route } from 'react-router-dom';
import Phase1Upload from './components/Phase1Upload';
import Phase1Review from './components/Phase1Review';

function App() {
  return (
    <div className="app-main">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Phase1Upload />} />
        
        {/* Upload route */}
        <Route path="/phase1upload" element={<Phase1Upload />} />
        
        {/* FIX: Ensure this matches exactly what's in your navigate('/review') */}
        <Route path="/review" element={<Phase1Review />} />
        
        {/* If you are using /phase1review elsewhere, keep this too */}
        <Route path="/phase1review" element={<Phase1Review />} />
      </Routes>
    </div>
  );
}

export default App;