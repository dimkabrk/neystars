document.addEventListener('DOMContentLoaded', function() {
  // Конфигурация
  const SBP_PAYMENT_LINK = "https://www.tinkoff.ru/rm/r_KQkcHeUggc.aUMaYfOFtp/Q1P6h40111";
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0m8uskb9_ThPhNdVtszSagTQ6x5i7LY0UvO0lR42eHW3-FJzmwhfrrP_z34sZuax0/exec";
  
  // Элементы
  const buyBtns = document.querySelectorAll('.buy-btn');
  const orderForm = document.getElementById('orderForm');
  const selectedPackage = document.getElementById('selectedPackage');
  const purchaseForm = document.getElementById('purchaseForm');
  const usernameInput = document.getElementById('username');
  
  // Текущий выбранный пакет
  let currentPackage = null;
  
  // Обработчики выбора пакета
  buyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      currentPackage = {
        stars: this.getAttribute('data-stars'),
        price: this.getAttribute('data-price')
      };
      
      // Обновляем отображение выбранного пакета
      selectedPackage.innerHTML = `
        <strong>Выбранный пакет:</strong><br>
        ${currentPackage.stars} звёзд за ${currentPackage.price} ₽
      `;
      
      // Показываем форму
      orderForm.style.display = 'block';
      
      // Плавная прокрутка к форме
      orderForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Фокусируем поле ввода
      usernameInput.focus();
    });
  });
  
 purchaseForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Получаем текущую дату и время
  const now = new Date();
  const timestamp = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Валидация
  const username = usernameInput.value.trim();
  if (!username) {
    showAlert('Пожалуйста, введите ваш Telegram username');
    return;
  }

  if (!currentPackage) {
    showAlert('Пожалуйста, выберите пакет звёзд');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('timestamp', timestamp); // Добавляем метку времени
    formData.append('username', username);
    formData.append('package', `${currentPackage.stars} звёзд`);
    formData.append('amount', `${currentPackage.price} ₽`);
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Ошибка сети');
    
    showAlert('Заявка принята! Сейчас вы будете перенаправлены на оплату.', 'success');
    setTimeout(() => {
      window.open(SBP_PAYMENT_LINK + currentPackage.price, '_blank');
    }, 1500);
    
    purchaseForm.reset();
    orderForm.style.display = 'none';
    
  } catch (error) {
    console.error('Ошибка:', error);
    showAlert('Произошла ошибка при отправке заявки');
  }
});
    
    try {
      // Подготовка данных
      const formData = new FormData();
      formData.append('date', new Date().toLocaleString());
      formData.append('username', username);
      formData.append('package', `${currentPackage.stars} звёзд`);
      formData.append('amount', `${currentPackage.price} ₽`);
      
      // Отправка в Google Таблицы
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Ошибка сети');
      
      // Перенаправление на оплату
      showAlert('Заявка принята! Сейчас вы будете перенаправлены на оплату.', 'success');
      setTimeout(() => {
        window.open(SBP_PAYMENT_LINK + currentPackage.price, '_blank');
      }, 1500);
      
      // Сброс формы
      purchaseForm.reset();
      orderForm.style.display = 'none';
      
    } catch (error) {
      console.error('Ошибка:', error);
      showAlert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    }
  });
  
  // Вспомогательная функция для показа уведомлений
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
