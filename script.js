document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        paymentLink: "https://www.tinkoff.ru/rm/r_KQkcHeUggc.aUMaYfOFtp/Q1P6h40111",
        apiEndpoint: "/api/orders"
    };

    const buyBtns = document.querySelectorAll('.buy-btn');
    const orderForm = document.getElementById('orderForm');
    const selectedPackage = document.getElementById('selectedPackage');
    const purchaseForm = document.getElementById('purchaseForm');
    const usernameInput = document.getElementById('username');
    const paymentBtn = purchaseForm.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    let currentPackage = null;

    // Обработчики выбора пакета
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
            window.scrollTo({
                top: orderForm.offsetTop - 20,
                behavior: 'smooth'
            });
            usernameInput.focus();
        });
    });

    // Отправка формы
    purchaseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        if (!validateUsername(username)) return;

        try {
            // Активируем состояние загрузки
            paymentBtn.classList.add('loading');
            paymentBtn.disabled = true;
            
            // Отправка данных на сервер
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
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка сервера: ${response.status}`);
            }

            // Открываем платежную систему
            setTimeout(() => {
                window.open(CONFIG.paymentLink, '_blank');
                
                // Сбрасываем форму
                purchaseForm.reset();
                orderForm.style.display = 'none';
                paymentBtn.classList.remove('loading');
                paymentBtn.disabled = false;
            }, 500);

        } catch (error) {
            console.error('Ошибка:', error);
            showAlert(`❌ Ошибка: ${error.message}`);
            paymentBtn.classList.remove('loading');
            paymentBtn.disabled = false;
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
        
        // Сброс ошибок если валидация прошла
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
