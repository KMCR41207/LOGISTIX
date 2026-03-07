import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { Star, MapPin, TrendingUp } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  status: "active" | "inactive" | "suspended";
  rating: number;
  totalRatings: number;
  location: string;
  completionRate: number;
  totalTrips: number;
  earnings: string;
  avatar: string;
}

const drivers: Driver[] = [
  {
    id: "DR001",
    name: "Michael Rodriguez",
    status: "active",
    rating: 4.8,
    totalRatings: 189,
    location: "Los Angeles, CA",
    completionRate: 98.5,
    totalTrips: 245,
    earnings: "$12,450.50",
    avatar: "M"
  },
  {
    id: "DR002",
    name: "Sarah Johnson",
    status: "active",
    rating: 4.9,
    totalRatings: 156,
    location: "San Francisco, CA",
    completionRate: 99.2,
    totalTrips: 198,
    earnings: "$11,200.75",
    avatar: "S"
  },
  {
    id: "DR003",
    name: "James Wilson",
    status: "active",
    rating: 4.6,
    totalRatings: 142,
    location: "Seattle, WA",
    completionRate: 97.1,
    totalTrips: 167,
    earnings: "$9,850.00",
    avatar: "J"
  },
  {
    id: "DR004",
    name: "Maria Garcia",
    status: "inactive",
    rating: 4.7,
    totalRatings: 98,
    location: "Phoenix, AZ",
    completionRate: 96.8,
    totalTrips: 112,
    earnings: "$7,200.50",
    avatar: "M"
  },
];

export function DriversList() {
  const navigate = useNavigate();

  const handleDriverClick = (driverId: string) => {
    navigate(`/driver/${driverId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600 mt-1">Manage and view driver profiles</p>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              onClick={() => handleDriverClick(driver.id)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              {/* Driver Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {driver.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-600">{driver.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                  {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{driver.location}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900">{driver.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({driver.totalRatings} ratings)</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">{driver.completionRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Trips</p>
                  <span className="font-bold text-gray-900">{driver.totalTrips}</span>
                </div>
              </div>

              {/* Earnings */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Earnings</span>
                <span className="font-bold text-green-600">{driver.earnings}</span>
              </div>

              {/* Click Hint */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-blue-600 font-semibold">Click to view profile →</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
