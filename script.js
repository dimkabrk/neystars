document.addEventListener('DOMContentLoaded', function() {
    // Анимация кнопок
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Здесь добавьте ссылку на ваш Telegram бот
                window.open('https://t.me/your_bot', '_blank');
            }, 200);
        });
    });
});
