import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        // Check for new notifications to show toast
        if (notifications.length > 0 && result.data.notifications.length > notifications.length) {
          const newNotif = result.data.notifications[0];
          if (!newNotif.isRead) {
            addToast(newNotif);
          }
        }
        
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications (Simulation of Real-time)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const addToast = (notification) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      markAsRead, 
      markAllAsRead, 
      fetchNotifications,
      toasts
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="pointer-events-auto bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-brand-500/30 p-4 rounded-2xl shadow-2xl shadow-brand-500/10 min-w-[300px] animate-slide-up"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                🔔
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-tight">{toast.title}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{toast.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
