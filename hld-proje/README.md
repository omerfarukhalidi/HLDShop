# HLD Shop

Modern ve güvenli bir e-ticaret uygulaması örneği.

## Özellikler
- Kullanıcı kaydı ve girişi (JWT ile güvenli)
- Ürün listeleme, arama ve filtreleme
- Sepet yönetimi (kalıcı, kullanıcıya özel)
- Sipariş oluşturma ve geçmişi görüntüleme
- Admin için ürün ekleme (API)
- Tamamen responsive frontend

## Kurulum

1. **Gereksinimler:**
   - Node.js 18+
   - MongoDB (localhost:27017'de çalışmalı)

2. **Backend'i başlat:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Veritabanına örnek ürün eklemek için:**
   ```bash
   node seed.js
   ```

4. **Frontend'i aç:**
   - `index.html` dosyasını tarayıcıda açın veya bir live server ile çalıştırın.

## Proje Mimarisi

- **backend/**: Node.js + Express + MongoDB API
- **pages/**: Frontend HTML sayfaları
- **assets/**: Görseller
- **script.js**: Ortak frontend JS
- **styles.css**: Ortak stil dosyası

## Temel API Endpointleri

- `POST   /api/register`   → Kullanıcı kaydı (username, password, name)
- `POST   /api/login`      → Giriş (JWT döner)
- `GET    /api/products`   → Tüm ürünler
- `GET    /api/products/search?name=...&category=...&minPrice=...&maxPrice=...` → Arama/filtreleme
- `GET    /api/cart/:username` (JWT)
- `POST   /api/cart/:username` (JWT)
- `DELETE /api/cart/:username/:productId` (JWT)
- `POST   /api/orders/:username` (JWT)
- `GET    /api/orders/:username` (JWT)

## Güvenlik
- Şifreler hashlenir (bcryptjs)
- JWT ile oturum yönetimi
- Sepet ve sipariş endpointleri JWT ile korunur

## Katkı
Pull request ve issue açabilirsiniz.

## Lisans
MIT
