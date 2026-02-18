# 📌 Fichame - Documentación del Proyecto

## Descripción

Fichame es una aplicación de control de jornadas laborales. Permite a los usuarios registrarse, crear categorías de trabajo y registrar sesiones de trabajo con check-in/check-out.

---

## 🏗️ Arquitectura

```
fichame/
├── docker-compose.yaml          # Orquestador de servicios
├── backend/
│   ├── Dockerfile               # Imagen Docker del backend
│   ├── .env                     # Variables de entorno (no se sube a git)
│   ├── .dockerignore            # Archivos excluidos del build
│   ├── package.json             # Dependencias del proyecto
│   ├── index.js                 # Punto de entrada del servidor
│   ├── database/
│   │   └── connection.js        # Conexión a MongoDB
│   ├── models/                  # Esquemas de Mongoose
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── WorkSession.js
│   ├── controllers/             # Lógica de negocio
│   │   ├── UserController.js
│   │   ├── CategoryController.js
│   │   └── WorkSessionController.js
│   ├── routes/                  # Definición de endpoints
│   │   ├── user.js
│   │   └── category.js
│   ├── middlewares/             # Interceptores de peticiones
│   │   └── auth.js
│   ├── helpers/                 # Funciones auxiliares simples
│   │   └── validate.js
│   └── services/                # Lógica compleja con librerías externas
│       └── jwt.js
└── frontend/                    # (por desarrollar)
```

---

## 🔧 Stack Tecnológico

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
| **Docker** | Contenerización |

---

## 🐳 Docker

### Servicios (docker-compose.yaml)

| Servicio | Imagen | Puerto | Descripción |
|---|---|---|---|
| `server` | `fichame-server` (build local) | 3000 | Backend API |
| `client` | `fichame-frontend` (build local) | - | Frontend (pendiente) |
| `mongodb` | `mongo:latest` | - | Base de datos |

### Comandos útiles

```bash
# Reconstruir y arrancar el backend
docker compose up -d --build server

# Ver logs del backend
docker logs fichame-backend --tail 20

# Parar todos los servicios
docker compose down

# Entrar al contenedor del backend
docker exec -it fichame-backend sh
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

### WorkSession (🚧 en desarrollo)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | ObjectId | ID auto-generado |
| `userId` | ObjectId | Usuario propietario |
| `categoryId` | ObjectId | Categoría asignada |
| `description` | String | Descripción de la sesión |
| `checkIn` | Date | Hora de entrada |
| `checkOut` | Date | Hora de salida |

---

## 🔐 Autenticación (JWT)

### Flujo

```
1. POST /api/user/login → { email, password }
2. Backend valida credenciales → genera token JWT (30 días)
3. Frontend guarda el token
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
    "user": {
        "id": "...",
        "name": "Joan",
        "email": "joan@test.com"
    }
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
    "user": {
        "id": "...",
        "name": "Joan",
        "email": "joan@test.com"
    }
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

**Respuesta exitosa:**
```json
{
    "status": "success",
    "message": "Categoria creada correctamente",
    "category": {
        "id": "...",
        "name": "Trabajo",
        "color": "#FF5733"
    }
}
```

#### GET /api/category/list

**Headers:** `Authorization: <token>`

**Respuesta:** Lista de categorías del usuario ordenadas por nombre (A→Z)

#### DELETE /api/category/remove/:id

**Headers:** `Authorization: <token>`

> Solo puede borrar categorías propias

---

### ⏱️ Jornadas (`/api/worksession`) — 🚧 En desarrollo

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/start` | Empezar jornada (check-in) |
| `PUT` | `/end/:id` | Acabar jornada (check-out) |
| `POST` | `/create` | Crear jornada manual |
| `GET` | `/list` | Listar jornadas |
| `DELETE` | `/remove/:id` | Eliminar jornada |

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
Cliente → Ruta → [Middleware auth] → Controller → Modelo → MongoDB
                                         ↓
                                    Respuesta JSON
```

### Reglas importantes

1. **Siempre `await`** en llamadas a Mongoose (`.find()`, `.save()`, `.findById()`, etc.)
2. **Nunca catch vacío** — siempre devolver respuesta de error con `res.status(500).json(...)`
3. **Comparar ObjectId con string** usando `.toString()` → `category.user.toString() !== req.user.id`
4. **Password nunca en respuestas** — devolver solo `id`, `name`, `email`
5. **Rebuild tras cambios** → `docker compose up -d --build server`

---

## 📝 Pendiente por Implementar

- [ ] **WorkSession**: Completar controller (start, end, create, list, remove)
- [ ] **WorkSession**: Crear rutas
- [ ] **WorkSession**: Arreglar modelo (usar `Schema.ObjectId` con `ref` en vez de `ObjectId`)
- [ ] **Category**: Función editar categoría
- [ ] **User**: Ruta de perfil (`/profile/:id`)
- [ ] **Frontend**: Desarrollo completo
- [ ] **MongoDB**: Añadir autenticación para producción
- [ ] **Seguridad**: Validar formato de email en login
- [ ] **Register**: Migrar bcrypt de callback a async/await
