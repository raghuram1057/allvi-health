import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader2, Database } from 'lucide-react';

const Phase1Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, existingId } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [assignedId, setAssignedId] = useState(existingId || null);

  // Mock Parsed Data (This will be AI-driven in Phase 3)
  const [parsedData, setParsedData] = useState({
    test_date: new Date().toISOString().split('T')[0],
    tsh: '2.45',
    free_t3: '3.1',
    free_t4: '1.2',
    vit_d: '32',
    ferritin: '45'
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseURL}/api/patient/onboard`, { 
        labData: { ...parsedData, existingId } 
      });

      if (response.data.success) {
        setAssignedId(response.data.allvi_id);
        setFinished(true);
      }
    } catch (err) {
      alert("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">
        {!finished ? (
          <>
            <h2 className="text-2xl font-bold text-slate-800">Review Parsed Data</h2>
            <p className="text-sm text-slate-500 mb-6">Extracted from: <span className="font-bold text-blue-600">{fileName}</span></p>

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl mb-8">
              {Object.keys(parsedData).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{key.replace('_', ' ')}</label>
                  <input 
                    type={key === 'test_date' ? 'date' : 'number'} 
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    value={parsedData[key]}
                    onChange={(e) => setParsedData({...parsedData, [key]: e.target.value})}
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-600 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Database size={20}/> Confirm & Save to Dashboard</>}
            </button>
          </>
        ) : (
          <div className="text-center py-10">
            <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800">Data Successfully Stored!</h3>
            <div className="bg-blue-50 p-6 rounded-2xl my-6">
              <p className="text-xs text-blue-500 font-bold mb-2">PATIENT ALLVI-ID</p>
              <span className="text-4xl font-mono font-black text-blue-700">{assignedId}</span>
            </div>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Go to Phase 2: Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Phase1Review;