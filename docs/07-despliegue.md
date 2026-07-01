# Despliegue — TIC & Stock

> El sistema corre 100% en la red local del taller. Sin internet, sin cloud, sin hosting pago.

---

## Requisitos del Servidor

- **Sistema operativo:** Windows 10/11, Linux o macOS
- **Node.js:** v18+ (LTS recomendada)
- **MySQL:** 8.x
- **RAM:** Mínimo 512MB libres (el sistema es liviano)
- **Red:** Conexión Wi-Fi o Ethernet al router del taller

---

## Instalación (primera vez)

```bash
# 1. Clonar o copiar el proyecto
git clone <url-del-repo> tic-stock
cd tic-stock

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env (copiar de .env.example)
# Editar con los datos de la BD local
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tic_stock
SESSION_SECRET=generar_un_seguro_aqui
PORT=4000
EOF

# 4. Crear base de datos
mysql -u root -p -e "CREATE DATABASE tic_stock;"

# 5. Importar esquema
mysql -u root -p tic_stock < database/schema.sql

# 6. (Opcional) Cargar datos de demo
mysql -u root -p tic_stock < database/seed.sql

# 7. Instalar dependencias de test
npm install --save-dev supertest

# 8. Iniciar servidor
npm run dev
```

---

## Acceso desde la Red Local

### En la máquina servidor

```bash
# Obtener IP local:
# Windows:
ipconfig | findstr "IPv4"
# Linux:
ip addr show | grep "inet "
# macOS:
ifconfig | grep "inet "

npm run dev
```

### ⚠️ Importante: IPv6 vs IPv4

El servidor escucha en `localhost` (`server.js:53`). En Windows con Node.js, `localhost` puede resolver a `[::1]` (IPv6), lo que **bloquea** el acceso via `127.0.0.1`.

**Síntoma**: El servidor inicia sin error pero `http://127.0.0.1:4000` no carga.

**Soluciones**:
1. **Acceder via IPv6**: Usar `http://[::1]:4000` en el navegador (funciona en la misma máquina)
2. **Forzar IPv4**: Cambiar `'localhost'` por `'0.0.0.0'` en `server.js:53` y reiniciar. Esto permite acceso via `127.0.0.1` y la IP local de red (`192.168.x.x`)
3. **Verificar bind**: `netstat -an | findstr :4000` — si solo aparece `[::1]:4000`, está bound a IPv6; si aparece `0.0.0.0:4000`, escucha en ambas

### Desde otros dispositivos (celulares, otras PCs)

```
http://[IP-DEL-SERVIDOR]:4000
```

Ejemplo: `http://192.168.1.100:4000`

---

## Ejecución Diaria

```bash
# Asegurar que MySQL está corriendo
# En Windows: net start MySQL80  (o el nombre del servicio)
# En Linux: sudo systemctl start mysql

# Iniciar servidor
cd tic-stock
npm run dev

# Abrir en navegador:
# http://localhost:4000
```

---

## Creación de administradores

No hay formulario público para crear cuentas `superusuario` — el endpoint `POST /api/auth/registro` siempre asigna `rol='usuario'`.

**Opciones**:
1. **Seed SQL**: `mysql -u root -p tic_stock < database/seed.sql` (incluye admin@ticstock.edu / admin123)
2. **Seed JS**: `npm run seed` (versión programática del mismo seed)
3. **Manual SQL**:
   ```sql
   INSERT INTO usuarios (nombre, email, password, rol)
   VALUES ('Admin', 'admin@ejemplo.com', '$2b$10$...hash...', 'superusuario');
   ```
   Generar hash con `node -e "const b=require('bcrypt');b.hash('password123',10).then(console.log)"`

---

## Preparación para la Demo

### Checklist pre-demo

- [ ] Base de datos con seed cargado (no vacía)
- [ ] Usuario admin: admin@ticstock.edu / admin123
- [ ] Usuario docente: docente@taller.edu / admin123
- [ ] Alumnos de prueba: alumno1@estudiante.edu, alumno2@estudiante.edu, alumno3@estudiante.edu / admin123
- [ ] Al menos 1 retiro sin devolver con fecha > 7 días (para alertas)
- [ ] Etiquetas QR impresas y pegadas en los ítems de la demo
- [ ] Cámara del celular/dispositivo funciona con la página (probar antes)
- [ ] Input manual de código funciona como fallback
- [ ] Sistema accesible desde otro dispositivo en la misma red

### Probar desde celular

1. Conectar celular a la misma red Wi-Fi que el servidor
2. Abrir Chrome/Firefox en el celular
3. Navegar a `http://[IP-DEL-SERVIDOR]:4000`
4. Probar escaneo (los navegadores móviles pueden requerir HTTPS para cámara → usar input manual como fallback)
5. Probar todo el flujo: login → escanear → retirar → ver catálogo actualizado

### Problema conocido: Cámara en móviles

Si la cámara no se activa desde el celular (los navegadores móviles exigen HTTPS para getUserMedia salvo en localhost), usar el **input manual** de código como alternativa. Esto ya está contemplado en la interfaz de escaneo.

### Mitigación: HTTPS local con mkcert (opcional pero recomendado para demo con escaneo móvil)

Si se desea que el escaneo por cámara funcione desde celulares durante la demo:

```bash
# 1. Instalar mkcert
# Windows: choco install mkcert
# Linux: sudo apt install mkcert
# macOS: brew install mkcert

# 2. Inicializar CA local
mkcert -install

# 3. Generar certificado para la IP del servidor
mkcert 192.168.1.100 localhost 127.0.0.1

# 4. Usar server-https.js (crear con https.createServer)
# Opción rápida: proxy inverso con nginx o agregar flag --https en server.js
```

Alternativa sin HTTPS: realizar la demostración de escaneo desde una **PC con cámara** en lugar de un celular. La PC no exige HTTPS para getUserMedia en localhost/IP local.

---

## Guion de Demo (3-5 minutos)

1. **Problema:** "El taller pierde 100 minutos semanales por persona buscando materiales"
2. **Login como alumno** → catálogo: "En 5 segundos sé si el kit está disponible"
3. **Escanear QR real** → confirmar retiro → catálogo actualizado al instante
4. **Cambiar a sesión admin** → movimientos: historial reflejado
5. **Mostrar alerta vencida** del seed → resolverla en vivo
6. **Cierre técnico:** "Monolito 3 capas con Transaction Script, Node + Express + MySQL, corre en la red del taller sin internet ni cloud"

## Verificación post-despliegue

```bash
# Ejecutar tests antes de la demo
npm test

# Verificar que vendor local funciona (desconectar internet y probar escaneo)
```
Si todos los tests pasan, el sistema está listo para la demo.
