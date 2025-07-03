document.addEventListener('DOMContentLoaded', function() {
    // Анимация кнопок "Купить сейчас"
    const buyButtons = document.querySelectorAll('.buy-btn');
    const telegramBotUrl = 'https://t.me/vtorie_bot';
    
    buyButtons.forEach(button => {
        // Эффект пульсации при наведении
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
        });
        
        // Анимация нажатия
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        // Переход в Telegram
        button.addEventListener('click', function(e) {
            e.preventDefault();
            setTimeout(() => {
                window.open(telegramBotUrl, '_blank');
            }, 300);
        });
    });
    
    // Плавное появление карточек при загрузке
    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});
