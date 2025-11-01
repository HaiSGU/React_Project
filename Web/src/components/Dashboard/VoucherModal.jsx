import { useState, useEffect } from 'react'
import './VoucherModal.css'

export default function VoucherModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editVoucher = null 
}) {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    expiryDate: '',
    description: ''
  })

  useEffect(() => {
    if (editVoucher) {
      setFormData({
        code: editVoucher.code || '',
        discountType: editVoucher.discountType || 'percentage',
        discountValue: editVoucher.discountValue || '',
        minOrderValue: editVoucher.minOrderValue || '',
        maxDiscount: editVoucher.maxDiscount || '',
        expiryDate: editVoucher.expiryDate?.split('T')[0] || '',
        description: editVoucher.description || ''
      })
    } else {
      // Set ngày mặc định: 30 ngày sau
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 30)
      
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        expiryDate: defaultDate.toISOString().split('T')[0],
        description: ''
      })
    }
  }, [editVoucher, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.code || !formData.discountValue) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    onSave({
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderValue: parseFloat(formData.minOrderValue) || 0,
      maxDiscount: parseFloat(formData.maxDiscount) || null,
      expiryDate: new Date(formData.expiryDate).toISOString()
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content voucher-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editVoucher ? '✏️ Sửa voucher' : '🎟️ Tạo voucher mới'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="voucher-form">
          <div className="form-row">
            <div className="form-group">
              <label>Mã voucher *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="GIAMGIA50"
                maxLength="20"
                required
                disabled={editVoucher} // Không cho sửa code
              />
            </div>

            <div className="form-group">
              <label>Loại giảm giá *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">% Phần trăm</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Giá trị giảm * 
                {formData.discountType === 'percentage' ? ' (%)' : ' (VNĐ)'}
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
                required
              />
            </div>

            {formData.discountType === 'percentage' && (
              <div className="form-group">
                <label>Giảm tối đa (VNĐ)</label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="100000"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Đơn tối thiểu (VNĐ)</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Ngày hết hạn *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Giảm giá cho đơn hàng từ 100k..."
              rows="2"
            />
          </div>

          <div className="voucher-preview">
            <h4>Xem trước:</h4>
            <div className="preview-card">
              <div className="preview-code">{formData.code || 'VOUCHER'}</div>
              <div className="preview-value">
                Giảm {formData.discountValue}
                {formData.discountType === 'percentage' ? '%' : 'đ'}
                {formData.maxDiscount && formData.discountType === 'percentage' && 
                  ` (tối đa ${parseFloat(formData.maxDiscount).toLocaleString()}đ)`
                }
              </div>
              {formData.minOrderValue > 0 && (
                <div className="preview-min">
                  Đơn tối thiểu: {parseFloat(formData.minOrderValue).toLocaleString()}đ
                </div>
              )}
              <div className="preview-expiry">
                HSD: {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-save">
              {editVoucher ? 'Cập nhật' : 'Tạo voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}