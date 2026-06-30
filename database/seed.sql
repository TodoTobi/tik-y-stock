-- TIC & Stock — Datos de demostración
USE tic_stock;

-- ============================================================
-- Usuarios (contraseña hasheada con bcrypt, costo 10)
-- password: admin123
-- ============================================================
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Admin TIC', 'admin@ticstock.edu', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'superusuario'),
  ('Docente Taller', 'docente@taller.edu', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'superusuario'),
  ('Alumno Uno', 'alumno1@estudiante.edu', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'usuario'),
  ('Alumno Dos', 'alumno2@estudiante.edu', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'usuario'),
  ('Alumno Tres', 'alumno3@estudiante.edu', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'usuario');

-- ============================================================
-- Items
-- ============================================================
INSERT INTO items (nombre, categoria, cantidad, estado, observaciones, ubicacion, codigo_escaneable) VALUES
  ('Kit Arduino Uno', 'Electrónica', 5, 'disponible', 'Incluye placa, cable USB y protoboard', 'Estante A1', 'ARD-001'),
  ('Sensor Ultrasonido HC-SR04', 'Sensores', 8, 'disponible', 'Rango 2cm-400cm', 'Cajón B2', 'SEN-002'),
  ('Servomotor SG90', 'Actuadores', 4, 'disponible', 'Micro servo 180°', 'Estante A3', 'ACT-003'),
  ('Módulo Bluetooth HC-05', 'Comunicación', 3, 'disponible', 'Maestro/esclavo configurable', 'Cajón B1', 'COM-004'),
  ('LED Pack 100u', 'Componentes', 2, 'disponible', '100 LEDs surtidos 5mm', 'Cajón C1', 'LED-005'),
  ('Protoboard 830 puntos', 'Herramientas', 6, 'disponible', 'Protoboard mediana', 'Estante A1', 'PRO-006'),
  ('Cable USB tipo B', 'Cables', 10, 'disponible', '1.5m, para Arduino', 'Cajón D1', 'CBL-007'),
  ('Multímetro Digital', 'Instrumentos', 2, 'disponible', 'Mide voltaje, corriente, resistencia', 'Estante A2', 'INS-008'),
  ('Sensor DHT11', 'Sensores', 5, 'disponible', 'Temperatura y humedad', 'Cajón B2', 'SEN-009'),
  ('Módulo Relé 2 canales', 'Actuadores', 3, 'disponible', 'Relé 10A/250VAC', 'Estante A3', 'ACT-010'),
  ('Pantalla LCD 16x2', 'Display', 4, 'disponible', 'Con adaptador I2C', 'Cajón B1', 'DSP-011'),
  ('Resistencias 220Ω pack 50u', 'Componentes', 3, 'disponible', 'Pack de 50 unidades', 'Cajón C2', 'RES-012'),
  ('Cables Dupont M-M pack', 'Cables', 8, 'disponible', 'Pack 40 unidades 20cm', 'Cajón D1', 'CBL-013'),
  ('Sensor de movimiento PIR', 'Sensores', 4, 'disponible', 'HC-SR501, alcance 7m', 'Cajón B3', 'SEN-014'),
  ('Joystick Analógico', 'Componentes', 3, 'disponible', 'Módulo KY-023, 2 ejes + botón', 'Cajón C2', 'JST-015'),
  ('Módulo RTC DS3231', 'Comunicación', 2, 'disponible', 'Reloj en tiempo real preciso', 'Cajón B1', 'COM-016'),
  ('Buzzer Activo 5V', 'Actuadores', 6, 'disponible', 'Genera tono fijo al alimentarlo', 'Estante A3', 'ACT-017'),
  ('Cable Jumper M-H pack', 'Cables', 7, 'disponible', 'Pack 40 unidades 20cm', 'Cajón D2', 'CBL-018');

-- ============================================================
-- Movimientos históricos
-- ============================================================
-- Retiro reciente (alumno1 retiró un Arduino)
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora, devuelto) VALUES
  (1, 3, 'retiro', 'ARD-001', DATE_SUB(NOW(), INTERVAL 2 DAY), FALSE);

-- Retiro devuelto (alumno2 retiró y devolvió un sensor)
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora, devuelto) VALUES
  (2, 4, 'retiro', 'SEN-002', DATE_SUB(NOW(), INTERVAL 5 DAY), TRUE);
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora) VALUES
  (2, 4, 'devolucion', NULL, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Retiro viejo sin devolver (alerta vencida - más de 7 días)
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora, devuelto) VALUES
  (3, 5, 'retiro', 'ACT-003', DATE_SUB(NOW(), INTERVAL 10 DAY), FALSE);

-- Otro retiro viejo sin devolver (segunda alerta)
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora, devuelto) VALUES
  (5, 3, 'retiro', 'LED-005', DATE_SUB(NOW(), INTERVAL 9 DAY), FALSE);

-- Retiro devuelto a tiempo
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora, devuelto) VALUES
  (4, 4, 'retiro', 'COM-004', DATE_SUB(NOW(), INTERVAL 1 DAY), TRUE);
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora) VALUES
  (4, 4, 'devolucion', NULL, NOW());

-- Retiro del docente (admin)
INSERT INTO movimientos (id_item, id_usuario, tipo, codigo_escaneado, fecha_hora, devuelto) VALUES
  (7, 1, 'retiro', 'CBL-007', DATE_SUB(NOW(), INTERVAL 3 DAY), FALSE);
