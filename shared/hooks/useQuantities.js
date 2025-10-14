import { useState, useMemo, useCallback } from 'react';


export const useQuantities = (items = []) => {
  const [quantities, setQuantities] = useState({});

  // ✅ useCallback để optimize performance
  const increase = useCallback((itemId) => {
    setQuantities(prev => ({ 
      ...prev, 
      [itemId]: (prev[itemId] || 0) + 1 
    }));
  }, []);

  const decrease = useCallback((itemId) => {
    setQuantities(prev => {
      const newQty = Math.max((prev[itemId] || 0) - 1, 0);
      return { ...prev, [itemId]: newQty };
    });
  }, []);

  const setQuantity = useCallback((itemId, qty) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(0, qty) }));
  }, []);

  const reset = useCallback(() => {
    setQuantities({});
  }, []);

  // ✅ Tính tổng tiền
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [quantities, items]);

  // ✅ Lấy items đã chọn
  const cartItems = useMemo(() => {
    return items
      .filter(item => (quantities[item.id] || 0) > 0)
      .map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: quantities[item.id] || 0,
        image: item.image,
        description: item.description,
      }));
  }, [quantities, items]);

  // ✅ Tổng số lượng items
  const totalItems = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  }, [quantities]);

  return {
    quantities,
    increase,
    decrease,
    setQuantity,
    reset,
    totalPrice,
    cartItems,
    totalItems,
  };
};