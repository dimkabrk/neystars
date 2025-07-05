document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('purchaseForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';

    const orderData = {
      username: document.getElementById('username').value.trim(),
      packageData: {
        stars: document.querySelector('.package-item.active').dataset.stars,
        price: document.querySelector('.package-item.active').dataset.price
      }
    };

    try {
      // Клиентская подпись (без секрета)
      const signature = await generateClientSignature(orderData);
      
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, signature })
      });

      const result = await response.json();
      
      if (result.success) {
        showAlert('✅ Заявка успешно отправлена!', 'success');
        form.reset();
      } else {
        showAlert('❌ Ошибка при отправке', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('⚠️ Ошибка соединения', 'warning');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
    }
  });

  async function generateClientSignature(data) {
    const str = `${data.username}|${data.packageData.stars}|${data.packageData.price}`;
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(str));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
  }
});
