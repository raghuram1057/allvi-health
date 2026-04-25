import React, { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Phase1Upload from './components/Phase1Upload';
import Phase1Review from './components/Phase1Review';
import Dashboard from './components/Dashboard';
import AdminPortal from './components/AdminPortal'; 
import PatientProfile from './components/PatientProfile';
import UserPortal from './components/UserPortal';
import RegisterPage from './components/RegisterPage';

// Helper to check if user is "Logged In" via our storage/cookie
const isAuthenticated = () => {
  return localStorage.getItem('allvi_auth_token') !== null;
};

const DashboardWrapper = () => {
    const { id } = useParams();
    // If someone tries to access a dashboard ID that isn't theirs, 
    // you can add extra logic here, but for now we pass the ID.
    return <Dashboard patientId={id} />;
};

function App() {
  const navigate = useNavigate();

  // --- COOKIE/SESSION LOGIC ---
  useEffect(() => {
    const savedId = localStorage.getItem('allvi_auth_token');
    
    // If they are on the root or portal and already have a "cookie", 
    // send them straight to their profile.
    const publicPaths = ['/login', '/register'];
    if (savedId && publicPaths.includes(window.location.pathname)) {
        navigate(`/profile/${savedId}`);
    }
  }, [navigate]);

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: "#F7F1E8" }}>
      
      <Navbar />

      <main style={{ padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Phase1Upload />} />
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/phase1upload" element={<Phase1Upload />} />
          <Route path="/login" element={<UserPortal />} />
          
          {/* Protected Routes: Redirect to portal if not authenticated */}
          <Route 
            path="/review" 
            element={isAuthenticated() ? <Phase1Review /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/dashboard/:id" 
            element={isAuthenticated() ? <DashboardWrapper /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/profile/:patientId" 
            element={isAuthenticated() ? <PatientProfile /> : <Navigate to="/login" />} 
          />

          {/* Admin Route */}
          <Route path="/admin" element={<AdminPortal />} />
          
          {/* 404 Route */}
          <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#0F4C5C' }}>404 - Page Not Found</h2>
            <button onClick={() => navigate('/portal')} style={{ marginTop: '20px', cursor: 'pointer', color: '#0F4C5C', fontWeight: 'bold', background: 'none', border: '1px solid #0F4C5C', padding: '10px 20px', borderRadius: '10px' }}>
              Back to Safety
            </button>
          </div>} />
        </Routes>
      </main>
      
    </div>
  );
}

export default App;