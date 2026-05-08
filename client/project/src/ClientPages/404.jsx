import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu-1 { animation: fade-up 0.5s ease forwards; }
        .fu-2 { animation: fade-up 0.5s ease forwards 0.15s; opacity: 0; }
        .fu-3 { animation: fade-up 0.5s ease forwards 0.3s;  opacity: 0; }
        .fu-4 { animation: fade-up 0.5s ease forwards 0.45s; opacity: 0; }
      `}</style>

      <div className="fu-1 text-[9rem] font-black leading-none text-gray-100 select-none tracking-tight">
        404
      </div>

      <div className="fu-2 -mt-4 mb-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 64 64"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M20 44c0-6.627 5.373-12 12-12s12 5.373 12 12M16 28c0-2 1-4 3-5m26 5c0-2-1-4-3-5M10 52h44M28 20l4-8 4 8"
          />
        </svg>
      </div>

      <h1 className="fu-3 text-2xl font-bold text-gray-900 mb-2">
        Không tìm thấy trang
      </h1>
      <p className="fu-3 text-gray-400 text-sm mb-8 max-w-xs">
        Trang bạn đang tìm không tồn tại hoặc đã bị xoá.
      </p>

      <div className="fu-4 flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-7 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Trang chủ
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-7 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default NotFound;
