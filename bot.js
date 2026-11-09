const TelegramBot = require('node-telegram-bot-api');

// Вставь токен твоего бота и ID чата администратора
const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const ADMIN_CHAT_ID = 'YOUR_ADMIN_CHAT_ID'; 

const bot = new TelegramBot(TOKEN, { polling: true });

// Обработка данных, пришедших из Mini App
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);
      const customer = data.customer;
      
      let itemsList = '';
      let totalBYN = 0;

      data.items.forEach((item, index) => {
        itemsList += `${index + 1}. ${item.name} (Размер: ${item.size}) — ${item.price} BYN\n`;
        totalBYN += item.price;
      });

      const messageText = `
🛍 **НОВЫЙ ЗАКАЗ!**

👤 **Покупатель:**
• **ФИО:** ${customer.fio}
• **Телефон:** ${customer.phone}
• **Telegram:** ${customer.telegram}

📍 **Доставка:**
• **Страна:** ${customer.country}
• **Город:** ${customer.city}
• **ПВЗ:** ${customer.address}
• **Комментарий:** ${customer.comment || 'Нет'}

📦 **Товары:**
${itemsList}
💰 **Валюта заказа:** ${data.currency}
💵 **Итого:** ~${data.currency === 'BYN' ? totalBYN + ' BYN' : Math.round(totalBYN * 29.5) + ' RUB'}
      `;

      // Отправка уведомления администратору
      bot.sendMessage(ADMIN_CHAT_ID, messageText, { parse_mode: 'Markdown' });

      // Подтверждение пользователю
      bot.sendMessage(msg.chat.id, 'Спасибо за заказ! Администратор свяжется с вами в ближайшее время.');
    } catch (e) {
      console.error('Ошибка обработки заказа:', e);
    }
  }
});