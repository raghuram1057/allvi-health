import { Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the new component
import Phase1Upload from './components/Phase1Upload';
import Phase1Review from './components/Phase1Review';
import Dashboard from './components/Dashboard';
import AdminPortal from './components/AdminPortal'; 

const DashboardWrapper = () => {
    const { id } = useParams();
    return <Dashboard patientId={id} />;
};

function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: "#F7F1E8" }}>
      
      {/* NEW NAVBAR COMPONENT */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Phase1Upload />} />
          <Route path="/phase1upload" element={<Phase1Upload />} />
          <Route path="/review" element={<Phase1Review />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/dashboard/:id" element={<DashboardWrapper />} />
          <Route path="*" element={<div style={{ padding: '40px' }}>404 - Not Found</div>} />
        </Routes>
      </main>
      
    </div>
  );
}

export default App;