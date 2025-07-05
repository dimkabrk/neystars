document.addEventListener('DOMContentLoaded', function() {
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
            submitBtn.innerHTML = '<span class="spinner"></span> Обработка...';

            // Генерация уникального ID заказа
            const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            
            // Шифрование данных (базовый пример, в продакшене используйте более надежные методы)
            const encryptedData = btoa(encodeURIComponent(
                JSON.stringify({
                    orderId: orderId,
                    username: username,
                    stars: currentPackage.stars,
                    price: currentPackage.price,
                    timestamp: new Date().toISOString()
                })
            ));

            // Открытие платежной системы с параметрами
            const paymentUrl = `https://www.tinkoff.ru/rm/r_KQkcHeUggc.aUMaYfOFtp/Q1P6h40111?comment=${encodeURIComponent(orderId + '|' + username)}`;
            const paymentWindow = window.open(paymentUrl, '_blank');
            
            if (!paymentWindow) {
                showAlert('Разрешите всплывающие окна для этого сайта', 'warning');
            }

            // Сброс формы
            purchaseForm.reset();
            orderForm.style.display = 'none';

            // Сохранение данных в localStorage
            localStorage.setItem(orderId, encryptedData);

            showAlert('✅ Заказ оформлен! Проверьте платежную систему.', 'success');

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
        
        // Сброс ошибки
        usernameInput.classList.remove('error');
        errorElement.style.display = 'none';
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
