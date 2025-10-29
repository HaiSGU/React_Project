// Web resolver - Map imageName từ RestaurantsData sang ES6 import cho Vite
import { RESTAURANTS_DATA } from '../../../shared/constants/RestaurantsData';

// Import tất cả ảnh nhà hàng
import JollibeeImg from '../../../shared/assets/images/restaurant/Jollibee.png';
import KFCImg from '../../../shared/assets/images/restaurant/KFC.jpg';
import TexasImg from '../../../shared/assets/images/restaurant/Texas.png';
import PhucLongImg from '../../../shared/assets/images/restaurant/phuclong.png';
import HighlandImg from '../../../shared/assets/images/restaurant/highland.png';
import MaychaImg from '../../../shared/assets/images/restaurant/maycha.png';
import LotteriaImg from '../../../shared/assets/images/restaurant/lotteria.png';
import CaliImg from '../../../shared/assets/images/restaurant/cali.png';
import SabichuongImg from '../../../shared/assets/images/restaurant/sabichuong.jpg';
import TCHImg from '../../../shared/assets/images/restaurant/TCH.jpg';
import Bunbohue3AImg from '../../../shared/assets/images/restaurant/Bunbohue3A.jpg';
import PhoHoaImg from '../../../shared/assets/images/restaurant/PhoHoa.png';
import ChaybodeImg from '../../../shared/assets/images/restaurant/chaybode.jpg';
import PizzahutImg from '../../../shared/assets/images/restaurant/pizzahut.jpg';
import SushikeiImg from '../../../shared/assets/images/restaurant/sushikei.png';
import ComnieusaigonImg from '../../../shared/assets/images/restaurant/comnieusaigon.png';
import SukiyaImg from '../../../shared/assets/images/restaurant/sukiya.png';
import MandalaImg from '../../../shared/assets/images/restaurant/mandala.jpg';
import ThaybaImg from '../../../shared/assets/images/restaurant/thayba.jpg';
import NgogiaImg from '../../../shared/assets/images/restaurant/ngogia.jpg';

// Map tên file ảnh sang ES6 import
const IMAGE_IMPORT_MAP = {
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
  'comnieusaigon.png': ComnieusaigonImg,
  'sukiya.png': SukiyaImg,
  'mandala.jpg': MandalaImg,
  'thayba.jpg': ThaybaImg,
  'ngogia.jpg': NgogiaImg,
};

// Export RESTAURANTS với image đã được resolve bởi ES6 import
export const RESTAURANTS = RESTAURANTS_DATA.map(restaurant => ({
  ...restaurant,
  image: IMAGE_IMPORT_MAP[restaurant.imageName] || null
}));
