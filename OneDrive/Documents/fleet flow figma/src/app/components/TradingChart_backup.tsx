import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronDown, Info, TrendingUp, TrendingDown, MoreVertical, BarChart3, TrendingUp as LineIcon, Activity } from "lucide-react";

interface TradingChartProps {
  title: string;
  subtitle?: string;
  data: any[];
  dataKey: string;
  color: string;
  icon?: React.ReactNode;
  breakdown?: Array<{ label: string; value: string; percentage: string; change: string }>;
  stats?: { label: string; value: string; change: string; trend: "up" | "down" }[];
  height?: number;
}

export function TradingChart({
  title,
  subtitle,
  data,
  dataKey,
  color,
  icon,
  breakdown,
  stats,
  height = 350,
}: TradingChartProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [timeframe, setTimeframe] = useState("6M");
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
  const [showChartMenu, setShowChartMenu] = useState(false);

  const colorMap = {
    blue: { line: "#3b82f6", fill: "rgba(59, 130, 246, 0.1)", accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    green: { line: "#10b981", fill: "rgba(16, 185, 129, 0.1)", accent: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    purple: { line: "#a855f7", fill: "rgba(168, 85, 247, 0.1)", accent: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    orange: { line: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)", accent: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  }[color];

  // Generate realistic data based on timeframe
  const filteredData = useMemo(() => {
    const baseData = [...data];
    const latestValue = baseData[baseData.length - 1]?.[dataKey] || 0;
    
    switch (timeframe) {
      case "1D":
        // Generate hourly data for 1 day
        return Array.from({ length: 24 }, (_, i) => ({
          month: `${i}:00`,
          [dataKey]: Math.round(latestValue * (0.95 + Math.random() * 0.1))
        }));
      case "1W":
        // Generate daily data for 1 week
        return Array.from({ length: 7 }, (_, i) => ({
          month: `Day ${i + 1}`,
          [dataKey]: Math.round(latestValue * (0.92 + Math.random() * 0.16))
        }));
      case "1M":
        // Generate weekly data for 1 month
        return Array.from({ length: 4 }, (_, i) => ({
          month: `Week ${i + 1}`,
          [dataKey]: Math.round(latestValue * (0.88 + Math.random() * 0.24))
        }));
      case "3M":
        return baseData.slice(-3);
      case "6M":
        return baseData;
      case "1Y":
        // Generate monthly data for 1 year
        const yearData = Array.from({ length: 12 }, (_, i) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const growthFactor = 0.7 + (i / 12) * 0.6; // Growth over the year
          return {
            month: monthNames[i],
            [dataKey]: Math.round(latestValue * growthFactor * (0.9 + Math.random() * 0.2))
          };
        });
        return yearData;
      default:
        return baseData;
    }
  }, [data, dataKey, timeframe]);

  const currentValue = filteredData[filteredData.length - 1]?.[dataKey] || 0;
  const previousValue = filteredData[0]?.[dataKey] || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(2) : "0.00";
  const isPositive = change >= 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showChartMenu) {
        setShowChartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChartMenu]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {icon && <div className={`w-10 h-10 rounded-lg ${colorMap.bg} ${colorMap.accent} flex items-center justify-center`}>{icon}</div>}
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white"
            >
              <Info className="w-5 h-5" />
            </button>
            
            {/* Chart Type Menu */}
            <div className="relative">
              <button
                onClick={() => setShowChartMenu(!showChartMenu)}
                className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showChartMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-slate-300 mb-2 px-2">Chart Type</div>
                    <button
                      onClick={() => {
                        setChartType("area");
                        setShowChartMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        chartType === "area" 
                          ? "bg-blue-600 text-white" 
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      Area Chart
                    </button>
                    <button
                      onClick={() => {
                        setChartType("line");
                        setShowChartMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        chartType === "line" 
                          ? "bg-blue-600 text-white" 
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <LineIcon className="w-4 h-4" />
                      Line Chart
                    </button>
                    <button
                      onClick={() => {
                        setChartType("bar");
                        setShowChartMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        chartType === "bar" 
                          ? "bg-blue-600 text-white" 
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Bar Chart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price and Change */}
        <div className="flex items-end gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-white">{currentValue.toLocaleString()}</div>
            <div className={`flex items-center gap-1 mt-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-semibold">{isPositive ? "+" : ""}{change.toLocaleString()} ({changePercent}%)</span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2">
          {["1D", "1W", "1M", "3M", "6M", "1Y"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                timeframe === tf
                  ? `${colorMap.bg} ${colorMap.accent}`
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 border-b border-slate-700">
        <ResponsiveContainer width="100%" height={height}>
          {chartType === "area" && (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorMap.line} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colorMap.line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                style={{ fontSize: "12px" }} 
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: "12px" }} 
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value.toString();
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${colorMap.line}`,
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [value.toLocaleString(), dataKey]}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={colorMap.line}
                strokeWidth={2}
                fill={`url(#gradient-${color})`}
              />
            </AreaChart>
          )}
          
          {chartType === "line" && (
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                style={{ fontSize: "12px" }} 
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: "12px" }} 
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value.toString();
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${colorMap.line}`,
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [value.toLocaleString(), dataKey]}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colorMap.line}
                strokeWidth={3}
                dot={{ fill: colorMap.line, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colorMap.line, strokeWidth: 2 }}
              />
            </LineChart>
          )}
          
          {chartType === "bar" && (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                style={{ fontSize: "12px" }} 
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: "12px" }} 
                tick={{ fill: "#94a3b8" }}
                tickLine={{ stroke: "#94a3b8" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value.toString();
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${colorMap.line}`,
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [value.toLocaleString(), dataKey]}
              />
              <Bar
                dataKey={dataKey}
                fill={colorMap.line}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          {stats && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-white mb-3">Key Statistics</h4>
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className={`p-3 rounded-lg ${colorMap.bg} border ${colorMap.border}`}>
                    <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className={`text-xs mt-1 ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                      {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breakdown && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Breakdown</h4>
              <div className="space-y-2">
                {breakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded hover:bg-slate-700/50 transition">
                    <div className="flex-1">
                      <div className="text-sm text-slate-300">{item.label}</div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${colorMap.bg}`}
                          style={{ width: item.percentage }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-semibold text-white">{item.value}</div>
                      <div className="text-xs text-slate-400">{item.percentage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
