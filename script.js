document.addEventListener('DOMContentLoaded', function() {
  // Элементы формы
  const purchaseForm = document.getElementById('purchaseForm');
  
  purchaseForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const packageData = {
      stars: document.querySelector('.package-item.active').dataset.stars,
      price: document.querySelector('.package-item.active').dataset.price
    };

    // Подпись данных (без использования секретного ключа)
    const signature = await generateClientSignature(username, packageData);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, packageData, clientSignature: signature })
      });

      const data = await response.json();
      
      if (data.success) {
        showAlert('✅ Заказ успешно отправлен!', 'success');
      } else {
        showAlert('❌ Ошибка при отправке заказа', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('❌ Ошибка соединения', 'error');
    }
  });

  // Генерация подписи на клиенте (имитация)
  async function generateClientSignature(username, packageData) {
    const dataString = `${username}|${packageData.stars}|${packageData.price}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
});
