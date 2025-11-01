// Mobile resolver - Map imageName sang require() cho React Native

import { MENU_ITEMS } from './MenuItems'

// Map tất cả ảnh menu
const MENU_IMAGE_REQUIRE_MAP = {
  'Hamburger.jpg': require('../assets/images/menu/Hamburger.jpg'),
  'FriedChicken.jpg': require('../assets/images/menu/FriedChicken.jpg'),
  'Pizza.jpg': require('../assets/images/menu/Pizza.jpg'),
  'Chips.jpg': require('../assets/images/menu/Chips.jpg'),
  'Pasta.jpg': require('../assets/images/menu/Pasta.jpg'),
  'matcha.jpg': require('../assets/images/menu/matcha.jpg'),
  'cheeseburger.jpg': require('../assets/images/menu/cheeseburger.jpg'),
  'fries.jpg': require('../assets/images/menu/fries.jpg'),
  'chickenbucket.jpg': require('../assets/images/menu/chickenbucket.jpg'),
  'ColeslawSalad.jpg': require('../assets/images/menu/ColeslawSalad.jpg'),
  'HawaiianPizza.jpg': require('../assets/images/menu/HawaiianPizza.jpg'),
  'PepperoniPizza.jpg': require('../assets/images/menu/PepperoniPizza.jpg'),
  'caphe_suada.jpg': require('../assets/images/menu/caphe_suada.jpg'),
  'tradao.jpg': require('../assets/images/menu/tradao.jpg'),
  'latte.jpg': require('../assets/images/menu/latte.jpg'),
  'bacxiu.jpg': require('../assets/images/menu/bacxiu.jpg'),
  'trasuachantrau.jpg': require('../assets/images/menu/trasuachantrau.jpg'),
  'thaitea.jpg': require('../assets/images/menu/thaitea.jpg'),
  'hongtra.jpg': require('../assets/images/menu/hongtra.jpg'),
  'comtam.jpg': require('../assets/images/menu/comtam.jpg'),
  'comga.jpg': require('../assets/images/menu/comga.jpg'),
  'cakhoto.jpg': require('../assets/images/menu/cakhoto.jpg'),
  'canhchua.jpg': require('../assets/images/menu/canhchua.jpg'),
  'bunbohue.jpg': require('../assets/images/menu/bunbohue.jpg'),
  'bunbotainam.jpg': require('../assets/images/menu/bunbotainam.jpg'),
  'phobo.jpg': require('../assets/images/menu/phobo.jpg'),
  'phoga.jpg': require('../assets/images/menu/phoga.jpg'),
  'comchay.jpg': require('../assets/images/menu/comchay.jpg'),
  'bunrieuchay.jpg': require('../assets/images/menu/bunrieuchay.jpg'),
  'launamchay.jpg': require('../assets/images/menu/launamchay.jpg'),
  'sushicahoi.jpg': require('../assets/images/menu/sushicahoi.jpg'),
  'sashimi.jpg': require('../assets/images/menu/sashimi.jpg'),
  'udon.jpg': require('../assets/images/menu/udon.jpg'),
  'gyudon.jpg': require('../assets/images/menu/gyudon.jpg'),
  'curryrice.jpg': require('../assets/images/menu/curryrice.jpg'),
  'cocacola.jpg': require('../assets/images/menu/cocacola.jpg'),
  'pepsi.jpg': require('../assets/images/menu/pepsi.jpg'),
  'sundae.jpg': require('../assets/images/menu/sundae.jpg'),
  'oolong.jpg': require('../assets/images/menu/oolong.jpg'),
  'espresso.jpg': require('../assets/images/menu/espresso.jpg'),
  'banhtam.jpg': require('../assets/images/menu/banhtam.jpg'),
  'banhtamduacot.jpg': require('../assets/images/menu/banhtamduacot.jpg'),
  'milkteakemcheese.jpg': require('../assets/images/menu/milkteakemcheese.jpg'),
  'milkteaoreo.jpg': require('../assets/images/menu/milkteaoreo.jpg'),
  'comtamganuong.jpg': require('../assets/images/menu/comtamganuong.jpg'),
  'miybo.jpg': require('../assets/images/menu/miybo.jpg'),
  'hotdog.jpg': require('../assets/images/menu/hotdog.jpg'),
  'gasotcay.jpg': require('../assets/images/menu/gasotcay.jpg'),
  'zinger.jpg': require('../assets/images/menu/zinger.jpg'),
}

// Export MENU_ITEMS với image đã resolve
export const MENU_ITEMS_RESOLVED = MENU_ITEMS.map(item => ({
  ...item,
  image: MENU_IMAGE_REQUIRE_MAP[item.image] || null
}))