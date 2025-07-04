// Анимация счетчиков
function animateCounters() {
    const counters = document.querySelectorAll('.stats-grid .stat-value');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
}

// Запуск анимации при скролле
function startCountersWhenVisible() {
    const aboutSection = document.querySelector('.about-section');
    const sectionPosition = aboutSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (sectionPosition < screenPosition) {
        animateCounters();
        window.removeEventListener('scroll', startCountersWhenVisible);
    }
}

window.addEventListener('scroll', startCountersWhenVisible);
document.addEventListener('DOMContentLoaded', startCountersWhenVisible);

/* система отзывов */
document.addEventListener('DOMContentLoaded', function() {
    const reviews = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    function showReview(index) {
        reviews.forEach((review, i) => {
            review.classList.toggle('active', i === index);
        });
    }

    function nextReview() {
        currentIndex = (currentIndex + 1) % reviews.length;
        showReview(currentIndex);
    }

    function prevReview() {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        showReview(currentIndex);
    }

    nextBtn.addEventListener('click', nextReview);
    prevBtn.addEventListener('click', prevReview);

    // Автопереключение каждые 5 секунд
    setInterval(nextReview, 5000);

    // Показать первый отзыв
    showReview(0);
});
