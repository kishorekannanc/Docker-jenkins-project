
import { Restaurant } from './types';

export const CATEGORIES = ['All', 'Pizza', 'Sushi', 'Burgers', 'Salads', 'Desserts', 'Asian'];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'The Pizza Hub',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    image: 'https://picsum.photos/seed/pizza1/600/400',
    categories: ['Pizza', 'Italian'],
    menu: [
      { id: 'm1', name: 'Margherita Pizza', description: 'Fresh basil, mozzarella, and tomato sauce', price: 12.99, image: 'https://picsum.photos/seed/m1/200/200', category: 'Pizza' },
      { id: 'm2', name: 'Pepperoni Feast', description: 'Double pepperoni with extra cheese', price: 15.99, image: 'https://picsum.photos/seed/m2/200/200', category: 'Pizza' },
      { id: 'm3', name: 'Garlic Knots', description: 'Soft knots with garlic butter', price: 5.99, image: 'https://picsum.photos/seed/m3/200/200', category: 'Sides' },
    ]
  },
  {
    id: 'res-2',
    name: 'Sushi Zen',
    rating: 4.9,
    deliveryTime: '30-45 min',
    deliveryFee: 3.50,
    image: 'https://picsum.photos/seed/sushi1/600/400',
    categories: ['Sushi', 'Asian'],
    menu: [
      { id: 'm4', name: 'Salmon Sashimi', description: 'Fresh Atlantic salmon slices', price: 18.50, image: 'https://picsum.photos/seed/m4/200/200', category: 'Sushi' },
      { id: 'm5', name: 'Dragon Roll', description: 'Eel, cucumber, and avocado topping', price: 14.99, image: 'https://picsum.photos/seed/m5/200/200', category: 'Sushi' },
      { id: 'm6', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 4.50, image: 'https://picsum.photos/seed/m6/200/200', category: 'Sides' },
    ]
  },
  {
    id: 'res-3',
    name: 'Burger Palace',
    rating: 4.5,
    deliveryTime: '15-25 min',
    deliveryFee: 0.00,
    image: 'https://picsum.photos/seed/burger1/600/400',
    categories: ['Burgers', 'Fast Food'],
    menu: [
      { id: 'm7', name: 'Classic Cheeseburger', description: 'Angus beef, cheddar, and secret sauce', price: 10.99, image: 'https://picsum.photos/seed/m7/200/200', category: 'Burgers' },
      { id: 'm8', name: 'Truffle Mushroom Burger', description: 'Gourmet truffle oil and sautéed mushrooms', price: 14.50, image: 'https://picsum.photos/seed/m8/200/200', category: 'Burgers' },
      { id: 'm9', name: 'Curly Fries', description: 'Crispy seasoned curly fries', price: 3.99, image: 'https://picsum.photos/seed/m9/200/200', category: 'Sides' },
    ]
  },
  {
    id: 'res-4',
    name: 'Green Leaf Salads',
    rating: 4.7,
    deliveryTime: '20-30 min',
    deliveryFee: 1.50,
    image: 'https://picsum.photos/seed/salad1/600/400',
    categories: ['Salads', 'Healthy'],
    menu: [
      { id: 'm10', name: 'Quinoa Power Bowl', description: 'Quinoa, kale, avocado, and lemon tahini', price: 13.99, image: 'https://picsum.photos/seed/m10/200/200', category: 'Salads' },
      { id: 'm11', name: 'Caesar Salad', description: 'Crisp romaine with parmesan and croutons', price: 11.50, image: 'https://picsum.photos/seed/m11/200/200', category: 'Salads' },
    ]
  }
];
