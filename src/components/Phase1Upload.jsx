import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, Loader2, ArrowRight, Fingerprint } from 'lucide-react';

const Phase1Upload = () => {
  const [file, setFile] = useState(null);
  const [existingId, setExistingId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startProcessing = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a lab report to upload.");

    setLoading(true);

    // We use FormData because we are sending an actual file to the backend
    const formData = new FormData();
    formData.append('report', file);
    if (existingId) formData.append('existingId', existingId);

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Hit the new Gemini processing endpoint
      const response = await axios.post(`${baseURL}/api/patient/process-report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Navigate to Phase 2 (Review) with the AI-extracted data
        navigate('/review', { 
          state: { 
            parsedData: response.data.parsedData, 
            allviId: response.data.allvi_id,
            fileName: file.name
          } 
        });
      }
    } catch (error) {
      console.error("AI Processing Error:", error);
      alert(error.response?.data?.error || "Failed to process report. Ensure your Gemini API key is set on the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Fingerprint size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Allvi Health AI</h2>
        </div>

        <p className="text-slate-500 text-sm mb-8">
          Upload your lab report. Our AI will extract the biomarkers and de-identify your data.
        </p>

        <form onSubmit={startProcessing} className="space-y-6">
          {/* Returning User Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Have an ALLVI-ID? (Enter to update records)
            </label>
            <input 
              type="text" 
              placeholder="e.g. ALLVI-4829" 
              className="w-full p-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-mono"
              value={existingId}
              onChange={(e) => setExistingId(e.target.value.toUpperCase())}
            />
          </div>

          {/* Upload Dropzone */}
          <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all relative ${file ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400'}`}>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              accept=".pdf,image/*"
            />
            
            {file ? (
              <div className="flex flex-col items-center text-green-600">
                <FileText size={48} className="mb-2" />
                <span className="font-semibold text-sm truncate w-full px-4">{file.name}</span>
                <span className="text-xs mt-1 text-green-500">File attached successfully</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Upload size={48} className="mb-2" />
                <p className="text-sm font-medium">Click or drag report here</p>
                <p className="text-xs mt-1">PDF, PNG, or JPG supported</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            disabled={loading || !file}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                AI is analyzing your report...
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