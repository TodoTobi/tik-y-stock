document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
  document.getElementById('codigoInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscarPorCodigo();
  });
  document.getElementById('btnBuscar').addEventListener('click', buscarPorCodigo);
});

async function verificarSesion() {
  const res = await fetch('/api/auth/me');
  if (!res.ok) window.location.href = '/login.html';
}

let ultimoItem = null;

async function buscarPorCodigo() {
  const codigo = document.getElementById('codigoInput').value.trim();
  if (!codigo) return;
  const resultDiv = document.getElementById('resultado');
  resultDiv.style.display = 'none';
  document.getElementById('loadingScan').style.display = 'block';
  try {
    const res = await fetch(`/api/items?busqueda=${encodeURIComponent(codigo)}`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) {
      mostrarError('Ítem no encontrado. Verificá el código.');
      return;
    }
    const item = data.data.find(i => i.codigo_escaneable === codigo) || data.data[0];
    ultimoItem = item;
    resultDiv.innerHTML = `
      ${item.foto_url ? `<img src="${item.foto_url}" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:12px;">` : ''}
      <h3>${item.nombre}</h3>
      <p><strong>Código:</strong> ${item.codigo_escaneable}</p>
      <p><strong>Categoría:</strong> ${item.categoria}</p>
      <p><strong>Disponible:</strong> ${item.cantidad} unidades</p>
      <p><strong>Estado:</strong> <span class="badge ${item.estado === 'disponible' ? 'badge-success' : 'badge-danger'}">${item.estado}</span></p>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-success" onclick="confirmarRetiro()" ${item.cantidad <= 0 || item.estado !== 'disponible' ? 'disabled' : ''}>Retirar</button>
        <button class="btn btn-primary" onclick="confirmarDevolucion()">Devolver (escaneando código)</button>
      </div>
    `;
    resultDiv.style.display = 'block';
  } catch {
    mostrarError('Error de conexión');
  } finally {
    document.getElementById('loadingScan').style.display = 'none';
  }
}

async function confirmarRetiro() {
  if (!ultimoItem) return;
  document.getElementById('btnRetirar') && (document.getElementById('btnRetirar').disabled = true);
  try {
    const res = await fetch('/api/movimientos/retiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_item: ultimoItem.id, codigo_escaneado: ultimoItem.codigo_escaneable }),
    });
    const data = await res.json();
    if (data.success) {
      mostrarExito('Retiro exitoso');
      ultimoItem = null;
    } else {
      mostrarError(data.message);
    }
  } catch {
    mostrarError('Error de conexión');
  }
}

async function confirmarDevolucion() {
  const codigo = document.getElementById('codigoInput').value.trim();
  if (!codigo) { mostrarError('Escaneá o ingresá un código primero'); return; }
  try {
    const res = await fetch('/api/movimientos?busqueda=' + encodeURIComponent(codigo));
    const data = await res.json();
    if (!data.success) { mostrarError('Error al buscar'); return; }
    const movs = data.data.filter(m => m.tipo === 'retiro' && !m.devuelto);
    if (movs.length === 0) { mostrarError('No hay retiros activos para este ítem'); return; }
    const res2 = await fetch('/api/movimientos/devolucion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_movimiento: movs[0].id }),
    });
    const data2 = await res2.json();
    if (data2.success) mostrarExito('Devolución exitosa');
    else mostrarError(data2.message);
  } catch {
    mostrarError('Error de conexión');
  }
}

function mostrarError(msg) {
  const div = document.getElementById('resultado');
  div.style.display = 'block';
  div.innerHTML = `<div style="color:#dc2626;padding:16px;text-align:center;"><strong>${msg}</strong></div>`;
}

function mostrarExito(msg) {
  const div = document.getElementById('resultado');
  div.style.display = 'block';
  div.innerHTML = `<div style="color:#16a34a;padding:16px;text-align:center;"><strong>${msg}</strong></div>`;
  setTimeout(() => { div.style.display = 'none'; document.getElementById('codigoInput').value = ''; document.getElementById('codigoInput').focus(); }, 2000);
}

async function cerrarSesion() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
