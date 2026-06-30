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
PORT=3000
EOF

# 4. Crear base de datos
mysql -u root -p -e "CREATE DATABASE tic_stock;"

# 5. Importar esquema
mysql -u root -p tic_stock < database/schema.sql

# 6. (Opcional) Cargar datos de demo
mysql -u root -p tic_stock < database/seed.sql

# 7. Iniciar servidor
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

# El servidor debe escuchar en 0.0.0.0 (ya configurado en server.js)
npm run dev
```

### Desde otros dispositivos (celulares, otras PCs)

```
http://[IP-DEL-SERVIDOR]:3000
```

Ejemplo: `http://192.168.1.100:3000`

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
# http://localhost:3000
```

---

## Preparación para la Demo

### Checklist pre-demo

- [ ] Base de datos con seed cargado (no vacía)
- [ ] Usuario admin: admin@ticstock.edu / admin123
- [ ] Usuario docente: docente@taller.edu / docente123
- [ ] Alumnos de prueba: almuno1@test.com, alumno2@test.com / alumno123
- [ ] Al menos 1 retiro sin devolver con fecha > 7 días (para alertas)
- [ ] Etiquetas QR impresas y pegadas en los ítems de la demo
- [ ] Cámara del celular/dispositivo funciona con la página (probar antes)
- [ ] Input manual de código funciona como fallback
- [ ] Sistema accesible desde otro dispositivo en la misma red

### Probar desde celular

1. Conectar celular a la misma red Wi-Fi que el servidor
2. Abrir Chrome/Firefox en el celular
3. Navegar a `http://[IP-DEL-SERVIDOR]:3000`
4. Probar escaneo (los navegadores móviles pueden requerir HTTPS para cámara → usar input manual como fallback)
5. Probar todo el flujo: login → escanear → retirar → ver catálogo actualizado

### Problema conocido: Cámara en móviles

Si la cámara no se activa desde el celular (los navegadores móviles exigen HTTPS para getUserMedia salvo en localhost), usar el **input manual** de código como alternativa. Esto ya está contemplado en la interfaz de escaneo.

---

## Guion de Demo (3-5 minutos)

1. **Problema:** "El taller pierde 100 minutos semanales por persona buscando materiales"
2. **Login como alumno** → catálogo: "En 5 segundos sé si el kit está disponible"
3. **Escanear QR real** → confirmar retiro → catálogo actualizado al instante
4. **Cambiar a sesión admin** → dashboard: movimiento reflejado
5. **Mostrar alerta vencida** del seed → resolverla en vivo
6. **Cierre técnico:** "Monolito 3 capas, Node + Express + MySQL, corre en la red del taller sin internet ni cloud"
