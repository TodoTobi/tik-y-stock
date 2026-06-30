document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  cargarMovimientos();
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
});

async function verificarSesion() {
  const res = await fetch('/api/auth/me');
  const data = await res.json();
  if (!data.success || data.data.rol !== 'superusuario') {
    window.location.href = '/login.html';
  }
}

async function cargarMovimientos() {
  const container = document.getElementById('tableContainer');
  document.getElementById('loading').style.display = 'block';
  const params = new URLSearchParams();
  const tipo = document.getElementById('tipoFilter').value;
  if (tipo) params.set('tipo', tipo);
  const busqueda = document.getElementById('searchInput').value.trim();
  if (busqueda && !isNaN(busqueda)) params.set('id_item', busqueda);
  try {
    const res = await fetch(`/api/movimientos?${params}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    const movs = data.data;
    if (movs.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No hay movimientos registrados</p></div>';
      return;
    }
    container.innerHTML = `<table><thead><tr>
      <th>ID</th><th>Item</th><th>Usuario</th><th>Tipo</th><th>Fecha</th><th>Código</th><th>Devuelto</th>
    </tr></thead><tbody>${movs.map(m => `<tr>
      <td>${m.id}</td>
      <td>${m.item_nombre}</td>
      <td>${m.usuario_nombre}</td>
      <td><span class="badge ${m.tipo === 'retiro' ? 'badge-danger' : 'badge-success'}">${m.tipo}</span></td>
      <td>${new Date(m.fecha_hora).toLocaleString()}</td>
      <td><code style="font-size:12px;">${m.codigo_escaneado || '—'}</code></td>
      <td>${m.tipo === 'retiro' ? (m.devuelto ? '<span class="badge badge-success">Sí</span>' : '<span class="badge badge-danger">No</span>') : '—'}</td>
    </tr>`).join('')}</tbody></table>`;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

async function cerrarSesion() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
