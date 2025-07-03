// Создание мерцающих звезд
function createStars() {
  const starsBg = document.querySelector('.stars-bg');
  const starCount = 150; // Количество звезд
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Случайные параметры звезд
    const size = Math.random() * 3;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.7 + 0.3;
    const duration = Math.random() * 8 + 4;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.setProperty('--opacity', opacity);
    star.style.setProperty('--duration', `${duration}s`);
    
    // Случайная задержка анимации
    star.style.animationDelay = `${Math.random() * 10}s`;
    
    // Случайный цвет (некоторые звезды золотые)
    if (Math.random() > 0.7) {
      star.style.backgroundColor = '#ffd700';
    }
    
    starsBg.appendChild(star);
  }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  createStars();
  
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
