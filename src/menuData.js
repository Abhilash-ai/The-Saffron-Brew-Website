export const menuCategories = [
  { id: 'all', name: 'All Cravings' },
  { id: 'coffee', name: 'Artisan Coffee' },
  { id: 'desserts', name: 'Nostalgic Desserts' },
  { id: 'snacks', name: 'Warm Snacks' },
  { id: 'specialties', name: 'Saffron Specials' }
];

export const menuItems = [
  {
    id: 'saffron-latte',
    name: 'Signature Saffron Latte',
    description: 'Double shot of luxury espresso infused with handpicked saffron threads, smooth oat milk, and a hint of organic raw honey.',
    price: 6.75,
    rating: 4.9,
    reviews: 142,
    category: 'specialties',
    tags: ['Signature', 'Vegan Option', 'Hot/Cold'],
    image: '/assets/saffron_latte.png',
    featured: true,
    ingredients: ['Espresso', 'Saffron threads', 'Oat milk', 'Raw honey', 'Cardamom hint']
  },
  {
    id: 'caramel-latte',
    name: 'Toasted Caramel Cloud',
    description: 'Creamy espresso latte topped with a mountain of cloud-like whipped cream and slow-drizzled artisanal salted caramel.',
    price: 6.25,
    rating: 4.8,
    reviews: 98,
    category: 'coffee',
    tags: ['Popular', 'Sweet', 'Hot/Cold'],
    image: '/assets/caramel_latte.png',
    featured: true,
    ingredients: ['Espresso', 'Steamed whole milk', 'House caramel syrup', 'Whipped cream', 'Sea salt crystals']
  },
  {
    id: 'berry-pancakes',
    name: 'Soufflé Berry Pancakes',
    description: 'Ultra-fluffy, Japanese-style soufflé pancakes topped with a fresh berry medley, organic maple syrup, and whipped cream.',
    price: 12.50,
    rating: 4.9,
    reviews: 215,
    category: 'desserts',
    tags: ['Nostalgic', 'Must Try'],
    image: '/assets/berry_pancakes.png',
    featured: true,
    ingredients: ['Soufflé batter', 'Fresh strawberries', 'Wild blueberries', 'Maple syrup', 'Sweet cream']
  },
  {
    id: 'choco-fudge',
    name: 'Nostalgic Choco Fudge Cake',
    description: 'A decadent slice of rich, moist chocolate fudge cake coated with glossy dark chocolate glaze, just like childhood birthday parties.',
    price: 8.00,
    rating: 4.7,
    reviews: 86,
    category: 'desserts',
    tags: ['Sweet', 'Warm Serving'],
    image: '/assets/choco_fudge.png',
    featured: true,
    ingredients: ['Belgian dark chocolate', 'Moist cocoa sponge', 'Glossy fudge icing', 'Vanilla bean whip']
  },
  {
    id: 'saffron-matcha',
    name: 'Gold Dust Matcha Latte',
    description: 'Premium ceremonial Uji matcha whisked with oat milk and garnished with a delicate sprinkle of saffron dust and edible gold leaf.',
    price: 7.25,
    rating: 4.8,
    reviews: 64,
    category: 'specialties',
    tags: ['Signature', 'Anti-oxidant', 'Hot/Cold'],
    image: '/assets/saffron_latte.png',
    featured: false,
    ingredients: ['Uji Matcha', 'Oat milk', 'Saffron dust', 'Gold leaf', 'Agave nectar']
  },
  {
    id: 'espresso-macchiato',
    name: 'Double Macchiato',
    description: 'A robust double shot of our signature house blend espresso, marked with a gentle dollop of silky velvety microfoam.',
    price: 4.00,
    rating: 4.6,
    reviews: 57,
    category: 'coffee',
    tags: ['Bold', 'Hot'],
    image: '/assets/gallery_barista.png',
    featured: false,
    ingredients: ['Espresso double shot', 'Microfoam micro']
  },
  {
    id: 'saffron-bun',
    name: 'Warm Saffron Cardamom Bun',
    description: 'Soft, braided Swedish-style cardamom bun baked with golden saffron dough and finished with pearl sugar.',
    price: 5.50,
    rating: 4.9,
    reviews: 110,
    category: 'snacks',
    tags: ['Baked Fresh', 'Best Seller'],
    image: '/assets/berry_pancakes.png',
    featured: false,
    ingredients: ['Yeasted saffron dough', 'Cardamom spice fill', 'Pearl sugar glaze']
  },
  {
    id: 'avocado-shokupan',
    name: 'Saffron Toast & Avocado',
    description: 'Creamy mashed avocado seasoned with sea salt, lemon, and red pepper flakes, served on toasted Japanese shokupan bread.',
    price: 11.00,
    rating: 4.7,
    reviews: 134,
    category: 'snacks',
    tags: ['Healthy', 'Spicy Hint'],
    image: '/assets/hero_cafe.png',
    featured: false,
    ingredients: ['Mashed avocado', 'Japanese Shokupan (milk bread)', 'Saffron aioli', 'Red pepper flakes', 'Lemon zest']
  }
];
