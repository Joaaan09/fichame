# 📌 Fichame - Documentación del Proyecto

## Descripción

Fichame es una aplicación de control de jornadas laborales. Permite a los usuarios registrarse, crear categorías de trabajo y registrar sesiones de trabajo con check-in/check-out.

---

## 🏗️ Arquitectura

```
fichame/
├── docker-compose.yaml
├── DOCUMENTATION.md
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── .dockerignore
│   ├── package.json
│   ├── index.js                     # Entry point del servidor
│   ├── database/
│   │   └── connection.js            # Conexión a MongoDB
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── WorkSession.js
│   ├── controllers/
│   │   ├── UserController.js
│   │   ├── CategoryController.js
│   │   └── WorkSessionController.js
│   ├── routes/
│   │   ├── user.js
│   │   ├── category.js
│   │   └── workSession.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── helpers/
│   │   └── validate.js
│   └── services/
│       └── jwt.js
└── frontend/
    ├── Dockerfile
    ├── vite.config.js               # Proxy /api → backend:3000
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx                 # Entry point
        ├── App.jsx                  # Layout principal + Routing
        ├── assets/
        │   └── css/
        │       ├── index.css        # Estilos globales + variables CSS
        │       └── responsive.css   # Media queries
        ├── components/
        │   ├── layout/
        │   │   ├── public/
        │   │   │   ├── PublicLayout.jsx   # Layout sin auth (login, registro)
        │   │   │   └── Header.jsx         # Header público (logo)
        │   │   └── private/
        │   │       ├── PrivateLayout.jsx   # Layout con auth (dashboard)
        │   │       └── Header.jsx          # Header privado (nav, categorías)
        │   ├── pages/
        │   │   └── Home.jsx               # Dashboard principal (timer, fichaje)
        │   └── user/
        │       ├── Login.jsx              # Formulario de login
        │       └── Register.jsx           # Formulario de registro
        ├── context/
        │   └── AuthProvider.jsx     # Contexto global de autenticación
        ├── hooks/
        │   ├── useAuth.jsx          # Hook para acceder al contexto auth
        │   └── useForm.jsx          # Hook para formularios
        ├── helpers/
        │   └── Global.js            # Constantes globales (API URL)
        └── router/
            └── Routing.jsx          # Definición de rutas (react-router-dom)
```

---

## 🔧 Stack Tecnológico

### Backend

| Tecnología | Uso |
|---|---|
| **Node.js 20** | Runtime del servidor |
| **Express 5** | Framework web |
| **MongoDB** | Base de datos NoSQL |
| **Mongoose** | ODM para MongoDB |
| **bcryptjs** | Cifrado de contraseñas |
| **jwt-simple** | Codificación/decodificación JWT |
| **moment** | Manejo de fechas (expiración tokens) |
| **validator** | Validación de inputs |
| **dotenv** | Variables de entorno |
| **cors** | Control de acceso cruzado |

### Frontend

| Tecnología | Uso |
|---|---|
| **React 19** | Librería UI |
| **Vite** | Bundler + dev server con HMR |
| **react-router-dom** | Enrutamiento SPA |

---

## 🐳 Docker

### Servicios (docker-compose.yaml)

| Servicio | Imagen | Puerto | Descripción |
|---|---|---|---|
| `server` | `fichame-server` (build local) | 3000 | Backend API |
| `client` | `fichame-frontend` (build local) | 5173 (dev) | Frontend React |
| `mongodb` | `mongo:latest` | - | Base de datos |

### Comandos útiles

```bash
# Reconstruir y arrancar el backend
docker compose up -d --build server

# Ver logs del backend
docker logs fichame-backend --tail 20

# Parar todos los servicios
docker compose down

# Frontend en desarrollo (sin Docker, con hot reload)
cd frontend && npm run dev

# Backend en desarrollo (sin Docker)
cd backend && npx nodemon index.js
```

### Red

Todos los servicios usan la red externa `reverse_proxy_network` para integrarse con Nginx Proxy Manager.

---

## 🗄️ Variables de Entorno (.env)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://mongodb_fichame:27017/fichame` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `(cadena generada)` |
| `NODE_ENV` | Entorno de ejecución | `production` |

---

## 📊 Modelos de Datos

### User

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | ObjectId | ID auto-generado |
| `name` | String | Nombre del usuario |
| `email` | String | Email (único) |
| `password` | String | Contraseña cifrada con bcrypt |

### Category

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | ObjectId | ID auto-generado |
| `user` | ObjectId (ref: User) | Usuario propietario |
| `name` | String | Nombre de la categoría |
| `color` | String | Color asociado |

### WorkSession

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | ObjectId | ID auto-generado |
| `user` | ObjectId (ref: User) | Usuario propietario |
| `categoryId` | ObjectId (ref: Category) | Categoría asignada |
| `description` | String | Descripción de la sesión |
| `checkIn` | Date | Hora de entrada |
| `checkOut` | Date | Hora de salida (null si jornada activa) |

---

## 🔐 Autenticación (JWT)

### Flujo

```
1. POST /api/user/login → { email, password }
2. Backend valida credenciales → genera token JWT (30 días)
3. Frontend guarda el token en localStorage
4. Peticiones protegidas → Header: Authorization: <token>
5. Middleware auth.js decodifica → inyecta req.user con datos del usuario
```

### Payload del Token

```json
{
    "id": "usuario_id",
    "name": "Joan",
    "email": "joan@test.com",
    "iat": 1739913600,
    "exp": 1742505600
}
```

> ⚠️ **Importante**: `req.user` usa `id` (sin guion bajo). Los modelos Mongoose usan `_id`.

---

## 🛣️ API Endpoints

### 👤 Usuarios (`/api/user`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/register` | ❌ | Registrar nuevo usuario |
| `POST` | `/login` | ❌ | Iniciar sesión (devuelve token) |
| `PUT` | `/update` | ✅ | Editar perfil del usuario logueado |

#### POST /api/user/register

**Body:**
```json
{
    "name": "Joan",
    "email": "joan@test.com",
    "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
    "status": "success",
    "message": "Usuario registrado correctamente",
    "user": { "id": "...", "name": "Joan", "email": "joan@test.com" }
}
```

#### POST /api/user/login

**Body:**
```json
{
    "email": "joan@test.com",
    "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
    "status": "success",
    "message": "Usuario logueado correctamente",
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "Joan", "email": "joan@test.com" }
}
```

#### PUT /api/user/update

**Headers:** `Authorization: <token>`

**Body (password opcional):**
```json
{
    "name": "Joan Actualizado",
    "email": "joan_nuevo@test.com"
}
```

---

### 📂 Categorías (`/api/category`)

> Todas las rutas requieren autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/create` | Crear categoría |
| `GET` | `/list` | Listar categorías del usuario |
| `DELETE` | `/remove/:id` | Eliminar categoría por ID |

#### POST /api/category/create

**Headers:** `Authorization: <token>`

**Body:**
```json
{
    "name": "Trabajo",
    "color": "#FF5733"
}
```

#### GET /api/category/list

**Headers:** `Authorization: <token>`

**Respuesta:** Lista de categorías del usuario ordenadas por nombre (A→Z)

#### DELETE /api/category/remove/:id

**Headers:** `Authorization: <token>`

> Solo puede borrar categorías propias

---

### ⏱️ Jornadas (`/api/work-session`)

> Todas las rutas requieren autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/start` | Empezar jornada (check-in automático) |
| `POST` | `/end` | Acabar jornada (check-out automático) |
| `POST` | `/create` | Crear jornada manual |
| `PUT` | `/update/:id` | Editar jornada existente |
| `GET` | `/list` | Listar jornadas del usuario |
| `GET` | `/active` | Obtener jornada activa (sin checkOut) |
| `DELETE` | `/remove/:id` | Eliminar jornada |

#### POST /api/work-session/start

**Headers:** `Authorization: <token>`

**Body:**
```json
{
    "checkIn": 1739913600000,
    "categoryId": "category_id"
}
```

**Respuesta exitosa:**
```json
{
    "status": "success",
    "message": "Jornada empezada correctamente",
    "workSession": { "_id": "...", "user": "...", "categoryId": "...", "checkIn": "..." }
}
```

#### POST /api/work-session/end

**Headers:** `Authorization: <token>`

**Body:**
```json
{
    "workSessionId": "session_id"
}
```

#### GET /api/work-session/active

**Headers:** `Authorization: <token>`

**Respuesta:** La jornada activa del usuario (sin `checkOut`) o `null`.

#### POST /api/work-session/create

**Headers:** `Authorization: <token>`

**Body:**
```json
{
    "categoryId": "category_id",
    "description": "Reunión",
    "checkIn": "2026-02-19T09:00:00",
    "checkOut": "2026-02-19T17:00:00"
}
```

#### GET /api/work-session/list

**Headers:** `Authorization: <token>`

**Respuesta:** Lista de jornadas del usuario ordenadas por checkIn (más reciente primero)

---

## 🖥️ Frontend (React + Vite)

### Enrutamiento

```
/                 → PublicLayout → Login (si no auth)
/login            → PublicLayout → Login
/registro         → PublicLayout → Register
/home             → PrivateLayout → Home (dashboard con timer)
```

### Flujo de autenticación

```
1. Usuario inicia sesión en Login.jsx
2. Token se guarda en localStorage
3. AuthProvider verifica token al cargar (GET /api/user/profile)
4. PublicLayout: si auth → redirige a /home
5. PrivateLayout: si no auth → redirige a /
```

### Componentes clave

| Componente | Función |
|---|---|
| `AuthProvider` | Contexto global: verifica token, guarda datos del usuario |
| `PublicLayout` | Layout para páginas sin auth (Login, Register) |
| `PrivateLayout` | Layout para páginas con auth (Home). Carga categorías |
| `Home` | Dashboard: timer, botón fichaje (start/end), stats del día |
| `Header (private)` | Navegación + selector de categoría con dropdown |
| `useForm` | Hook para gestionar formularios (onChange → state) |
| `useAuth` | Hook para acceder al contexto de autenticación |

### Proxy (Vite → Backend)

En `vite.config.js`, las peticiones a `/api` se redirigen al backend:

```js
server: {
    proxy: {
        '/api': 'http://localhost:3000'
    }
}
```

### Variables CSS principales

```css
--bg-body: #F5F5F7         /* Fondo general */
--bg-card: #FFFFFF         /* Fondo tarjetas */
--text-primary: #1D1D1F    /* Texto principal */
--text-secondary: #86868B  /* Texto secundario */
--accent-blue: #0071E3     /* Azul Apple */
--accent-green: #34C759    /* Botón start */
--accent-red: #FF3B30      /* Botón stop / errores */
```

---

## 🧩 Patrones del Proyecto

### Estructura de respuesta estándar

```json
{
    "status": "success | error",
    "message": "Descripción del resultado",
    "data": { }
}
```

### Flujo de una petición

```
Frontend (fetch) → Vite Proxy → Express Router → [auth middleware] → Controller → Mongoose → MongoDB
                                                                          ↓
                                                                    Respuesta JSON
```


