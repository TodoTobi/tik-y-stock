const API = '/api/items';

document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  cargarItems();
  cargarCategorias();
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
  document.getElementById('itemForm').addEventListener('submit', guardarItem);
});

async function verificarSesion() {
  const res = await fetch('/api/auth/me');
  const data = await res.json();
  if (!data.success || data.data.rol !== 'superusuario') {
    window.location.href = '/login.html';
  }
}

async function cargarItems() {
  const container = document.getElementById('tableContainer');
  document.getElementById('loading').style.display = 'block';
  const params = new URLSearchParams();
  const busqueda = document.getElementById('searchInput').value.trim();
  if (busqueda) params.set('busqueda', busqueda);
  const categoria = document.getElementById('categoriaFilter').value;
  if (categoria) params.set('categoria', categoria);
  const estado = document.getElementById('estadoFilter').value;
  if (estado) params.set('estado', estado);
  try {
    const res = await fetch(`${API}?${params}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    const items = data.data;
    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No hay ítems registrados</p></div>';
      return;
    }
    container.innerHTML = `<table><thead><tr>
      <th>Foto</th><th>Código</th><th>Nombre</th><th>Categoría</th><th>Cant.</th><th>Estado</th><th>Ubicación</th><th>Acciones</th>
    </tr></thead><tbody>${items.map(i => `<tr>
      <td>${i.foto_url ? `<img src="${i.foto_url}" width="48" height="48" style="object-fit:cover;border-radius:4px;">` : '<span style="color:#ccc;">—</span>'}</td>
      <td><code style="font-size:12px;">${i.codigo_escaneable}</code></td>
      <td><strong>${i.nombre}</strong></td>
      <td>${i.categoria}</td>
      <td>${i.cantidad}</td>
      <td><span class="badge ${i.estado === 'disponible' ? 'badge-success' : i.estado === 'en_uso' ? 'badge-warning' : 'badge-danger'}">${i.estado}</span></td>
      <td>${i.ubicacion || '—'}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarItem(${i.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarItem(${i.id})">Eliminar</button>
      </td>
    </tr>`).join('')}</tbody></table>`;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error al cargar: ${err.message}</p></div>`;
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

function abrirModal(item) {
  document.getElementById('modalTitle').textContent = item ? 'Editar ítem' : 'Nuevo ítem';
  document.getElementById('itemId').value = item ? item.id : '';
  document.getElementById('nombre').value = item ? item.nombre : '';
  document.getElementById('categoria').value = item ? item.categoria : '';
  document.getElementById('cantidad').value = item ? item.cantidad : 1;
  document.getElementById('codigo_escaneable').value = item ? item.codigo_escaneable : '';
  document.getElementById('ubicacion').value = item ? (item.ubicacion || '') : '';
  document.getElementById('estado').value = item ? item.estado : 'disponible';
  document.getElementById('observaciones').value = item ? (item.observaciones || '') : '';
  document.getElementById('foto').value = '';
  document.getElementById('formError').style.display = 'none';
  document.getElementById('itemModal').classList.add('open');
}

function cerrarModal() {
  document.getElementById('itemModal').classList.remove('open');
}

function editarItem(id) {
  fetch(`${API}/${id}`).then(r => r.json()).then(data => {
    if (data.success) abrirModal(data.data);
  });
}

async function eliminarItem(id) {
  if (!confirm('¿Eliminar este ítem?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.success) cargarItems();
  else alert(data.message);
}

async function guardarItem(e) {
  e.preventDefault();
  const id = document.getElementById('itemId').value;
  const fd = new FormData();
  fd.append('nombre', document.getElementById('nombre').value);
  fd.append('categoria', document.getElementById('categoria').value);
  fd.append('cantidad', document.getElementById('cantidad').value);
  fd.append('codigo_escaneable', document.getElementById('codigo_escaneable').value);
  fd.append('ubicacion', document.getElementById('ubicacion').value);
  fd.append('estado', document.getElementById('estado').value);
  fd.append('observaciones', document.getElementById('observaciones').value);
  const foto = document.getElementById('foto').files[0];
  if (foto) fd.append('foto', foto);
  document.getElementById('saveBtn').disabled = true;
  try {
    const res = await fetch(id ? `${API}/${id}` : API, { method: id ? 'PUT' : 'POST', body: fd });
    const data = await res.json();
    if (data.success) { cerrarModal(); cargarItems(); }
    else { document.getElementById('formError').textContent = data.message; document.getElementById('formError').style.display = 'block'; }
  } catch { document.getElementById('formError').textContent = 'Error de conexión'; document.getElementById('formError').style.display = 'block'; }
  finally { document.getElementById('saveBtn').disabled = false; }
}

async function cerrarSesion() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
