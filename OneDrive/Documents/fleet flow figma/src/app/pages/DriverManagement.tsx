import { DashboardLayout } from "../components/DashboardLayout";
import { 
  Users, 
  Plus, 
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  Edit,
  Trash2,
  CheckCircle,
  Clock
} from "lucide-react";

const drivers = [
  { 
    id: "DRV-1024",
    name: "John Martinez",
    phone: "+1 (555) 234-5678",
    email: "john.martinez@example.com",
    license: "CDL Class A",
    status: "active",
    currentTruck: "TRK-2401",
    currentLoad: "LD-8821",
    location: "Phoenix, AZ",
    rating: 4.9,
    completedLoads: 28,
    earnings: 42500,
    onTimeRate: 98
  },
  { 
    id: "DRV-1019",
    name: "Sarah Johnson",
    phone: "+1 (555) 345-6789",
    email: "sarah.j@example.com",
    license: "CDL Class A",
    status: "active",
    currentTruck: "TRK-2398",
    currentLoad: "LD-8822",
    location: "Portland, OR",
    rating: 4.8,
    completedLoads: 26,
    earnings: 39800,
    onTimeRate: 96
  },
  { 
    id: "DRV-1032",
    name: "Mike Chen",
    phone: "+1 (555) 456-7890",
    email: "mchen@example.com",
    license: "CDL Class A",
    status: "idle",
    currentTruck: "TRK-2405",
    currentLoad: null,
    location: "Dallas, TX",
    rating: 4.7,
    completedLoads: 24,
    earnings: 38200,
    onTimeRate: 95
  },
  { 
    id: "DRV-1015",
    name: "Emily Davis",
    phone: "+1 (555) 567-8901",
    email: "emily.davis@example.com",
    license: "CDL Class A",
    status: "active",
    currentTruck: "TRK-2392",
    currentLoad: "LD-8824",
    location: "Atlanta, GA",
    rating: 5.0,
    completedLoads: 23,
    earnings: 36900,
    onTimeRate: 100
  },
  { 
    id: "DRV-1028",
    name: "Carlos Rivera",
    phone: "+1 (555) 678-9012",
    email: "crivera@example.com",
    license: "CDL Class A",
    status: "idle",
    currentTruck: "TRK-2411",
    currentLoad: null,
    location: "Houston, TX",
    rating: 4.6,
    completedLoads: 22,
    earnings: 35600,
    onTimeRate: 94
  },
  { 
    id: "DRV-1041",
    name: "Jessica Lee",
    phone: "+1 (555) 789-0123",
    email: "jlee@example.com",
    license: "CDL Class A",
    status: "active",
    currentTruck: "TRK-2387",
    currentLoad: "LD-8809",
    location: "Chicago, IL",
    rating: 4.9,
    completedLoads: 21,
    earnings: 34200,
    onTimeRate: 97
  },
];

export function DriverManagement() {
  return (
    <DashboardLayout role="fleet-owner" userName="James Anderson">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600 mt-1">Manage your driver roster and assignments</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/30">
            <Plus className="w-5 h-5" />
            Add Driver
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Drivers"
            value="48"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard 
            title="Active on Road"
            value="42"
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard 
            title="Idle Available"
            value="6"
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <StatCard 
            title="Avg Rating"
            value="4.8"
            icon={<Star className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search drivers by name, ID, or email..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Idle</option>
              <option>Off Duty</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option>Sort by: Name</option>
              <option>Sort by: Rating</option>
              <option>Sort by: Earnings</option>
              <option>Sort by: Loads</option>
            </select>
          </div>
        </div>

        {/* Drivers List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Driver</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Current Assignment</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Performance</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.id}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{driver.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        driver.status === "active" 
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {driver.status === "active" ? "On Road" : "Available"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {driver.currentLoad ? (
                        <div>
                          <div className="text-sm font-semibold text-blue-600">{driver.currentTruck}</div>
                          <div className="text-xs text-gray-600">Load: {driver.currentLoad}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-semibold text-gray-600">{driver.currentTruck}</div>
                          <div className="text-xs text-gray-400">No active load</div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {driver.location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">{driver.rating}</span>
                        </div>
                        <div className="text-xs text-gray-600">{driver.completedLoads} loads</div>
                        <div className="text-xs text-green-600 font-semibold">${driver.earnings.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">1-6</span> of <span className="font-semibold">48</span> drivers
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}
