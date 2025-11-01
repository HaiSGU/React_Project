import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './OrderChart.css'

export default function OrderChart({ data, type = 'line' }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>📊 Thống kê 7 ngày gần đây</h3>
        <div className="chart-empty">
          <p>Chưa có dữ liệu thống kê</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <h3>📊 Thống kê 7 ngày gần đây</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#667eea" 
              strokeWidth={2}
              name="Số đơn hàng"
              dot={{ fill: '#667eea', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#26de81" 
              strokeWidth={2}
              name="Doanh thu (k)"
              dot={{ fill: '#26de81', r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="orders" fill="#667eea" name="Số đơn hàng" />
            <Bar dataKey="revenue" fill="#26de81" name="Doanh thu (k)" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}