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
  {
    name: "iPhone 13 Pro",
    description: "Apple iPhone 13 Pro 256GB, Grafit, 6GB RAM, A15 Bionic işlemci",
    price: 42999,
    category: "electronics",
    image: "/assets/product1.jpg",
    stock: 50,
    featured: true
  },
  {
    name: "Samsung Galaxy S22 Ultra",
    description: "Samsung Galaxy S22 Ultra 256GB, Phantom Black, 8GB RAM, Exynos 2200",
    price: 34999,
    category: "electronics",
    image: "/assets/product2.jpg",
    stock: 40,
    featured: false
  },
  {
    name: "MacBook Air M2",
    description: "Apple MacBook Air M2 13.6'' 8GB 256GB SSD, Uzay Grisi",
    price: 39999,
    category: "electronics",
    image: "/assets/product3.jpg",
    stock: 25,
    featured: true
  },
  // Diğer ürünleri buraya ekleyebilirsin
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