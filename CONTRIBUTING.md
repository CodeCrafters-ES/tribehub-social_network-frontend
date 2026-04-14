# Guía de contribución — TribeHub Frontend

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
bun run dev   # Inicia el servidor en http://localhost:5173
```

---

## 3. Comandos disponibles

| Comando            | Descripción                                      |
|--------------------|--------------------------------------------------|
| `bun run dev`      | Servidor de desarrollo                           |
| `bun run build`    | Compilación de producción                        |
| `bun run start`    | Inicia la build de producción compilada          |
| `bun run lint`     | Ejecuta ESLint sobre el proyecto                 |
| `bun run typecheck`| Verificación de tipos con TypeScript             |
| `bun run check`    | Ejecuta lint y typecheck en conjunto             |
| `bun run test`     | Ejecuta la suite de tests                        |
| `bun run test:watch` | Tests en modo watch                           |

---

## 4. Arquitectura FSD — reglas para contribuidores

Esta sección es crítica. Todo el código nuevo debe respetar la estructura Feature-Sliced Design (FSD) del proyecto.

### Estructura de directorios

```
app/                  # Rutas, layouts y boundaries (loading.tsx, error.tsx)
  (auth)/             # Rutas públicas: /login, /register
  (app)/              # Zona autenticada: /feed, /profile/[id], ...

features/             # Funcionalidades de dominio, una carpeta por dominio
  auth/
  profile/
  interests/
  posts/
  feed/
  search/

shared/               # Código reutilizable sin lógica de dominio
  ui/                 # Componentes base: Button, Input, Modal, Card, Avatar...
  lib/                # Helpers, formateadores, constantes
  hooks/              # Hooks genéricos: useDebounce, useMediaQuery...
  types/              # Tipos compartidos entre dominios

services/             # Capa de comunicación con el backend
  api/                # Instancia Axios, interceptores, manejo de errores
  server/             # Wrapper tipado de fetch para Server Components
```

### Regla de aislamiento de features

Un feature **no puede importar de otro feature**. Solo puede importar desde:

- `shared/*`
- `services/*`

Incorrecto:
```ts
// features/feed/components/FeedPost.tsx
import { useProfile } from '@/features/profile/hooks/useProfile'; // NO permitido
```

Correcto:
```ts
// features/feed/components/FeedPost.tsx
import { Avatar } from '@/shared/ui/Avatar'; // OK
import { apiClient } from '@/services/api/client'; // OK
```

### Tipos de dominio y tipos compartidos

- Los tipos propios de un dominio se definen en `features/<domain>/types.ts`
- Los tipos que cruzan fronteras entre dominios se definen en `shared/types/`

### Server Components

Se usan para el render inicial, SEO y rendimiento. Restricciones:

- No pueden contener `useState`, `useEffect` ni event handlers
- Los datos se obtienen a través de `services/server/`
- No usar TanStack Query en Server Components

### Client Components

Se usan para interacciones, formularios, mutaciones y datos en tiempo real.

- Deben declarar `'use client'` al inicio del archivo
- Usan TanStack Query + Axios para obtener y mutar datos

### Componentes de `shared/ui/`

Los componentes en `shared/ui/` son genéricos y **no deben contener lógica de dominio**. No deben importar de ningún feature ni acoplar comportamiento específico de negocio.

---

## 5. Estrategia de ramas

- Siempre crear la rama desde `develop`
- Los PRs siempre apuntan a `develop`, nunca directamente a `main`

| Prefijo    | Uso                                                  | Ejemplo                          |
|------------|------------------------------------------------------|----------------------------------|
| `feat/*`   | Nueva funcionalidad                                  | `feat/p01-login-form`            |
| `fix/*`    | Corrección de bugs                                   | `fix/feed-cursor-pagination`     |
| `docs/*`   | Documentación                                        | `docs/update-contributing`       |
| `task/*`   | Sub-tarea dentro de una feature (trabajo colaborativo) | `task/p01-auth-hook`           |

### Flujo colaborativo

Cuando varias personas trabajan en la misma feature:

1. Se crea una rama `feat/*` compartida como base
2. Cada colaborador crea su propia rama `task/*` desde esa `feat/*`
3. Cada `task/*` se integra en la `feat/*` compartida mediante PRs internos
4. Un único PR final lleva la `feat/*` completa a `develop`

---

## 6. Convenciones de commits

Formato: `<type>: descripción breve en presente`

| Tipo         | Uso                                                     |
|--------------|---------------------------------------------------------|
| `feat:`      | Nueva funcionalidad                                     |
| `fix:`       | Corrección de bug                                       |
| `refactor:`  | Cambio interno sin cambio de comportamiento             |
| `docs:`      | Documentación                                           |
| `test:`      | Tests                                                   |
| `chore:`     | Tareas menores (config, scripts, CI/CD)                 |
| `style:`     | Formato sin impacto funcional                           |
| `perf:`      | Mejoras de rendimiento                                  |
| `task:`      | Sub-tarea dentro de una feature (trabajo colaborativo)  |

Cuando aplique, referenciar el issue en el mensaje:

```
feat: (#45) implement group join request flow
```

No usar scope en el type. Incorrecto: `feat(auth): login form`. Correcto: `feat: (#12) add login form`.

---

## 7. Proceso de Pull Request

- Los PRs deben ser pequeños y revisables
- Incluir `Closes #ID` en la descripción para el cierre automático del issue
- Ejecutar `bun run check` y `bun run test` antes de abrir el PR
- El PR debe pasar el CI completo: lint + typecheck + build + tests
- Se requiere un mínimo de 1 aprobación antes del merge
- No incluir dead code, `console.log` ni prints de debug
- La descripción debe explicar claramente el propósito del cambio

---

## 8. PR readiness checklist

Antes de marcar el PR como listo para revisión, verificar:

- [ ] El código compila sin errores (`bun run build`)
- [ ] Los tipos son correctos (`bun run typecheck`)
- [ ] Sin regresiones (`bun run test`)
- [ ] Sigue las convenciones de arquitectura FSD
- [ ] El PR referencia el issue con `Closes #ID`
- [ ] Sin dead code, `console.log` ni prints de debug
- [ ] La descripción explica el propósito del cambio

---

## 9. Nomenclatura de issues

Formato: `I-F-{EPIC}-{FEATURE}-{NUM}`

| Parte     | Descripción                        |
|-----------|------------------------------------|
| `EPIC`    | Código del epic (ej. `P01`)        |
| `FEATURE` | Número de feature dentro del epic  |
| `NUM`     | Número de issue dentro del feature |

Ejemplo: `I-F-P01-03-01` corresponde al Issue 01 de la Feature 03 del EPIC-P01.

---

## 10. CI y deploy

- El pipeline de CI se ejecuta en cada push: lint + typecheck + build + tests
- Netlify generará una preview URL por cada PR (pendiente de configurar)
- Los PRs deben pasar el CI completo antes de poder hacer merge
