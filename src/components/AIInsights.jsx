import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, CheckCircle, AlertTriangle, Search, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // npm install react-markdown

const AIInsights = ({ patientId }) => {
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://allvibackend.onrender.com';
                const res = await axios.get(`${baseURL}/api/patient/insights/${patientId}`);
                if (res.data.success) setInsights(res.data.insights);
            } catch (err) {
                console.error("AI Insight Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [patientId]);

    if (loading) return (
        <div className="bg-white p-8 rounded-3xl border border-blue-100 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-slate-500 font-medium italic">Gemini AI is analyzing your trends...</p>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl border border-blue-100 shadow-sm mb-10">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">AI Health Insights</h2>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                <ReactMarkdown>{insights}</ReactMarkdown>
            </div>

            <div className="mt-6 p-4 bg-white/50 rounded-xl border border-blue-200 text-xs text-blue-800 italic">
                Note: This AI summary is for informational purposes. Always review these patterns with your doctor.
            </div>
        </div>
    );
};

export default AIInsights;