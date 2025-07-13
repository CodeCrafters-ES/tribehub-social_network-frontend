# 🤝 Guía de Contribución

### ¡Gracias por tu interés en contribuir a este proyecto! 🎉  
Este documento explica cómo colaborar de forma clara, segura y ordenada.

---

## 📌 Requisitos Previos

Asegúrate de tener instalado:
- Node.js >= 18.x
- npm >= 9.x (o yarn/pnpm)

---

## 🚀 Flujo de Trabajo

## ⚙️ Instalación del Entorno de Desarrollo

Sigue estos pasos para poner en marcha el proyecto localmente:

### 1️⃣ Haz un *Fork*

Haz clic en **Fork** en la parte superior derecha para crear tu copia del repositorio en tu cuenta.

---

### 2️⃣ **Clona tu *fork***

```bash
# Clona TU fork (reemplaza <TU_USUARIO> y <TU_REPOSITORIO>)
git clone https://github.com/<TU_USUARIO>/<TU_REPOSITORIO>.git

```

#### Entra a la carpeta del proyecto

```bash
cd <TU_REPOSITORIO>
```

### Agrega el repositorio original como remoto "upstream"

```bash
git remote add upstream https://github.com/CodeCrafters-ES/social-network-webapp-frontend.git
```

### 3️⃣ **Instala dependencias**

```bash
npm install
```

### 4️⃣ Inicia el servidor de desarrollo

```bash
npm run dev
```

Abre <http://localhost:5173> para ver la aplicación en tu navegador.

## 📁 Estructura de Carpetas

```bash
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│       ├── auth/
│       ├── dashboard/
│   ├── pages/
│       ├── HomePage/
│           ├── index.jsx/
│       ├── LandingPage/
│           ├── index.jsx/
│       ├── NotFoundPage/
│           ├── index.jsx/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .gitignore
```

## 👩‍💻 Flujo de Trabajo Colaborativo

### 1️⃣ Mantén tu fork sincronizado

Antes de empezar, actualiza tu rama dev local con los últimos cambios del repositorio principal:

```bash
# Cambia a dev
git checkout dev

# Busca los últimos cambios del original (upstream)
git fetch upstream

# Fusiona cambios en tu rama dev
git merge upstream/dev

# Sube tu rama dev actualizada a TU fork
git push origin dev
```

### 2️⃣ Crea una rama feature desde dev

```bash
git checkout -b feature/<nombre-de-la-feature>
```

Ejemplo:

```bash
git checkout -b feature/add-login-page
```

### 3️⃣ Trabaja en tu rama

- Realiza los cambios necesarios.
- Añade los archivos modificados:

```bash
git add .
```

```bash
git commit -m "feat: agregar página de login"
```

### 4️⃣ Sube tu rama feature a tu fork

```bash
git push origin feature/<nombre-de-la-feature>
```

### 5️⃣ Crea un Pull Request

1. Desde la página de tu fork en GitHub, haz clic en Compare & Pull Request.

2. Abre un PR de tu rama feature/... hacia la rama dev del repositorio original.

3. Asigna revisores, añade una descripción clara y sigue las pautas de revisión.

4. Espera la aprobación antes de mergear.

## ✅ Scripts Disponibles

| Script            | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia servidor de desarrollo            |
| `npm run build`   | Construye versión de producción          |
| `npm run preview` | Visualiza build de producción localmente |

## 🤝 Convenciones

- Todas las ramas feature/ deben basarse en dev.
- Los PRs apuntan siempre a la rama dev del repositorio original.
- Usa commits claros siguiendo Conventional Commits.

## 📝 Notas

- Si tienes dudas sobre configuración, dependencias o flujo de trabajo, abre una issue o consulta con el responsable del equipo.
- Para agregar nuevas dependencias, consulta con el equipo.
- Se recomienda usar eslint y prettier para mantener el código limpio y consistente.

---

**✅ Diferencias clave:**

- El repositorio original se mantiene limpio y protegido.
- Cada colaborador mantiene su copia (*fork*).
- Se agrega `upstream` para sincronizar cambios.
- Todos los *PRs* se abren contra `dev` del **repo principal**.
