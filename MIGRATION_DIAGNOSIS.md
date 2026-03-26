# Diagnóstico de Migración (Fase 1)

## Resumen de comparación

### Proyecto origen (`TribeHub_FrontEnd`)
- Arquitectura: Next.js App Router bajo `src/`
- Funcionalidad principal implementada: autenticación (login/register), sesión por cookie HttpOnly, ruta protegida `/feed`, middleware de guardia
- UI: componentes reutilizables de formulario (`Button`, `Input`), estilos globales con tokens de marca
- Backend integration: Route Handlers `/api/auth/login` y `/api/auth/register` con proxy a backend externo (`AUTH_API_BASE_URL`)
- Runtime/PM: Bun (con `bun.lock` y `packageManager`)

### Proyecto destino (`tribehub-social_network-frontend`)
- Arquitectura: Next.js App Router en raíz `app/` (sin `src/`)
- Estado funcional: setup base (home estática), sin auth real ni rutas protegidas
- Tooling: Next 16 + React 19 + ESLint/Jest + Tailwind 4
- Config avanzada: cabeceras de seguridad en `next.config.ts`
- PM actual: npm lock inicial; sin integración explícita de Bun en `package.json`

## Qué módulos existen en origen y no en destino
- Flujo completo de autenticación (UI + cliente + Route Handlers + sesión)
- Rutas de auth (`/login`, `/register`) y ruta protegida (`/feed`)
- Guard de rutas en borde (`middleware.ts`)
- Librería `lib/auth/*` (tipos, constantes, sesión, cliente)
- Componentes UI reutilizables para formularios

## Qué sí conviene migrar
- Librería de auth (`lib/auth/*`) con validaciones y manejo de errores
- Route Handlers de login/register (adaptados a Next 16)
- Pantallas auth + componentes reutilizables
- Ruta `/feed` protegida por sesión
- Estilos globales de marca (tokens CSS y animación de entrada)
- Variables de entorno mínimas (`AUTH_API_BASE_URL`)

## Qué no conviene migrar (descartar)
- Copia literal de `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs` del origen
- Estructura `src/` completa (destino ya tiene arquitectura en raíz)
- Dependencias redundantes del origen (Tailwind v3/autoprefixer/postcss heredados)
- `middleware.ts` legacy en Next 16 (se migra a `proxy.ts`)

## Refactors necesarios antes de integrar
- Sustituir `middleware` por `proxy` (deprecación en Next 16)
- Alinear alias `@` para soportar imports desde raíz del destino
- Adaptar estilos de Tailwind v3 directives a esquema actual del destino (Tailwind v4)
- Ajustar tests existentes para comportamiento nuevo (`/` redirige a `/login`)

## Conflictos técnicos detectados
1. Alias conflictivo en destino: `turbopack.resolveAlias` apuntaba `@` a `./app`, incompatible con módulos `lib/` y `components/`.
2. Diferencia de estructura: origen usa `src/`, destino usa raíz.
3. Diferencia de convención Next 16: `middleware` deprecado en favor de `proxy`.
4. Diferencia de estilos Tailwind: origen en sintaxis v3, destino en setup v4.

## Estrategia de migración aplicada
1. Mantener base arquitectónica/configuración del destino.
2. Migrar funcionalidad útil del origen por bloques (auth, rutas, UI, servicios).
3. Refactorizar en integración para cumplir Next 16 y evitar deuda técnica.
4. Integrar Bun sin romper scripts actuales ni linting del destino.
