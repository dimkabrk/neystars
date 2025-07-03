--Добавление новых товаров

--В разделе product-section (index.html) добавьте новые карточки товаров по образцу:

html
<div class="product-card">
    <div class="product-image">
        <i class="fas fa-gift"></i>
        <div class="stars-count">25</div> <!-- Количество звёзд -->
    </div>
    <div class="product-details">
        <h3>Подарок 25 звёзд</h3>
        <p>Описание товара</p>
        <div class="price">$18.00</div> <!-- Цена -->
        <div class="buy-button" id="product25StarsButton">Купить через Telegram</div>
    </div>
</div>


--В script.js добавьте обработчик для новой кнопки:

javascript
const product25StarsButton = document.getElementById('product25StarsButton');
product25StarsButton.addEventListener('click', function() {
    window.open('https://t.me/your_bot_username?start=25stars', '_blank');
});
