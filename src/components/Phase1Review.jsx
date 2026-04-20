import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipboardCheck, Save, AlertCircle, ArrowLeft, Loader2, UserCircle } from 'lucide-react';

const Phase1Review = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state (age and gender are passed forward from upload)
  const { parsedData, allviId, fileName, age, gender } = location.state || {};

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
      console.log("🔍 Review Page received state:", parsedData);

      setFormData({
        // 1. Check if test_date exists, otherwise use today
        test_date: parsedData.test_date || new Date().toISOString().split('T')[0],

        // 2. Map the flattened keys. 
        // IMPORTANT: The keys must match what the AI named them (usually lowercase)
        tsh: parsedData.tsh || '',
        free_t3: parsedData.free_t3 || '',
        free_t4: parsedData.free_t4 || '',
        anti_tpo: parsedData.anti_tpo || '',
        ferritin: parsedData.ferritin || '',
        vit_d: parsedData.vit_d || ''
      });
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
        // Direct to dashboard after successful row-based insertion
        navigate(`/dashboard/${allviId}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert(`Error: ${error.response?.data?.error || "Failed to save records."}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60">

        {/* Header Header */}
        <div className="bg-[#0F4C5C] p-8 text-[#F7F1E8]">
          <button
            onClick={() => navigate('/phase1upload')}
            className="flex items-center gap-2 text-[#F7F1E8]/70 hover:text-white transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Change File
          </button>

          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardCheck /> Review Results
              </h2>
              {/* Show Demographics Badge */}
              <div className="flex items-center gap-2 mt-2 bg-white/10 w-fit px-3 py-1 rounded-lg">
                <UserCircle size={14} className="text-[#F7F1E8]/70" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {age} Years • {gender}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-[#F7F1E8]/50 uppercase font-black tracking-widest">Identity</span>
              <span className="text-xl font-mono font-bold text-white">{allviId}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-3 p-4 bg-[#F7F1E8] text-[#1F2937]/70 rounded-xl mb-8 border border-slate-200 text-sm">
            <AlertCircle size={20} className="text-[#0F4C5C] shrink-0" />
            <p>
              Please confirm the extracted values match your lab report.
              <strong> Age and gender</strong> are used to calculate optimal ranges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {Object.keys(formData).map((key) => (
              <div key={key} className="space-y-1">
                <label className="block text-[10px] font-black text-[#1F2937]/40 uppercase tracking-widest">
                  {key.replace('_', ' ')}
                </label>
                <input
                  type={key === 'test_date' ? 'date' : 'text'}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0F4C5C] outline-none transition-all font-bold text-[#1F2937]"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmSave}
            disabled={saving}
            className="w-full mt-10 bg-[#1F2937] text-[#F7F1E8] py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-[#0F4C5C] shadow-lg shadow-[#1F2937]/10 transition-all disabled:opacity-40"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {saving ? " Creating Clinical Profile..." : " Confirm & View Analysis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Phase1Review;