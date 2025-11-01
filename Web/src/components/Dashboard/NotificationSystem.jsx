import { useState, useEffect } from 'react'
import './NotificationSystem.css'

export default function NotificationSystem({ restaurantId }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Kiểm tra đơn hàng pending trong localStorage
    const checkNewOrders = () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]')
        const pendingOrders = allOrders.filter(o => 
          o.status === 'pending' && 
          (o.restaurantId === restaurantId || 
           o.items?.some(item => item.restaurantId === restaurantId))
        )
        
        if (pendingOrders.length > 0) {
          const newNotif = {
            id: Date.now(),
            type: 'new_order',
            message: `Có ${pendingOrders.length} đơn hàng chờ xác nhận`,
            time: new Date().toLocaleTimeString('vi-VN'),
            count: pendingOrders.length
          }
          
          setNotifications(prev => {
            const exists = prev.some(n => n.type === 'new_order')
            if (exists) {
              return prev.map(n => n.type === 'new_order' ? newNotif : n)
            }
            return [newNotif, ...prev].slice(0, 5)
          })
        }
      } catch (error) {
        console.error('Error checking orders:', error)
      }
    }

    checkNewOrders()
    const interval = setInterval(checkNewOrders, 30000) // Check mỗi 30s

    return () => clearInterval(interval)
  }, [restaurantId])

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="notification-panel">
      <div className="notif-header">
        <h3>🔔 Thông báo</h3>
        {notifications.length > 0 && (
          <span className="notif-count">{notifications.length}</span>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <p className="no-notif">Chưa có thông báo mới</p>
      ) : (
        <div className="notif-list">
          {notifications.map(notif => (
            <div key={notif.id} className="notif-item new">
              <div className="notif-content">
                <p>{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
              <button 
                className="notif-dismiss"
                onClick={() => dismissNotification(notif.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}