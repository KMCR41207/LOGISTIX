import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { 
  Users, 
  Truck, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const platformStats = [
  { month: "Jul", users: 850, revenue: 125000, loads: 3200 },
  { month: "Aug", users: 920, revenue: 145000, loads: 3800 },
  { month: "Sep", users: 1050, revenue: 168000, loads: 4200 },
  { month: "Oct", users: 1180, revenue: 192000, loads: 4850 },
  { month: "Nov", users: 1340, revenue: 218000, loads: 5420 },
  { month: "Dec", users: 1520, revenue: 245000, loads: 6100 },
];

const userGrowthData = [
  { date: "Week 1", fleetOwners: 520, drivers: 1850, shippers: 980 },
  { date: "Week 2", fleetOwners: 540, drivers: 1920, shippers: 1020 },
  { date: "Week 3", fleetOwners: 565, drivers: 2010, shippers: 1080 },
  { date: "Week 4", fleetOwners: 595, drivers: 2150, shippers: 1140 },
];

const topFleetOwners = [
  { name: "Swift Logistics Inc", trucks: 145, revenue: 2450000, loads: 3820, growth: 15 },
  { name: "TransNational Freight", trucks: 128, revenue: 2180000, loads: 3450, growth: 12 },
  { name: "Premium Transport Co", trucks: 98, revenue: 1850000, loads: 2890, growth: 18 },
  { name: "Global Haul Systems", trucks: 87, revenue: 1620000, loads: 2560, growth: 9 },
  { name: "Elite Carrier Group", trucks: 76, revenue: 1420000, loads: 2280, growth: 22 },
];

const recentActivity = [
  { type: "user", action: "New fleet owner registered", user: "Alpha Logistics LLC", time: "5 min ago" },
  { type: "load", action: "High-value load completed", details: "$12,500 - CA to NY", time: "12 min ago" },
  { type: "alert", action: "Driver safety incident reported", details: "TRK-4521", time: "25 min ago" },
  { type: "payment", action: "Payment processed", details: "$45,800 to Swift Logistics", time: "1 hour ago" },
  { type: "user", action: "15 new drivers onboarded", user: "TransNational Freight", time: "2 hours ago" },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout role="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Admin</h1>
            <p className="text-gray-600 mt-1">Monitor and manage Fleet Flow platform operations</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-semibold">All Systems Operational</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Users"
            value="3,445"
            change="+12% this month"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard 
            title="Active Trucks"
            value="15,240"
            change="+8% this month"
            trend="up"
            icon={<Truck className="w-6 h-6" />}
            color="green"
          />
          <MetricCard 
            title="Monthly Loads"
            value="6,100"
            change="+15% this month"
            trend="up"
            icon={<Package className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard 
            title="Platform Revenue"
            value="$245,000"
            change="+18% this month"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Revenue Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={platformStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">User Growth by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="fleetOwners" stroke="#3b82f6" strokeWidth={2} name="Fleet Owners" />
                <Line type="monotone" dataKey="drivers" stroke="#10b981" strokeWidth={2} name="Drivers" />
                <Line type="monotone" dataKey="shippers" stroke="#f59e0b" strokeWidth={2} name="Shippers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Truck className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-3xl font-bold mb-1">595</div>
            <div className="text-blue-100 text-sm font-semibold mb-1">Fleet Owners</div>
            <div className="text-xs text-blue-200">+45 this month</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition" onClick={() => navigate("/admin/drivers")}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-200" />
            </div>
            <div className="text-3xl font-bold mb-1">2,150</div>
            <div className="text-green-100 text-sm font-semibold mb-1">Active Drivers</div>
            <div className="text-xs text-green-200">+230 this month</div>
            <div className="mt-4 pt-4 border-t border-green-400 text-center">
              <p className="text-xs text-green-100 font-semibold">Click to view all drivers →</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Package className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-orange-200" />
            </div>
            <div className="text-3xl font-bold mb-1">1,140</div>
            <div className="text-orange-100 text-sm font-semibold mb-1">Shippers</div>
            <div className="text-xs text-orange-200">+60 this month</div>
          </div>
        </div>

        {/* Top Fleet Owners */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Fleet Owners</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trucks</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loads</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topFleetOwners.map((fleet, index) => (
                  <tr key={fleet.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-900">{fleet.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{fleet.trucks}</td>
                    <td className="py-3 px-4 text-gray-700">{fleet.loads.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${(fleet.revenue / 1000000).toFixed(2)}M</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">{fleet.growth}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === "user" ? "bg-blue-100" :
                  activity.type === "load" ? "bg-green-100" :
                  activity.type === "alert" ? "bg-red-100" :
                  "bg-purple-100"
                }`}>
                  {activity.type === "user" && <Users className="w-5 h-5 text-blue-600" />}
                  {activity.type === "load" && <Package className="w-5 h-5 text-green-600" />}
                  {activity.type === "alert" && <Shield className="w-5 h-5 text-red-600" />}
                  {activity.type === "payment" && <DollarSign className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.user || activity.details}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
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
