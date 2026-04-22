import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import Papa from 'papaparse';
import { Activity, Printer, FileUp, Shield, Clock, UserCheck, Info, Calendar, Send, X, Loader2 } from 'lucide-react';
import AIInsights from './AIInsights';

const Dashboard = ({ patientId }) => {
    const [data, setData] = useState({ labs: [], symptoms: [] });
    const [demographics, setDemographics] = useState({ age: '—', gender: '—' });
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Appointment Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [sending, setSending] = useState(false);

    const dashboardRef = useRef(null);

    const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:5000'
        : 'https://allvibackend.onrender.com';

    useEffect(() => {
        setIsMounted(true);
        fetchDashboardData();
    }, [patientId]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/api/patient/dashboard/${patientId}`);
            if (res.data.success) {
                setData({
                    labs: res.data.labs,
                    symptoms: res.data.symptoms
                });
                setDemographics(res.data.profile);
            }
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentSubmit = async () => {
        setSending(true);
        try {
            await axios.post(`${baseURL}/api/patient/request-appointment`, {
                patientId: patientId,
                notes: notes
            });
            alert("Your appointment request has been sent to support@allvihealth.com!");
            setIsModalOpen(false);
            setNotes('');
        } catch (error) {
            alert("Failed to send request. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const getDynamicBiomarkers = () => {
        if (!data.labs || data.labs.length === 0) return [];
        const keys = new Set();
        data.labs.forEach(report => {
            Object.keys(report).forEach(key => {
                if (!['id', 'test_date', 'report_type', 'created_at', 'patient_id', 'meta'].includes(key)) {
                    keys.add(key);
                }
            });
        });
        return Array.from(keys);
    };

    const handleDownload = () => {
        const originalTitle = document.title;
        document.title = `Allvi health_${patientId}`;
        window.print();
        document.title = originalTitle;
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true, skipEmptyLines: true,
            complete: async (results) => {
                try {
                    await axios.post(`${baseURL}/api/patient/import-symptoms`, {
                        patientId: patientId, symptoms: results.data
                    });
                    alert("Tally data imported successfully!");
                    fetchDashboardData();
                } catch (err) { console.error("Import failed", err); }
            }
        });
    };

    const ChartCard = ({ title, dataKey, color, data }) => {
        const latestEntry = [...data].reverse().find(entry => entry[dataKey] !== undefined);
        const meta = latestEntry?.meta?.[dataKey] || {};
        const currentValue = latestEntry?.[dataKey] || '—';

        return (
            <div className="bg-white p-6 rounded-xl border border-black/10 print:border-black print:border-[0.5pt] w-full mb-8 shadow-sm flex flex-col" style={{ breakInside: 'avoid' }}>
                <div className="flex items-center justify-between mb-8 gap-2">
                    <div className="flex items-center gap-2 flex-1">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                        <h3 className="text-[#1F2937] text-[11px] font-black uppercase tracking-widest leading-tight truncate">
                            {meta.key || title.replace(/_/g, ' ')}
                        </h3>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 px-2 border-x border-slate-100">
                        <p className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-tighter">{meta.unit || 'Unit'}</p>
                        <p className="text-[8px] text-[#1F2937]/40 font-bold uppercase tracking-tighter whitespace-nowrap">Ref: {meta.ref_range || 'N/A'}</p>
                    </div>
                    <div className="text-right flex-1">
                        <p className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-tighter">Value: {currentValue}</p>
                    </div>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                    {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="test_date" 
                                    tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} 
                                    axisLine={{ stroke: '#f1f5f9' }}
                                    tickLine={true}
                                    label={{ value: 'Timeline', position: 'insideBottomRight', offset: -15, fontSize: 8, fontWeight: 900, fill: '#cbd5e1', textAnchor: 'end' }}
                                />
                                <YAxis 
                                    tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} 
                                    axisLine={true}
                                    tickLine={true}
                                    domain={['auto', 'auto']}
                                    label={{ 
                                        value: meta.unit || 'Value', 
                                        angle: -90, 
                                        position: 'insideLeft', 
                                        style: { textAnchor: 'middle', fontSize: 8, fontWeight: 900, fill: '#cbd5e1', textTransform: 'uppercase' } 
                                    }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1F2937', color: '#fff', fontSize: '10px' }}
                                    itemStyle={{ color: '#F7F1E8' }}
                                    formatter={(value) => [`${value} ${meta.unit || ''}`, meta.label || title]}
                                />
                                <Line connectNulls type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }} isAnimationActive={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F1E8]">
            <Loader2 className="animate-spin text-[#0F4C5C]" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F1E8] p-4 md:p-8">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { background-color: #F7F1E8 !important; -webkit-print-color-adjust: exact; margin: 0 !important; }
                    .no-print { display: none !important; }
                    .print-only { display: flex !important; }
                    #dashboard-content { 
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 210mm !important;
                        padding: 15mm !important;
                        margin: 0 !important;
                        display: block !important;
                    }
                    .grid { display: block !important; }
                    .recharts-responsive-container { width: 100% !important; height: 300px !important; }
                }
            `}} />

            <div className="max-w-6xl mx-auto">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <Activity className="text-[#0F4C5C]" size={36} />
                        <div>
                            <h1 className="text-3xl font-black text-[#1F2937] tracking-tighter uppercase">ALLVI Dashboard</h1>
                            <div className="flex gap-4 text-[11px] font-bold text-[#0F4C5C] uppercase tracking-tight">
                                <span className="flex items-center gap-1"><UserCheck size={14} /> ID: {patientId}</span>
                                <span>AGE: {demographics.age}</span>
                                <span>GENDER: {demographics.gender}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <label className="bg-[#0F4C5C] text-[#F7F1E8] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md">
                            <FileUp size={18} /> Import additional data
                            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                        </label>
                        <button onClick={handleDownload} className="bg-[#1F2937] text-[#F7F1E8] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md">
                            <Printer size={18} /> Download Report
                        </button>
                    </div>
                </div>

                <div ref={dashboardRef} id="dashboard-content" className="space-y-8 bg-[#F7F1E8]">
                    {/* Print Header */}
                    <div className="hidden print-only flex-row justify-between items-center border-b-[1.5pt] border-black pb-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Shield className="text-[#0F4C5C]" size={40} />
                            <div>
                                <h1 className="text-2xl font-black text-[#1F2937]">ALLVI HEALTH</h1>
                                <p className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-widest">Clinical Analysis Report</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg font-black text-[#1F2937] uppercase">BIO-ANALYSIS SUMMARY</h2>
                            <div className="text-[10px] font-bold text-[#1F2937]/50 uppercase mt-1">
                                <span>Patient: {patientId}</span> | <span>Age: {demographics.age}</span> | <span>{demographics.gender}</span>
                            </div>
                            <div className="text-[9px] font-bold text-[#1F2937]/30 uppercase">Date: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Labs Section */}
                    <section className="print-full-width">
                        <h2 className="text-[11px] font-black text-[#1F2937]/40 uppercase tracking-widest mb-4">Biomarker Trends & Lab Ranges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:block">
                            {getDynamicBiomarkers().map(markerKey => (
                                <ChartCard key={markerKey} title={markerKey} dataKey={markerKey} color="#0F4C5C" data={data.labs} />
                            ))}
                        </div>
                    </section>

                    {/* Symptoms Section */}
                     <section className="print-full-width" style={{ breakInside: 'avoid' }}>
                        <h2 className="text-[11px] font-black text-[#1F2937]/40 uppercase tracking-widest mb-4">Symptom Correlation Trends</h2>
                        <div className="bg-white p-6 rounded-xl border border-black/10 print:border-black print:border-[0.5pt]">
                            <div style={{ width: '100%', height: 320 }}>
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.symptoms}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} />
                                            <YAxis domain={[0, 10]} tick={{fontSize: 10}} axisLine={false} />
                                            <Legend verticalAlign="top" height={40} iconType="circle" />
                                            <Line name="Energy" type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={3} isAnimationActive={false} />
                                            <Line name="Sleep" type="monotone" dataKey="sleep" stroke="#0F4C5C" strokeWidth={3} isAnimationActive={false} />
                                            <Line name="Mood" type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} isAnimationActive={false} />
                                            <Line name="Stress" type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} isAnimationActive={false} />
                                            <Line name="Joint Pain" type="monotone" dataKey="joint_pain" stroke="#8b5cf6" strokeWidth={3} isAnimationActive={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="print-full-width">
                        <AIInsights patientId={patientId} />
                    </section>

                    {/* REQUEST APPOINTMENT SECTION */}
                    <section className="no-print pt-8 pb-12">
                        <div className="bg-[#0F4C5C] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-[#0F4C5C]/20 border border-white/10">
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                
                                className="bg-[#F7F1E8] text-[#0F4C5C] px-8 mb-4 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                            >
                                <Calendar size={18} /> Request an Appointment
                            </button>
                             <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#F7F1E8] text-[#0F4C5C] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                            >
                                <Calendar size={18} /> Ask us anything
                            </button>
                        </div>
                        
                    </section>
                </div>
            </div>
            

            {/* MODAL OVERLAY */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 no-print">
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                        <div className="bg-[#0F4C5C] p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calendar size={20} />
                                <h3 className="font-black uppercase tracking-widest text-sm">Appointment Request</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                Share your notes or questions
                            </label>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="E.g., I'm concerned about my thyroid levels or energy drops..."
                                className="w-full h-32 p-4 bg-[#F7F1E8]/50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0F4C5C] transition-all text-sm font-medium resize-none text-[#1F2937]"
                            />
                            <button 
                                onClick={handleAppointmentSubmit}
                                disabled={sending}
                                className="w-full mt-6 bg-[#1F2937] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#0F4C5C] transition-all disabled:opacity-50"
                            >
                                {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                {sending ? "Sending Request..." : "Submit Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;