const API = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.remove('visible');
    submitBtn.disabled = true;

    const isLogin = form.id === 'loginForm';
    const body = isLogin
      ? { email: form.email.value.trim(), password: form.password.value }
      : { nombre: form.nombre.value.trim(), email: form.email.value.trim(), password: form.password.value };

    try {
      const res = await fetch(isLogin ? `${API}/login` : `${API}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (isLogin) {
          window.location.href = data.data.rol === 'superusuario' ? '/admin/movimientos.html' : '/usuario/catalogo.html';
        } else {
          window.location.href = 'login.html';
        }
      } else {
        errorMsg.textContent = data.message;
        errorMsg.classList.add('visible');
      }
    } catch {
      errorMsg.textContent = 'Error de conexión con el servidor';
      errorMsg.classList.add('visible');
    } finally {
      submitBtn.disabled = false;
    }
  });
});
