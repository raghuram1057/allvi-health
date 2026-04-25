import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  useEffect(() => {
    // Tally embed script logic
    const scriptSrc = "https://tally.so/widgets/embed.js";
    
    const loadTally = () => {
      if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
      } else {
        document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((e) => {
          e.src = e.dataset.tallySrc;
        });
      }
    };

    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.onload = loadTally;
      script.onerror = loadTally;
      document.body.appendChild(script);
    } else {
      loadTally();
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Top Navigation / Header */}
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
        <div style={styles.badge}>
          <ShieldCheck size={16} color="#0F4C5C" />
          <span style={{ color: '#0F4C5C', fontWeight: '600' }}>Secure Clinical Intake</span>
        </div>
      </div>

      <div style={styles.formWrapper}>
        <div style={styles.welcomeText}>
          <h1 style={styles.title}>AlliaMD Thyroid 360</h1>
          <p style={styles.subtitle}>
            Please complete this clinical intake form. Your answers help our AI 
            provide context to your lab results.
          </p>
        </div>

        {/* The Tally Iframe you provided */}
        <div style={styles.iframeContainer}>
          <iframe 
            data-tally-src="https://tally.so/embed/zxYlVZ?alignLeft=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1" 
            loading="lazy" 
            width="100%" 
            height="1145" 
            frameBorder="0" 
            marginHeight="0" 
            marginWidth="0" 
            title="AlliaMD Thyroid 360 — Intake Form"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      </div>

      <footer style={styles.footer}>
        © 2026 Allvi Health. All medical data is encrypted and private.
      </footer>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#F7F1E8', // Matches your Navbar background
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: 'sans-serif',
  },
  header: {
    maxWidth: '800px',
    margin: '0 auto 30px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#0F4C5C',
    fontSize: '14px',
    fontWeight: '600',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  formWrapper: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(15, 76, 92, 0.1)',
    padding: '40px 0',
  },
  welcomeText: {
    textAlign: 'center',
    padding: '0 40px 30px 40px',
    borderBottom: '1px solid #eee',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    color: '#0F4C5C',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.5',
    maxWidth: '500px',
    margin: '0 auto',
  },
  iframeContainer: {
    width: '100%',
    minHeight: '600px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '12px',
    color: '#94a3b8',
  }
};

export default RegisterPage;