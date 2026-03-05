import { DashboardLayout } from "../components/DashboardLayout";
import { 
  Truck, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Clock,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  return (
    <DashboardLayout role="fleet-owner" userName="James Anderson">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your fleet performance and operations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Trucks"
            value="53"
            change="+3 this month"
            trend="up"
            icon={<Truck className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard 
            title="Active Drivers"
            value="48"
            change="42 on road now"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="green"
          />
          <MetricCard 
            title="Monthly Revenue"
            value="$234,500"
            change="+12% from last month"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard 
            title="Total Profit"
            value="$76,200"
            change="+15% from last month"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
          />
        </div>

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
}

function MetricCard({ title, value, change, trend, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
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
  );
}
