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

// Показать/скрыть все пакеты
function toggleAdditionalPackages() {
    const showAllBtn = document.getElementById('showAllPackages');
    const additionalPackages = document.getElementById('additionalPackages');
    
    showAllBtn.addEventListener('click', function() {
        additionalPackages.classList.toggle('active');
        this.textContent = additionalPackages.classList.contains('active') ? 
            'Скрыть пакеты' : 'Показать все пакеты';
    });
}

// Обработка кнопок "Купить сейчас"
function handleBuyButtons() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const orderSection = document.getElementById('orderSection');
    const starsInput = document.getElementById('stars-amount');
    const priceDisplay = document.getElementById('total-price');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stars = this.getAttribute('data-stars');
            const price = this.getAttribute('data-price');
            
            // Устанавливаем значения в форму
            starsInput.value = stars;
            priceDisplay.textContent = price + ' ₽';
            
            // Прокрутка к форме с анимацией
            orderSection.scrollIntoView({ behavior: 'smooth' });
            orderSection.classList.add('scroll-animation');
            
            // Удаляем класс анимации после завершения
            setTimeout(() => {
                orderSection.classList.remove('scroll-animation');
            }, 1500);
        });
    });
}

// Валидация формы
function setupFormValidation() {
    const usernameInput = document.getElementById('telegram-username');
    const starsInput = document.getElementById('stars-amount');
    const usernameError = document.getElementById('username-error');
    const starsError = document.getElementById('stars-error');
    const submitBtn = document.getElementById('submitOrder');
    const SBP_PAYMENT_LINK = "https://www.tinkoff.ru/rm/r_KQkcHeUggc.aUMaYfOFtp/Q1P6h40111?amount=";
    
    // Валидация при вводе
    usernameInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError(usernameError, 'Введите имя пользователя');
        } else if (!/^[a-zA-Z0-9_]+$/.test(this.value.trim())) {
            showError(usernameError, 'Только латинские буквы, цифры и _');
        } else {
            clearError(usernameError);
        }
    });
    
    starsInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (isNaN(value) || value < 50) {
            showError(starsError, 'Минимальное количество - 50 звёзд');
        } else {
            clearError(starsError);
            updateTotalPrice(value);
        }
    });
    
    // Отправка формы
    submitBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const stars = parseInt(starsInput.value);
        let isValid = true;
        
        // Валидация имени пользователя
        if (username === '') {
            showError(usernameError, 'Введите имя пользователя');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showError(usernameError, 'Только латинские буквы, цифры и _');
            isValid = false;
        }
        
        // Валидация количества звезд
        if (isNaN(stars) {
            showError(starsError, 'Введите количество звёзд');
            isValid = false;
        } else if (stars < 50) {
            showError(starsError, 'Минимальное количество - 50 звёзд');
            isValid = false;
        }
        
        if (isValid) {
            const price = calculatePrice(stars);
            window.open(SBP_PAYMENT_LINK + price, '_blank');
            
            // Отправка данных в Google Таблицы
            const formData = new FormData();
            formData.append('username', '@' + username);
            formData.append('package', `${stars} звёзд за ${price} ₽`);
            
            fetch('https://script.google.com/macros/s/AKfycbzdTaFPsIrez0mBYvTGnCry0TxCSpNMD3_Y98sMUxzWTQhMFWjMO_LbnInN00qhZ-CW/exec', {
                method: 'POST',
                body: formData
            }).catch(error => console.error('Error:', error));
        }
    });
    
    // Функции для работы с ошибками
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('active');
        element.previousElementSibling.classList.add('error');
    }
    
    function clearError(element) {
        element.textContent = '';
        element.classList.remove('active');
        element.previousElementSibling.classList.remove('error');
    }
    
    // Расчет цены
    function calculatePrice(stars) {
        // Здесь можно добавить логику расчета цены
        // Пока просто используем базовую цену (1.64 ₽ за звезду)
        return Math.round(stars * 1.64);
    }
    
    function updateTotalPrice(stars) {
        const price = calculatePrice(stars);
        document.getElementById('total-price').textContent = price + ' ₽';
    }
}

// Вспомогательные функции
function showError(element, message) {
    element.textContent = message;
    element.classList.add('active');
    element.previousElementSibling.querySelector('input').classList.add('error');
}

function clearError(element) {
    element.textContent = '';
    element.classList.remove('active');
    element.previousElementSibling.querySelector('input').classList.remove('error');
}

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', function() {
    startCountersWhenVisible();
    window.addEventListener('scroll', startCountersWhenVisible);
    toggleAdditionalPackages();
    handleBuyButtons();
    setupFormValidation();
});
