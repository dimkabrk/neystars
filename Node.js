const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

// Только ваш ID для получения заявок
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID;

bot.on('message', (msg) => {
    // Игнорируем все сообщения не от админа
    if (msg.from.id.toString() !== ADMIN_ID.toString()) {
        bot.sendMessage(msg.chat.id, 'Доступ запрещен');
        return;
    }

    // Обработка команд админа
    if (msg.text === '/orders') {
        // Логика получения заказов
    }
});

// Логирование ошибок
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
