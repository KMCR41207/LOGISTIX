import { ReactNode, useState, useRef, useEffect } from "react";
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
  Search,
  ChevronDown
} from "lucide-react";
import "./DashboardLayout.css";
import { NotificationPanel } from "./NotificationPanel";
import { UserProfileModal } from "./UserProfileModal";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "fleet-owner" | "driver" | "shipper" | "admin";
  userName: string;
  userId?: string;
}

export function DashboardLayout({ children, role, userName, userId = "UNKNOWN" }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState(userName);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Load unread notification count
  useEffect(() => {
    const loadUnreadCount = () => {
      const stored = localStorage.getItem(`notifications_${userId}`);
      if (stored) {
        const notifications = JSON.parse(stored);
        const unread = notifications.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    };

    loadUnreadCount();
    
    // Poll for new notifications every 5 seconds
    const interval = setInterval(loadUnreadCount, 5000);
    
    return () => clearInterval(interval);
  }, [userId, isNotificationOpen]);

  // Load profile picture
  useEffect(() => {
    const loadProfilePicture = () => {
      console.log('=== LOADING PROFILE PICTURE ===');
      console.log('User ID:', userId);
      
      const stored = localStorage.getItem(`profile_${userId}`);
      console.log('Raw stored data exists:', !!stored);
      
      if (stored) {
        try {
          const profileData = JSON.parse(stored);
          console.log('Parsed profile data:', {
            name: profileData.name,
            hasPicture: !!profileData.profilePicture,
            pictureLength: profileData.profilePicture?.length || 0
          });
          
          if (profileData.profilePicture) {
            setProfilePicture(profileData.profilePicture);
            console.log('✓ Profile picture loaded and set');
          } else {
            setProfilePicture("");
            console.log('✗ No profile picture in stored data');
          }
          
          // Update userName if it changed
          if (profileData.name && profileData.name !== currentUserName) {
            setCurrentUserName(profileData.name);
            console.log('✓ Updated userName to:', profileData.name);
          }
        } catch (error) {
          console.error('✗ Error parsing profile data:', error);
          setProfilePicture("");
        }
      } else {
        console.log('✗ No profile data found in localStorage for key:', `profile_${userId}`);
        setProfilePicture("");
      }
    };

    loadProfilePicture();
  }, [userId]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu */}
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

              {/* Dropdown Menu */}
              <div className="ml-8 relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-sm font-medium">Menu</span>
                  <ChevronDown className={`w-4 h-4 transition ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Content */}
                <div 
                  className={`dropdown-menu ${isMenuOpen ? 'dropdown-menu-open' : 'dropdown-menu-closed'}`}
                >
                  <nav className="p-2 space-y-1">
                    {currentNav.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            navigate(item.href);
                            setIsMenuOpen(false);
                          }}
                          className={`menu-item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
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

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Bottom Actions */}
                  <div className="p-2 space-y-1">
                    <button className="menu-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                    <button 
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="menu-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

              {/* Notifications */}
              <button 
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{currentUserName}</div>
                  <div className="text-xs text-gray-500 capitalize">{role.replace("-", " ")}</div>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:scale-105 transition-all cursor-pointer overflow-hidden"
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={currentUserName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUserName.charAt(0)
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userId={userId}
        userName={userName}
        role={role}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => {
          console.log('Profile modal closing...');
          setIsProfileOpen(false);
          // Force reload profile picture after modal closes
          setTimeout(() => {
            console.log('Reloading profile picture after modal close');
            const stored = localStorage.getItem(`profile_${userId}`);
            if (stored) {
              const profileData = JSON.parse(stored);
              if (profileData.profilePicture) {
                setProfilePicture(profileData.profilePicture);
                console.log('✓ Profile picture reloaded');
              }
              if (profileData.name) {
                setCurrentUserName(profileData.name);
              }
            }
          }, 100);
        }}
        userId={userId}
        userName={currentUserName}
        role={role}
        onProfileUpdate={() => {
          console.log('Profile updated, reloading data...');
          // Reload profile picture and name after update
          const stored = localStorage.getItem(`profile_${userId}`);
          if (stored) {
            const profileData = JSON.parse(stored);
            console.log('Updated profile data:', profileData);
            
            if (profileData.profilePicture) {
              setProfilePicture(profileData.profilePicture);
              console.log('Profile picture updated');
            }
            
            if (profileData.name) {
              setCurrentUserName(profileData.name);
              console.log('User name updated to:', profileData.name);
            }
          }
        }}
      />
    </div>
  );
}