-- TIC & Stock — Esquema de Base de Datos
-- MySQL/MariaDB 10.4+ / MySQL 8.x

CREATE DATABASE IF NOT EXISTS tic_stock
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tic_stock;

-- ============================================================
-- Tabla: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('superusuario','usuario') NOT NULL DEFAULT 'usuario',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuarios_email (email),
  INDEX idx_usuarios_rol (rol)
) ENGINE=InnoDB;

-- ============================================================
-- Tabla: items
-- ============================================================
CREATE TABLE IF NOT EXISTS items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  cantidad INT UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('disponible','en_uso','dañado','de_baja') NOT NULL DEFAULT 'disponible',
  observaciones TEXT,
  foto_url VARCHAR(500),
  ubicacion VARCHAR(200),
  codigo_escaneable VARCHAR(100) NOT NULL UNIQUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_items_categoria (categoria),
  INDEX idx_items_estado (estado),
  CONSTRAINT chk_cantidad CHECK (cantidad >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- Tabla: movimientos
-- ============================================================
CREATE TABLE IF NOT EXISTS movimientos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_item INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  tipo ENUM('retiro','devolucion') NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  codigo_escaneado VARCHAR(100),
  devuelto BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX idx_movimientos_item (id_item),
  INDEX idx_movimientos_usuario (id_usuario),
  INDEX idx_movimientos_fecha (fecha_hora),
  CONSTRAINT fk_mov_item FOREIGN KEY (id_item) REFERENCES items(id) ON DELETE RESTRICT,
  CONSTRAINT fk_mov_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
