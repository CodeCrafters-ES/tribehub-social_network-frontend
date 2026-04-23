# 🚀 Proyecto de red social (Social Network WebApp) - Frontend Team

## Bienvenido/a al repositorio del proyecto **Social Network** en el que colabora el equipo **Frontend**

Este proyecto usa **NextJS**, **HTML** y **TailwindCSS** como base para un desarrollo rápido, modular y escalable.

---

[![Licencia](https://img.shields.io/badge/licencia-MIT-blue)](LICENSE)
[![NextJS](https://img.shields.io/badge/NextJS-16.2.1-orange)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%5E4-06B6D4)](https://tailwindcss.com/)

Aplicación web de una red social moderna construida con **NextJS** y **Tailwind CSS**.
Incluye funcionalidades como autenticación, publicaciones, comentarios y perfiles de usuario.

<!-- ![Captura de Pantalla](./src/assets/screenshot.png)  <!-- Reemplazar con imagen real -->

---

[![Sitio Web en Vivo](https://img.shields.io/badge/🌐-Visitar_Sitio-2EA44F)](https://turedsocial.com)  
[![Demo](https://img.shields.io/badge/🎥-Ver_Demo-FF0000)](https://youtu.be/ejemplo-demo)

---

## 🔹 **Funcionalidades clave**

- Publica fotos, textos y enlaces.
- Conecta con amigos.
- Descubre comunidades temáticas.

---

## 🤝 Contribución

Para conocer las pautas detalladas de contribución, consulta el archivo [CONTRIBUTING.md](CONTRIBUTING.md).  
_(Haz clic en el enlace para ir directamente a las guías)_

---

## 🖥️ Cómo Usar la Aplicación

### Opción 1: Acceder Online (Recomendado)

Simplemente visita **[https://tribehub.app](https://tribehub.app)** en tu navegador (Chrome, Firefox o Edge).

### Opción 2: Ejecutar Localmente (Para Testing)

Si quieres probar la app en tu máquina:

1. **Clona el repositorio**:

```bash
git clone https://github.com/CodeCrafters-ES/social-network-webapp-frontend.git
cd social-network-webapp-frontend
```

2. **Instala Bun** (si aún no lo tienes):

```bash
curl -fsSL https://bun.sh/install | bash
```

3. **Instala las dependencias**:

```bash
bun install
```

4. **Configura las variables de entorno**:

Copia el archivo de ejemplo y ajusta los valores según tu entorno:

```bash
cp .env.example .env
```

El archivo `.env` contiene la URL del backend de autenticación (login y registro):

```
AUTH_API_BASE_URL=http://localhost:8080
```

5. **Levanta el servidor de desarrollo**:

```bash
bun run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

Las rutas de autenticación disponibles son:

- `/login` — Inicio de sesión
- `/register` — Registro de usuario

⚠️ _Nota_: Para que el login y registro funcionen correctamente, el backend de autenticación debe estar corriendo en la URL configurada en `AUTH_API_BASE_URL`.

---

## 📱 Dispositivos Soportados

- **Navegadores**: Chrome ≥ v115, Firefox ≥ v110, Safari ≥ v15.
- **Móvil**: Accede desde cualquier smartphone (Android/iOS) via navegador.

---

## 🆘 Soporte Técnico

¿Problemas al acceder?

- Verifica tu conexión a Internet.
- Limpia la caché del navegador.
- Contáctanos <!--en [soporte@turedsocial.com](mailto:soporte@turedsocial.com). -->

---

## 📜 Licencia

Este proyecto es de código abierto bajo licencia [MIT](LICENSE).  
© 2026 CodeCrafters - ES
