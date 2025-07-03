document.addEventListener('DOMContentLoaded', function() {
    // Анимация звёзд в герое
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Обработчики кнопок покупки
    const buyButtons = document.querySelectorAll('#buyButton, #productBuyButton');
    const telegramBotUrl = 'https://t.me/StarsovEarnBot?start=iJZWZF2F8'; // Замените на username вашего бота
    
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
    
    // Плавная прокрутка для якорных ссылок
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
    
    // Анимация при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .product-card, .about-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Инициализация анимаций
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запустить при загрузке для видимых элементов
    
    // Инициализация элементов с анимацией
    const animatedElements = document.querySelectorAll('.step, .product-card, .about-content');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Параллакс эффект для фона
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const starsBackground = document.querySelector('.stars-background');
        starsBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });
});
