export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Cinzel:wght@400&display=swap');

        .wf-footer {
          position: relative;
          width: 100%;
          background: linear-gradient(to bottom, #f2e8d5, #ede0c8);
          border-top: 1px solid rgba(154,123,58,0.2);
          padding: 36px 24px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          overflow: hidden;
          font-family: 'Cinzel', serif;
        }

        /* Subtle grain */
        .wf-footer::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px;
          pointer-events: none;
        }

        /* Divider row with center ornament */
        .wf-footer-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 320px;
        }
        .wf-footer-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.45));
        }
        .wf-footer-line:last-child {
          background: linear-gradient(90deg, rgba(154,123,58,0.45), transparent);
        }
        .wf-footer-gem {
          width: 6px;
          height: 6px;
          background: #c6a769;
          transform: rotate(45deg);
          flex-shrink: 0;
          box-shadow: 0 0 5px rgba(198,167,105,0.5);
        }

        /* Names */
        .wf-footer-names {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.45rem;
          color: #3a2a0e;
          letter-spacing: 0.06em;
        }
        .wf-footer-amp {
          color: #9a7b3a;
          margin: 0 6px;
        }

        /* Date line */
        .wf-footer-date {
          font-size: 0.52rem;
          letter-spacing: 0.28em;
          color: #7a5c1e;
          text-transform: uppercase;
        }

        /* Copyright */
        .wf-footer-copy {
          font-size: 0.46rem;
          letter-spacing: 0.2em;
          color: rgba(90,62,20,0.5);
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Corner dots */
        .wf-corner-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(154,123,58,0.3);
        }
      `}</style>

      <footer className="wf-footer">
        {/* Corner dots */}
        <span className="wf-corner-dot" style={{ top: 14, left: 20 }} />
        <span className="wf-corner-dot" style={{ top: 14, right: 20 }} />

        {/* Divider */}
        <div className="wf-footer-divider">
          <div className="wf-footer-line" />
          <div className="wf-footer-gem" />
          <div className="wf-footer-line" />
        </div>

        {/* Names */}
        <p className="wf-footer-names">
          Thiloka <span className="wf-footer-amp">&amp;</span> Devin
        </p>

        {/* Copyright */}
        <p className="wf-footer-copy">
          Made with ♥ · All rights reserved
        </p>
      </footer>
    </>
  );
}