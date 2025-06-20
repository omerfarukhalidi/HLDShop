const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Dummy data (örnek veri)
let users = [];
let products = [
  { id: 1, name: 'Ürün 1', price: 100, image: '/assets/product1.jpg', category: 'electronics' },
  { id: 2, name: 'Ürün 2', price: 200, image: '/assets/product2.jpg', category: 'fashion' },
  { id: 3, name: 'Ürün 3', price: 300, image: '/assets/product3.jpg', category: 'home' },
  { id: 4, name: 'Ürün 4', price: 400, image: '/assets/product4.jpg', category: 'electronics' },
];
let carts = {}; // { userId: [productId, ...] }
let orders = {}; // { userId: [order, ...] }

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/hldshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
});

const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Kullanıcı kaydı (MongoDB)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Kullanıcı zaten var.' });
    }
    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'Kayıt başarılı.' });
  } catch (err) {
    res.status(500).json({ message: 'Kayıt sırasında hata oluştu.' });
  }
});

// Kullanıcı girişi (MongoDB)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
    res.json({ message: 'Giriş başarılı.', username });
  } catch (err) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu.' });
  }
});

// Sunucu başlarken admin/admin kullanıcısı yoksa ekle
async function ensureAdminUser() {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await new User({ username: 'admin', password: 'admin' }).save();
    console.log('Varsayılan admin/admin kullanıcısı eklendi.');
  }
}

ensureAdminUser();

// Ürünleri listele (MongoDB'den)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Ürünler alınamadı.' });
  }
});

// Sadece elektronik ürünleri döndür (MongoDB'den)
app.get('/api/products/electronics', async (req, res) => {
  try {
    const electronics = await Product.find({ category: 'electronics' });
    res.json(electronics);
  } catch (err) {
    res.status(500).json({ message: 'Elektronik ürünler alınamadı.' });
  }
});

// Sepeti görüntüle
app.get('/api/cart/:username', (req, res) => {
  const { username } = req.params;
  const cart = carts[username] || [];
  res.json(cart.map(id => products.find(p => p.id === id)));
});

// Sepete ürün ekle
app.post('/api/cart/:username', (req, res) => {
  const { username } = req.params;
  const { productId } = req.body;
  if (!carts[username]) carts[username] = [];
  carts[username].push(productId);
  res.json({ message: 'Ürün sepete eklendi.' });
});

// Sepetten ürün sil
app.delete('/api/cart/:username/:productId', (req, res) => {
  const { username, productId } = req.params;
  if (!carts[username]) return res.status(404).json({ message: 'Sepet bulunamadı.' });
  carts[username] = carts[username].filter(id => id != productId);
  res.json({ message: 'Ürün sepetten silindi.' });
});

// Sipariş oluştur
app.post('/api/orders/:username', (req, res) => {
  const { username } = req.params;
  const cart = carts[username] || [];
  if (cart.length === 0) return res.status(400).json({ message: 'Sepet boş.' });
  if (!orders[username]) orders[username] = [];
  const order = { id: Date.now(), items: cart.map(id => products.find(p => p.id === id)), date: new Date() };
  orders[username].push(order);
  carts[username] = [];
  res.json({ message: 'Sipariş oluşturuldu.', order });
});

// Siparişleri listele
app.get('/api/orders/:username', (req, res) => {
  const { username } = req.params;
  res.json(orders[username] || []);
});

// Yeni ürün ekle
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, category } = req.body;
    const newProduct = new Product({ name, price, image, category });
    await newProduct.save();
    res.status(201).json({ message: 'Ürün başarıyla eklendi.', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Ürün eklenemedi.' });
  }
});

// Statik dosyaları sun (frontend)
app.use(express.static(path.join(__dirname, '../')));

app.listen(PORT, () => {
  console.log(`Backend API http://localhost:${PORT} adresinde çalışıyor.`);
}); 