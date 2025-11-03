// Web resolver - Map imageName sang import cho Vite
import { CATEGORIES_DATA } from './CategoriesData';

// Import ảnh categories
import FoodImg from '../assets/images/category/food.jpg';
import CoffeeImg from '../assets/images/category/coffee.jpg';
import MilkteaImg from '../assets/images/category/milktea.jpg';
import VegetableImg from '../assets/images/category/vegetable.jpg';
import RiceImg from '../assets/images/category/rice.jpg';
import NoodleImg from '../assets/images/category/noodle.jpg';
import AsiaImg from '../assets/images/category/asia.jpg';

const IMAGE_MAP = {
  'food.jpg': FoodImg,
  'coffee.jpg': CoffeeImg,
  'milktea.jpg': MilkteaImg,
  'vegetable.jpg': VegetableImg,
  'rice.jpg': RiceImg,
  'noodle.jpg': NoodleImg,
  'asia.jpg': AsiaImg,
};

export const CATEGORIES = CATEGORIES_DATA.map(category => ({
  ...category,
  image: IMAGE_MAP[category.imageName] || null
}));
