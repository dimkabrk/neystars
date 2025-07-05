require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// В server.js после инициализации бота
bot.setWebHook(); // Явно отключаем вебхуки
console.log('Bot running in polling mode for single user');

// Middleware
app.use(bodyParser.json());

// Генерация HMAC подписи
const generateSignature = (data) => {
  return crypto.createHmac('sha256', process.env.SECRET_KEY)
    .update(JSON.stringify(data))
    .digest('hex');
};

// Endpoint для обработки заказов
app.post('/api/submit-order', async (req, res) => {
  try {
    const { username, packageData, signature } = req.body;

    // Верификация подписи
    const validSignature = generateSignature({ username, ...packageData });
    if (signature !== validSignature) {
      return res.status(403).json({ error: 'Invalid request signature' });
    }
    
// Перед отправкой сообщения
if (process.env.NODE_ENV === 'production') {
  bot.sendMessage(process.env.YOUR_TELEGRAM_ID, 'Бот запущен в продакшн режиме');
}
    
    // Отправка сообщения напрямую вам
    await bot.sendMessage(
      process.env.YOUR_TELEGRAM_ID,
      `🛒 Новая заявка:\n\n` +
      `👤 Пользователь: ${username}\n` +
      `⭐ Пакет: ${packageData.stars} звёзд\n` +
      `💰 Сумма: ${packageData.price} ₽\n` +
      `🕒 ${new Date().toLocaleString()}\n\n` +
      `📝 ID: ${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Защита от сканирования .env
app.get('/.env*', (req, res) => res.status(403).send('Access denied'));

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
