// Web resolver - Map imageName sang đường dẫn URL cho Vite
import { MENU_ITEMS } from './MenuItems';

// Import tất cả ảnh menu
import HamburgerImg from '../assets/images/menu/Hamburger.jpg';
import FriedChickenImg from '../assets/images/menu/FriedChicken.jpg';
import PizzaImg from '../assets/images/menu/Pizza.jpg';
import ChipsImg from '../assets/images/menu/Chips.jpg';
import PastaImg from '../assets/images/menu/Pasta.jpg';
import MatchaImg from '../assets/images/menu/matcha.jpg';
import CheeseburgerImg from '../assets/images/menu/cheeseburger.jpg';
import FriesImg from '../assets/images/menu/fries.jpg';
import ChickenBucketImg from '../assets/images/menu/chickenbucket.jpg';
import ColeslawSaladImg from '../assets/images/menu/ColeslawSalad.jpg';
import HawaiianPizzaImg from '../assets/images/menu/HawaiianPizza.jpg';
import PepperoniPizzaImg from '../assets/images/menu/PepperoniPizza.jpg';
import CapheSuaDaImg from '../assets/images/menu/caphe_suada.jpg';
import TraDaoImg from '../assets/images/menu/tradao.jpg';
import LatteImg from '../assets/images/menu/latte.jpg';
import BacXiuImg from '../assets/images/menu/bacxiu.jpg';
import TraSuaChanTrauImg from '../assets/images/menu/trasuachantrau.jpg';
import ThaiTeaImg from '../assets/images/menu/thaitea.jpg';
import HongTraImg from '../assets/images/menu/hongtra.jpg';
import ComTamImg from '../assets/images/menu/comtam.jpg';
import ComGaImg from '../assets/images/menu/comga.jpg';
import CaKhoToImg from '../assets/images/menu/cakhoto.jpg';
import CanhChuaImg from '../assets/images/menu/canhchua.jpg';
import BunBoHueImg from '../assets/images/menu/bunbohue.jpg';
import BunBoTaiNamImg from '../assets/images/menu/bunbotainam.jpg';
import PhoBoImg from '../assets/images/menu/phobo.jpg';
import PhoGaImg from '../assets/images/menu/phoga.jpg';
import ComChayImg from '../assets/images/menu/comchay.jpg';
import BunRieuChayImg from '../assets/images/menu/bunrieuchay.jpg';
import LauNamChayImg from '../assets/images/menu/launamchay.jpg';
import SushiCaHoiImg from '../assets/images/menu/sushicahoi.jpg';
import SashimiImg from '../assets/images/menu/sashimi.jpg';
import UdonImg from '../assets/images/menu/udon.jpg';
import GyudonImg from '../assets/images/menu/gyudon.jpg';
import CurryRiceImg from '../assets/images/menu/curryrice.jpg';
import CocaColaImg from '../assets/images/menu/cocacola.jpg';
import PepsiImg from '../assets/images/menu/pepsi.jpg';
import SundaeImg from '../assets/images/menu/sundae.jpg';
import OolongImg from '../assets/images/menu/oolong.jpg';
import EspressoImg from '../assets/images/menu/espresso.jpg';
import BanhTamImg from '../assets/images/menu/banhtam.jpg';
import BanhTamDuaCotImg from '../assets/images/menu/banhtamduacot.jpg';
import MilkTeaKemCheeseImg from '../assets/images/menu/milkteakemcheese.jpg';
import MilkTeaOreoImg from '../assets/images/menu/milkteaoreo.jpg';
import ComTamGaNuongImg from '../assets/images/menu/comtamganuong.jpg';
import MiyBoImg from '../assets/images/menu/miybo.jpg';
import HotdogImg from '../assets/images/menu/hotdog.jpg';
import GaSotCayImg from '../assets/images/menu/gasotcay.jpg';
import ZingerImg from '../assets/images/menu/zinger.jpg';

// Map tên file sang URL đã import
const IMAGE_MAP = {
  'Hamburger.jpg': HamburgerImg,
  'FriedChicken.jpg': FriedChickenImg,
  'Pizza.jpg': PizzaImg,
  'Chips.jpg': ChipsImg,
  'Pasta.jpg': PastaImg,
  'matcha.jpg': MatchaImg,
  'cheeseburger.jpg': CheeseburgerImg,
  'fries.jpg': FriesImg,
  'chickenbucket.jpg': ChickenBucketImg,
  'ColeslawSalad.jpg': ColeslawSaladImg,
  'HawaiianPizza.jpg': HawaiianPizzaImg,
  'PepperoniPizza.jpg': PepperoniPizzaImg,
  'caphe_suada.jpg': CapheSuaDaImg,
  'tradao.jpg': TraDaoImg,
  'latte.jpg': LatteImg,
  'bacxiu.jpg': BacXiuImg,
  'trasuachantrau.jpg': TraSuaChanTrauImg,
  'thaitea.jpg': ThaiTeaImg,
  'hongtra.jpg': HongTraImg,
  'comtam.jpg': ComTamImg,
  'comga.jpg': ComGaImg,
  'cakhoto.jpg': CaKhoToImg,
  'canhchua.jpg': CanhChuaImg,
  'bunbohue.jpg': BunBoHueImg,
  'bunbotainam.jpg': BunBoTaiNamImg,
  'phobo.jpg': PhoBoImg,
  'phoga.jpg': PhoGaImg,
  'comchay.jpg': ComChayImg,
  'bunrieuchay.jpg': BunRieuChayImg,
  'launamchay.jpg': LauNamChayImg,
  'sushicahoi.jpg': SushiCaHoiImg,
  'sashimi.jpg': SashimiImg,
  'udon.jpg': UdonImg,
  'gyudon.jpg': GyudonImg,
  'curryrice.jpg': CurryRiceImg,
  'cocacola.jpg': CocaColaImg,
  'pepsi.jpg': PepsiImg,
  'sundae.jpg': SundaeImg,
  'oolong.jpg': OolongImg,
  'espresso.jpg': EspressoImg,
  'banhtam.jpg': BanhTamImg,
  'banhtamduacot.jpg': BanhTamDuaCotImg,
  'milkteakemcheese.jpg': MilkTeaKemCheeseImg,
  'milkteaoreo.jpg': MilkTeaOreoImg,
  'comtamganuong.jpg': ComTamGaNuongImg,
  'miybo.jpg': MiyBoImg,
  'hotdog.jpg': HotdogImg,
  'gasotcay.jpg': GaSotCayImg,
  'zinger.jpg': ZingerImg,
};

// Export MENU_ITEMS với image URL cho Web
export const MENU_ITEMS_WEB = MENU_ITEMS.map(item => ({
  ...item,
  name: item.title, // Map title → name để khớp với MenuItem component
  image: IMAGE_MAP[item.image] || null
}));
