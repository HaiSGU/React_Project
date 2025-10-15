export const DELIVERY_METHODS = [
  { 
    key: 'express', 
    label: 'Siêu tốc', 
    fee: 40000, 
    time: 20,
    icon: '🚀',
    description: 'Giao trong 20 phút',
  },
  { 
    key: 'fast', 
    label: 'Nhanh', 
    fee: 25000, 
    time: 30,
    icon: '🏃',
    description: 'Giao trong 30 phút',
  },
  { 
    key: 'standard', 
    label: 'Tiêu chuẩn', 
    fee: 15000, 
    time: 45,
    icon: '🚴',
    description: 'Giao trong 45 phút',
  },
  { 
    key: 'economy', 
    label: 'Tiết kiệm', 
    fee: 10000, 
    time: 60,
    icon: '🚶',
    description: 'Giao trong 60 phút',
  },
];

export const getDeliveryMethodByKey = (key) => {
  return DELIVERY_METHODS.find(m => m.key === key);
};