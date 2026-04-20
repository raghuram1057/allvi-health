import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, User, Activity } from 'lucide-react';

const AIInsights = ({ patientId, insights = {}, loading = false }) => {
    // Skeleton Loader Component
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex items-center justify-between px-2">
                    <div className="h-3 w-32 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 h-48 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                                <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-50 rounded"></div>
                                <div className="h-2 w-5/6 bg-slate-50 rounded"></div>
                                <div className="h-2 w-4/6 bg-slate-50 rounded"></div>
                            </div>
                            <div className="mt-auto flex items-center justify-center">
                                <Activity className="text-slate-200 animate-spin" size={16} />
                                <span className="ml-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">AI Analyzing...</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const categories = [
        {
            title: "Optimal / Stable",
            color: "bg-emerald-50 text-emerald-900 border-emerald-200",
            icon: <ShieldCheck className="text-emerald-600" size={24} />,
            borderColor: "border-emerald-500",
            points: insights.optimal || ["TSH levels remain stable within the reference range.", "Vitamin D levels showing consistent upward progression."]
        },
        {
            title: "Monitor / Borderline",
            color: "bg-amber-50 text-amber-900 border-amber-200",
            icon: <AlertTriangle className="text-amber-600" size={24} />,
            borderColor: "border-amber-500",
            points: insights.monitor || ["Ferritin stores are at the lower end of optimal; monitor intake.", "Slight correlation detected between late sleep and elevated stress markers."]
        },
        {
            title: "Requires Attention",
            color: "bg-rose-50 text-rose-900 border-rose-200",
            icon: <AlertCircle className="text-rose-600" size={24} />,
            borderColor: "border-rose-500",
            points: insights.critical || ["Joint pain reports have increased by 20% this week.", "Anti-TPO levels suggest the need for a follow-up consultation."]
        }
    ];

    return (
        <div className="space-y-6 ai-insights-container">
            <div className="flex items-center justify-between px-2 no-print">
                <h2 className="text-xs font-black text-[#1F2937]/40 uppercase tracking-[0.25em]">Allvi AI Health Insights</h2>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 px-3 py-1 rounded-full">
                    <User size={12} /> ID: {patientId}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat, index) => (
                    <div 
                        key={index} 
                        className={`${cat.color} p-5 rounded-2xl border print:border-[0.5pt] print:shadow-none print:bg-white shadow-sm flex flex-col h-full`}
                        style={{ breakInside: 'avoid' }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {cat.icon}
                            <h3 className="font-black text-sm uppercase tracking-tight">{cat.title}</h3>
                        </div>
                        <ul className="space-y-3 flex-grow">
                            {cat.points.map((point, pIndex) => (
                                <li key={pIndex} className="text-xs font-medium leading-relaxed flex gap-2">
                                    <span className="opacity-40 mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsights;