document.addEventListener('DOMContentLoaded', function() {
    // Обработчики кнопок
    const buyButtons = document.querySelectorAll('.buy-button, .cta-button');
    const telegramBotUrl = 'https://t.me/vtorie_bot';
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Перенаправление в Telegram
                window.open(telegramBotUrl, '_blank');
            }, 200);
        });
    });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
