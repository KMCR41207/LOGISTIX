import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { 
  Truck, 
  Users, 
  Package, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  Search
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "fleet-owner" | "driver" | "shipper" | "admin";
  userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = {
    "fleet-owner": [
      { name: "Dashboard", href: "/fleet-owner", icon: LayoutDashboard },
      { name: "Trucks", href: "/fleet-owner/trucks", icon: Truck },
      { name: "Drivers", href: "/fleet-owner/drivers", icon: Users },
      { name: "Loads", href: "/fleet-owner/loads", icon: Package },
    ],
    "driver": [
      { name: "Dashboard", href: "/driver", icon: LayoutDashboard },
      { name: "My Loads", href: "/driver/loads", icon: Package },
    ],
    "shipper": [
      { name: "Dashboard", href: "/shipper", icon: LayoutDashboard },
      { name: "Post Load", href: "/shipper/post", icon: Package },
      { name: "My Shipments", href: "/shipper/shipments", icon: Truck },
    ],
    "admin": [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Fleet Owners", href: "/admin/fleet-owners", icon: Truck },
      { name: "Analytics", href: "/admin/analytics", icon: Package },
    ],
  };

  const currentNav = navigation[role];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Logistix Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-lg font-bold text-gray-900">Logistix</div>
                <div className="text-xs text-gray-500 capitalize">{role.replace("-", " ")}</div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 bg-gray-50"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{userName}</div>
                  <div className="text-xs text-gray-500 capitalize">{role.replace("-", " ")}</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-600/20">
                  {userName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}