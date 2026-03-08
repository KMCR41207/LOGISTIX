import { DashboardLayout } from "../components/DashboardLayout";
import { Users, Search, MoreVertical, X, Eye, Ban, AlertCircle, Trash2, Edit, Truck, Package, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function AdminUsers() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('logistix_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [
      { id: "ADMIN001", name: "Admin User", role: "Admin", status: "active", joinDate: "2024-01-01" },
      { id: "FO001", name: "Swift Logistics", role: "Fleet Owner", status: "active", joinDate: "2024-01-15" },
      { id: "DR001", name: "Michael Rodriguez", role: "Driver", status: "active", joinDate: "2024-02-01" },
      { id: "SH001", name: "Global Shippers", role: "Shipper", status: "active", joinDate: "2024-02-10" },
    ];
  });

  const currentUserId = sessionStorage.getItem('currentUserId') || 'ADMIN001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'Admin';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    role: "Fleet Owner",
    name: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter users based on search query
  const filteredUsers = users.filter((user: any) => {
    const query = searchQuery.toLowerCase();
    return (
      user.id.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('logistix_users', JSON.stringify(users));
  }, [users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.password || !formData.name) {
      alert("Please fill in all fields");
      return;
    }

    const newUser = {
      id: formData.userId,
      name: formData.name,
      role: formData.role,
      password: formData.password,
      status: "active",
      joinDate: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setFormData({ userId: "", password: "", role: "Driver", name: "" });
    setIsModalOpen(false);
    alert("User created successfully!");
  };

  const handleViewProfile = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewingUser(user);
      setIsProfileModalOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleSuspendUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === "active" ? "suspended" : "active";
    
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus }
        : user
    ));

    // Send notification to user
    const notification = {
      id: Date.now().toString(),
      type: newStatus === "suspended" ? "suspension" : "reactivation",
      title: newStatus === "suspended" ? "Account Suspended" : "Account Reactivated",
      message: newStatus === "suspended" 
        ? "Your account has been suspended by the administrator. Please contact support for more information."
        : "Your account has been reactivated. You can now access all platform features.",
      from: "System Admin",
      timestamp: new Date().toISOString(),
      read: false
    };

    const userNotifications = localStorage.getItem(`notifications_${userId}`);
    const notifications = userNotifications ? JSON.parse(userNotifications) : [];
    notifications.unshift(notification);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));

    alert(`User ${userId} has been ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
    setOpenMenuId(null);
  };

  const handleWarnUser = (userId: string) => {
    // Send warning notification to user
    const notification = {
      id: Date.now().toString(),
      type: "warning",
      title: "Warning Issued",
      message: "You have received a warning from the administrator. Please review your account activity and ensure compliance with platform policies.",
      from: "System Admin",
      timestamp: new Date().toISOString(),
      read: false
    };

    const userNotifications = localStorage.getItem(`notifications_${userId}`);
    const notifications = userNotifications ? JSON.parse(userNotifications) : [];
    notifications.unshift(notification);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));

    alert(`Warning issued to user: ${userId}`);
    setOpenMenuId(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
      setUsers(users.filter(user => user.id !== userId));
      
      // Clean up user's notifications
      localStorage.removeItem(`notifications_${userId}`);
      
      alert(`User ${userId} has been deleted`);
      setOpenMenuId(null);
    }
  };

  const handleEditProfile = (user: any) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, name: editingUser.name, role: editingUser.role }
          : user
      ));

      // Send notification to user about profile update
      const notification = {
        id: Date.now().toString(),
        type: "system",
        title: "Profile Updated",
        message: `Your profile has been updated by the administrator. Name: ${editingUser.name}, Role: ${editingUser.role}`,
        from: "System Admin",
        timestamp: new Date().toISOString(),
        read: false
      };

      const userNotifications = localStorage.getItem(`notifications_${editingUser.id}`);
      const notifications = userNotifications ? JSON.parse(userNotifications) : [];
      notifications.unshift(notification);
      localStorage.setItem(`notifications_${editingUser.id}`, JSON.stringify(notifications));

      setIsEditModalOpen(false);
      setEditingUser(null);
      alert("User profile updated successfully!");
    }
  };

  return (
    <DashboardLayout role="admin" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 pb-64">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Create User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Join Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{user.id}</td>
                  <td className="py-4 px-6 text-gray-700">{user.name}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{user.joinDate}</td>
                  <td className="py-4 px-6 relative">
                    <div ref={openMenuId === user.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                          <button
                            onClick={() => handleViewProfile(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                            <span>View Profile</span>
                          </button>
                          <button
                            onClick={() => handleEditProfile(user)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                          >
                            <Edit className="w-5 h-5 text-green-600" />
                            <span>Edit Profile</span>
                          </button>
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                          >
                            <Ban className="w-5 h-5 text-orange-600" />
                            <span>{user.status === "active" ? "Suspend" : "Reactivate"}</span>
                          </button>
                          <button
                            onClick={() => handleWarnUser(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                          >
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <span>Issue Warning</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h2>

              <form onSubmit={handleCreateUser} className="space-y-5">
                {/* User Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* User ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                  <input 
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder="e.g., FO002, DR003, SH002"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: FO (Fleet Owner), DR (Driver), SH (Shipper)</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Fleet Owner">Fleet Owner</option>
                    <option value="Driver">Driver</option>
                    <option value="Shipper">Shipper</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User Profile</h2>

              <form onSubmit={handleSaveEditProfile} className="space-y-5">
                {/* User ID (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                  <input 
                    type="text"
                    value={editingUser.id}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 outline-none"
                  />
                </div>

                {/* User Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select 
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Fleet Owner">Fleet Owner</option>
                    <option value="Driver">Driver</option>
                    <option value="Shipper">Shipper</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isProfileModalOpen && viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-2xl">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                  {viewingUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{viewingUser.name}</h2>
                  <div className="flex items-center gap-4 text-blue-100">
                    <span className="font-semibold">{viewingUser.id}</span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {viewingUser.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      viewingUser.status === "active" 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}>
                      {viewingUser.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">User ID</div>
                    <div className="font-semibold text-gray-900">{viewingUser.id}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Full Name</div>
                    <div className="font-semibold text-gray-900">{viewingUser.name}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Role</div>
                    <div className="font-semibold text-gray-900">{viewingUser.role}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Join Date</div>
                    <div className="font-semibold text-gray-900">{viewingUser.joinDate}</div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Account Status
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Current Status</div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        viewingUser.status === "active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {viewingUser.status === "active" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                        {viewingUser.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Member Since</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(viewingUser.joinDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-Specific Information */}
              {viewingUser.role === "Fleet Owner" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Fleet Information
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Total Trucks</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {viewingUser.id === "FO001" ? "145" : viewingUser.id === "FO002" ? "128" : "0"}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Total Drivers</div>
                      <div className="text-2xl font-bold text-green-700">
                        {viewingUser.id === "FO001" ? "320" : viewingUser.id === "FO002" ? "280" : "0"}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600 mb-1">Revenue</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {viewingUser.id === "FO001" ? "$2.45M" : viewingUser.id === "FO002" ? "$2.18M" : "$0"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewingUser.role === "Driver" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Driver Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Total Loads</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {viewingUser.id === "DR001" ? "342" : "0"}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Completed</div>
                      <div className="text-2xl font-bold text-green-700">
                        {viewingUser.id === "DR001" ? "328" : "0"}
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-600 mb-1">Rating</div>
                      <div className="text-2xl font-bold text-orange-700">
                        {viewingUser.id === "DR001" ? "4.8" : "0"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewingUser.role === "Shipper" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Shipper Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Total Shipments</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {viewingUser.id === "SH001" ? "156" : "0"}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Delivered</div>
                      <div className="text-2xl font-bold text-green-700">
                        {viewingUser.id === "SH001" ? "148" : "0"}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600 mb-1">Total Spent</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {viewingUser.id === "SH001" ? "$1.2M" : "$0"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      handleEditProfile(viewingUser);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      handleSuspendUser(viewingUser.id);
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-semibold ${
                      viewingUser.status === "active"
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    <Ban className="w-5 h-5" />
                    {viewingUser.status === "active" ? "Suspend User" : "Reactivate User"}
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      handleWarnUser(viewingUser.id);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Issue Warning
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      handleDeleteUser(viewingUser.id);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
