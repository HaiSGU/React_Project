// src/components/DiscountCard/DiscountCard.jsx
import { useParams, Link } from 'react-router-dom';

const promotions = {
  freeship: {
    title: "Miễn Phí Vận Chuyển",
    desc: "Đơn từ 300.000đ",
    gradient: "from-emerald-500 to-teal-600",
    icon: "🚚",
    shadow: "shadow-emerald-500/40",
  },
  sale10: {
    title: "Giảm 10% Toàn Bộ",
    desc: "Hôm nay duy nhất!",
    gradient: "from-rose-500 to-pink-600",
    icon: "🎁",
    shadow: "shadow-rose-500/40",
  },
  flashsale: {
    title: "Flash Sale 50%",
    desc: "Chỉ còn 1 giờ!",
    gradient: "from-violet-500 to-purple-600",
    icon: "⚡",
    shadow: "shadow-violet-500/40",
  },
};

export default function DiscountCard({ text, type: forcedType }) {
  const { type: urlType } = useParams();
  const type = forcedType || urlType;

  const promo = promotions[type] || {
    title: text || "Khuyến Mãi",
    desc: "Chi tiết ưu đãi",
    gradient: "from-gray-500 to-gray-700",
    icon: "🎟️",
    shadow: "shadow-gray-500/40",
  };

  const isDetailPage = !!urlType;

  if (isDetailPage) {
    // TRANG CHI TIẾT: /discount/freeship
    return (
      <div className={`min-h-screen bg-gradient-to-br ${promo.gradient} flex items-center justify-center p-6`}>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center animate-float-in border border-white/30 overflow-hidden">
          {/* Hiệu ứng viền gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-20 from-white to-transparent pointer-events-none"></div>

          {/* Icon lớn */}
          <div className="text-8xl mb-6 animate-bounce">{promo.icon}</div>

          {/* Tiêu đề */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {promo.title}
          </h1>

          {/* Mô tả */}
          <p className="text-lg text-gray-700 mb-8">{promo.desc}</p>

          {/* Mã khuyến mãi */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-100">
            <p className="text-sm text-gray-600 font-medium mb-2">Mã khuyến mãi</p>
            <code className="text-3xl font-bold text-indigo-600 tracking-widest">
              {type.toUpperCase()}
            </code>
          </div>

          {/* Thời hạn */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
            </svg>
            <span>Hết hạn: 30/11/2025</span>
          </div>
        </div>
      </div>
    );
  }

  // TRANG CHỦ – THẺ NHỎ
  return (
    <Link
      to={`/discount/${type}`}
      className="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl p-5 text-white 
          bg-gradient-to-br ${promo.gradient} 
          shadow-lg ${promo.shadow} 
          transition-all duration-500 
          group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-white/30
        `}
      >
        {/* Hiệu ứng sáng khi hover */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

        {/* Nội dung */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">{text || promo.title}</h3>
            <p className="text-xs opacity-90">{promo.desc}</p>
          </div>
          <div className="text-3xl animate-pulse">{promo.icon}</div>
        </div>

        {/* Nút xem chi tiết */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
            Xem chi tiết
          </span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-2 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}