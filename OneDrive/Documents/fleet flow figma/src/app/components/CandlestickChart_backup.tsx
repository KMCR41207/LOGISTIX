import { useState, useMemo, useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart } from "recharts";
import { Info, TrendingUp, TrendingDown, MoreVertical, BarChart3, TrendingUp as LineIcon, Activity, Zap } from "lucide-react";

function CandlestickChart({
  title,
  subtitle,
  data,
  dataKeys,
  color,
  icon,
  height = 350,
}: CandlestickChartProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [timeframe, setTimeframe] = useState("6M");
  const [chartType, setChartType] = useState<"candlestick" | "area" | "line">("candlestick");
  const [showChartMenu, setShowChartMenu] = useState(false);

  const colorMap = {
    blue: { line: "#3b82f6", fill: "rgba(59, 130, 246, 0.1)", accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    green: { line: "#10b981", fill: "rgba(16, 185, 129, 0.1)", accent: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    purple: { line: "#a855f7", fill: "rgba(168, 85, 247, 0.1)", accent: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    orange: { line: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)", accent: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  }[color];

  // Generate candlestick data based on timeframe
  const filteredData = useMemo(() => {
    const baseData = [...data];
    const latestValue = baseData[baseData.length - 1]?.[dataKeys.close] || 0;

    switch (timeframe) {
      case "1D":
        return Array.from({ length: 24 }, (_, i) => {
          const basePrice = latestValue * (0.95 + Math.random() * 0.1);
          const volatility = basePrice * 0.02;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: `${i}:00`,
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 1000 + 500)
          };
        });
      case "1W":
        return Array.from({ length: 7 }, (_, i) => {
          const basePrice = latestValue * (0.92 + Math.random() * 0.16);
          const volatility = basePrice * 0.03;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: `Day ${i + 1}`,
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 2000 + 1000)
          };
        });
      case "1M":
        return Array.from({ length: 4 }, (_, i) => {
          const basePrice = latestValue * (0.88 + Math.random() * 0.24);
          const volatility = basePrice * 0.05;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: `Week ${i + 1}`,
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 5000 + 2000)
          };
        });
      case "3M":
        return baseData.slice(-3).map(item => ({
          ...item,
          [dataKeys.open]: item[dataKeys.close] * (0.98 + Math.random() * 0.04),
          [dataKeys.high]: item[dataKeys.close] * (1.02 + Math.random() * 0.03),
          [dataKeys.low]: item[dataKeys.close] * (0.96 + Math.random() * 0.02),
          [dataKeys.volume || 'volume']: Math.round(Math.random() * 8000 + 3000)
        }));
      case "6M":
        return baseData.map(item => ({
          ...item,
          [dataKeys.open]: item[dataKeys.close] * (0.98 + Math.random() * 0.04),
          [dataKeys.high]: item[dataKeys.close] * (1.02 + Math.random() * 0.03),
          [dataKeys.low]: item[dataKeys.close] * (0.96 + Math.random() * 0.02),
          [dataKeys.volume || 'volume']: Math.round(Math.random() * 10000 + 4000)
        }));
      case "1Y":
        const yearData = Array.from({ length: 12 }, (_, i) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const growthFactor = 0.7 + (i / 12) * 0.6;
          const basePrice = latestValue * growthFactor * (0.9 + Math.random() * 0.2);
          const volatility = basePrice * 0.08;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: monthNames[i],
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 15000 + 5000)
          };
        });
        return yearData;
      default:
        return baseData;
    }
  }, [data, dataKeys, timeframe]);

  const currentValue = filteredData[filteredData.length - 1]?.[dataKeys.close] || 0;
  const previousValue = filteredData[0]?.[dataKeys.close] || 0;
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

  // Custom candlestick renderer
  const CandlestickBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const open = payload[dataKeys.open];
    const close = payload[dataKeys.close];
    const high = payload[dataKeys.high];
    const low = payload[dataKeys.low];

    const isGreen = close > open;
    const candleColor = isGreen ? "#10b981" : "#ef4444";
    const bodyHeight = Math.abs(close - open) * (height / (high - low));
    const bodyY = y + (high - Math.max(open, close)) * (height / (high - low));

    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={candleColor}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={bodyHeight || 1}
          fill={isGreen ? candleColor : candleColor}
          stroke={candleColor}
          strokeWidth={1}
        />
      </g>
    );
  };

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
                        setChartType("candlestick");
                        setShowChartMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        chartType === "candlestick"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      Candlestick
                    </button>
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
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {chartType === "candlestick" && (
            <ComposedChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${colorMap.line}`,
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value, name) => [value.toLocaleString(), name]}
              />
              <Bar dataKey={dataKeys.close} shape={<CandlestickBar />} />
              {dataKeys.volume && (
                <Line
                  type="monotone"
                  dataKey={dataKeys.volume}
                  stroke={colorMap.line}
                  strokeWidth={1}
                  dot={false}
                  strokeOpacity={0.3}
                />
              )}
            </ComposedChart>
          )}

          {chartType === "area" && (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id={`gradient-area-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorMap.line} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colorMap.line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${colorMap.line}`,
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [value.toLocaleString(), dataKeys.close]}
              />
              <Area
                type="monotone"
                dataKey={dataKeys.close}
                stroke={colorMap.line}
                strokeWidth={2}
                fill={`url(#gradient-area-${color})`}
              />
            </AreaChart>
          )}

          {chartType === "line" && (
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid ${colorMap.line}`,
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [value.toLocaleString(), dataKeys.close]}
              />
              <Line
                type="monotone"
                dataKey={dataKeys.close}
                stroke={colorMap.line}
                strokeWidth={3}
                dot={{ fill: colorMap.line, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colorMap.line, strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}


export function CandlestickChart({
  title,
  subtitle,
  data,
  dataKeys,
  color,
  icon,
  height = 350,
}: CandlestickChartProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [timeframe, setTimeframe] = useState("6M");
  const [chartType, setChartType] = useState<"candlestick" | "area" | "line">("candlestick");
  const [showChartMenu, setShowChartMenu] = useState(false);

  const colorMap = {
    blue: { line: "#3b82f6", fill: "rgba(59, 130, 246, 0.1)", accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    green: { line: "#10b981", fill: "rgba(16, 185, 129, 0.1)", accent: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    purple: { line: "#a855f7", fill: "rgba(168, 85, 247, 0.1)", accent: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    orange: { line: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)", accent: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  }[color];

  // Generate candlestick data based on timeframe
  const filteredData = useMemo(() => {
    const baseData = [...data];
    const latestValue = baseData[baseData.length - 1]?.[dataKeys.close] || 0;
    
    switch (timeframe) {
      case "1D":
        return Array.from({ length: 24 }, (_, i) => {
          const basePrice = latestValue * (0.95 + Math.random() * 0.1);
          const volatility = basePrice * 0.02;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: `${i}:00`,
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 1000 + 500)
          };
        });
      case "1W":
        return Array.from({ length: 7 }, (_, i) => {
          const basePrice = latestValue * (0.92 + Math.random() * 0.16);
          const volatility = basePrice * 0.03;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: `Day ${i + 1}`,
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 2000 + 1000)
          };
        });
      case "1M":
        return Array.from({ length: 4 }, (_, i) => {
          const basePrice = latestValue * (0.88 + Math.random() * 0.24);
          const volatility = basePrice * 0.05;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: `Week ${i + 1}`,
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 5000 + 2000)
          };
        });
      case "3M":
        return baseData.slice(-3).map(item => ({
          ...item,
          [dataKeys.open]: item[dataKeys.close] * (0.98 + Math.random() * 0.04),
          [dataKeys.high]: item[dataKeys.close] * (1.02 + Math.random() * 0.03),
          [dataKeys.low]: item[dataKeys.close] * (0.96 + Math.random() * 0.02),
          [dataKeys.volume || 'volume']: Math.round(Math.random() * 8000 + 3000)
        }));
      case "6M":
        return baseData.map(item => ({
          ...item,
          [dataKeys.open]: item[dataKeys.close] * (0.98 + Math.random() * 0.04),
          [dataKeys.high]: item[dataKeys.close] * (1.02 + Math.random() * 0.03),
          [dataKeys.low]: item[dataKeys.close] * (0.96 + Math.random() * 0.02),
          [dataKeys.volume || 'volume']: Math.round(Math.random() * 10000 + 4000)
        }));
      case "1Y":
        const yearData = Array.from({ length: 12 }, (_, i) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const growthFactor = 0.7 + (i / 12) * 0.6;
          const basePrice = latestValue * growthFactor * (0.9 + Math.random() * 0.2);
          const volatility = basePrice * 0.08;
          const open = basePrice + (Math.random() - 0.5) * volatility;
          const close = basePrice + (Math.random() - 0.5) * volatility;
          const high = Math.max(open, close) + Math.random() * volatility;
          const low = Math.min(open, close) - Math.random() * volatility;
          return {
            month: monthNames[i],
            [dataKeys.open]: Math.round(open),
            [dataKeys.high]: Math.round(high),
            [dataKeys.low]: Math.round(low),
            [dataKeys.close]: Math.round(close),
            [dataKeys.volume || 'volume']: Math.round(Math.random() * 15000 + 5000)
          };
        });
        return yearData;
      default:
        return baseData;
    }
  }, [data, dataKeys, timeframe]);

  const currentValue = filteredData[filteredData.length - 1]?.[dataKeys.close] || 0;
  const previousValue = filteredData[0]?.[dataKeys.close] || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(2) : "0.00";
  const isPositive = change >= 0;

  // Custom candlestick renderer
  const CandlestickBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const open = payload[dataKeys.open];
    const close = payload[dataKeys.close];
    const high = payload[dataKeys.high];
    const low = payload[dataKeys.low];

    const isGreen = close > open;
    const candleColor = isGreen ? "#10b981" : "#ef4444";
    const bodyHeight = Math.abs(close - open) * (height / (high - low));
    const bodyY = y + (high - Math.max(open, close)) * (height / (high - low));

    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={candleColor}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={bodyHeight || 1}
          fill={isGreen ? candleColor : candleColor}
          stroke={candleColor}
          strokeWidth={1}
        />
      </g>
    );
  };

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
                        setChartType("candlestick");
                        setShowChartMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        chartType === "candlestick" 
                          ? "bg-blue-600 text-white" 
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      Candlestick
                    </button>
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
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: `1px solid ${colorMap.line}`,
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value, name) => [value.toLocaleString(), name]}
            />
            <Bar dataKey={dataKeys.close} shape={<CandlestickBar />} />
            {dataKeys.volume && (
              <Line
                type="monotone"
                dataKey={dataKeys.volume}
                stroke={colorMap.line}
                strokeWidth={1}
                dot={false}
                strokeOpacity={0.3}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}