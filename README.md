# 🚀 TribeHub — Frontend

## Bienvenido/a al repositorio del frontend de **TribeHub**, la red social comunitaria

TribeHub es una aplicación web de red social moderna construida con **Next.js + TypeScript + Tailwind CSS**.
Incluye funcionalidades como autenticación, publicaciones, comentarios, perfiles de usuario y feed social.

<!-- ![Captura de Pantalla](./src/assets/screenshot.png)  Reemplazar con imagen real -->

---

[![Licencia](https://img.shields.io/badge/licencia-MIT-blue)](LICENSE)
[![NextJS](https://img.shields.io/badge/NextJS-16.2.1-orange)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%5E4-06B6D4)](https://tailwindcss.com/)

> **Estado del deploy:** El despliegue en Netlify está pendiente. Aún no existe una URL de producción pública.

---

## 🔹 **Funcionalidades — Hito 1 MVP Crítico** *(en construcción)*

- Autenticación: registro y login con confirmación de email (Supabase)
- Onboarding: selección de intereses al crear la cuenta
- Perfil público/privado con avatar
- Posts de texto e imagen
- Feed general con paginación por cursor
- Búsqueda global con debounce

---

## 🛠️ Stack técnico

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js (App Router) | 16.2.1 | Framework SSR + routing |
| React | 19 | Capa de UI |
| TypeScript | — | Tipado estático |
| TanStack Query | — | Fetching y caché en cliente |
| Axios | — | Cliente HTTP con interceptores |
| react-hook-form + zod | — | Formularios y validación |
| Tailwind CSS | v4 | Estilos (sin `tailwind.config.js`) |
| bun | — | Package manager y runner |
| Netlify | — | Deploy objetivo (preview por PR) |

---

## 📁 Estructura del proyecto (Feature-Sliced Design)

```
app/                      # Rutas, layouts y boundaries (loading/error)
  (auth)/                 # Rutas públicas: /login, /register
  (app)/                  # Zona autenticada: /feed, /profile/[id], ...

features/                 # Lógica de dominio aislada por feature
  auth/                   # Componentes, hooks y tipos de autenticación
  profile/                # Perfil de usuario
  interests/              # Onboarding de intereses
  posts/                  # Creación y detalle de posts
  feed/                   # Feed general
  search/                 # Búsqueda global

shared/                   # Código reutilizable sin lógica de dominio
  ui/                     # Componentes base: Button, Input, Modal, Card, Avatar...
  lib/                    # Helpers, formatters, constantes
  hooks/                  # Hooks genéricos: useDebounce, useMediaQuery...
  types/                  # Tipos compartidos entre dominios

services/
  api/                    # Instancia Axios, interceptores, manejo de errores
  server/                 # Wrapper fetch tipado para Server Components
```

**Regla de aislamiento:** un feature no puede importar de otro feature — solo de `shared/*` y `services/*`.

---

## ✅ Prerequisitos

- **Node.js** 20 o superior
- **bun** instalado ([instrucciones](https://bun.sh/))
- **Backend de TribeHub** corriendo en `http://localhost:3000` (ver `tribehub-social_network-backend/`)

---

## 🖥️ Cómo ejecutar localmente

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
cp .env.example .env.local
```

5. **Levanta el servidor de desarrollo**:

```bash
bun run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

Las rutas de autenticación disponibles son:

- `/login` — Inicio de sesión
- `/register` — Registro de usuario

⚠️ _Nota_: Para que el login y registro funcionen correctamente, el backend de TribeHub debe estar corriendo en `http://localhost:3000`.

---

## 🔑 Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# URL base de la API del backend (incluye el prefijo /api/v1)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

> Las variables con prefijo `NEXT_PUBLIC_` son expuestas al cliente. Las variables sin ese prefijo solo están disponibles en el servidor.

---

## 📟 Comandos disponibles

```bash
bun run dev        # Servidor de desarrollo (puerto 5173)
bun run build      # Build de producción
bun run start      # Inicia el build de producción
bun run lint       # Análisis de código con ESLint
```

---

## 🤝 Contribución

Para conocer las pautas detalladas de contribución, consulta el archivo [CONTRIBUTING.md](CONTRIBUTING.md).  
_(Haz clic en el enlace para ir directamente a las guías)_

---

## 📱 Dispositivos Soportados

- **Navegadores**: Chrome ≥ v115, Firefox ≥ v110, Safari ≥ v15.
- **Móvil**: Accede desde cualquier smartphone (Android/iOS) via navegador.

---

## 🆘 Soporte Técnico

¿Problemas al ejecutar el proyecto?

- Verifica que el backend esté corriendo en `http://localhost:3000`.
- Verifica tu archivo `.env.local` y que las variables estén correctamente definidas.
- Limpia la caché del navegador.
- Contáctanos abriendo un issue en el repositorio.

---

## 📜 Licencia

Este proyecto es de código abierto bajo licencia [MIT](LICENSE).  
© 2026 CodeCrafters - ES
