const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'hldshop_secret_key'; // Gerçek projede .env ile saklanmalı

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
  name: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Yeni: Sepet ve Sipariş modelleri
const cartItemSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    name: String,
    image: String,
  }],
  date: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

// Kullanıcı kaydı (MongoDB)
app.post('/api/register', async (req, res) => {
  const { username, password, name } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Kullanıcı zaten var.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, name });
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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
    // JWT üret
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Giriş başarılı.', username, token });
  } catch (err) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu.' });
  }
});

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token gerekli.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Geçersiz token.' });
  }
}

// Sunucu başlarken admin/admin kullanıcısı yoksa ekle
async function ensureAdminUser() {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await new User({ username: 'admin', password: hashedPassword, name: 'Admin' }).save();
    console.log('Varsayılan admin/admin kullanıcısı eklendi.');
  }
}

// Sunucu başlarken ürünler koleksiyonu boşsa örnek ürünleri ekle
async function ensureSeedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const seedProducts = [
      // Elektronik
      { name: "Akıllı Telefon", price: 49999, image: "/assets/smartphone.jpg", category: "electronics" },
      { name: "Dizüstü Bilgisayar", price: 39999, image: "/assets/laptop.jpg", category: "electronics" },
      { name: "Akıllı Saat", price: 5999, image: "/assets/smartwatch.jpg", category: "electronics" },
      { name: "Kablosuz Kulaklık", price: 1299, image: "/assets/earbuds.jpg", category: "electronics" },
      // Moda
      { name: "Kot Pantolon", price: 1799, image: "/assets/jeans.jpg", category: "fashion" },
      { name: "Spor Ayakkabı", price: 2999, image: "/assets/sneakers.jpg", category: "fashion" },
      { name: "Tişört", price: 799, image: "/assets/tshirt.jpg", category: "fashion" },
      { name: "Kadın Elbise", price: 1599, image: "/assets/dress.jpg", category: "fashion" },
      // Ev & Yaşam
      { name: "Fritöz", price: 3499, image: "/assets/airfryer.jpg", category: "home" },
      { name: "Kahve Makinesi", price: 2499, image: "/assets/coffeemachine.jpg", category: "home" },
      { name: "Yemek Takımı", price: 1999, image: "/assets/dinnerset.jpg", category: "home" },
      { name: "Blender Seti", price: 899, image: "/assets/blender.jpg", category: "home" },
      // Spor
      { name: "Koşu Ayakkabısı", price: 2199, image: "/assets/runningshoes.jpg", category: "sports" },
      { name: "Futbol Topu", price: 499, image: "/assets/football.jpg", category: "sports" },
      { name: "Yoga Matı", price: 299, image: "/assets/yogamat.jpg", category: "sports" },
      { name: "Spor Çanta", price: 699, image: "/assets/sportsbag.jpg", category: "sports" },
    ];
    await Product.insertMany(seedProducts);
    console.log('Örnek ürünler MongoDB\'ye eklendi.');
  }
}

ensureAdminUser();
ensureSeedProducts();

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

// Ürün arama ve filtreleme endpointi
app.get('/api/products/search', async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let filter = {};
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (category && category !== 'Tümü') filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Arama sırasında hata oluştu.' });
  }
});

// Sepeti görüntüle (MongoDB)
app.get('/api/cart/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`[SEPET ÇEK] Kullanıcı: ${username}`);
  try {
    const cartItems = await CartItem.find({ user: username }).populate('productId');
    const result = cartItems
      .filter(item => item.productId) // Sadece geçerli ürünler
      .map(item => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity
      }));
    console.log(`[SEPET VERİSİ]`, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Sepet alınamadı.' });
  }
});

// Sepete ürün ekle (MongoDB)
app.post('/api/cart/:username', async (req, res) => {
  const { username } = req.params;
  const { productId } = req.body;
  console.log(`[SEPET EKLE] Kullanıcı: ${username}, Ürün: ${productId}`);
  try {
    let item = await CartItem.findOne({ user: username, productId });
    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = new CartItem({ user: username, productId, quantity: 1 });
      await item.save();
    }
    res.json({ message: 'Ürün sepete eklendi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sepete eklenemedi.' });
  }
});

// Sepetten ürün sil (MongoDB)
app.delete('/api/cart/:username/:productId', async (req, res) => {
  const { username, productId } = req.params;
  try {
    let item = await CartItem.findOne({ user: username, productId });
    if (!item) return res.status(404).json({ message: 'Sepet ürünü bulunamadı.' });
    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
    } else {
      await item.deleteOne();
    }
    res.json({ message: 'Ürün sepetten silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sepetten silinemedi.' });
  }
});

// Sipariş oluştur (MongoDB)
app.post('/api/orders/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const cartItems = await CartItem.find({ user: username }).populate('productId');
    if (!cartItems.length) {
      console.log(`[SİPARİŞ HATASI] Sepet boş! Kullanıcı: ${username}, cartItems:`, cartItems);
      return res.status(400).json({ message: 'Sepet boş.' });
    }
    // Sadece productId'si dolu olanları siparişe ekle
    const orderItems = cartItems
      .filter(item => item.productId && item.productId._id)
      .map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        name: item.productId.name,
        image: item.productId.image
      }));
    if (!orderItems.length) {
      console.log(`[SİPARİŞ HATASI] Sepette geçerli ürün yok! Kullanıcı: ${username}`);
      return res.status(400).json({ message: 'Sepette geçerli ürün yok.' });
    }
    const order = new Order({ user: username, items: orderItems });
    await order.save();
    await CartItem.deleteMany({ user: username });
    console.log(`[SİPARİŞ OLUŞTURULDU] Kullanıcı: ${username}, Sipariş:`, order);
    res.json({ message: 'Sipariş oluşturuldu.', order });
  } catch (err) {
    console.error(`[SİPARİŞ HATASI]`, err);
    res.status(500).json({ message: 'Sipariş oluşturulamadı.' });
  }
});

// Siparişleri listele (MongoDB)
app.get('/api/orders/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const orders = await Order.find({ user: username }).sort({ date: -1 });
    console.log(`[SİPARİŞLER GETİR] Kullanıcı: ${username}, Siparişler:`, orders);
    res.json(orders.map(order => ({
      id: order._id,
      date: order.date,
      items: order.items
    })));
  } catch (err) {
    res.status(500).json({ message: 'Siparişler alınamadı.' });
  }
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

// Kullanıcı adını döndür (profil için basit endpoint)
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    res.json({ username: user.username, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcı alınamadı.' });
  }
});

// Dinamik kategoriye göre ürünleri listele
app.get('/api/products/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Kategoriye göre ürünler alınamadı.' });
  }
});

// Geliştirici: Ürünleri ve sepetleri temizle (DİKKAT: Sadece geliştirme için)
app.post('/api/dev/clear', async (req, res) => {
  try {
    await Product.deleteMany({});
    await CartItem.deleteMany({});
    res.json({ message: 'Tüm ürünler ve sepetler silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Temizleme işlemi başarısız.' });
  }
});

// Geliştirici: Belirli bir kullanıcının cartitems verilerini döndür
app.get('/api/dev/cartitems/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const items = await CartItem.find({ user: username });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcıya ait sepet verileri alınamadı.' });
  }
});

// Geliştirici: Test siparişi ekle
app.post('/api/dev/add-order', async (req, res) => {
  try {
    const order = new Order({
      user: req.body.user || 'testuser',
      items: [
        {
          productId: req.body.productId || null,
          quantity: req.body.quantity || 1,
          price: req.body.price || 100,
          name: req.body.name || 'Test Ürün',
          image: req.body.image || ''
        }
      ]
    });
    await order.save();
    res.json({ message: 'Test siparişi eklendi.', order });
  } catch (err) {
    res.status(500).json({ message: 'Test siparişi eklenemedi.' });
  }
});

// Statik dosyaları sun (frontend)
app.use(express.static(path.join(__dirname, '../')));

app.listen(PORT, () => {
  console.log(`Backend API http://localhost:${PORT} adresinde çalışıyor.`);
}); 