const Loading = () => (
  <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      @keyframes strobe {
        0%, 100% { opacity: 1; transform: scaleX(1); }
        50% { opacity: 0.15; transform: scaleX(0.6); }
      }
      @keyframes slide-bar {
        0% { width: 0%; }
        100% { width: 100%; }
      }
      .loading-letter {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 4rem;
        letter-spacing: 0.25em;
        color: #111;
        animation: strobe 1.2s ease-in-out infinite;
      }
      .loading-letter span {
        display: inline-block;
      }
      .loading-letter span:nth-child(1) { animation-delay: 0s; }
      .loading-letter span:nth-child(2) { animation-delay: 0.1s; }
      .loading-letter span:nth-child(3) { animation-delay: 0.2s; }
      .loading-letter span:nth-child(4) { animation-delay: 0.3s; }
      .loading-letter span:nth-child(5) { animation-delay: 0.4s; }
      .loading-letter span:nth-child(6) { animation-delay: 0.5s; }
      .loading-letter span:nth-child(7) { animation-delay: 0.6s; }
      .progress-bar {
        animation: slide-bar 1.8s cubic-bezier(0.4,0,0.2,1) infinite;
      }
    `}</style>

    <div className="loading-letter">
      {"LOADING".split("").map((l, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          {l}
        </span>
      ))}
    </div>

    <div className="w-48 h-px bg-gray-200 overflow-hidden">
      <div className="progress-bar h-full bg-gray-900" />
    </div>
  </div>
);

export default Loading;
