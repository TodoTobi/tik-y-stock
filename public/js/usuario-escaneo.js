let html5QrCode = null;
let ultimoItem = null;

document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
  iniciarCamara();
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

function iniciarCamara() {
  const readerEl = document.getElementById('reader');
  if (typeof Html5Qrcode === 'undefined') {
    readerEl.innerHTML = '<p style="color:#9ca3af;">Librería de escaneo no disponible. Usá el input manual.</p>';
    return;
  }
  html5QrCode = new Html5Qrcode('reader');
  html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    onScanSuccess,
    () => {}
  ).catch(() => {
    readerEl.innerHTML = '<p style="color:#9ca3af;">Cámara no disponible. Usá el input manual.</p>';
  });
}

function onScanSuccess(decodedText) {
  if (html5QrCode) html5QrCode.stop().catch(() => {});
  document.getElementById('codigoInput').value = decodedText;
  buscarPorCodigo();
}

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
        <button class="btn btn-success" id="btnRetirar" onclick="confirmarRetiro()" ${item.cantidad <= 0 || item.estado !== 'disponible' ? 'disabled' : ''}>Retirar</button>
        <button class="btn btn-primary" onclick="buscarYDevolver()">Devolver</button>
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
  const btn = document.getElementById('btnRetirar');
  if (btn) btn.disabled = true;
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

async function buscarYDevolver() {
  if (!ultimoItem) { mostrarError('Escaneá o ingresá un código primero'); return; }
  try {
    const res = await fetch('/api/movimientos/mis-prestamos');
    const data = await res.json();
    if (!data.success) { mostrarError('Error al buscar préstamos'); return; }
    const mov = data.data.find(m => m.id_item === ultimoItem.id && m.tipo === 'retiro' && !m.devuelto);
    if (!mov) { mostrarError('No tenés un retiro activo de este ítem'); return; }
    const res2 = await fetch('/api/movimientos/devolucion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_movimiento: mov.id }),
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
  setTimeout(() => { div.style.display = 'none'; document.getElementById('codigoInput').value = ''; document.getElementById('codigoInput').focus(); if (html5QrCode) html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, onScanSuccess, () => {}).catch(() => {}); }, 2000);
}

async function cerrarSesion() {
  if (html5QrCode) await html5QrCode.stop().catch(() => {});
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}
