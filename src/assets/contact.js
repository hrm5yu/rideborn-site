// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.querySelector('.btn-text').textContent;
      
      submitBtn.querySelector('.btn-text').textContent = '送信中...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification('メッセージを送信しました！', 'success');
        form.reset();
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
});

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-text">${message}</span>
    <button class="notification-close">×</button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
  
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
}
