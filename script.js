// Анимация счетчиков
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
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
