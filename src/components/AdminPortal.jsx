import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ExternalLink, Activity, Search } from 'lucide-react';

const AdminPortal = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://allvibackend.onrender.com';
            const res = await axios.get(`${baseURL}/api/patient/admin/patients`);
            if (res.data.success) setPatients(res.data.patients);
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Users className="text-blue-600" /> Clinical Oversight
                        </h1>
                        <p className="text-slate-500 mt-1">Care Coordinator Panel - Patient Monitoring</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Patient ID..." 
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="p-4 font-semibold">Patient ID</th>
                                <th className="p-4 font-semibold">Joined Date</th>
                                <th className="p-4 font-semibold">Latest Lab Report</th>
                                <th className="p-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-blue-600">{patient.id}</td>
                                    <td className="p-4 text-slate-600">{new Date(patient.joined).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${patient.lastActivity === 'No reports yet' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {patient.lastActivity}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => navigate(`/dashboard/${patient.id}`)}
                                            className="flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-900 hover:text-white px-4 py-2 rounded-lg font-medium transition-all"
                                        >
                                            View Dashboard <ExternalLink size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;