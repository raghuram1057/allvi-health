import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ArrowRight } from 'lucide-react';

const Phase1Upload = () => {
  const [file, setFile] = useState(null);
  const [existingId, setExistingId] = useState(''); // For returning users
  const navigate = useNavigate();

  const handleNext = () => {
    if (!file) return alert("Please upload a lab report first");
    // Pass the file data (simulated) and existing ID to the next page
    navigate('/review', { state: { fileName: file.name, existingId } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Lab Report</h2>
        <p className="text-slate-500 text-sm mb-8">Upload your PDF/Image to extract health data.</p>

        {/* Existing User Check */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Returning Patient? (Optional)</label>
          <input 
            type="text" 
            placeholder="Enter ALLVI-ID (e.g. ALLVI-1234)" 
            className="w-full p-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
            value={existingId}
            onChange={(e) => setExistingId(e.target.value)}
          />
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center bg-slate-50 group hover:border-blue-400 transition-all relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          {file ? (
            <div className="flex flex-col items-center text-blue-600">
              <FileText size={48} className="mb-2" />
              <span className="font-semibold text-sm truncate w-full px-4">{file.name}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <Upload size={48} className="mb-2 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-medium">Click to upload report</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleNext}
          className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-slate-900 transition-all"
        >
          Next: Review Data <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Phase1Upload;