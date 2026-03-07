import { DashboardLayout } from "../components/DashboardLayout";
import { Truck, TrendingUp, DollarSign, Users } from "lucide-react";

export function AdminFleetOwners() {
  const fleetOwners = [
    { id: "FO001", name: "Swift Logistics Inc", trucks: 145, drivers: 320, revenue: "$2.45M", status: "active" },
    { id: "FO002", name: "TransNational Freight", trucks: 128, drivers: 280, revenue: "$2.18M", status: "active" },
    { id: "FO003", name: "Premium Transport Co", trucks: 98, drivers: 210, revenue: "$1.85M", status: "active" },
    { id: "FO004", name: "Global Haul Systems", trucks: 87, drivers: 190, revenue: "$1.62M", status: "active" },
  ];

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Owners Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all fleet owner accounts</p>
        </div>

        {/* Fleet Owners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetOwners.map((owner) => (
            <div key={owner.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{owner.name}</h3>
                  <p className="text-sm text-gray-600">{owner.id}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {owner.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700"><strong>{owner.trucks}</strong> Trucks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700"><strong>{owner.drivers}</strong> Drivers</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Revenue: <strong>{owner.revenue}</strong></span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
