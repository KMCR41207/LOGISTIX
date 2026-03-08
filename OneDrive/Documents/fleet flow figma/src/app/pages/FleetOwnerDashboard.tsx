import { DashboardLayout } from "../components/DashboardLayout";
import { ChromaGrid } from "../components/ChromaGrid";
import { 
  Truck, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 145000, profit: 42000 },
  { month: "Feb", revenue: 162000, profit: 48000 },
  { month: "Mar", revenue: 178000, profit: 55000 },
  { month: "Apr", revenue: 195000, profit: 61000 },
  { month: "May", revenue: 210000, profit: 68000 },
  { month: "Jun", revenue: 234000, profit: 76000 },
];

const truckStatusData = [
  { name: "Active", value: 42, color: "#10b981" },
  { name: "Idle", value: 8, color: "#f59e0b" },
  { name: "Maintenance", value: 3, color: "#ef4444" },
];

const topPerformingTrucks = [
  { id: "TRK-2401", driver: "John Martinez", loads: 28, revenue: 42500, profit: 12800 },
  { id: "TRK-2398", driver: "Sarah Johnson", loads: 26, revenue: 39800, profit: 11500 },
  { id: "TRK-2405", driver: "Mike Chen", loads: 24, revenue: 38200, profit: 11200 },
  { id: "TRK-2392", driver: "Emily Davis", loads: 23, revenue: 36900, profit: 10800 },
  { id: "TRK-2411", driver: "Carlos Rivera", loads: 22, revenue: 35600, profit: 10400 },
];

const recentLoads = [
  { id: "LD-8821", origin: "Los Angeles, CA", destination: "Phoenix, AZ", truck: "TRK-2401", status: "In Transit", progress: 65 },
  { id: "LD-8822", origin: "Seattle, WA", destination: "Portland, OR", truck: "TRK-2398", status: "In Transit", progress: 85 },
  { id: "LD-8823", origin: "Dallas, TX", destination: "Houston, TX", truck: "TRK-2405", status: "Loading", progress: 15 },
  { id: "LD-8824", origin: "Miami, FL", destination: "Atlanta, GA", truck: "TRK-2392", status: "Delivered", progress: 100 },
];

export function FleetOwnerDashboard() {
  const currentUserId = sessionStorage.getItem('currentUserId') || 'FO001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'James Anderson';
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  return (
    <DashboardLayout role="fleet-owner" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your fleet performance and operations</p>
        </div>

        {/* Key Metrics */}
        <ChromaGrid radius={350} columns={4} damping={0.45} fadeOut={0.6}>
          <MetricCard 
            title="Total Trucks"
            value="53"
            change="+3 this month"
            trend="up"
            icon={<Truck className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("trucks")}
          />
          <MetricCard 
            title="Active Drivers"
            value="48"
            change="42 on road now"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("drivers")}
          />
          <MetricCard 
            title="Monthly Revenue"
            value="$234,500"
            change="+12% from last month"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
            onClick={() => setSelectedMetric("revenue")}
          />
          <MetricCard 
            title="Total Profit"
            value="$76,200"
            change="+15% from last month"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("profit")}
          />
        </ChromaGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Profit Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue & Profit Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fleet Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Fleet Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={truckStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {truckStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {truckStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value} trucks</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Trucks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Trucks This Month</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Truck ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loads</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Profit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingTrucks.map((truck) => (
                  <tr key={truck.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-600">{truck.id}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{truck.driver}</td>
                    <td className="py-3 px-4 text-gray-700">{truck.loads}</td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">${truck.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">${truck.profit.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Loads</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentLoads.map((load) => (
              <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{load.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        load.status === "Delivered" 
                          ? "bg-green-100 text-green-700"
                          : load.status === "In Transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {load.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Truck</div>
                    <div className="font-semibold text-blue-600">{load.truck}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{load.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        load.status === "Delivered" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${load.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Detail Modals */}
      {selectedMetric && (
        <MetricDetailModal 
          metric={selectedMetric} 
          onClose={() => setSelectedMetric(null)} 
        />
      )}
    </DashboardLayout>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function MetricCard({ title, value, change, trend, icon, color, onClick }: MetricCardProps) {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", spotlight: "rgba(59, 130, 246, 0.4)" },
    green: { bg: "bg-green-100", text: "text-green-600", spotlight: "rgba(16, 185, 129, 0.4)" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", spotlight: "rgba(168, 85, 247, 0.4)" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", spotlight: "rgba(245, 158, 11, 0.4)" },
  }[color];

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      className="chroma-card"
      onClick={onClick}
      onMouseMove={handleCardMove}
      style={{
        '--spotlight-color': colorClasses.spotlight
      } as React.CSSProperties}
    >
      <div className="chroma-card-content">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center`}>
            {icon}
          </div>
          {trend === "up" ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600 mb-2">{title}</div>
        <div className="text-xs text-gray-500">{change}</div>
      </div>
    </div>
  );
}

interface MetricDetailModalProps {
  metric: string;
  onClose: () => void;
}

function MetricDetailModal({ metric, onClose }: MetricDetailModalProps) {
  const detailData = {
    trucks: {
      title: "Total Trucks",
      icon: <Truck className="w-8 h-8" />,
      color: "blue",
      current: "53",
      breakdown: [
        { label: "Active on Road", value: "42", percentage: "79.2%", change: "+5" },
        { label: "Idle/Available", value: "8", percentage: "15.1%", change: "-1" },
        { label: "In Maintenance", value: "3", percentage: "5.7%", change: "-1" },
      ],
      monthlyData: [
        { month: "Jan", value: 45 },
        { month: "Feb", value: 47 },
        { month: "Mar", value: 48 },
        { month: "Apr", value: 49 },
        { month: "May", value: 50 },
        { month: "Jun", value: 53 },
      ]
    },
    drivers: {
      title: "Active Drivers",
      icon: <Users className="w-8 h-8" />,
      color: "green",
      current: "48",
      breakdown: [
        { label: "On Road Now", value: "42", percentage: "87.5%", change: "+8" },
        { label: "Available", value: "4", percentage: "8.3%", change: "-2" },
        { label: "Off Duty", value: "2", percentage: "4.2%", change: "-1" },
      ],
      monthlyData: [
        { month: "Jan", value: 38 },
        { month: "Feb", value: 40 },
        { month: "Mar", value: 42 },
        { month: "Apr", value: 44 },
        { month: "May", value: 46 },
        { month: "Jun", value: 48 },
      ]
    },
    revenue: {
      title: "Monthly Revenue",
      icon: <DollarSign className="w-8 h-8" />,
      color: "purple",
      current: "$234,500",
      breakdown: [
        { label: "Long Haul", value: "$145,000", percentage: "61.8%", change: "+$18,000" },
        { label: "Regional", value: "$62,500", percentage: "26.7%", change: "+$8,500" },
        { label: "Local Delivery", value: "$27,000", percentage: "11.5%", change: "+$3,200" },
      ],
      monthlyData: [
        { month: "Jan", value: 145000 },
        { month: "Feb", value: 162000 },
        { month: "Mar", value: 178000 },
        { month: "Apr", value: 195000 },
        { month: "May", value: 210000 },
        { month: "Jun", value: 234500 },
      ]
    },
    profit: {
      title: "Total Profit",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "orange",
      current: "$76,200",
      breakdown: [
        { label: "Operating Profit", value: "$58,400", percentage: "76.6%", change: "+$9,200" },
        { label: "Fuel Savings", value: "$12,800", percentage: "16.8%", change: "+$2,100" },
        { label: "Other Income", value: "$5,000", percentage: "6.6%", change: "+$800" },
      ],
      monthlyData: [
        { month: "Jan", value: 42000 },
        { month: "Feb", value: 48000 },
        { month: "Mar", value: 55000 },
        { month: "Apr", value: 61000 },
        { month: "May", value: 68000 },
        { month: "Jun", value: 76200 },
      ]
    }
  };

  const data = detailData[metric as keyof typeof detailData];
  
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  }[data.color];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${colorClasses.bg} ${colorClasses.border} border-b p-6 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${colorClasses.bg} ${colorClasses.text} rounded-xl flex items-center justify-center border-2 ${colorClasses.border}`}>
              {data.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
              <p className="text-3xl font-bold text-gray-900 mt-1">{data.current}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-white/50 flex items-center justify-center transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.breakdown.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.percentage}</span>
                    <span className={`text-xs font-semibold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">6-Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyData}>
                <defs>
                  <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={
                      data.color === 'blue' ? '#3b82f6' :
                      data.color === 'green' ? '#10b981' :
                      data.color === 'purple' ? '#a855f7' :
                      '#f59e0b'
                    } stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={
                      data.color === 'blue' ? '#3b82f6' :
                      data.color === 'green' ? '#10b981' :
                      data.color === 'purple' ? '#a855f7' :
                      '#f59e0b'
                    } stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    data.color === 'blue' ? '#3b82f6' :
                    data.color === 'green' ? '#10b981' :
                    data.color === 'purple' ? '#a855f7' :
                    '#f59e0b'
                  }
                  strokeWidth={2} 
                  fill={`url(#color${metric})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
