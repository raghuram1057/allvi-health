import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { Activity, Upload, Download, Calendar } from 'lucide-react';
import AIInsights from './AIInsights'; // Phase 3 AI Panel

const Dashboard = ({ patientId }) => {
    const [data, setData] = useState({ labs: [], symptoms: [] });
    const [isMounted, setIsMounted] = useState(false);
    const dashboardRef = useRef();

    const baseURL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://allvibackend.onrender.com';

    useEffect(() => {
        setIsMounted(true);
        fetchDashboardData();
    }, [patientId]);

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/patient/dashboard/${patientId}`);
            if (res.data.success) setData(res.data);
        } catch (err) {
            console.error("Fetch error", err);
        }
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    await axios.post(`${baseURL}/api/patient/import-symptoms`, {
                        patientId: patientId,
                        symptoms: results.data
                    });
                    alert("Symptom data imported!");
                    fetchDashboardData();
                } catch (err) {
                    console.error("Import failed", err);
                }
            }
        });
    };

    const downloadPDF = async () => {
        const element = dashboardRef.current;
        const canvas = await html2canvas(element, { backgroundColor: "#f8fafc", scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Health_Summary_${patientId}.pdf`);
    };

    const ChartCard = ({ title, dataKey, color, data }) => (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
            <div style={{ width: '100%', height: 220 }}>
                {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#cbd5e1" />
                            <XAxis dataKey="test_date" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                            <Line 
                                connectNulls 
                                type="monotone" 
                                dataKey={dataKey} 
                                stroke={color} 
                                strokeWidth={3} 
                                dot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Header Area */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Health Dashboard</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: '5px 0 0 0' }}>Patient: {patientId}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                            Upload CSV
                            <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
                        </label>
                        <button onClick={downloadPDF} style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', border: 'none' }}>
                            PDF Export
                        </button>
                    </div>
                </div>

                {/* Dashboard Viewport for PDF capture */}
                <div ref={dashboardRef}>
                    
                    {/* PHASE 3: AI INSIGHTS PANEL */}
                    <AIInsights patientId={patientId} />

                    <h2 style={{ fontSize: '18px', color: '#475569', marginBottom: '15px', fontWeight: '700' }}>Biomarker History</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <ChartCard title="TSH" dataKey="tsh" color="#2563eb" data={data.labs} />
                        <ChartCard title="Free T3" dataKey="free_t3" color="#8b5cf6" data={data.labs} />
                        <ChartCard title="Free T4" dataKey="free_t4" color="#ec4899" data={data.labs} />
                        <ChartCard title="Vitamin D" dataKey="vit_d" color="#f59e0b" data={data.labs} />
                        <ChartCard title="Ferritin" dataKey="ferritin" color="#10b981" data={data.labs} />
                        <ChartCard title="Anti-TPO" dataKey="anti_tpo" color="#ef4444" data={data.labs} />
                    </div>

                    <h2 style={{ fontSize: '18px', color: '#475569', marginBottom: '15px', fontWeight: '700' }}>Daily Symptom Tracking</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '100%', height: 300 }}>
                            {isMounted && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.symptoms}>
                                        <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#cbd5e1" />
                                        <XAxis dataKey="date" tick={{fontSize: 11}} axisLine={false} />
                                        <YAxis domain={[0, 10]} tick={{fontSize: 11}} axisLine={false} />
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={40} />
                                        <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                                        <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                                        <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                                        <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                                        <Line type="monotone" dataKey="joint_pain" stroke="#64748b" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;