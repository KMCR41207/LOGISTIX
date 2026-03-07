import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Truck, User, Lock } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any>({});

  // Load users from localStorage on component mount
  useEffect(() => {
    // Default users - these should NEVER be overwritten
    const defaultUsers = {
      "ADMIN001": { role: "admin", password: "admin123", name: "Admin User" },
      "FO001": { role: "fleet-owner", password: "fleet123", name: "Swift Logistics" },
      "FO002": { role: "fleet-owner", password: "fleet123", name: "Fleet Owner 2" },
      "DR001": { role: "driver", password: "driver123", name: "Michael Rodriguez" },
      "DR002": { role: "driver", password: "driver123", name: "Driver 2" },
      "SH001": { role: "shipper", password: "shipper123", name: "Global Shippers" },
      "SH002": { role: "shipper", password: "shipper123", name: "Shipper 2" },
    };

    try {
      const savedUsers = localStorage.getItem('logistix_users');
      let userMap = { ...defaultUsers };

      if (savedUsers) {
        try {
          const userList = JSON.parse(savedUsers);
          const roleMap: any = {
            "Admin": "admin",
            "Fleet Owner": "fleet-owner",
            "Driver": "driver",
            "Shipper": "shipper",
          };
          
          // Process all users from localStorage
          userList.forEach((user: any) => {
            // Skip default users - keep their original passwords
            if (!defaultUsers[user.id as keyof typeof defaultUsers]) {
              // Convert role format: "Fleet Owner" -> "fleet-owner"
              let roleValue = user.role;
              if (roleMap[user.role]) {
                roleValue = roleMap[user.role];
              } else if (typeof user.role === 'string') {
                roleValue = user.role.toLowerCase().replace(/\s+/g, '-');
              }
              
              userMap[user.id] = { 
                role: roleValue, 
                password: user.password, // Use the exact password stored
                name: user.name 
              };
            }
          });
        } catch (e) {
          console.error("Error parsing saved users, using defaults");
          userMap = { ...defaultUsers };
        }
      }

      setUsers(userMap);
    } catch (e) {
      console.error("Error loading users:", e);
      setUsers(defaultUsers);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // If users is empty, show error
    if (Object.keys(users).length === 0) {
      setError("System loading, please try again");
      return;
    }

    // Check if user ID exists (case-insensitive) - trim and clean input
    const normalizedUserId = userId.trim().toUpperCase().replace(/^:/, "");
    const user = users[normalizedUserId as keyof typeof users];
    
    if (!user) {
      setError(`Invalid User ID: ${normalizedUserId}`);
      return;
    }

    // Debug log
    console.log("User found:", normalizedUserId, "Password stored:", user.password, "Password entered:", password);
    console.log("All users in system:", users);

    // Check password
    if (user.password !== password) {
      setError("Invalid Password");
      return;
    }

    // Navigate based on role associated with the ID
    navigate(`/${user.role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/login-background.jpg" 
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-4 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
            <img 
              src="/logo.png" 
              alt="Logistix Logo" 
              className="w-20 h-20 object-contain"
            />
            <div className="text-left">
              <div className="text-4xl font-bold text-gray-900">Logistix</div>
              <div className="text-base text-gray-600 font-semibold">by SVLT</div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In to Your Account</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* User ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your User ID"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold">Admin</div>
                <div>ID: ADMIN001</div>
                <div className="text-gray-400">Pass: admin123</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold">Fleet Owner</div>
                <div>ID: FO001</div>
                <div className="text-gray-400">Pass: fleet123</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold">Driver</div>
                <div>ID: DR001</div>
                <div className="text-gray-400">Pass: driver123</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold">Shipper</div>
                <div>ID: SH001</div>
                <div className="text-gray-400">Pass: shipper123</div>
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Only Admin can create new user IDs. Contact your administrator for account creation.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}