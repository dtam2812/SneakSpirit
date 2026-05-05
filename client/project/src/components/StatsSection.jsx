import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
    value: 500,
    suffix: "+",
    label: "Mẫu Giày",
    sublabel: "Trong kho",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
    value: 12,
    suffix: "K+",
    label: "Khách Hàng",
    sublabel: "Hài lòng",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    ),
    value: 98,
    suffix: "%",
    label: "Đánh Giá Tích Cực",
    sublabel: "Từ khách hàng",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    value: 30,
    suffix: "K+",
    label: "Đơn Giao Thành Công",
    sublabel: "Toàn quốc",
  },
];

function useCountUp(target, duration = 1800, started) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

const StatCard = ({ icon, value, suffix, label, sublabel, delay, started }) => {
  const count = useCountUp(value, 1800, started);

  return (
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      {/* Glow accent */}
      <div className="stat-glow" />

      {/* Icon */}
      <div className="stat-icon">{icon}</div>

      {/* Number */}
      <div className="stat-number">
        {count}
        {suffix}
      </div>

      {/* Label */}
      <div className="stat-label">{label}</div>
      <div className="stat-sublabel">{sublabel}</div>
    </div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

        .stats-section {
          position: relative;
          padding: 80px 24px;
          background: linear-gradient(135deg, #0a0a12 0%, #0f0a1e 40%, #0a1020 100%);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Ambient background blobs */
        .stats-section::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(120,60,220,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .stats-section::after {
          content: '';
          position: absolute;
          bottom: -60px; right: -60px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(60,100,220,0.14) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Section header */
        .stats-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .stats-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: #a78bfa;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .stats-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
          margin: 0;
        }
        .stats-title span {
          background: linear-gradient(90deg, #a78bfa, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Card */
        .stat-card {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(167,139,250,0.15);
          border-radius: 20px;
          padding: 36px 24px 32px;
          text-align: center;
          backdrop-filter: blur(10px);
          overflow: hidden;
          cursor: default;
          opacity: 0;
          transform: translateY(30px);
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
          border-color: rgba(167,139,250,0.5);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(124,58,237,0.2);
        }

        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Inner glow on hover */
        .stat-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.12) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .stat-card:hover .stat-glow { opacity: 1; }

        /* Icon */
        .stat-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px; height: 56px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.25);
          border-radius: 14px;
          color: #a78bfa;
          margin-bottom: 20px;
        }

        /* Number */
        .stat-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.8rem, 5vw, 3.8rem);
          color: #fff;
          letter-spacing: 0.02em;
          line-height: 1;
          margin-bottom: 8px;
        }

        /* Labels */
        .stat-label {
          font-size: 15px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 4px;
        }
        .stat-sublabel {
          font-size: 12px;
          color: #64748b;
          letter-spacing: 0.05em;
        }

        /* Divider line bottom of card */
        .stat-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
          border-radius: 2px;
        }
      `}</style>

      <section className="stats-section" ref={ref}>
        <div className="stats-header">
          <span className="stats-eyebrow">Con số biết nói</span>
          <h2 className="stats-title">
            Tại Sao Chọn <span>Chúng Tôi</span>
          </h2>
        </div>
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <StatCard key={i} {...stat} delay={i * 120} started={started} />
          ))}
        </div>
      </section>
    </>
  );
};

export default StatsSection;
