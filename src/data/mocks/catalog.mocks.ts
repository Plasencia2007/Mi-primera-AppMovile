export const CATALOG_MOCKS = {
  CATEGORIES: [
    { id: '1', name: 'Hamburguesas', icon: '🍔', image: require('../../../assets/images/burger.png') },
    { id: '2', name: 'Pizza', icon: '🍕', image: require('../../../assets/images/pizza.png') },
    { id: '3', name: 'Sushi', icon: '🍣', image: require('../../../assets/images/sushi.png') },
    { id: '4', name: 'Ensaladas', icon: '🥗', image: require('../../../assets/images/pizza.png') },
  ],
  FEATURED_ITEMS: [
    {
      id: 'f1',
      name: 'Truffle Dream Burger',
      description: 'Carne premium, trufas frescas y queso fundido.',
      price: 'S/ 45.00',
      rating: '4.9',
      time: '20-30 min',
      image: require('../../../assets/images/burger.png'),
      tag: 'Popular'
    },
    {
      id: 'f2',
      name: 'Pizza Margherita Royal',
      description: 'Mozzarella de búfala y albahaca fresca.',
      price: 'S/ 38.00',
      rating: '4.8',
      time: '15-25 min',
      image: require('../../../assets/images/pizza.png'),
      tag: 'Especial'
    },
    {
      id: 'f3',
      name: 'Omakase Platter',
      description: 'Selección del chef de los mejores cortes.',
      price: 'S/ 65.00',
      rating: '5.0',
      time: '35-45 min',
      image: require('../../../assets/images/sushi.png'),
      tag: 'Premium'
    }
  ]
};
