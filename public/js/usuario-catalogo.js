const API = '/api/items';

document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  cargarCatalogo();
  cargarCategorias();
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
});

async function verificarSesion() {
  const res = await fetch('/api/auth/me');
  if (!res.ok) window.location.href = '/login.html';
}

async function cargarCatalogo() {
  const container = document.getElementById('gridContainer');
  document.getElementById('loading').style.display = 'block';
  const params = new URLSearchParams();
  const busqueda = document.getElementById('searchInput').value.trim();
  if (busqueda) params.set('busqueda', busqueda);
  const categoria = document.getElementById('categoriaFilter').value;
  if (categoria) params.set('categoria', categoria);
  if (document.getElementById('soloDisponibles').checked) params.set('estado', 'disponible');
  try {
    const res = await fetch(`${API}?${params}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    const items = data.data;
    const disponibles = items.filter(i => i.cantidad > 0 && i.estado === 'disponible').length;
    document.getElementById('summary').textContent = `${disponibles} de ${items.length} disponibles`;
    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No se encontraron ítems</p></div>';
      return;
    }
    container.innerHTML = items.map(i => `
      <div class="card" onclick="verDetalle(${i.id})">
        ${i.foto_url ? `<img src="${i.foto_url}" alt="${i.nombre}">` : '<div style="height:160px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#ccc;">Sin foto</div>'}
        <div class="card-body">
          <h3>${i.nombre}</h3>
          <p>${i.categoria} · ${i.codigo_escaneable}</p>
          <span class="badge ${i.cantidad > 0 && i.estado === 'disponible' ? 'badge-success' : 'badge-danger'}">${i.cantidad > 0 && i.estado === 'disponible' ? 'Disponible' : 'No disponible'}</span>
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<div class="empty-state"><p>Error al cargar el catálogo</p></div>';
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
}

async function cargarCategorias() {
  try {
    const res = await fetch(`${API}?`);
    const data = await res.json();
    if (!data.success) return;
    const cats = [...new Set(data.data.map(i => i.categoria))].sort();
    const select = document.getElementById('categoriaFilter');
    cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; select.appendChild(o); });
  } catch {}
}

async function verDetalle(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  if (!data.success) return;
  const i = data.data;
  document.getElementById('detailNombre').textContent = i.nombre;
  document.getElementById('detailBody').innerHTML = `
    ${i.foto_url ? `<img src="${i.foto_url}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;">` : ''}
    <p><strong>Categoría:</strong> ${i.categoria}</p>
    <p><strong>Código:</strong> ${i.codigo_escaneable}</p>
    <p><strong>Cantidad:</strong> ${i.cantidad}</p>
    <p><strong>Estado:</strong> <span class="badge ${i.estado === 'disponible' ? 'badge-success' : 'badge-danger'}">${i.estado}</span></p>
    ${i.ubicacion ? `<p><strong>Ubicación:</strong> ${i.ubicacion}</p>` : ''}
    ${i.observaciones ? `<p><strong>Observaciones:</strong> ${i.observaciones}</p>` : ''}
  `;
  document.getElementById('detailModal').classList.add('open');
}

function cerrarDetalle() {
  document.getElementById('detailModal').classList.remove('open');
}

async function cerrarSesion() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
