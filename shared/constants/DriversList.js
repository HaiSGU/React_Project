// Mobile resolver - Map imageName từ DriversData sang require() cho React Native
import { DRIVERS_DATA } from './DriversData';

// Map tên file ảnh sang require() cho Metro bundler
const IMAGE_REQUIRE_MAP = {
  'Dat.jpg': require('../assets/images/driver/Dat.jpg'),
  'Hai.jpg': require('../assets/images/driver/Hai.jpg'),
  'Hieu.jpg': require('../assets/images/driver/Hieu.jpg'),
  'Viet.jpg': require('../assets/images/driver/Viet.jpg'),
};

// Export DRIVERS với image đã được resolve bởi require()
export const DRIVERS = DRIVERS_DATA.map(driver => ({
  ...driver,
  image: IMAGE_REQUIRE_MAP[driver.imageName] || null
}));
