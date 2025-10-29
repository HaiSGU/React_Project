// Mobile resolver - Map imageName từ RestaurantsData sang require() cho React Native
import { RESTAURANTS_DATA } from './RestaurantsData';

// Map tên file ảnh sang require() cho Metro bundler
const IMAGE_REQUIRE_MAP = {
  'Jollibee.png': require('../assets/images/restaurant/Jollibee.png'),
  'KFC.jpg': require('../assets/images/restaurant/KFC.jpg'),
  'Texas.png': require('../assets/images/restaurant/Texas.png'),
  'phuclong.png': require('../assets/images/restaurant/phuclong.png'),
  'highland.png': require('../assets/images/restaurant/highland.png'),
  'maycha.png': require('../assets/images/restaurant/maycha.png'),
  'lotteria.png': require('../assets/images/restaurant/lotteria.png'),
  'cali.png': require('../assets/images/restaurant/cali.png'),
  'sabichuong.jpg': require('../assets/images/restaurant/sabichuong.jpg'),
  'TCH.jpg': require('../assets/images/restaurant/TCH.jpg'),
  'Bunbohue3A.jpg': require('../assets/images/restaurant/Bunbohue3A.jpg'),
  'PhoHoa.png': require('../assets/images/restaurant/PhoHoa.png'),
  'chaybode.jpg': require('../assets/images/restaurant/chaybode.jpg'),
  'pizzahut.jpg': require('../assets/images/restaurant/pizzahut.jpg'),
  'sushikei.png': require('../assets/images/restaurant/sushikei.png'),
  'comnieusaigon.png': require('../assets/images/restaurant/comnieusaigon.png'),
  'sukiya.png': require('../assets/images/restaurant/sukiya.png'),
  'mandala.jpg': require('../assets/images/restaurant/mandala.jpg'),
  'thayba.jpg': require('../assets/images/restaurant/thayba.jpg'),
  'ngogia.jpg': require('../assets/images/restaurant/ngogia.jpg'),
};

// Export RESTAURANTS với image đã được resolve bởi require()
export const RESTAURANTS = RESTAURANTS_DATA.map(restaurant => ({
  ...restaurant,
  image: IMAGE_REQUIRE_MAP[restaurant.imageName] || null
}));

