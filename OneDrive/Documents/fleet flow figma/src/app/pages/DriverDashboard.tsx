import { DashboardLayout } from "../components/DashboardLayout";
import { ChromaGrid } from "../components/ChromaGrid";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  X
} from "lucide-react";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const assignedLoads = [
  { 
    id: "LD-8821", 
    origin: "Los Angeles, CA", 
    destination: "Phoenix, AZ", 
    distance: "373 miles",
    pickup: "Today, 2:00 PM",
    delivery: "Tomorrow, 10:00 AM",
    rate: 1250,
    cargo: "Electronics",
    weight: "24,000 lbs",
    status: "pending"
  },
  { 
    id: "LD-8819", 
    origin: "San Diego, CA", 
    destination: "Las Vegas, NV", 
    distance: "332 miles",
    pickup: "Tomorrow, 8:00 AM",
    delivery: "Tomorrow, 6:00 PM",
    rate: 980,
    cargo: "Furniture",
    weight: "18,500 lbs",
    status: "accepted"
  },
];

const activeLoads = [
  { 
    id: "LD-8815", 
    origin: "Seattle, WA", 
    destination: "Portland, OR", 
    progress: 65,
    eta: "2 hours 15 minutes",
    rate: 750,
    status: "in-transit"
  },
];

const completedLoads = [
  { id: "LD-8812", origin: "Denver, CO", destination: "Salt Lake City, UT", date: "2 days ago", earnings: 1150 },
  { id: "LD-8809", origin: "Phoenix, AZ", destination: "Albuquerque, NM", date: "4 days ago", earnings: 890 },
  { id: "LD-8805", origin: "San Francisco, CA", destination: "Sacramento, CA", date: "6 days ago", earnings: 450 },
  { id: "LD-8801", origin: "Los Angeles, CA", destination: "San Diego, CA", date: "1 week ago", earnings: 380 },
];

export function DriverDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  return (
    <DashboardLayout role="driver" userName="Michael Rodriguez">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your loads and track your earnings</p>
        </div>

        {/* Key Metrics */}
        <ChromaGrid radius={350} columns={4} damping={0.45} fadeOut={0.6}>
          <MetricCard 
            title="This Month's Earnings"
            value="$8,450"
            subtitle="12 loads completed"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("earnings")}
          />
          <MetricCard 
            title="Active Load"
            value="1"
            subtitle="In transit to Portland"
            icon={<Package className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("active")}
          />
          <MetricCard 
            title="Pending Offers"
            value="2"
            subtitle="Awaiting your response"
            icon={<Clock className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("pending")}
          />
          <MetricCard 
            title="On-Time Rate"
            value="98%"
            subtitle="Excellent performance"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            onClick={() => setSelectedMetric("ontime")}
          />
        </ChromaGrid>

        {/* Active Load */}
        {activeLoads.length > 0 && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-blue-100 mb-1">ACTIVE LOAD</div>
                <h2 className="text-2xl font-bold">{activeLoads[0].id}</h2>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                In Transit
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-lg mb-4">
              <MapPin className="w-5 h-5" />
              <span>{activeLoads[0].origin} → {activeLoads[0].destination}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-blue-100">ETA</div>
                <div className="font-semibold">{activeLoads[0].eta}</div>
              </div>
              <div>
                <div className="text-sm text-blue-100">Earnings</div>
                <div className="font-semibold">${activeLoads[0].rate}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{activeLoads[0].progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${activeLoads[0].progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" />
                Navigate
              </button>
              <button className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition backdrop-blur-sm">
                Update Status
              </button>
            </div>
          </div>
        )}

        {/* Assigned Loads (Pending) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Load Offers</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              {assignedLoads.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {assignedLoads.map((load) => (
              <div key={load.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{load.id}</span>
                      {load.status === "accepted" && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Accepted
                        </span>
                      )}
                      {load.status === "pending" && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${load.rate}</div>
                    <div className="text-sm text-gray-500">{load.distance}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cargo Type</div>
                    <div className="text-sm font-semibold text-gray-900">{load.cargo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="text-sm font-semibold text-gray-900">{load.weight}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pickup</div>
                    <div className="text-sm font-semibold text-gray-900">{load.pickup}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Delivery</div>
                    <div className="text-sm font-semibold text-gray-900">{load.delivery}</div>
                  </div>
                </div>

                {load.status === "pending" && (
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Accept Load
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                      Decline
                    </button>
                  </div>
                )}

                {load.status === "accepted" && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    You've accepted this load. Await dispatch confirmation.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completed Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Completed Loads</h2>
          <div className="space-y-3">
            {completedLoads.map((load) => (
              <div key={load.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{load.id}</div>
                    <div className="text-sm text-gray-600">{load.origin} → {load.destination}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${load.earnings}</div>
                  <div className="text-xs text-gray-500">{load.date}</div>
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
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function MetricCard({ title, value, subtitle, icon, color, onClick }: MetricCardProps) {
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
        <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm font-semibold text-gray-700 mb-1">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
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
    earnings: {
      title: "This Month's Earnings",
      icon: <DollarSign className="w-8 h-8" />,
      color: "green",
      current: "$8,450",
      breakdown: [
        { label: "Long Haul", value: "$5,200", percentage: "61.5%", change: "+$850" },
        { label: "Regional", value: "$2,400", percentage: "28.4%", change: "+$320" },
        { label: "Local", value: "$850", percentage: "10.1%", change: "+$120" },
      ],
      monthlyData: [
        { month: "Jan", value: 6200 },
        { month: "Feb", value: 6800 },
        { month: "Mar", value: 7100 },
        { month: "Apr", value: 7600 },
        { month: "May", value: 8000 },
        { month: "Jun", value: 8450 },
      ]
    },
    active: {
      title: "Active Load",
      icon: <Package className="w-8 h-8" />,
      color: "blue",
      current: "1",
      breakdown: [
        { label: "In Transit", value: "1", percentage: "100%", change: "0" },
        { label: "Loading", value: "0", percentage: "0%", change: "0" },
        { label: "Unloading", value: "0", percentage: "0%", change: "0" },
      ],
      monthlyData: [
        { month: "Jan", value: 2 },
        { month: "Feb", value: 3 },
        { month: "Mar", value: 2 },
        { month: "Apr", value: 3 },
        { month: "May", value: 2 },
        { month: "Jun", value: 1 },
      ]
    },
    pending: {
      title: "Pending Offers",
      icon: <Clock className="w-8 h-8" />,
      color: "orange",
      current: "2",
      breakdown: [
        { label: "New Offers", value: "2", percentage: "100%", change: "+2" },
        { label: "Under Review", value: "0", percentage: "0%", change: "0" },
        { label: "Expiring Soon", value: "0", percentage: "0%", change: "0" },
      ],
      monthlyData: [
        { month: "Jan", value: 5 },
        { month: "Feb", value: 4 },
        { month: "Mar", value: 6 },
        { month: "Apr", value: 3 },
        { month: "May", value: 4 },
        { month: "Jun", value: 2 },
      ]
    },
    ontime: {
      title: "On-Time Rate",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "purple",
      current: "98%",
      breakdown: [
        { label: "On-Time Deliveries", value: "118", percentage: "98.3%", change: "+5" },
        { label: "Delayed", value: "2", percentage: "1.7%", change: "-1" },
        { label: "Early Deliveries", value: "45", percentage: "37.5%", change: "+8" },
      ],
      monthlyData: [
        { month: "Jan", value: 96.5 },
        { month: "Feb", value: 97.0 },
        { month: "Mar", value: 97.5 },
        { month: "Apr", value: 97.8 },
        { month: "May", value: 98.0 },
        { month: "Jun", value: 98.3 },
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
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
                    <span className={`text-xs font-semibold ${item.change.startsWith('+') ? 'text-green-600' : item.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
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
