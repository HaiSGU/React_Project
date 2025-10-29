// Web resolver - Map imageName sang ES6 import cho Vite
import { CATEGORIES_DATA } from '../../../shared/constants/CategoriesData';

import foodImg from '../../../shared/assets/images/category/food.jpg';
import coffeeImg from '../../../shared/assets/images/category/coffee.jpg';
import milkteaImg from '../../../shared/assets/images/category/milktea.jpg';
import vegetableImg from '../../../shared/assets/images/category/vegetable.jpg';
import riceImg from '../../../shared/assets/images/category/rice.jpg';
import noodleImg from '../../../shared/assets/images/category/noodle.jpg';
import asiaImg from '../../../shared/assets/images/category/asia.jpg';

const IMAGE_IMPORT_MAP = {
  'food.jpg': foodImg,
  'coffee.jpg': coffeeImg,
  'milktea.jpg': milkteaImg,
  'vegetable.jpg': vegetableImg,
  'rice.jpg': riceImg,
  'noodle.jpg': noodleImg,
  'asia.jpg': asiaImg,
};

export const CATEGORIES = CATEGORIES_DATA.map(category => ({
  ...category,
  icon: IMAGE_IMPORT_MAP[category.imageName] || ''
}));
