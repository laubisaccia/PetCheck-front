# PetCheck - Sistema de Gestión Veterinaria

Sistema web moderno para la administración de clínicas veterinarias que permite gestionar turnos, clientes, mascotas y médicos de forma eficiente e intuitiva.

## Características Principales

- **Gestión de Turnos**: Visualización de citas en formato tabla o calendario
- **Administración de Clientes**: Registro y gestión completa de clientes
- **Gestión de Mascotas**: Control de mascotas asociadas a cada cliente
- **Panel de Médicos**: Administración de profesionales veterinarios
- **Dashboard Interactivo**: Estadísticas en tiempo real (turnos del día, semanal, total de clientes y mascotas)
- **Sistema de Autenticación**: Login seguro con JWT
- **Roles de Usuario**: Diferenciación entre administradores y empleados
- **Tema Claro/Oscuro**: Modo oscuro con cambio dinámico de logo
- **Notificaciones**: Sistema de toasts para feedback al usuario
- **Validaciones**: Validación de formularios en tiempo real
- **Skeleton Loaders**: Indicadores de carga para mejor UX

## Tecnologías Utilizadas

### Frontend Core

- **React 19** - Librería principal para construir la interfaz
- **TypeScript** - Tipado estático para código más robusto
- **Vite** - Build tool moderno y rápido

### Enrutamiento y Estado

- **React Router DOM** - Navegación entre páginas
- **Next Themes** - Sistema de temas (modo claro/oscuro)

### Estilos y UI

- **Tailwind CSS v4** - Framework utility-first
- **Radix UI** - Componentes accesibles (Dialog, Tabs, Dropdown, etc.)
- **Lucide React** - Iconografía moderna
- **Class Variance Authority** - Gestión de variantes de componentes

### Utilidades

- **JWT Decode** - Manejo de autenticación con tokens
- **Sonner** - Sistema de notificaciones
- **clsx + tailwind-merge** - Manejo de clases CSS condicionales

## Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- Acceso al backend de PetCheck (repositorio separado)

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/laubisaccia/PetCheck-front.git
cd PetCheck-front
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar el backend:

   - Asegurarse de que el backend esté corriendo en `http://localhost:8000`
   - El frontend espera la API en ese endpoint

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila el proyecto para producción
npm run preview      # Previsualiza la build de producción
npm run lint         # Ejecuta el linter
```

## Estructura del Proyecto

```
src/
├── assets/              # Imágenes y recursos estáticos
├── components/
│   ├── ui/             # Componentes de UI reutilizables
│   ├── info-cards-group.tsx
│   └── theme-provider.tsx
├── pages/              # Páginas principales
│   ├── dashboard.tsx
│   └── login-form.tsx
├── utils/              # Utilidades y helpers
│   └── auth.ts         # Funciones de autenticación
├── App.tsx             # Componente principal
└── main.tsx           # Punto de entrada

```

## Funcionalidades por Rol

### Administrador

- Acceso completo a todas las funcionalidades
- Gestión de usuarios del sistema
- Gestión de médicos
- Visualización y administración de turnos, clientes y mascotas

### Empleado

- Gestión de turnos
- Gestión de clientes y mascotas
- Visualización de estadísticas

## Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:

1. El usuario ingresa credenciales en el login
2. El backend valida y retorna un token JWT
3. El token se almacena en `localStorage`
4. Cada petición incluye el token en el header `Authorization: Bearer {token}`
5. El token contiene información del usuario (email, rol, expiración)

## Endpoints de la API

El frontend consume los siguientes endpoints del backend:

- `POST /api/v1/login` - Autenticación
- `GET /api/v1/appointments/with-names` - Obtener turnos
- `GET /api/v1/customers` - Obtener clientes
- `GET /api/v1/doctors` - Obtener médicos
- `POST /api/v1/users` - Crear usuario (admin)
- `POST /api/v1/customers` - Crear cliente
- `POST /api/v1/pets` - Crear mascota
- Y más...

## Características de UX/UI

- **Diseño Responsive**: Adaptado a diferentes tamaños de pantalla
- **Modo Oscuro**: Cambia automáticamente el logo según el tema
- **Validación en Tiempo Real**: Feedback inmediato en formularios
- **Skeleton Loaders**: Mejor percepción de velocidad durante la carga
- **Notificaciones Toast**: Confirmaciones y errores claros
- **Iconografía Consistente**: Icons de Lucide React

## Contribución

Para contribuir con el proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commitea tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abri un Pull Request

---

**PetCheck** - Simplificando la gestión veterinaria 🐾
