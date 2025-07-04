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
    
    const username = usernameInput.value.trim();
    const usernameError = document.getElementById('usernameError');
    
    // Сбрасываем ошибки
    usernameInput.classList.remove('error');
    usernameError.style.display = 'none';
    
    // Валидация
    if (!username) {
      showInputError(usernameInput, usernameError, 'Пожалуйста, введите ваш Telegram username');
      return;
    }

    if (!username.startsWith('@')) {
      showInputError(usernameInput, usernameError, 'Username должен начинаться с @');
      return;
    }

    if (username.length < 5) {
      showInputError(usernameInput, usernameError, 'Username слишком короткий');
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
 // Функция для показа ошибки в поле ввода
  function showInputError(inputElement, errorElement, message) {
    inputElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.focus();
  }

  // Создаем мерцающие звёзды на фоне
  createStars();
});

// Создание анимированных звёзд
function createStars() {
  const starsBg = document.querySelector('.stars-bg');
  const starCount = 20;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'large-star';
    
    // Случайные параметры для звёзд
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 3;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;
    
    starsBg.appendChild(star);
  }
}
