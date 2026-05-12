# Guía de contribución — TribeHub Frontend

Gracias por contribuir al frontend de TribeHub. Este documento explica cómo configurar el entorno, enviar cambios y trabajar dentro del flujo del equipo.

---

## Indice

1. [Código de conducta](#codigo-de-conducta)
2. [Configuración del entorno de desarrollo](#configuracion-del-entorno-de-desarrollo)
3. [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
4. [Convención de nomenclatura de issues](#convencion-de-nomenclatura-de-issues)
5. [Kanban y limites de WIP](#kanban-y-limites-de-wip)
6. [Lista de comprobación para Pull Requests](#lista-de-comprobacion-para-pull-requests)
7. [Requisitos de testing](#requisitos-de-testing)
8. [Guía de estilo de código](#guia-de-estilo-de-codigo)

---

## Código de conducta

Este proyecto sigue un Código de Conducta profesional estandar. Todos los colaboradores deben tratar a los demás con respeto, ofrecer críticas constructivas y mantener un entorno colaborativo. No se toleraran el acoso, el lenguaje discriminatorio ni los ataques personales. Comunica cualquier incidencia a los responsables del proyecto.

---

## Configuración del entorno de desarrollo

### Requisitos previos

- Node.js >= 20
- npm >= 10

### Instalación

```bash
cd tribehub-social_network-frontend

# Instalar dependencias
npm install
```

### Arrancar el servidor de desarrollo

```bash
npm run dev
```

El servidor de desarrollo se ejecuta actualmente en `http://localhost:5173` (Vite). Tras la migracion a Next.js se ejecutara en `http://localhost:3000`.

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de produccion
npm run preview   # Previsualizar el build de produccion (puerto 4173)
npm run lint      # ESLint
```

Tras la migración a Next.js:

```bash
npm run dev       # Servidor de desarrollo Next.js (puerto 3000)
npm run build     # Build de produccion Next.js
npm run start     # Arrancar el servidor de produccion
```

### Nota sobre la arquitectura

El proyecto es actualmente un scaffold de React 19 + Vite. La migración a **Next.js (App Router)** esta en curso. Todo el trabajo de nuevas funcionalidades debe apuntar a la arquitectura Next.js descrita en la sección de estilo de código. No añadas nuevas páginas ni funcionalidades sobre el setup de Vite.

---

## Flujo de trabajo con Git

### Ramas

Crea siempre las ramas a partir de `develop`. Los Pull Requests deben apuntar siempre a `develop`, nunca directamente a `main`.

| Tipo de rama            | Prefijo  | Ejemplo                        |
| ----------------------- | -------- | ------------------------------ |
| Nueva funcionalidad     | `feat/*` | `feat/p01-01-registro-usuario` |
| Corrección de bug       | `fix/*`  | `fix/feed-ordering-bug`        |
| Documentación           | `docs/*` | `docs/update-adr-auth`         |
| Subtarea (colaborativa) | `task/*` | `task/p01-01-login-form`       |

Para trabajo colaborativo sobre la misma funcionalidad: cada colaborador crea una rama `task/*` a partir de la rama `feat/*` compartida, integra internamente y luego se hace un único PR final a `develop`.

### Formato de commits

```
<tipo>: descripción breve en tiempo presente
```

Referencia el issue cuando corresponda:

```
feat: (#45) implementar formulario de login con validación zod
```

Tipos permitidos:

| Tipo        | Cuando usarlo                                     |
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

Reglas:

- Escribe en tiempo presente ("add component", no "added component")
- La línea de asunto no debe superar los 72 caracteres
- Sin puntuación al final de la línea de asunto
- No hagas commit de código muerto, bloques comentados ni logs de depuración

### Pull Requests

- Los PRs deben ser pequeños y revisables — prefiere cambios enfocados con un único propósito
- El título debe seguir el formato de commit
- El cuerpo debe incluir `Closes #ID` para cerrar automaticamente el issue asociado
- Se requiere mínimo 1 aprobación antes de fusionar
- Todas las comprobaciones de CI (lint, tests, build) deben pasar antes de fusionar
- No fusiones tu propio PR sin una revisión salvo acuerdo explícito del equipo

---

## Convención de nomenclatura de issues

Los issues siguen un formato estructurado para la trazabilidad entre hitos, epics y funcionalidades:

```
I-F-{EPIC}-{FEATURE}-{NUM}
```

Ejemplos:

- `I-F-P01-03-01` — Issue 01 de la Feature 03 dentro de EPIC-P01
- `I-F-P04-01-02` — Issue 02 de la Feature 01 dentro de EPIC-P04

### Referencia de epics

| Epic ID  | Ámbito                                                     |
| -------- | ---------------------------------------------------------- |
| EPIC-T00 | Enabler — infraestructura y estabilidad                    |
| EPIC-P01 | Identidad, onboarding y perfiles                           |
| EPIC-P02 | Contenido: posts y multimedia                              |
| EPIC-P03 | Interacciones sociales: comentarios, reacciones, menciones |
| EPIC-P04 | Descubrimiento: feed y busqueda                            |
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
Hito -> Epic -> Feature -> Issue -> Rama -> Commits -> Pull Request -> Merge -> Done
```

---

## Kanban y límites de WIP

El tablero tiene las siguientes columnas:

```
Backlog -> Ready For Dev -> In Progress -> In Review -> Testing/QA -> Ready for Deploy -> Done
```

Reglas:

- Límite de WIP: máximo 2 tareas por desarrollador en "In Progress" al mismo tiempo
- Una tarea no puede pasar a "In Progress" sin haber pasado antes por "Ready For Dev"
- Cada issue debe tener objetivo claro y criterios de aceptación antes de entrar en "Ready For Dev"
- La reunión de sincronización semanal es el punto principal de coordinación — no hay daily obligatorio

---

## Lista de comprobación para Pull Requests

Antes de abrir un PR, verifica todos los puntos siguientes:

**Calidad del codigo**

- [ ] El código compila sin errores (`npm run build`)
- [ ] No se han introducido regresiones
- [ ] Sin código muerto, bloques comentados ni logs de depuracion
- [ ] Sigue las convenciones de nomenclatura y la estructura de carpetas del proyecto

**Tests**

- [ ] Todos los tests existentes pasan
- [ ] Los nuevos hooks y funciones de utilidad tienen tests unitarios
- [ ] Los nuevos componentes de UI compartidos tienen tests de componente

**Lint**

- [ ] El lint pasa sin errores (`npm run lint`)

**Arquitectura**

- [ ] Sigue Feature-Sliced Design — las features no importan de otras features
- [ ] Los Server Components no usan `useState`, `useEffect` ni manejadores de eventos
- [ ] Los Client Components estan marcados explicitamente con `'use client'` al inicio del fichero
- [ ] No se almacenan tokens en `localStorage` — los refresh tokens usan solo cookies `httpOnly`
- [ ] Todos los formularios se validan con un esquema zod antes de enviar
- [ ] Sin estilos en línea — solo clases de utilidad de Tailwind
- [ ] Las peticiones autenticadas pasan por el cliente Axios en `services/api/client.ts`

**Metadatos del PR**

- [ ] El título del PR sigue el formato de commit
- [ ] El cuerpo incluye `Closes #ID`
- [ ] Vinculado al issue correcto en el tablero
- [ ] La rama apunta a `develop`, no a `main`

---

## Requisitos de testing

```bash
npm run test       # Tests unitarios (una vez configurado)
npm run lint       # Comprobacion de lint
```

Expectativas:

- Todo nuevo hook o función de utilidad en `shared/` requiere un test unitario
- Los componentes de UI compartidos en `shared/ui/` requieren tests de componente
- La cobertura de tests no debe disminuir con un PR
- Los tests no deben depender de detalles de implementación — prueba el comportamiento, no las tripas

---

## Guía de estilo de código

### General

- TypeScript en todo el proyecto — sin `any` salvo que sea inevitable y este justificado explicitamente con un comentario
- `camelCase` para variables y funciones; `PascalCase` para tipos, interfaces y componentes; `UPPER_SNAKE_CASE` para constantes
- Prefiere tipos explícitos en las signaturas de funciones publicas
- Sin imports ni variables sin usar

### Estructura de carpetas (Feature-Sliced Design)

```
app/                        # Rutas, layouts, limites de carga/error
  (auth)/                   # Rutas publicas: /login, /register
  (app)/                    # Zona autenticada: /feed, /profile/:id, ...
features/
  auth/
  profile/
  interests/
  posts/
  feed/
  search/
shared/
  ui/                       # Biblioteca de componentes base (Button, Input, Modal, Card...)
  lib/                      # Helpers, formateadores, constantes
  hooks/                    # Hooks genericos reutilizables
  types/                    # Tipos compartidos entre dominios
services/
  api/                      # Instancia Axios, interceptores, mapeo de errores
  server/                   # Wrapper de fetch tipado para Server Components
```

### Aislamiento de features

- Una feature (`features/<domain>/`) no debe importar de otra feature
- Las features solo pueden importar de `shared/*` y `services/*`
- Los tipos especificos de un dominio pertenecen a `features/<domain>/types.ts`
- Los tipos compartidos entre dominios pertenecen a `shared/types/`
- Los componentes de UI reutilizables pertenecen a `shared/ui/` — no se permite logica de dominio ahi

### Server Components vs Client Components

| Escenario                              | Tipo de componente                | Obtencion de datos         |
| -------------------------------------- | --------------------------------- | -------------------------- |
| Renderizado inicial de pagina, SEO     | Server Component                  | `services/server/fetch.ts` |
| Formularios, mutaciones, interacciones | Client Component (`'use client'`) | TanStack Query + Axios     |
| Tiempo real, suscripciones             | Client Component (`'use client'`) | TanStack Query + Axios     |

No uses TanStack Query en Server Components.

### Estilos

- Solo clases de utilidad de Tailwind — sin estilos en linea, sin CSS Modules, sin styled-components
- Se usa Tailwind v4 mediante `@tailwindcss/vite` — no se necesita `tailwind.config.js`

### Formularios

- Todos los formularios usan `react-hook-form` con un esquema `zod` para la validacion
- Valida en el cliente antes de cualquier peticion de red
- Muestra mensajes de error a nivel de campo usando los mensajes de error del esquema zod

### API y obtención de datos

- Todas las peticiones autenticadas pasan por la instancia Axios en `services/api/client.ts`
  - Configurada con `baseURL: '/api/v1'` y `withCredentials: true`
- La rotacion de tokens y el manejo de errores 401 viven exclusivamente en `services/api/interceptors.ts` — no dupliques esta logica en features ni componentes
- No crees instancias Axios ad-hoc ni llamadas `fetch` directas que salten la cadena de interceptores
- Los access tokens van en la cabecera `Authorization: Bearer <token>`
- Los refresh tokens son cookies `httpOnly` — nunca almacenes tokens en `localStorage` ni en `sessionStorage`

### Subida de imágenes

La subida de imágenes usa el flujo de URL prefirmada en dos pasos:

1. `POST /assets/init` — solicita una URL prefirmada al backend, recibe `assetId` y `url`
2. `PUT <url-prefirmada>` — el cliente sube el fichero directamente al almacenamiento
3. `POST /assets/complete` — asocia el `assetId` con el post o el perfil
