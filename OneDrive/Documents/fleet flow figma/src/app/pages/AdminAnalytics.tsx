import { DashboardLayout } from "../components/DashboardLayout";
import { TradingChart } from "../components/TradingChart";
import { CandlestickChart } from "../components/CandlestickChart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Truck, Package, DollarSign } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 125000 },
  { month: "Feb", revenue: 145000 },
  { month: "Mar", revenue: 168000 },
  { month: "Apr", revenue: 192000 },
  { month: "May", revenue: 218000 },
  { month: "Jun", revenue: 245000 },
];

const userGrowthData = [
  { week: "Week 1", fleetOwners: 520, drivers: 1850, shippers: 980 },
  { week: "Week 2", fleetOwners: 540, drivers: 1920, shippers: 1020 },
  { week: "Week 3", fleetOwners: 565, drivers: 2010, shippers: 1080 },
  { week: "Week 4", fleetOwners: 595, drivers: 2150, shippers: 1140 },
];

export function AdminAnalytics() {
  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Platform performance and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3,445</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-gray-500 mt-1">+12% this month</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">15,240</div>
            <div className="text-sm text-gray-600">Active Trucks</div>
            <div className="text-xs text-gray-500 mt-1">+8% this month</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">6,100</div>
            <div className="text-sm text-gray-600">Monthly Loads</div>
            <div className="text-xs text-gray-500 mt-1">+15% this month</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">$245K</div>
            <div className="text-sm text-gray-600">Platform Revenue</div>
            <div className="text-xs text-gray-500 mt-1">+18% this month</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <TradingChart
            title="Revenue Growth"
            subtitle="Monthly platform revenue"
            data={revenueData}
            dataKey="revenue"
            color="blue"
            icon={<DollarSign className="w-5 h-5" />}
            stats={[
              { label: "Current", value: "$245,000", change: "+18%", trend: "up" },
              { label: "Average", value: "$189,000", change: "+12%", trend: "up" },
              { label: "Peak", value: "$245,000", change: "+25%", trend: "up" },
            ]}
            breakdown={[
              { label: "Commission Fees", value: "$185,000", percentage: "75.5%", change: "+$28,000" },
              { label: "Subscription", value: "$42,000", percentage: "17.1%", change: "+$6,000" },
              { label: "Premium Features", value: "$18,000", percentage: "7.4%", change: "+$3,000" },
            ]}
          />

          {/* User Growth Chart */}
          <CandlestickChart
            title="User Growth Analysis"
            subtitle="User acquisition candlestick"
            data={userGrowthData.map(item => ({ ...item, close: item.drivers }))}
            dataKeys={{
              open: "fleetOwners",
              high: "drivers", 
              low: "shippers",
              close: "close",
              volume: "drivers"
            }}
            color="green"
            icon={<Users className="w-5 h-5" />}
            height={300}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
