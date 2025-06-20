// Sepete ekleme animasyonu
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        // Animasyon efekti
        this.innerHTML = '<i class="fas fa-check"></i> Eklendi';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            this.innerHTML = 'Sepete Ekle';
            this.style.backgroundColor = '#3498db';
        }, 2000);
    });
});

// Arama fonksiyonu
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Arama sayfasına yönlendirme
        window.location.href = `pages/search.html?q=${encodeURIComponent(searchTerm)}`;
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `pages/search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }
});

// Kategori kartları hover efekti
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Sayfa yüklendiğinde animasyon
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.product-card, .category-card');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Anasayfa ürünlerini veritabanından çek ve ekrana bas
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ) {
    document.addEventListener('DOMContentLoaded', () => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(products => {
                const grid = document.querySelector('.featured-products .product-grid');
                if (!grid) return;
                grid.innerHTML = '';
                products.forEach(product => {
                    const div = document.createElement('div');
                    div.className = 'product-card';
                    div.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price.toLocaleString('tr-TR')} TL</p>
                        <button class="add-to-cart">Sepete Ekle</button>
                    `;
                    grid.appendChild(div);
                });
            });
    });
}

// Giriş yaptıysa nav'daki Giriş Yap ve Üye Ol butonlarını gizle
function updateNavForLogin() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    const loginLink = navLinks.querySelector('a[href="pages/login.html"]');
    const registerLink = navLinks.querySelector('a[href="pages/register.html"]');
    let logoutBtn = navLinks.querySelector('.logout-btn');
    if (localStorage.getItem('loggedInUser')) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (!logoutBtn) {
            logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Çıkış Yap';
            logoutBtn.className = 'logout-btn nav-link';
            logoutBtn.style.background = 'none';
            logoutBtn.style.border = 'none';
            logoutBtn.style.cursor = 'pointer';
            logoutBtn.onclick = function() {
                localStorage.removeItem('loggedInUser');
                location.reload();
            };
            navLinks.appendChild(logoutBtn);
        }
    } else {
        if (loginLink) loginLink.style.display = '';
        if (registerLink) registerLink.style.display = '';
        if (logoutBtn) logoutBtn.remove();
    }
}

document.addEventListener('DOMContentLoaded', updateNavForLogin); 