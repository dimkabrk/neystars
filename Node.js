require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Настройка бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// Middleware
app.use(bodyParser.json());

// Генерация ключа для подписи данных
const generateSignature = (data) => {
  return crypto.createHmac('sha256', process.env.SECRET_KEY)
    .update(JSON.stringify(data))
    .digest('hex');
};

// API endpoint для обработки заказов
app.post('/api/orders', async (req, res) => {
  try {
    const { username, packageData, clientSignature } = req.body;

    // Верификация подписи
    const serverSignature = generateSignature({ username, packageData });
    if (serverSignature !== clientSignature) {
      return res.status(403).json({ error: 'Invalid signature' });
    }

    // Отправка уведомления админу
    const orderId = `ORD-${Date.now()}`;
    await bot.sendMessage(
      ADMIN_CHAT_ID,
      `📦 Новый заказ!\n\n` +
      `ID: ${orderId}\n` +
      `Username: ${username}\n` +
      `Пакет: ${packageData.stars} звёзд\n` +
      `Цена: ${packageData.price} ₽\n\n` +
      `Время: ${new Date().toLocaleString()}`
    );

    res.json({ success: true, orderId });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Защита от сканирования .env
app.get('/.env', (req, res) => {
  res.status(403).send('Access denied');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
