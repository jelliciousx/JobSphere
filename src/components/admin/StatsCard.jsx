const StatsCard = ({ title, value, trend, trendUp, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p
        className={`text-xs mt-2 flex items-center gap-1 ${trendUp ? "text-green-500" : "text-red-500"}`}
      >
        <span>{trendUp ? "↗" : "↘"}</span>
        {trend}
      </p>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

export default StatsCard;
