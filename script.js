document.addEventListener('DOMContentLoaded', function() {
    // Обработчики кнопок
    const buyButtons = document.querySelectorAll('.buy-btn');
    const telegramBotUrl = 'https://t.me/vtorie_bot'; // Замените на ваш URL
    
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
});
