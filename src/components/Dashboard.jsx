import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Legend
} from 'recharts';
import axios from 'axios';
import Papa from 'papaparse';
import { Activity, FileUp, Download } from 'lucide-react';
import AIInsights from './AIInsights';

const TEAL    = '#0F4C5C';
const IVORY   = '#F7F1E8';
const CHARCOAL = '#1F2937';

const Dashboard = ({ patientId }) => {
  const [data, setData] = useState({ labs: [], symptoms: [] });
  const [isMounted, setIsMounted] = useState(false);

  const baseURL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:5000'
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
      console.error('Fetch error', err);
    }
  };

  const handleDownload = () => {
    const orig = document.title;
    document.title = `Allvi_Health_Report_${patientId}_${new Date().toISOString().slice(0, 10)}`;
    window.print();
    document.title = orig;
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
            patientId,
            symptoms: results.data,
          });
          alert('Symptom data imported!');
          fetchDashboardData();
        } catch (err) {
          console.error('Import failed', err);
        }
      },
    });
  };

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  /* ── Biomarker chart (shared for screen + print) ── */
  const BioChart = ({ title, dataKey, color }) => (
    <div className="chart-card">
      <div className="chart-label">
        <span className="dot" style={{ background: color }} />
        {title}
      </div>
      <div className="chart-wrap">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.labs} margin={{ top: 4, right: 10, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2ebe8" />
              <XAxis dataKey="test_date" tick={{ fontSize: 9, fill: CHARCOAL }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: CHARCOAL }} axisLine={false} tickLine={false} />
              <Line connectNulls type="monotone" dataKey={dataKey} stroke={color}
                strokeWidth={2} dot={{ r: 3, fill: color }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

  /* ── Symptom chart (shared for screen + print) ── */
  const SymptomChart = () => (
    <div className="symptom-card">
      <div className="symptom-wrap">
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.symptoms} margin={{ top: 4, right: 10, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2ebe8" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: CHARCOAL }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: CHARCOAL }} axisLine={false} tickLine={false} />
              <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              <Line name="Energy"     type="monotone" dataKey="energy"     stroke="#f59e0b" strokeWidth={2} isAnimationActive={false} dot={false} />
              <Line name="Sleep"      type="monotone" dataKey="sleep"      stroke={TEAL}    strokeWidth={2} isAnimationActive={false} dot={false} />
              <Line name="Mood"       type="monotone" dataKey="mood"       stroke="#10b981" strokeWidth={2} isAnimationActive={false} dot={false} />
              <Line name="Stress"     type="monotone" dataKey="stress"     stroke="#ef4444" strokeWidth={2} isAnimationActive={false} dot={false} />
              <Line name="Joint Pain" type="monotone" dataKey="joint_pain" stroke="#8b5cf6" strokeWidth={2} isAnimationActive={false} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─── STYLES ──────────────────────────────────────────────────────────── */}
      <style>{`
        /* ════════════ SCREEN STYLES ════════════ */
        .allvi-root {
          min-height: 100vh;
          background: ${IVORY};
          padding: 32px 28px;
          font-family: 'Georgia', 'Times New Roman', serif;
          color: ${CHARCOAL};
        }
        .allvi-inner { max-width: 1100px; margin: 0 auto; }

        /* Top bar — screen only */
        @media screen {
          .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 36px;
          }
        }
        .brand-row { display: flex; align-items: center; gap: 12px; }
        .brand-title {
          font-size: 24px; font-weight: 900;
          letter-spacing: -0.5px; color: ${CHARCOAL};
          text-transform: uppercase;
        }
        .btn-group { display: flex; gap: 10px; }
        .btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 11px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; border: none; font-family: inherit;
          transition: opacity .15s;
        }
        .btn:hover { opacity: .83; }
        .btn-teal  { background: ${TEAL};     color: ${IVORY}; }
        .btn-dark  { background: ${CHARCOAL}; color: ${IVORY}; }
        .btn-file-label {
          display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
        }

        /* Section heading */
        .sec-head {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 14px;
        }
        .sec-head-icon { font-size: 11px; color: ${TEAL}; font-weight: 900; }
        .sec-head-text {
          font-size: 9px; font-weight: 900; letter-spacing: 3px;
          text-transform: uppercase; color: ${CHARCOAL}; opacity: .45;
          white-space: nowrap;
        }
        .sec-head-line { flex: 1; height: 1px; background: ${TEAL}; opacity: .2; }

        /* Biomarker grid — 3 col screen */
        .chart-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .chart-card {
          background: #fff;
          border: 1px solid rgba(15,76,92,.18);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .chart-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 9px; font-weight: 900; letter-spacing: 1.8px;
          text-transform: uppercase; color: ${CHARCOAL};
          margin-bottom: 10px;
        }
        .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .chart-wrap  { width: 100%; height: 175px; }

        /* Symptom card */
        .symptom-card {
          background: #fff;
          border: 1px solid rgba(15,76,92,.18);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 28px;
        }
        .symptom-wrap { width: 100%; height: 255px; }

        /* AI Insights wrapper */
        .insights-card {
          background: #fff;
          border: 1px solid rgba(15,76,92,.18);
          border-radius: 10px;
          padding: 16px 20px;
          margin-bottom: 24px;
        }
        .insights-card > *:first-child {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }

        /* PDF-only elements hidden on screen */
        .pdf-header     { display: none; }
        .pdf-accent-bar { display: none; }
        .pdf-footer     { display: none; }
        .pdf-confidential-badge { display: none; }

        /* ════════════ PRINT / PDF STYLES ════════════ */
        @media print {

          @page {
            size: A4 portrait;
            margin: 13mm 13mm 11mm 13mm;
          }

          /* Force brand colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            background: ${IVORY} !important;
            margin: 0 !important;
          }

          /* Hide screen controls — zero out completely, no ghost space */
          .top-bar {
            display: none !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }

          /* Root reset — no space anywhere */
          .allvi-root {
            min-height: unset !important;
            padding: 0 !important;
            margin: 0 !important;
            background: ${IVORY} !important;
          }
          .allvi-inner {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Kill default browser margins on block elements */
          .allvi-inner h1,
          .allvi-inner h2,
          .allvi-inner h3,
          .allvi-inner p {
            margin-top: 0 !important;
          }

          /* ── PDF HEADER ── */
          .pdf-header {
            display: flex !important;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2pt solid ${TEAL};
            padding-bottom: 11px;
            margin-bottom: 12px;
          }
          .pdf-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .pdf-logo-box {
            width: 38px; height: 38px;
            border-radius: 7px;
            background: ${TEAL} !important;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .pdf-company-name {
            font-size: 16px; font-weight: 900;
            color: ${TEAL} !important;
            letter-spacing: -.3px; line-height: 1.1;
          }
          .pdf-tagline {
            font-size: 6.5px; font-weight: 700;
            color: ${CHARCOAL}; letter-spacing: 2.5px;
            text-transform: uppercase;
            opacity: .5; margin-top: 2px;
          }
          .pdf-header-right { text-align: right; }
          .pdf-report-title {
            font-size: 11.5px; font-weight: 900;
            color: ${CHARCOAL}; letter-spacing: .8px;
            text-transform: uppercase;
          }
          .pdf-meta { margin-top: 5px; }
          .pdf-meta-row {
            font-size: 7px; color: ${CHARCOAL};
            opacity: .62; letter-spacing: .4px; margin-top: 2px;
          }
          .pdf-meta-row b { font-weight: 800; opacity: 1; }

          /* ── ACCENT BAR ── */
          .pdf-accent-bar {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            background: ${TEAL} !important;
            border-radius: 5px;
            padding: 6px 12px;
            margin-bottom: 14px;
          }
          .pdf-accent-main {
            font-size: 7px; font-weight: 700;
            color: ${IVORY} !important;
            letter-spacing: 1.5px; text-transform: uppercase;
          }
          .pdf-accent-sub {
            font-size: 6.5px;
            color: ${IVORY} !important; opacity: .7;
          }

          /* ── SECTION HEADINGS ── */
          .sec-head { margin-bottom: 8px; }
          .sec-head-text { font-size: 7.5px; letter-spacing: 2.5px; }
          .sec-head-icon { font-size: 9px; }

          /* ── BIOMARKER GRID: 2-col in print ── */
          .chart-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 9px !important;
            margin-bottom: 14px !important;
          }
          .chart-card {
            border: 0.5pt solid ${TEAL} !important;
            border-radius: 6px !important;
            padding: 9px 11px !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .chart-wrap { height: 138px !important; }
          .chart-label { font-size: 7.5px !important; letter-spacing: 1.5px !important; margin-bottom: 6px !important; }

          /* ── SYMPTOM ── */
          .symptom-card {
            border: 0.5pt solid ${TEAL} !important;
            border-radius: 6px !important;
            padding: 9px 11px !important;
            margin-bottom: 14px !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .symptom-wrap { height: 195px !important; }

          /* ── AI INSIGHTS ── */
          .insights-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .insights-card {
            border: 0.5pt solid ${TEAL} !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            margin-bottom: 14px !important;
            margin-top: 0 !important;
            font-size: 9px !important;
            line-height: 1.6 !important;
            overflow: hidden !important;
          }
          /* Kill any top margin/padding inside AIInsights children */
          .insights-card > *:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .insights-card p,
          .insights-card div,
          .insights-card span {
            margin-top: 0 !important;
            font-size: 9px !important;
            line-height: 1.6 !important;
          }

          /* ── PDF FOOTER ── */
          .pdf-footer {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            border-top: 1pt solid ${TEAL};
            padding-top: 8px;
            margin-top: 14px;
          }
          .pdf-footer-copy {
            font-size: 6.5px;
            color: ${CHARCOAL}; opacity: .4;
          }
          .pdf-footer-badge {
            font-size: 6.5px; font-weight: 800;
            letter-spacing: 1.5px;
            color: ${IVORY} !important;
            background: ${TEAL} !important;
            padding: 2px 9px;
            border-radius: 20px;
          }
        }
      `}</style>

      {/* ─── MARKUP ──────────────────────────────────────────────────────────── */}
      <div className="allvi-root">
        <div className="allvi-inner">

          {/* PDF HEADER — hidden on screen */}
          <div className="pdf-header">
            <div className="pdf-header-left">
              <div className="pdf-logo-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="#F7F1E8"/>
                  <path d="M9 12l2 2 4-4" stroke="#F7F1E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="pdf-company-name">ALLVI HEALTH</div>
                <div className="pdf-tagline">AI Clinical Analysis Platform</div>
              </div>
            </div>
            <div className="pdf-header-right">
              <div className="pdf-report-title">Bio-Analysis Report</div>
              <div className="pdf-meta">
                <div className="pdf-meta-row"><b>PATIENT REF:</b>&nbsp;{patientId}</div>
                <div className="pdf-meta-row"><b>DATE GENERATED:</b>&nbsp;{today}</div>
                <div className="pdf-meta-row"><b>CLASSIFICATION:</b>&nbsp;Confidential – Medical Record</div>
              </div>
            </div>
          </div>

          {/* PDF ACCENT BAR — hidden on screen */}
          <div className="pdf-accent-bar">
            <span className="pdf-accent-main">Comprehensive Health &amp; Biomarker Analysis</span>
            <span className="pdf-accent-sub">For clinical review only — not a substitute for professional medical advice</span>
          </div>

          {/* SCREEN TOPBAR — hidden on print */}
          <div className="top-bar">
            <div className="brand-row">
              <Activity color={TEAL} size={28} />
              <span className="brand-title">ALLVI Dashboard</span>
            </div>
            <div className="btn-group">
              <button className="btn btn-teal" style={{ padding: 0 }}>
                <label className="btn-file-label" style={{ padding: '10px 20px' }}>
                  <FileUp size={15} /> Import Tally CSV
                  <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
                </label>
              </button>
              <button className="btn btn-dark" onClick={handleDownload}>
                <Download size={15} /> Download Report
              </button>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="insights-section">
            <div className="sec-head">
              <span className="sec-head-icon">✦</span>
              <span className="sec-head-text">AI Health Insights</span>
              <div className="sec-head-line" />
            </div>
            <div className="insights-card">
              <AIInsights patientId={patientId} />
            </div>
          </div>

          {/* BIOMARKER TRENDS */}
          <div className="sec-head">
            <span className="sec-head-icon">◈</span>
            <span className="sec-head-text">Biomarker Historical Trends</span>
            <div className="sec-head-line" />
          </div>
          <div className="chart-grid">
            <BioChart title="TSH — Thyroid Stimulating Hormone" dataKey="tsh"      color={TEAL}    />
            <BioChart title="Free T3 — Triiodothyronine"        dataKey="free_t3"  color="#1a6b7a" />
            <BioChart title="Free T4 — Thyroxine"               dataKey="free_t4"  color={TEAL}    />
            <BioChart title="Vitamin D — 25-Hydroxyvitamin D"   dataKey="vit_d"    color="#f59e0b" />
            <BioChart title="Ferritin — Iron Storage Protein"   dataKey="ferritin" color="#10b981" />
            <BioChart title="Anti-TPO — Thyroid Antibody"       dataKey="anti_tpo" color="#ef4444" />
          </div>

          {/* SYMPTOM TRACKING */}
          <div className="sec-head">
            <span className="sec-head-icon">◉</span>
            <span className="sec-head-text">Daily Symptom Tracking</span>
            <div className="sec-head-line" />
          </div>
          <SymptomChart />

          {/* PDF FOOTER — hidden on screen */}
          <div className="pdf-footer">
            <span className="pdf-footer-copy">
              © {new Date().getFullYear()} Allvi Health · AI Clinical Analysis Platform · Confidential Medical Document
            </span>
            <span className="pdf-footer-badge">ALLVI</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;