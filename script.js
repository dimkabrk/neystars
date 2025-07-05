document.addEventListener('DOMContentLoaded', function() {
    // Инициализация выбора пакета
    const packageItems = document.querySelectorAll('.package-item');
    const orderForm = document.getElementById('orderForm');
    const selectedPackageElement = document.getElementById('selectedPackage');
    const usernameInput = document.getElementById('username');
    
    let selectedPackage = null;

    // Обработчики для кнопок "Выбрать"
    packageItems.forEach(item => {
        const selectBtn = item.querySelector('.buy-btn');
        
        selectBtn.addEventListener('click', function() {
            // Снимаем выделение со всех пакетов
            packageItems.forEach(pkg => pkg.classList.remove('active'));
            
            // Выделяем выбранный пакет
            item.classList.add('active');
            
            // Сохраняем данные пакета
            selectedPackage = {
                stars: this.dataset.stars,
                price: this.dataset.price
            };
            
            // Показываем информацию о выборе
            selectedPackageElement.innerHTML = `
                <strong>Выбранный пакет:</strong><br>
                ${selectedPackage.stars} звёзд за ${selectedPackage.price} ₽
            `;
            
            // Показываем форму заказа
            orderForm.style.display = 'block';
            
            // Плавная прокрутка к форме
            orderForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Фокус на поле ввода
            usernameInput.focus();
            
            console.log('Выбран пакет:', selectedPackage); // Для отладки
        });
    });

    // Обработчик отправки формы
    document.getElementById('purchaseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedPackage) {
            alert('Пожалуйста, выберите пакет!');
            return;
        }
        
        const username = usernameInput.value.trim();
        
        if (!username || !username.startsWith('@')) {
            alert('Введите корректный Telegram @username');
            return;
        }
        
        // Здесь будет код отправки данных
        console.log('Отправка заказа:', { username, ...selectedPackage });
        alert('✅ Заявка отправлена! Проверьте Telegram.');
        
        // Сброс формы
        this.reset();
        orderForm.style.display = 'none';
        packageItems.forEach(pkg => pkg.classList.remove('active'));
        selectedPackage = null;
    });
});
