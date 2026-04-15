import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = ({ patientId }) => {
    const [data, setData] = useState({ labs: [], symptoms: [] });
    const [isMounted, setIsMounted] = useState(false);
    const dashboardRef = useRef();

    useEffect(() => {
        setIsMounted(true);
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/patient/dashboard/${patientId}`);
                if (res.data.success) setData(res.data);
            } catch (err) {
                console.error("Fetch error", err);
            }
        };
        fetchData();
    }, [patientId]);

    const downloadPDF = async () => {
        const element = dashboardRef.current;
        const canvas = await html2canvas(element, { backgroundColor: "#f8fafc", scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Full_Health_Report_${patientId}.pdf`);
    };

    // Reusable Chart Component to keep code clean
    const ChartCard = ({ title, dataKey, color, data }) => (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minHeight: '350px' }}>
            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>{title}</h3>
            <div style={{ width: '100%', height: 250 }}>
                {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="test_date" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }} ref={dashboardRef}>
            {/* Header Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
                <div>
                    <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Health Insights</h1>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Patient ID: {patientId}</p>
                </div>
                <button onClick={downloadPDF} style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Download Full PDF
                </button>
            </div>

            {/* RESPONSIVE GRID SYSTEM */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '20px',
                marginBottom: '40px' 
            }}>
                <ChartCard title="TSH Levels (Thyroid)" dataKey="tsh" color="#2563eb" data={data.labs} />
                <ChartCard title="Free T3" dataKey="free_t3" color="#7c3aed" data={data.labs} />
                <ChartCard title="Free T4" dataKey="free_t4" color="#db2777" data={data.labs} />
                <ChartCard title="Vitamin D" dataKey="vit_d" color="#ea580c" data={data.labs} />
                <ChartCard title="Ferritin (Iron)" dataKey="ferritin" color="#059669" data={data.labs} />
                
                {/* Symptom Chart spans 1 or 2 columns based on space */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Daily Symptom Trends</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        {isMounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.symptoms}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} />
                                    <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} />
                                    <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;