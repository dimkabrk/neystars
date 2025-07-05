document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация (Кириллу сюда вход запрещен)
    const CONFIG = {
        paymentLink: "https://www.tinkoff.ru/rm/r_KQkcHeUggc.aUMaYfOFtp/Q1P6h40111",
        apiEndpoint: "/api/orders"  // Относительный путь для проксирования
    };

    // Элементы DOM
    const buyBtns = document.querySelectorAll('.buy-btn');
    const orderForm = document.getElementById('orderForm');
    const selectedPackage = document.getElementById('selectedPackage');
    const purchaseForm = document.getElementById('purchaseForm');
    const usernameInput = document.getElementById('username');
    let currentPackage = null;

    // Обработчики событий
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentPackage = {
                stars: this.getAttribute('data-stars'),
                price: this.getAttribute('data-price')
            };
            
            selectedPackage.innerHTML = `
                <strong>Выбранный пакет:</strong><br>
                ${currentPackage.stars} звёзд за ${currentPackage.price} ₽
            `;
            
            orderForm.style.display = 'block';
            usernameInput.focus();
        });
    });

    // Отправка формы
purchaseForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    if (!validateUsername(username)) return;

    try {
        const submitBtn = purchaseForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        
        // 1. Показываем лоадер
        submitBtn.innerHTML = '<span class="spinner"></span> Обработка...';

        // 2. Отправка данных
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                stars: currentPackage.stars,
                price: currentPackage.price
            })
        });

        // 3. Проверка ответа
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // 4. Успешная обработка
        showAlert('✅ Заказ оформлен! Открываю платежную систему...', 'success');
        
        // 5. Открытие оплаты в новом окне
        const paymentWindow = window.open(CONFIG.paymentLink, '_blank');
        if (!paymentWindow) {
            showAlert('Разрешите всплывающие окна для этого сайта', 'warning');
        }

        // 6. Сброс формы
        purchaseForm.reset();
        orderForm.style.display = 'none';

    } catch (error) {
        console.error('Ошибка:', error);
        showAlert(`❌ Ошибка: ${error.message}`);
    } finally {
        const submitBtn = purchaseForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Перейти к оплате';
        }
    }
});

    // Валидация username
    function validateUsername(username) {
        const errorElement = document.getElementById('usernameError');
        
        if (!username) {
            showError('Пожалуйста, введите ваш Telegram username');
            return false;
        }
        if (!username.startsWith('@')) {
            showError('Username должен начинаться с @');
            return false;
        }
        if (username.length < 5) {
            showError('Username слишком короткий');
            return false;
        }
        
        function showError(message) {
            usernameInput.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            usernameInput.focus();
        }
        
        return true;
    }

    // Вспомогательные функции
    function showAlert(message, type = 'error') {
        const alertBox = document.createElement('div');
        alertBox.className = `alert-box ${type}`;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 300);
        }, 3000);
    }
});
