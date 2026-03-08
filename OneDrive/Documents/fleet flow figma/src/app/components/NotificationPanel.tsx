import { useState, useEffect } from "react";
import { X, Bell, MessageSquare, AlertCircle, CheckCircle, Ban, Trash2, Send } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "warning" | "suspension" | "system" | "reactivation";
  title: string;
  message: string;
  from: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  role: string;
}

export function NotificationPanel({ isOpen, onClose, userId, userName, role }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
  const [messageRecipient, setMessageRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  // Load notifications and users
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadUsers();
    }
  }, [isOpen, userId]);

  const loadNotifications = () => {
    const stored = localStorage.getItem(`notifications_${userId}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  const loadUsers = () => {
    const stored = localStorage.getItem('logistix_users');
    if (stored) {
      const allUsers = JSON.parse(stored);
      // Filter out current user
      setUsers(allUsers.filter((u: any) => u.id !== userId));
    }
  };

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
  };

  const deleteNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
  };

  const sendMessage = () => {
    if (!messageRecipient || !messageText.trim()) {
      alert("Please select a recipient and enter a message");
      return;
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "message",
      title: "New Message",
      message: messageText,
      from: `${userName} (${userId})`,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Add to recipient's notifications
    const recipientNotifications = localStorage.getItem(`notifications_${messageRecipient}`);
    const notifications = recipientNotifications ? JSON.parse(recipientNotifications) : [];
    notifications.unshift(newNotification);
    localStorage.setItem(`notifications_${messageRecipient}`, JSON.stringify(notifications));

    // Clear form
    setMessageText("");
    setMessageRecipient("");
    alert("Message sent successfully!");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "suspension":
        return <Ban className="w-5 h-5 text-red-600" />;
      case "reactivation":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <h2 className="text-xl font-bold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                activeTab === "notifications"
                  ? "bg-white text-blue-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                activeTab === "messages"
                  ? "bg-white text-blue-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "notifications" ? (
            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">You'll see updates here</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      notification.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-medium">{notification.from}</span>
                          <span>{getTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  value={messageRecipient}
                  onChange={(e) => setMessageRecipient(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select recipient...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.id}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <button
                onClick={sendMessage}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Quick Tips</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Messages are delivered instantly</li>
                  <li>• Recipients will see a notification badge</li>
                  <li>• All users can message each other</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
