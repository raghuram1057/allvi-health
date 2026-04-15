import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Phase1Upload from './components/Phase1Upload';
import Phase1Review from './components/Phase1Review';
import Dashboard from './components/Dashboard'; // Import your new Dashboard component

// 1. Place the Wrapper function HERE (outside the App component)
const DashboardWrapper = () => {
    const { id } = useParams();
    return <Dashboard patientId={id} />;
};

function App() {
  return (
    <div className="app-main">
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Phase1Upload />} />
        <Route path="/phase1upload" element={<Phase1Upload />} />
        <Route path="/review" element={<Phase1Review />} />
        
        {/* 2. Add the Dashboard Route HERE */}
        <Route path="/dashboard/:id" element={<DashboardWrapper />} />
        
        {/* Optional Catch-all */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;