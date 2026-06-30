document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  cargarPrestamos();
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
});

async function verificarSesion() {
  const res = await fetch('/api/auth/me');
  if (!res.ok) window.location.href = '/login.html';
}

async function cargarPrestamos() {
  const container = document.getElementById('tableContainer');
  document.getElementById('loading').style.display = 'block';
  try {
    const res = await fetch('/api/movimientos/mis-prestamos');
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    const prestamos = data.data;
    if (prestamos.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No tenés préstamos activos</p></div>';
      return;
    }
    container.innerHTML = `<table><thead><tr>
      <th>Item</th><th>Código</th><th>Fecha de retiro</th><th>Días</th><th>Acción</th>
    </tr></thead><tbody>${prestamos.map(p => {
      const dias = Math.floor((Date.now() - new Date(p.fecha_hora)) / (1000*60*60*24));
      return `<tr>
        <td><strong>${p.item_nombre}</strong></td>
        <td><code style="font-size:12px;">${p.codigo_escaneado || '—'}</code></td>
        <td>${new Date(p.fecha_hora).toLocaleDateString()}</td>
        <td><span class="badge ${dias > 7 ? 'badge-danger' : dias > 3 ? 'badge-warning' : 'badge-info'}">${dias} días</span></td>
        <td><button class="btn btn-sm btn-success" onclick="devolver(${p.id})">Devolver</button></td>
      </tr>`;
    }).join('')}</tbody></table>`;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

async function devolver(id) {
  try {
    const res = await fetch('/api/movimientos/devolucion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_movimiento: id }),
    });
    const data = await res.json();
    if (data.success) cargarPrestamos();
    else alert(data.message);
  } catch {
    alert('Error de conexión');
  }
}

async function cerrarSesion() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
