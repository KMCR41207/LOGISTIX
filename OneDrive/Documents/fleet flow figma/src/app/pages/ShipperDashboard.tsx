import { DashboardLayout } from "../components/DashboardLayout";
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  MapPin,
  DollarSign,
  TrendingUp,
  Plus,
  Filter
} from "lucide-react";

const activeShipments = [
  { 
    id: "LD-8821", 
    origin: "Los Angeles, CA", 
    destination: "Phoenix, AZ",
    truck: "TRK-2401",
    driver: "John Martinez",
    status: "in-transit",
    progress: 65,
    pickup: "Nov 1, 2:00 PM",
    delivery: "Nov 2, 10:00 AM",
    rate: 1250,
    cargo: "Electronics",
    weight: "24,000 lbs"
  },
  { 
    id: "LD-8819", 
    origin: "San Diego, CA", 
    destination: "Las Vegas, NV",
    truck: "TRK-2398",
    driver: "Sarah Johnson",
    status: "assigned",
    progress: 0,
    pickup: "Nov 2, 8:00 AM",
    delivery: "Nov 2, 6:00 PM",
    rate: 980,
    cargo: "Furniture",
    weight: "18,500 lbs"
  },
];

const pendingLoads = [
  { 
    id: "LD-8825", 
    origin: "Miami, FL", 
    destination: "Orlando, FL",
    pickup: "Nov 5, 9:00 AM",
    rate: 650,
    cargo: "Medical Supplies",
    weight: "8,500 lbs",
    responses: 3
  },
  { 
    id: "LD-8826", 
    origin: "Chicago, IL", 
    destination: "Detroit, MI",
    pickup: "Nov 6, 7:00 AM",
    rate: 850,
    cargo: "Auto Parts",
    weight: "22,000 lbs",
    responses: 7
  },
];

const completedShipments = [
  { id: "LD-8812", origin: "Denver, CO", destination: "Salt Lake City, UT", date: "Oct 30", cost: 1150, rating: 5 },
  { id: "LD-8809", origin: "Phoenix, AZ", destination: "Albuquerque, NM", date: "Oct 28", cost: 890, rating: 5 },
  { id: "LD-8805", origin: "San Francisco, CA", destination: "Sacramento, CA", date: "Oct 26", cost: 450, rating: 4 },
  { id: "LD-8801", origin: "Los Angeles, CA", destination: "San Diego, CA", date: "Oct 24", cost: 380, rating: 5 },
];

export function ShipperDashboard() {
  return (
    <DashboardLayout role="shipper" userName="Jennifer Chen">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipper Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your shipments and track deliveries</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/30">
            <Plus className="w-5 h-5" />
            Post New Load
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Active Shipments"
            value="2"
            subtitle="Both on schedule"
            icon={<Truck className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard 
            title="Pending Loads"
            value="2"
            subtitle="Awaiting assignment"
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <MetricCard 
            title="This Month"
            value="$12,450"
            subtitle="18 loads shipped"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <MetricCard 
            title="Success Rate"
            value="99.2%"
            subtitle="On-time deliveries"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Active Shipments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Shipments</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="space-y-4">
            {activeShipments.map((shipment) => (
              <div key={shipment.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{shipment.id}</span>
                      {shipment.status === "in-transit" && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          In Transit
                        </span>
                      )}
                      {shipment.status === "assigned" && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Assigned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{shipment.origin} → {shipment.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${shipment.rate}</div>
                    <div className="text-xs text-gray-500">Total Cost</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Truck</div>
                    <div className="text-sm font-semibold text-blue-600">{shipment.truck}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Driver</div>
                    <div className="text-sm font-semibold text-gray-900">{shipment.driver}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pickup</div>
                    <div className="text-sm font-semibold text-gray-900">{shipment.pickup}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Delivery</div>
                    <div className="text-sm font-semibold text-gray-900">{shipment.delivery}</div>
                  </div>
                </div>

                {shipment.status === "in-transit" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Delivery Progress</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${shipment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Track Shipment
                  </button>
                  <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Contact Driver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Pending Loads</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              {pendingLoads.length} Awaiting Assignment
            </span>
          </div>

          <div className="space-y-4">
            {pendingLoads.map((load) => (
              <div key={load.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{load.id}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${load.rate}</div>
                    <div className="text-xs text-gray-500">Offered Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cargo Type</div>
                    <div className="text-sm font-semibold text-gray-900">{load.cargo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="text-sm font-semibold text-gray-900">{load.weight}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pickup Time</div>
                    <div className="text-sm font-semibold text-gray-900">{load.pickup}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">{load.responses}</span> fleet owners responded
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                    View Bids
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completed Shipments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Completed Shipments</h2>
          <div className="space-y-3">
            {completedShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{shipment.id}</div>
                    <div className="text-sm text-gray-600">{shipment.origin} → {shipment.destination}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${shipment.cost}</div>
                    <div className="text-xs text-gray-500">{shipment.date}</div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: shipment.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
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
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
      <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-semibold text-gray-700 mb-1">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}
