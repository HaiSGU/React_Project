import { useState, useEffect } from 'react'
import './MenuItemModal.css'

export default function MenuItemModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editItem = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'main'
  })

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || editItem.title || '',
        price: editItem.price || '',
        description: editItem.description || '',
        category: editItem.category || 'main'
      })
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'main'
      })
    }
  }, [editItem, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    onSave({
      ...formData,
      price: parseFloat(formData.price)
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content menu-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editItem ? '✏️ Sửa món' : '➕ Thêm món mới'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-group">
            <label>Tên món *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Gà rán giòn..."
              required
            />
          </div>

          <div className="form-group">
            <label>Giá (VNĐ) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="50000"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả về món ăn..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="main">Món chính</option>
              <option value="side">Món phụ</option>
              <option value="drink">Đồ uống</option>
              <option value="dessert">Tráng miệng</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-save">
              {editItem ? 'Cập nhật' : 'Thêm món'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}