import { DashboardLayout } from "../components/DashboardLayout";
import { Users, Search, MoreVertical, X, Eye, Ban, AlertCircle, Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    role: "Driver",
    name: "",
  });

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
      status: "active",
      joinDate: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setFormData({ userId: "", password: "", role: "Driver", name: "" });
    setIsModalOpen(false);
    alert("User created successfully!");
  };

  const handleViewProfile = (userId: string) => {
    alert(`Viewing profile for user: ${userId}`);
    setOpenMenuId(null);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "suspended" : "active" }
        : user
    ));
    alert(`User ${userId} has been ${users.find(u => u.id === userId)?.status === "active" ? "suspended" : "reactivated"}`);
    setOpenMenuId(null);
  };

  const handleWarnUser = (userId: string) => {
    alert(`Warning issued to user: ${userId}`);
    setOpenMenuId(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
      setUsers(users.filter(user => user.id !== userId));
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
      setIsEditModalOpen(false);
      setEditingUser(null);
      alert("User profile updated successfully!");
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
              {users.map((user) => (
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
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <p className="text-xs text-gray-500 mt-1">Format: FO (Fleet Owner), DR (Driver), SH (Shipper), ADMIN</p>
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
    </DashboardLayout>
  );
}
