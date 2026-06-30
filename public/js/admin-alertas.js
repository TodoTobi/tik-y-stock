document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  cargarAlertas();
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
});

async function verificarSesion() {
  const res = await fetch('/api/auth/me');
  const data = await res.json();
  if (!data.success || data.data.rol !== 'superusuario') {
    window.location.href = '/login.html';
  }
}

async function cargarAlertas() {
  const container = document.getElementById('tableContainer');
  document.getElementById('loading').style.display = 'block';
  try {
    const res = await fetch('/api/alertas');
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    const alertas = data.data;
    document.querySelector('h2').textContent = `Alertas de Devolución Vencida (${alertas.length})`;
    if (alertas.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No hay alertas pendientes</p></div>';
      return;
    }
    container.innerHTML = `<table><thead><tr>
      <th>Item</th><th>Código</th><th>Alumno</th><th>Email</th><th>Fecha retiro</th><th>Días vencido</th><th>Acción</th>
    </tr></thead><tbody>${alertas.map(a => {
      const dias = Math.floor((Date.now() - new Date(a.fecha_hora)) / (1000*60*60*24));
      return `<tr>
        <td><strong>${a.item_nombre}</strong></td>
        <td><code style="font-size:12px;">${a.item_codigo}</code></td>
        <td>${a.usuario_nombre}</td>
        <td>${a.usuario_email}</td>
        <td>${new Date(a.fecha_hora).toLocaleDateString()}</td>
        <td><span class="badge badge-danger">${dias} días</span></td>
        <td><button class="btn btn-sm btn-success" onclick="resolver(${a.id})">Resolver</button></td>
      </tr>`;
    }).join('')}</tbody></table>`;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

async function resolver(id) {
  if (!confirm('¿Marcar como devuelto?')) return;
  try {
    const res = await fetch(`/api/alertas/${id}/resolver`, { method: 'POST' });
    const data = await res.json();
    if (data.success) cargarAlertas();
    else alert(data.message);
  } catch {
    alert('Error de conexión');
  }
}

async function cerrarSesion() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
