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

// Система отзывов
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('review-modal');
    const openBtn = document.getElementById('open-review-btn');
    const closeBtn = document.querySelector('.close-modal');
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-review');
    const reviewsContainer = document.getElementById('reviews-container');
    
    let currentRating = 0;
    
    // Загрузка одобренных отзывов
    function loadApprovedReviews() {
        fetch('/api/reviews?approved=true')
            .then(response => response.json())
            .then(reviews => {
                reviewsContainer.innerHTML = '';
                reviews.forEach(review => {
                    reviewsContainer.appendChild(createReviewCard(review));
                });
            });
    }
    
    // Создание карточки отзыва
    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        card.innerHTML = `
            <div class="review-header">
                <div class="review-author">${review.author || 'Аноним'}</div>
                <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
            <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
        `;
        
        return card;
    }
    
    // Управление рейтингом
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            currentRating = value;
            
            stars.forEach((s, index) => {
                s.textContent = index < value ? '★' : '☆';
                s.classList.toggle('active', index < value);
            });
        });
    });
    
    // Отправка отзыва
    submitBtn.addEventListener('click', function() {
        const text = document.getElementById('review-text').value.trim();
        
        if (currentRating === 0) {
            alert('Пожалуйста, поставьте оценку');
            return;
        }
        
        if (text.length < 10) {
            alert('Отзыв должен содержать минимум 10 символов');
            return;
        }
        
        const review = {
            rating: currentRating,
            text: text,
            date: new Date().toISOString(),
            approved: false
        };
        
        // Отправка на сервер
        fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review)
        })
        .then(response => {
            if (response.ok) {
                alert('Спасибо! Ваш отзыв отправлен на модерацию.');
                modal.style.display = 'none';
                document.getElementById('review-text').value = '';
                stars.forEach(s => {
                    s.textContent = '☆';
                    s.classList.remove('active');
                });
                currentRating = 0;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке отзыва');
        });
    });
    
    // Управление модальным окном
    openBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Загружаем одобренные отзывы при загрузке страницы
    loadApprovedReviews();
});
