// Web resolver - Map imageName sang đường dẫn URL cho Vite
import { DRIVERS_DATA } from './DriversData';

// Import tất cả ảnh tài xế
import DatImg from '../assets/images/driver/Dat.jpg';
import HaiImg from '../assets/images/driver/Hai.jpg';
import HieuImg from '../assets/images/driver/Hieu.jpg';
import VietImg from '../assets/images/driver/Viet.jpg';

// Map tên file sang URL đã import
const IMAGE_MAP = {
  'Dat.jpg': DatImg,
  'Hai.jpg': HaiImg,
  'Hieu.jpg': HieuImg,
  'Viet.jpg': VietImg,
};

// Export DRIVERS với image URL cho Web
export const DRIVERS = DRIVERS_DATA.map(driver => ({
  ...driver,
  image: IMAGE_MAP[driver.imageName] || null
}));
