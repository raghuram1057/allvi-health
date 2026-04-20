import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, Loader2, ArrowRight, UserCircle, Users } from 'lucide-react';

const Phase1Upload = () => {
  const [file, setFile] = useState(null);
  const [existingId, setExistingId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startProcessing = async (e) => {
    e.preventDefault();
    
    if (!file) return alert("Please select a lab report to upload.");
    
    const isNewPatient = !existingId.trim();
    if (isNewPatient && (!age || !gender)) {
        return alert("New patients must provide Age and Gender for accurate AI clinical analysis.");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('report', file);
    
    if (!isNewPatient) {
        formData.append('existingId', existingId.trim());
    } else {
        formData.append('age', age);
        formData.append('gender', gender);
    }

    try {
      const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:5000' 
        : 'https://allvibackend.onrender.com';

      const response = await axios.post(`${baseURL}/api/patient/process-report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
    const flattenedBiomarkers = {};
    
    // 1. Get the array from the nested response
    const rawBiomarkers = response.data.parsedData?.biomarkers;

    // 2. Loop through and map to keys the Review page expects
    if (Array.isArray(rawBiomarkers)) {
        rawBiomarkers.forEach(bm => {
            if (bm && bm.name) {
                // Normalize name (e.g., "Vitamin D" -> "vit_d")
                let key = bm.name.toLowerCase().trim().replace(/\s+/g, '_');
                
                // Map common variations to your specific state keys
                if (key.includes('tsh')) key = 'tsh';
                if (key.includes('vit') && key.includes('d')) key = 'vit_d';
                if (key.includes('ferritin')) key = 'ferritin';
                
                flattenedBiomarkers[key] = bm.value ?? '';
            }
        });
    }

    navigate('/review', {
        state: {
            parsedData: {
                test_date: response.data.parsedData?.test_date || '',
                ...flattenedBiomarkers // This adds tsh, vit_d, etc. to the object
            },
            allviId: response.data.allvi_id,
            fileName: file.name,
            age: age || response.data.age,
            gender: gender || response.data.gender
          }
    });
}
    } catch (error) {
      console.error("AI Processing Error:", error);
      const errorMessage = error.response?.data?.details || "Failed to process report. Ensure server is running.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200/60">

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#0F4C5C]/10 p-2 rounded-xl">
             <Users className="text-[#0F4C5C]" size={24} />
          </div>
          <div className="flex items-baseline">
            <span style={{ fontFamily: 'serif', fontSize: '26px', fontWeight: '600', color: '#0F4C5C' }}>All</span>
            <span style={{ fontFamily: 'serif', fontSize: '26px', fontWeight: '300', fontStyle: 'italic', color: '#0F4C5C', opacity: 0.6 }}>vi</span>
            <h2 className="ml-2 text-xl font-bold text-[#1F2937]">Health AI</h2>
          </div>
        </div>

        <p className="text-[#1F2937]/70 text-sm mb-6 font-medium">
          Upload your report. Our AI identifies biomarkers based on your age and gender profile.
        </p>

        <form onSubmit={startProcessing} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-black text-[#1F2937]/40 mb-1.5 uppercase tracking-widest">
              Returning User?
            </label>
            <input
              type="text"
              placeholder="Enter ALLVI-ID"
              className="w-full p-3 bg-[#F7F1E8]/30 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0F4C5C] outline-none transition-all font-mono text-sm uppercase"
              value={existingId}
              onChange={(e) => setExistingId(e.target.value)}
            />
          </div>

          {!existingId.trim() && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#0F4C5C]/5 rounded-2xl border border-[#0F4C5C]/10 transition-all duration-300">
               <div className="col-span-2">
                  <p className="text-[10px] font-bold text-[#0F4C5C] uppercase mb-2 flex items-center gap-1">
                     <UserCircle size={12}/> New Patient Initialization
                  </p>
               </div>
               <div>
                  <label className="block text-[9px] font-bold text-[#1F2937]/60 uppercase mb-1">Age</label>
                  <input 
                    type="number" 
                    placeholder="Years"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-lg border border-slate-200 text-sm outline-none focus:border-[#0F4C5C]"
                  />
               </div>
               <div>
                  <label className="block text-[9px] font-bold text-[#1F2937]/60 uppercase mb-1">Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-lg border border-slate-200 text-sm outline-none focus:border-[#0F4C5C]"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
               </div>
            </div>
          )}

          <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all relative 
            ${file ? 'border-[#0F4C5C] bg-[#0F4C5C]/5' : 'border-slate-200 bg-[#F7F1E8]/20 hover:border-[#0F4C5C]/50'}`}>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,image/*"
            />
            {file ? (
              <div className="flex flex-col items-center text-[#0F4C5C]">
                <FileText size={32} className="mb-2" />
                <span className="font-bold text-xs truncate w-full px-4 italic">{file.name}</span>
                <span className="text-[10px] uppercase font-black tracking-tighter mt-1 opacity-60">Ready to Analyze</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#1F2937]/40">
                <Upload size={32} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-tighter">Attach Lab Report</p>
                <p className="text-[9px] mt-1 italic">PDF, JPG, or PNG</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-[#1F2937] text-[#F7F1E8] py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-[#0F4C5C] transition-all disabled:opacity-40 shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                AI is Analyzing...
              </>
            ) : (
              <>
                Analyze Report <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Phase1Upload;