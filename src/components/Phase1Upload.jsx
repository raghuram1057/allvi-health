import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, Fingerprint, Loader2, FileText } from 'lucide-react';
const baseURL = import.meta.env.VITE_API_URL

const Phase1Upload = () => {
  const [loading, setLoading] = useState(false);
  const [assignedId, setAssignedId] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    test_date: new Date().toISOString().split('T')[0],
    tsh: '', free_t3: '', free_t4: '', ferritin: '', vit_d: ''
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct call to port 5000
      const response = await axios.post(`${baseURL}/api/patient/onboard`, { 
        labData: formData 
    });

      if (response.data.success) {
        setAssignedId(response.data.allvi_id);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      const errorMsg = error.response?.data?.error || "Server is offline. Start 'node index.js' in the server folder.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white">
            <Fingerprint size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Allvi Onboarding</h2>
        </div>

        {!assignedId ? (
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 group hover:border-blue-400 transition-colors relative">
               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
               <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-blue-500" />
               <p className="text-sm font-medium text-slate-600">{file ? file.name : 'Upload Lab Report (PDF/JPG)'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 ml-1">TEST DATE</label>
                <input type="date" value={formData.test_date} className="w-full p-3 bg-slate-100 rounded-xl border-none" onChange={e => setFormData({...formData, test_date: e.target.value})} />
              </div>
              {['tsh', 'free_t3', 'free_t4', 'ferritin'].map(field => (
                <div key={field}>
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">{field.replace('_', ' ')}</label>
                  <input type="number" step="0.01" className="w-full p-3 bg-slate-100 rounded-xl border-none" placeholder="0.00" onChange={e => setFormData({...formData, [field]: e.target.value})} />
                </div>
              ))}
            </div>

            <button disabled={loading || !file} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : 'Securely Save & Generate ID'}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Identity Secured</h3>
            <div className="bg-slate-100 p-6 rounded-2xl my-6">
              <span className="text-4xl font-mono font-black text-blue-700 tracking-wider">{assignedId}</span>
            </div>
            <p className="text-sm text-slate-500">Save this ID to access your health trends.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Phase1Upload;