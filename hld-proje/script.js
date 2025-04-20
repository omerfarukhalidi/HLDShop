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