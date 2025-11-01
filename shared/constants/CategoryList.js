// Mobile resolver - Map imageName sang require() cho React Native
import { CATEGORIES_DATA } from './CategoriesData';

const IMAGE_REQUIRE_MAP = {
  'food.jpg': require('@shared/assets/images/category/food.jpg'),
  'coffee.jpg': require('@shared/assets/images/category/coffee.jpg'),
  'milktea.jpg': require('@shared/assets/images/category/milktea.jpg'),
  'vegetable.jpg': require('@shared/assets/images/category/vegetable.jpg'),
  'rice.jpg': require('@shared/assets/images/category/rice.jpg'),
  'noodle.jpg': require('@shared/assets/images/category/noodle.jpg'),
  'asia.jpg': require('@shared/assets/images/category/asia.jpg'),
};

export const CATEGORIES = CATEGORIES_DATA.map(category => ({
  ...category,
  icon: IMAGE_REQUIRE_MAP[category.imageName] || null
}));