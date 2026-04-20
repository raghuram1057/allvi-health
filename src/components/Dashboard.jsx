import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import Papa from 'papaparse';
import { Activity, Printer, FileUp, Shield, Clock, UserCheck } from 'lucide-react';
import AIInsights from './AIInsights';

const Dashboard = ({ patientId }) => {
    // 1. Initialize data and demographics state
    const [data, setData] = useState({ labs: [], symptoms: [] });
    const [demographics, setDemographics] = useState({ age: '—', gender: '—' });
    const [isMounted, setIsMounted] = useState(false);
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
            const res = await axios.get(`${baseURL}/api/patient/dashboard/${patientId}`);
            
            if (res.data.success) {
                // Update the lab results and symptoms
                setData(res.data);
                
                // 2. Update age and gender from the backend response
                setDemographics({
                    age: res.data.age,
                    gender: res.data.gender
                });
            }
        } catch (err) {
            console.error("Fetch error", err);
        }
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
        const latestEntry = data && data.length > 0 ? data[data.length - 1] : {};

        return (
            <div className="bg-white p-6 rounded-xl border border-black/10 print:border-black print:border-[0.5pt] w-full mb-8 shadow-sm" style={{ breakInside: 'avoid' }}>
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                        <h3 className="text-[#1F2937] text-[12px] font-black uppercase tracking-widest">{title}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-[#0F4C5C] uppercase">{latestEntry.unit || 'Unit'}</p>
                        <p className="text-[8px] text-[#1F2937]/50 font-bold uppercase tracking-tighter">
                            Ref: {latestEntry.ref_range || 'N/A'}
                        </p>
                    </div>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                    {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 35, left: -5, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="test_date" tick={{fontSize: 10, fill: '#1F2937'}} axisLine={false} />
                                <YAxis tick={{fontSize: 10, fill: '#1F2937'}} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#F7F1E8', fontSize: '10px' }} />
                                <Line connectNulls type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 4, fill: color }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        );
    };

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
                        background-color: #F7F1E8 !important;
                    }
                    .grid { display: block !important; }
                    section, .print-full-width { width: 100% !important; }
                    .recharts-responsive-container { width: 100% !important; height: 300px !important; }
                    .border-black\\/10 { border: 0.5pt solid black !important; }
                }
            `}} />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <Activity className="text-[#0F4C5C]" size={36} />
                        <div>
                            <h1 className="text-3xl font-black text-[#1F2937] tracking-tighter uppercase">ALLVI Dashboard</h1>
                            <div className="flex gap-4 text-[11px] font-bold text-[#0F4C5C] uppercase tracking-tight">
                                <span className="flex items-center gap-1"><UserCheck size={14}/> ID: {patientId}</span>
                                {/* 3. Display demographics from internal state */}
                                <span>AGE: {demographics.age || '—'}</span>
                                <span>GENDER: {demographics.gender || '—'}</span>
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
                                {/* 4. Print Header uses internal state */}
                                <span>Patient: {patientId}</span> | <span>Age: {demographics.age}</span> | <span>{demographics.gender}</span>
                            </div>
                            <div className="text-[9px] font-bold text-[#1F2937]/30 uppercase">Date: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <section className="print-full-width">
                        <h2 className="text-[11px] font-black text-[#1F2937]/40 uppercase tracking-widest mb-4">Biomarker Trends & Lab Ranges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:block">
                            <ChartCard title="TSH" dataKey="tsh" color="#0F4C5C" data={data.labs} />
                            <ChartCard title="Free T3" dataKey="free_t3" color="#0F4C5C" data={data.labs} />
                            <ChartCard title="Free T4" dataKey="free_t4" color="#0F4C5C" data={data.labs} />
                            <ChartCard title="Vitamin D" dataKey="vit_d" color="#0F4C5C" data={data.labs} />
                            <ChartCard title="Ferritin" dataKey="ferritin" color="#0F4C5C" data={data.labs} />
                            <ChartCard title="Anti-TPO" dataKey="anti_tpo" color="#0F4C5C" data={data.labs} />
                        </div>
                    </section>

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
                </div>
            </div>
        </div>
    );
};

export default Dashboard;