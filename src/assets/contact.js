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
      
      // メール送信のためのmailtoリンクを作成
      const subject = encodeURIComponent(`[RIDE BORN お問い合わせ] ${getSubjectText(data.subject)}`);
      const body = encodeURIComponent(`
お名前: ${data.name}
メールアドレス: ${data.email}
件名: ${getSubjectText(data.subject)}

メッセージ:
${data.message}

---
このメッセージはRIDE BORNのウェブサイトから送信されました。
      `.trim());
      
      const mailtoLink = `mailto:info@rideborn.jp?subject=${subject}&body=${body}`;
      
      // メールクライアントを開く
      window.location.href = mailtoLink;
      
      // 成功メッセージを表示
      setTimeout(() => {
        showNotification('メールアプリが開きました。メッセージを確認して送信してください。', 'success');
        form.reset();
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }
});

// 件名のテキストを取得
function getSubjectText(value) {
  const subjects = {
    'general': '一般的なお問い合わせ',
    'business': 'ビジネス提案',
    'collaboration': 'コラボレーション',
    'other': 'その他'
  };
  return subjects[value] || value;
}

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
