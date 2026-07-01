# TIC & Stock

Sistema de gestión de inventario para el Taller de TIC de la Escuela Técnica N°20 "Carolina Muzilli".

**Stack**: Node.js + Express + MySQL | Monolito 3 capas | HTML/CSS/JS vanilla

Documentación completa en [docs/README.md](docs/README.md)

---

## Requisitos

- **Node.js** v18+
- **MySQL** 8.x
- **npm**

## Puesta en marcha

```bash
# 1. Clonar
git clone <repo-url> tic-stock
cd tic-stock

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de la base de datos local

# 4. Crear base de datos e importar esquema
mysql -u root -p -e "CREATE DATABASE tic_stock"
mysql -u root -p tic_stock < database/schema.sql

# 5. (Opcional) Cargar datos de demo
mysql -u root -p tic_stock < database/seed.sql

# 6. Iniciar servidor
npm run dev
```

## Acceso

| URL | Descripción |
|---|---|
| `http://localhost:4000` | Redirige a login |
| `http://localhost:4000/login.html` | Inicio de sesión |
| `http://localhost:4000/registro.html` | Registro de alumnos |
| `http://localhost:4000/usuario/catalogo.html` | Catálogo de items |
| `http://localhost:4000/admin/dashboard.html` | Dashboard admin |
| `http://localhost:4000/admin/inventario.html` | Gestión de inventario |

### Usuarios demo (con seed)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin@ticstock.edu` | `admin123` | superusuario |
| `docente@taller.edu` | `admin123` | superusuario |
| `alumno1@estudiante.edu` | `admin123` | usuario |

## Notas importantes

- **IPv6**: El servidor usa `localhost` como bind address. En Windows con Node.js, `localhost` puede resolver a `[::1]` (IPv6). Si necesitás acceder desde `127.0.0.1`, cambiá `'localhost'` por `'0.0.0.0'` en `server.js:53`.
- **Admin seed**: No hay registro público de admins. El superusuario se crea via `database/seed.sql` o `npm run seed`.
- **Cámara en móviles**: Los navegadores móviles requieren HTTPS para `getUserMedia`. Usar el input manual de código QR como fallback, o configurar HTTPS local con mkcert.
- **Tests**: Correr con `npm test`.