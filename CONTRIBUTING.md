# Guía de contribución — TribeHub Frontend

Gracias por contribuir al frontend de TribeHub. Este documento explica cómo configurar el entorno, enviar cambios y trabajar dentro del flujo del equipo. Léelo completo antes de abrir tu primer PR.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Setup local](#2-setup-local)
3. [Comandos disponibles](#3-comandos-disponibles)
4. [Arquitectura FSD](#4-arquitectura-fsd)
5. [Server vs Client Components](#5-server-vs-client-components)
6. [Estilos, formularios y API](#6-estilos-formularios-y-api)
7. [Subida de imágenes](#7-subida-de-imagenes)
8. [Flujo de trabajo con Git](#8-flujo-de-trabajo-con-git)
9. [Pull Requests](#9-pull-requests)
10. [Nomenclatura de issues](#10-nomenclatura-de-issues)
11. [Kanban y límites de WIP](#11-kanban-y-limites-de-wip)
12. [Testing](#12-testing)
13. [CI y despliegue](#13-ci-y-despliegue)
- [Código de conducta](#codigo-de-conducta)

---

## 1. Requisitos previos

- Node.js 20 o superior
- [bun](https://bun.sh) instalado globalmente
- Backend de TribeHub corriendo en `http://localhost:3000`

---

## 2. Setup local

```bash
bun install
cp .env.example .env.local
# Editar .env.local y establecer:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
bun run dev   # http://localhost:3000
```

### Dependencias principales del stack

`bun install` instala todas las dependencias declaradas en `package.json`. Las más relevantes para el desarrollo de features son:

| Paquete | Uso |
| --- | --- |
| `@tanstack/react-query` + `@tanstack/react-query-devtools` | Fetching y mutaciones en Client Components |
| `axios` | Cliente HTTP; no crear instancias ad-hoc — usar `services/api/client.ts` |
| `react-hook-form` + `@hookform/resolvers` | Formularios |
| `zod` | Validación de esquemas de formularios y datos de API |

---

## 3. Comandos disponibles

| Comando              | Descripción                             |
| -------------------- | --------------------------------------- |
| `bun run dev`        | Servidor de desarrollo                  |
| `bun run build`      | Compilación de producción               |
| `bun run start`      | Inicia la build de producción compilada |
| `bun run lint`       | Ejecuta ESLint sobre el proyecto        |
| `bun run typecheck`  | Verificación de tipos con TypeScript    |
| `bun run check`      | Ejecuta lint y typecheck en conjunto    |
| `bun run test`       | Ejecuta la suite de tests               |
| `bun run test:watch` | Tests en modo watch                     |

---

## 4. Arquitectura FSD

Todo el código nuevo debe respetar la estructura Feature-Sliced Design (FSD) del proyecto.

### Estructura de directorios

```
app/                        # Rutas, layouts y boundaries (loading.tsx, error.tsx)
  (auth)/                   # Rutas públicas: /login, /register
    login/
      page.tsx
    register/
      page.tsx
    layout.tsx
  (app)/                    # Zona autenticada: /feed, /profile/[id], ...
    feed/
      page.tsx
    profile/
      [id]/
        page.tsx
    layout.tsx              # Auth guard, sidebar, navegación
  layout.tsx                # Root layout (fuentes, providers)
  not-found.tsx

features/                   # Funcionalidades de dominio, una carpeta por dominio
  auth/
    components/             # LoginForm, RegisterForm
    hooks/                  # useLogin, useRegister
    types.ts                # AuthUser, LoginPayload, RegisterPayload
  profile/
    components/
    hooks/
    types.ts
  interests/
    components/
    hooks/
    types.ts
  posts/
    components/
    hooks/
    types.ts
  feed/
    components/
    hooks/
    types.ts
  search/
    components/
    hooks/
    types.ts

shared/                     # Código reutilizable sin lógica de dominio
  ui/                       # Componentes base: Button, Input, Modal, Card, Avatar...
  lib/                      # Helpers, formateadores, constantes
  hooks/                    # Hooks genéricos: useDebounce, useMediaQuery...
  types/                    # Tipos compartidos entre dominios

services/                   # Capa de comunicación con el backend
  api/
    client.ts               # Instancia Axios: baseURL=/api/v1, interceptores
    interceptors.ts         # Rotación de tokens, manejo de 401
    errors.ts               # Mapeo AxiosError → errores de dominio
  server/
    fetch.ts                # Wrapper tipado de fetch para Server Components
```

### Regla de aislamiento de features

Una feature no puede importar de otra feature. Solo puede importar desde `shared/*` y `services/*`.

Incorrecto:

```ts
// features/feed/components/FeedPost.tsx
import { useProfile } from '@/features/profile/hooks/useProfile'; // NO permitido
```

Correcto:

```ts
// features/feed/components/FeedPost.tsx
import { Avatar } from '@/shared/ui/Avatar';       // OK
import { apiClient } from '@/services/api/client'; // OK
```

### Tipos de dominio vs tipos compartidos

- Los tipos propios de un dominio se definen en `features/<domain>/types.ts`.
- Los tipos que cruzan fronteras entre dominios se definen en `shared/types/`.

---

## 5. Server vs Client Components

### Cuándo usar cada uno

| Escenario                              | Tipo de componente                | Obtención de datos         |
| -------------------------------------- | --------------------------------- | -------------------------- |
| Renderizado inicial de página, SEO     | Server Component                  | `services/server/fetch.ts` |
| Formularios, mutaciones, interacciones | Client Component (`'use client'`) | TanStack Query + Axios     |
| Tiempo real, suscripciones             | Client Component (`'use client'`) | TanStack Query + Axios     |

### Restricciones en Server Components

- No pueden contener `useState`, `useEffect` ni event handlers.
- Los datos se obtienen a través de `services/server/fetch.ts`.
- No uses TanStack Query en Server Components.

### Requisitos en Client Components

- Deben declarar `'use client'` en la primera línea del archivo.
- Usan TanStack Query + Axios para obtener y mutar datos.

---

## 6. Estilos, formularios y API

### Estilos

- Solo clases de utilidad de Tailwind — sin estilos en línea, sin CSS Modules, sin styled-components.

### Formularios

- Todos los formularios usan `react-hook-form` con un esquema `zod` para la validación.
- Valida en el cliente antes de cualquier petición de red.
- Muestra mensajes de error a nivel de campo usando los mensajes del esquema zod.

### API y autenticación

- Todas las peticiones autenticadas pasan por la instancia Axios en `services/api/client.ts`, configurada con `baseURL: '/api/v1'` y `withCredentials: true`.
- La rotación de tokens y el manejo de errores 401 viven exclusivamente en `services/api/interceptors.ts` — no dupliques esta lógica en features ni componentes.
- No crees instancias Axios ad-hoc ni llamadas `fetch` directas que salten la cadena de interceptores.
- Los access tokens van en la cabecera `Authorization: Bearer <token>`.
- Los refresh tokens son cookies `httpOnly` — nunca almacenes tokens en `localStorage` ni en `sessionStorage`.

---

## 7. Subida de imágenes

La subida de imágenes usa el flujo de URL prefirmada en tres pasos:

1. `POST /assets/init` — solicita una URL prefirmada al backend; recibe `assetId` y `url`.
2. `PUT <url-prefirmada>` — el cliente sube el fichero directamente al almacenamiento (sin pasar por el backend).
3. `POST /assets/complete` — asocia el `assetId` con el post o el perfil.

---

## 8. Flujo de trabajo con Git

### Ramas

Crea siempre las ramas a partir de `develop`. Los Pull Requests deben apuntar siempre a `develop`, nunca directamente a `main`.

| Tipo de rama            | Prefijo  | Ejemplo                        |
| ----------------------- | -------- | ------------------------------ |
| Nueva funcionalidad     | `feat/*` | `feat/p01-01-registro-usuario` |
| Corrección de bug       | `fix/*`  | `fix/feed-ordering-bug`        |
| Documentación           | `docs/*` | `docs/update-adr-auth`         |
| Subtarea (colaborativa) | `task/*` | `task/p01-01-login-form`       |

### Flujo colaborativo

Cuando varias personas trabajan en la misma feature:

1. Se crea una rama `feat/*` compartida como base.
2. Cada colaborador crea su propia rama `task/*` desde esa `feat/*`.
3. Cada `task/*` se integra en la `feat/*` compartida mediante PRs internos.
4. Un único PR final lleva la `feat/*` completa a `develop`.

### Formato de commits

```
<tipo>: descripción breve en presente (max 72 chars, sin puntuación final)
```

Referencia el issue cuando corresponda:

```
feat: (#45) add login form with zod validation
```

| Tipo        | Cuándo usarlo                                     |
| ----------- | ------------------------------------------------- |
| `feat:`     | Nueva funcionalidad                               |
| `fix:`      | Corrección de bug                                 |
| `refactor:` | Cambio interno sin cambio de comportamiento       |
| `docs:`     | Solo documentación                                |
| `test:`     | Solo tests                                        |
| `chore:`    | Configuración, scripts, CI/CD                     |
| `style:`    | Formateo sin impacto funcional                    |
| `perf:`     | Mejoras de rendimiento                            |
| `task:`     | Subtarea dentro de una funcionalidad colaborativa |

No uses scope en el type. Incorrecto: `feat(auth): login`. Correcto: `feat: (#12) add login form`.

---

## 9. Pull Requests

- Los PRs deben ser pequeños y revisables, con un único propósito.
- Ejecuta `bun run check` y `bun run test` antes de abrir el PR.
- El CI completo (lint + typecheck + build + tests) debe pasar antes del merge.
- Se requiere mínimo 1 aprobación; no fusiones tu propio PR sin revisión salvo acuerdo explícito del equipo.
- Sin dead code, `console.log` ni prints de debug.

### PR readiness checklist

- [ ] `bun run build` sin errores
- [ ] `bun run typecheck` correcto
- [ ] `bun run test` sin regresiones
- [ ] Sigue las convenciones de arquitectura FSD
- [ ] No hay imports entre features
- [ ] Los Client Components tienen `'use client'` al inicio del archivo
- [ ] Sin tokens en `localStorage` ni `sessionStorage`
- [ ] Formularios validados con esquema zod
- [ ] Solo clases Tailwind (sin estilos en línea)
- [ ] Peticiones autenticadas por `services/api/client.ts`
- [ ] El título del PR sigue el formato de commit
- [ ] El cuerpo incluye `Closes #ID`
- [ ] La rama apunta a `develop`

---

## 10. Nomenclatura de issues

Formato: `I-F-{EPIC}-{FEATURE}-{NUM}`

Ejemplos:

- `I-F-P01-03-01` — Issue 01 de la Feature 03 del EPIC-P01
- `I-F-P04-01-02` — Issue 02 de la Feature 01 del EPIC-P04

### Referencia de epics

| Epic ID  | Ámbito                                                     |
| -------- | ---------------------------------------------------------- |
| EPIC-T00 | Enabler — infraestructura y estabilidad                    |
| EPIC-P01 | Identidad, onboarding y perfiles                           |
| EPIC-P02 | Contenido: posts y multimedia                              |
| EPIC-P03 | Interacciones sociales: comentarios, reacciones, menciones |
| EPIC-P04 | Descubrimiento: feed y búsqueda                            |
| EPIC-P05 | Comunidades: grupos y roles                                |
| EPIC-P06 | Eventos                                                    |
| EPIC-P07 | Conexiones: seguidores y sugerencias                       |
| EPIC-P08 | Tiempo real: chat y notificaciones in-app                  |
| EPIC-P09 | Moderación y confianza                                     |
| EPIC-P10 | Notificaciones por correo electrónico                      |

Cada issue debe incluir:

- Objetivo claro
- Criterios de aceptación
- Nombre de la rama asociada
- Enlace al PR asociado (una vez abierto)

### Cadena de trazabilidad

```
Hito → Epic → Feature → Issue → Rama → Commits → Pull Request → Merge → Done
```

---

## 11. Kanban y límites de WIP

Columnas del tablero:

```
Backlog → Ready For Dev → In Progress → In Review → Testing/QA → Ready for Deploy → Done
```

Reglas:

- Límite de WIP: máximo 2 tareas por desarrollador en "In Progress" al mismo tiempo.
- Una tarea no puede pasar a "In Progress" sin haber estado antes en "Ready For Dev".
- Cada issue debe tener objetivo claro y criterios de aceptación antes de entrar en "Ready For Dev".
- La reunión de sincronización semanal es el punto principal de coordinación — no hay daily obligatorio.

---

## 12. Testing

```bash
bun run test        # Ejecuta la suite de tests
bun run test:watch  # Tests en modo watch
```

Expectativas:

- Todo nuevo hook o función de utilidad en `shared/` requiere un test unitario.
- Los componentes de UI compartidos en `shared/ui/` requieren tests de componente.
- La cobertura de tests no debe disminuir con un PR.
- Prueba el comportamiento, no los detalles de implementación.

---

## 13. CI y despliegue

- El pipeline de CI se ejecuta en cada push: lint + typecheck + build + tests.
- Netlify genera una preview URL por cada PR.
- Los PRs deben pasar el CI completo antes de poder hacer merge.

---

## Código de conducta

Trato respetuoso, críticas constructivas y entorno colaborativo en todo momento. No se toleran el acoso, el lenguaje discriminatorio ni los ataques personales. Comunica cualquier incidencia al equipo responsable del proyecto.
