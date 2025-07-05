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
            submitBtn.innerHTML = 'Отправка... <span class="spinner"></span>';

            // Отправка данных в бекенд
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    stars: currentPackage.stars,
                    price: currentPackage.price
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка сервера');
            }

            showAlert('Заявка принята! Открываю страницу оплаты...', 'success');
            setTimeout(() => window.open(CONFIG.paymentLink, '_blank'), 1500);
            
            purchaseForm.reset();
            orderForm.style.display = 'none';
            
        } catch (error) {
            showAlert(error.message);
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
