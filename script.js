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
  
  // Анимация кнопок выбора
  buyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Анимация нажатия
      this.classList.add('btn-click-animation');
      setTimeout(() => {
        this.classList.remove('btn-click-animation');
      }, 300);
      
      currentPackage = {
        stars: this.getAttribute('data-stars'),
        price: this.getAttribute('data-price')
      };
      
      // Обновляем отображение выбранного пакета
      selectedPackage.innerHTML = `
        <strong>Выбранный пакет:</strong><br>
        ${currentPackage.stars} звёзд за ${currentPackage.price} ₽
      `;
      
      // Показываем форму с анимацией
      orderForm.style.display = 'block';
      orderForm.classList.add('form-show-animation');
      
      // Плавная прокрутка к форме
      setTimeout(() => {
        orderForm.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
      // Фокусируем поле ввода
      usernameInput.focus();
    });
  });
  
  // Отправка формы
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

    if (!username.startsWith('@')) {
      showAlert('Username должен начинаться с @');
      return;
    }

    if (!currentPackage) {
      showAlert('Пожалуйста, выберите пакет звёзд');
      return;
    }

    try {
      // Анимация загрузки
      const submitBtn = purchaseForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Отправка... <span class="spinner"></span>';
      
      const formData = new FormData();
      formData.append('timestamp', timestamp);
      formData.append('username', username);
      formData.append('package', `${currentPackage.stars} звёзд`);
      formData.append('amount', `${currentPackage.price} ₽`);
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Ошибка сети');
      
      showAlert('Заявка принята! Сейчас вы будете перенаправлены на оплату.', 'success');
      
      // Перенаправление без amount в URL
      setTimeout(() => {
        window.open(SBP_PAYMENT_LINK, '_blank');
      }, 1500);
      
      // Сброс формы
      purchaseForm.reset();
      orderForm.classList.remove('form-show-animation');
      setTimeout(() => {
        orderForm.style.display = 'none';
      }, 300);
      
    } catch (error) {
      console.error('Ошибка:', error);
      showAlert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      const submitBtn = purchaseForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Перейти к оплате';
      }
    }
  });
  
  // Функция показа уведомлений
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
