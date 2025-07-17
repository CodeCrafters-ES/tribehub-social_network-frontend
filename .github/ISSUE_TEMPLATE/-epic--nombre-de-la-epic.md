---
name: "[EPIC] Nombre de la epic"
about: Describe this issue template's purpose here.
title: "[EPIC] Template"
labels: ''
assignees: Azfe

---

# 🚀 [EPIC] Nombre de la Epic

## 📌 Descripción

Desarrollar los formularios de autenticación (login y registro) para la red social, garantizando una experiencia de usuario fluida, seguridad básica y integración con el backend.

## ✅ Objetivo

Los usuarios pueden registrarse e iniciar sesión de forma intuitiva, con validaciones en tiempo real y feedback claro.
Garantizar que solo usuarios registrados puedan acceder a funcionalidades privadas de la red social.

Los usuarios deben poder:

- Crear una cuenta usando correo electrónico y contraseña.
- Iniciar sesión de forma segura.
- Cerrar sesión y finalizar la sesión en el sistema.

---

## 📋 Historias de Usuario (Issues)

### 1. Maquetación de los formularios con Tailwind CSS

Descripción: Crear la interfaz visual de los formularios (login y registro) responsive.

**Tareas:**

- Diseñar formulario de login con campos: email y password.

- Diseñar formulario de registro con campos: nombre, email, password y confirmar password.

- Añadir botones de acción ("Iniciar sesión", "Registrarse", "¿Olvidaste tu contraseña?").

- Incluir links para alternar entre login/registro.

- Criterios de Aceptación:

- Diseño coherente con el theme de la red social.

- Responsive en móvil (320px) y desktop (≥1024px).

### 2. Validación de campos en frontend

**Descripción:** Validar inputs antes de enviar datos al backend.

**Tareas:**

- Validar formato de email con regex.

- Asegurar que password tenga al menos 8 caracteres (con muestra de fortaleza).

- Comparar password y confirmar password en registro.

- Mostrar mensajes de error contextuales (ej: "Email inválido").

**Criterios de Aceptación:**

- Los errores se muestran sin recargar la página.

---

## 🗂️ Issues relacionados

- [ ] Crear componentes FormLogin / FormSignup
- [ ] #12 Maquetar formulario de login
- [ ] #10 Maquetar formulario de registro
- [ ] #11 Validar datos del formulario (frontend)
- [ ] #14 Mostrar mensajes de error y validación
- [ ] Conectar formularios con API de backend
- [ ] Guardar token JWT en localStorage o cookie segura
- [ ] Implementar cierre de sesión en frontend

---

## ✅ Criterios de aceptación

- Los usuarios pueden registrarse con email y contraseña válidos.
- Las contraseñas se almacenan de forma segura (encriptadas).
- Un usuario puede iniciar sesión y recibe un token JWT.
- El token se usa para acceder a rutas protegidas.
- El usuario puede cerrar sesión y se invalida la sesión en cliente.

---

## 🔄 Dependencias

- Este Epic es requerido para habilitar todas las rutas protegidas (creación de posts, comentarios, perfil de usuario).

---

## 📌 Notas

- Usar `bcrypt` para encriptar contraseñas.
- Usar `jsonwebtoken` para generar y validar JWT.
- Se recomienda usar `axios` o `fetch` para conectar el frontend con el backend.
- Validar inputs con librerías como `yup` o validación manual.

---

## 🚀 Checklist de entrega

- [ ] Funcionalidad probada con tests básicos.
- [ ] Documentación actualizada en README.
- [ ] Validado con al menos 1 usuario de prueba.
