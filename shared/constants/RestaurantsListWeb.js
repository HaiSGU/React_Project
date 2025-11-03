// Web resolver - Map imageName sang đường dẫn URL cho Vite
import { RESTAURANTS_DATA } from './RestaurantsData';

// Import tất cả ảnh nhà hàng
import JollibeeImg from '../assets/images/restaurant/Jollibee.png';
import KFCImg from '../assets/images/restaurant/KFC.jpg';
import TexasImg from '../assets/images/restaurant/Texas.png';
import PhucLongImg from '../assets/images/restaurant/phuclong.png';
import HighlandImg from '../assets/images/restaurant/highland.png';
import MaychaImg from '../assets/images/restaurant/maycha.png';
import LotteriaImg from '../assets/images/restaurant/lotteria.png';
import CaliImg from '../assets/images/restaurant/cali.png';
import SabichuongImg from '../assets/images/restaurant/sabichuong.jpg';
import TCHImg from '../assets/images/restaurant/TCH.jpg';
import Bunbohue3AImg from '../assets/images/restaurant/Bunbohue3A.jpg';
import PhoHoaImg from '../assets/images/restaurant/PhoHoa.png';
import ChaybodeImg from '../assets/images/restaurant/chaybode.jpg';
import PizzahutImg from '../assets/images/restaurant/pizzahut.jpg';
import SushikeiImg from '../assets/images/restaurant/sushikei.png';
import ComnieuSaigonImg from '../assets/images/restaurant/comnieusaigon.png';
import SukiyaImg from '../assets/images/restaurant/sukiya.png';
import MandalaImg from '../assets/images/restaurant/mandala.jpg';
import ThaybaImg from '../assets/images/restaurant/thayba.jpg';
import NgogiaImg from '../assets/images/restaurant/ngogia.jpg';

// Map tên file sang URL đã import
const IMAGE_MAP = {
  'Jollibee.png': JollibeeImg,
  'KFC.jpg': KFCImg,
  'Texas.png': TexasImg,
  'phuclong.png': PhucLongImg,
  'highland.png': HighlandImg,
  'maycha.png': MaychaImg,
  'lotteria.png': LotteriaImg,
  'cali.png': CaliImg,
  'sabichuong.jpg': SabichuongImg,
  'TCH.jpg': TCHImg,
  'Bunbohue3A.jpg': Bunbohue3AImg,
  'PhoHoa.png': PhoHoaImg,
  'chaybode.jpg': ChaybodeImg,
  'pizzahut.jpg': PizzahutImg,
  'sushikei.png': SushikeiImg,
  'comnieusaigon.png': ComnieuSaigonImg,
  'sukiya.png': SukiyaImg,
  'mandala.jpg': MandalaImg,
  'thayba.jpg': ThaybaImg,
  'ngogia.jpg': NgogiaImg,
};

// Export RESTAURANTS với image URL cho Web
export const RESTAURANTS = RESTAURANTS_DATA.map(restaurant => ({
  ...restaurant,
  image: IMAGE_MAP[restaurant.imageName] || null,
  // Thêm các field cần thiết
  deliveryTime: '20-30 phút',
  distance: '2 km',
  categories: Array.isArray(restaurant.category) 
    ? restaurant.category 
    : [restaurant.category]
}));