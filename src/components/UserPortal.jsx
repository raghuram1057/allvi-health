import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, ArrowRight, UserPlus, History } from 'lucide-react';

const UserPortal = () => {
    const [searchId, setSearchId] = useState('');
    const navigate = useNavigate();

    const handleAccess = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            // Navigate to the Profile/History page for this specific ID
            navigate(`/profile/${searchId.trim().toUpperCase()}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F1E8] flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
                
                {/* Left Side: Existing User Access */}
                <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="bg-[#0F4C5C]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <History className="text-[#0F4C5C]" size={28} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1F2937] uppercase tracking-tight mb-2">Returning User</h2>
                    <p className="text-sm text-slate-500 mb-8">Enter your ALLVI ID to access your historical analytics and reports.</p>
                    
                    <form onSubmit={handleAccess} className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="e.g., ALLVI-1234"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#F7F1E8]/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F4C5C] outline-none transition-all font-mono font-bold uppercase"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-[#0F4C5C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0d3b47] transition-all shadow-lg shadow-[#0F4C5C]/20"
                        >
                            Access Dashboard <ArrowRight size={16} />
                        </button>
                    </form>
                </div>

                {/* Right Side: New User / Upload */}
                <div className="p-10 md:p-12 bg-slate-50/50 flex flex-col justify-center">
                    <div className="bg-[#1F2937]/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <UserPlus className="text-[#1F2937]" size={28} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1F2937] uppercase tracking-tight mb-2">New Analysis</h2>
                    <p className="text-sm text-slate-500 mb-8">Don't have an ID? Upload your medical report to generate your unique ALLVI ID and start tracking.</p>
                    
                    <button 
                        onClick={() => navigate('/phase1upload')}
                        className="w-full border-2 border-[#1F2937] text-[#1F2937] py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1F2937] hover:text-white transition-all"
                    >
                        Upload First Report <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPortal;