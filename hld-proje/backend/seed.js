const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hldshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  featured: Boolean,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const products = [
  // Elektronik
  {
    name: "iPhone 13 Pro",
    description: "Apple iPhone 13 Pro 256GB, Grafit, 6GB RAM, A15 Bionic işlemci",
    price: 42999,
    category: "electronics",
    image: "/assets/smartphone.jpg",
    stock: 50,
    featured: true
  },
  {
    name: "Samsung Galaxy S22 Ultra",
    description: "Samsung Galaxy S22 Ultra 256GB, Phantom Black, 8GB RAM, Exynos 2200",
    price: 34999,
    category: "electronics",
    image: "/assets/laptop.jpg",
    stock: 40,
    featured: false
  },
  {
    name: "MacBook Air M2",
    description: "Apple MacBook Air M2 13.6'' 8GB 256GB SSD, Uzay Grisi",
    price: 39999,
    category: "electronics",
    image: "/assets/smartwatch.jpg",
    stock: 25,
    featured: true
  },
  // Moda
  {
    name: "Kot Pantolon",
    description: "Rahat ve şık kot pantolon.",
    price: 1799,
    category: "fashion",
    image: "/assets/jeans.jpg",
    stock: 100,
    featured: false
  },
  {
    name: "Spor Ayakkabı",
    description: "Günlük kullanıma uygun spor ayakkabı.",
    price: 2999,
    category: "fashion",
    image: "/assets/sneakers.jpg",
    stock: 80,
    featured: false
  },
  {
    name: "Tişört",
    description: "Pamuklu tişört.",
    price: 799,
    category: "fashion",
    image: "/assets/tshirt.jpg",
    stock: 120,
    featured: false
  },
  {
    name: "Kadın Elbise",
    description: "Şık kadın elbise.",
    price: 1599,
    category: "fashion",
    image: "/assets/dress.jpg",
    stock: 60,
    featured: false
  },
  // Ev & Yaşam
  {
    name: "Fritöz",
    description: "Sağlıklı fritöz.",
    price: 3499,
    category: "home",
    image: "/assets/airfryer.jpg",
    stock: 30,
    featured: false
  },
  {
    name: "Kahve Makinesi",
    description: "Otomatik kahve makinesi.",
    price: 2499,
    category: "home",
    image: "/assets/coffeemachine.jpg",
    stock: 20,
    featured: false
  },
  {
    name: "Yemek Takımı",
    description: "24 parça yemek takımı.",
    price: 1999,
    category: "home",
    image: "/assets/dinnerset.jpg",
    stock: 40,
    featured: false
  },
  {
    name: "Blender Seti",
    description: "Çok amaçlı blender seti.",
    price: 899,
    category: "home",
    image: "/assets/blender.jpg",
    stock: 50,
    featured: false
  },
  // Spor
  {
    name: "Koşu Ayakkabısı",
    description: "Rahat koşu ayakkabısı.",
    price: 2199,
    category: "sports",
    image: "/assets/runningshoes.jpg",
    stock: 70,
    featured: false
  },
  {
    name: "Futbol Topu",
    description: "Dayanıklı futbol topu.",
    price: 499,
    category: "sports",
    image: "/assets/football.jpg",
    stock: 90,
    featured: false
  },
  {
    name: "Yoga Matı",
    description: "Kaymaz yoga matı.",
    price: 299,
    category: "sports",
    image: "/assets/yogamat.jpg",
    stock: 60,
    featured: false
  },
  {
    name: "Spor Çanta",
    description: "Büyük boy spor çanta.",
    price: 699,
    category: "sports",
    image: "/assets/sportsbag.jpg",
    stock: 40,
    featured: false
  },
];

async function seedProducts() {
  try {
    await Product.deleteMany({}); // Önce tüm ürünleri sil
    await Product.insertMany(products);
    console.log('Ürünler başarıyla eklendi!');
    process.exit();
  } catch (err) {
    console.error('Hata:', err);
    process.exit(1);
  }
}

seedProducts(); 