import { useState, useMemo } from 'react';
import {
  calculateSubtotal,
  calculateShippingFee,
  calculateDiscountAmount, // ✅ ĐỔI TÊN
  calculateTotalPrice,
} from '../utils/checkoutHelpers';
import { validateCheckoutInfo } from '../utils/checkoutValidation';

/**
 * ✅ Pure React Hook - Web & Mobile dùng chung
 */
export const useCheckout = (initialCart = []) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('fast');
  const [discount, setDiscount] = useState(null); // ✅ ĐỔI TỪ voucher → discount
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  // Tính toán giá
  const subtotal = useMemo(() => calculateSubtotal(initialCart), [initialCart]);
  
  const shippingFee = useMemo(() => 
    calculateShippingFee(deliveryMethod), 
    [deliveryMethod]
  );
  
  const { itemDiscount, shippingDiscount } = useMemo(() => 
    calculateDiscountAmount(discount, subtotal, shippingFee), // ✅ ĐỔI TÊN
    [discount, subtotal, shippingFee]
  );
  
  const totalPrice = useMemo(() => 
    calculateTotalPrice(subtotal, shippingFee, itemDiscount, shippingDiscount),
    [subtotal, shippingFee, itemDiscount, shippingDiscount]
  );

  // Validate
  const validate = () => {
    const result = validateCheckoutInfo(fullName, phone, address, initialCart);
    if (!result.valid) {
      setError(result.error);
      return false;
    }
    setError('');
    return true;
  };

  // Reset form
  const reset = () => {
    setFullName('');
    setPhone('');
    setAddress('');
    setDeliveryMethod('fast');
    setDiscount(null); // ✅ ĐỔI
    setPaymentMethod('cash');
    setError('');
  };

  return {
    // State
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    deliveryMethod,
    setDeliveryMethod,
    discount,     
    setDiscount,   
    paymentMethod,
    setPaymentMethod,
    error,
    setError,
    
    // Computed
    subtotal,
    shippingFee,
    itemDiscount,
    shippingDiscount,
    totalPrice,
    
    // Methods
    validate,
    reset,
  };
};