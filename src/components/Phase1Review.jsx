import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipboardCheck, Save, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const Phase1Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from Phase1Upload navigation state
  const { parsedData, allviId, fileName } = location.state || {};

  const [formData, setFormData] = useState({
    test_date: '',
    tsh: '',
    free_t3: '',
    free_t4: '',
    anti_tpo: '',
    ferritin: '',
    vit_d: ''
  });

  const [saving, setSaving] = useState(false);

  // Sync AI data to form state on load
  useEffect(() => {
    if (parsedData) {
      setFormData(prev => ({ ...prev, ...parsedData }));
    } else {
      // If someone accesses /review directly without uploading, send them back
      navigate('/phase1upload');
    }
  }, [parsedData, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      // Locally we use 5000, in production we use the Render URL
      const baseURL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://allvibackend.onrender.com';
      
      const response = await axios.post(`${baseURL}/api/patient/confirm-results`, {
        patientId: allviId,
        biomarkers: formData
      });

      if (response.data.success) {
        alert(`Success! Records saved under ID: ${allviId}`);
        
        // --- PHASE 2 REDIRECT ---
        // Navigate to the dashboard with the patient's unique ID
        navigate(`/dashboard/${allviId}`); 
      }
    } catch (error) {
      console.error("Final Save Error:", error);
      const errorDetail = error.response?.data?.details || "Database connection error.";
      alert(`Error: ${errorDetail}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white">
          <button 
            onClick={() => navigate('/phase1upload')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={16} /> Re-upload File
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-400">
                <ClipboardCheck /> Review Lab Values
              </h2>
              <p className="text-slate-400 text-sm mt-1">Source: {fileName}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-400 uppercase font-bold tracking-widest">Unique ID</span>
              <span className="text-xl font-mono text-white">{allviId}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="p-8">
          <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-xl mb-8 border border-amber-100 text-sm">
            <AlertCircle size={20} />
            <p><strong>Phase 2:</strong> Verify your values. Saving will redirect you to your health trends dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key} className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {key.replace('_', ' ')}
                </label>
                <input
                  type={key === 'test_date' ? 'date' : 'text'}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmSave}
            disabled={saving}
            className="w-full mt-10 bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={20} /> Confirm & View Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Phase1Review;