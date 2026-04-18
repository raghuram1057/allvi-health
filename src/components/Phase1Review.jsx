import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipboardCheck, Save, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const Phase1Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (parsedData) {
      setFormData(prev => ({ ...prev, ...parsedData }));
    } else {
      navigate('/phase1upload');
    }
  }, [parsedData, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:5000' 
        : 'https://allvibackend.onrender.com';
      
      const response = await axios.post(`${baseURL}/api/patient/confirm-results`, {
        patientId: allviId,
        biomarkers: formData
      });

      if (response.data.success) {
        alert(`Success! Records saved under ID: ${allviId}`);
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
    /* Background: Ivory #F7F1E8 */
    <div className="min-h-screen bg-[#F7F1E8] py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60">
        
        {/* Header: Deep Teal #0F4C5C */}
        <div className="bg-[#0F4C5C] p-8 text-[#F7F1E8]">
          <button 
            onClick={() => navigate('/phase1upload')}
            className="flex items-center gap-2 text-[#F7F1E8]/70 hover:text-white transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Re-upload File
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardCheck className="text-[#F7F1E8]" /> Review Lab Values
              </h2>
              <p className="text-[#F7F1E8]/70 text-sm mt-1">Source: {fileName}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-[#F7F1E8]/50 uppercase font-bold tracking-widest">Unique ID</span>
              <span className="text-xl font-mono font-bold">{allviId}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="p-8">
          {/* Info Alert: Uses Deep Teal as an accent */}
          <div className="flex items-center gap-3 p-4 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-xl mb-8 border border-[#0F4C5C]/10 text-sm">
            <AlertCircle size={20} />
            <p className="font-medium">
              Verify your values. Saving will redirect you to your health trends dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key} className="space-y-1">
                {/* Text: Charcoal #1F2937 */}
                <label className="block text-xs font-bold text-[#1F2937]/50 uppercase tracking-wider">
                  {key.replace('_', ' ')}
                </label>
                <input
                  type={key === 'test_date' ? 'date' : 'text'}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  /* Input Background: Ivory #F7F1E8 base */
                  className="w-full p-3 bg-[#F7F1E8]/30 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0F4C5C] focus:bg-white outline-none transition-all font-medium text-[#1F2937]"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmSave}
            disabled={saving}
            /* Action Button: Charcoal #1F2937 with Teal hover */
            className="w-full mt-10 bg-[#1F2937] text-[#F7F1E8] py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-[#0F4C5C] shadow-lg shadow-[#1F2937]/10 transition-all disabled:opacity-40"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" /> Saving Data...
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