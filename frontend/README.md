# TenantBase Frontend

A modern React frontend for the TenantBase multi-tenant project management system.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Multi-tenant Support**: Create, join, and switch between tenants
- **Project Management**: Create and manage projects within tenants
- **Task Management**: Create, view, and update tasks within projects
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript support

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   └── Layout/         # Layout components
├── contexts/           # React contexts
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the TenantBase backend API:

- **Authentication**: `/auth/login`, `/auth/register`
- **Tenants**: `/tenant/my`, `/tenant/`, `/tenant/join`
- **Projects**: `/project/`, `/project/list/:tenantId`
- **Tasks**: `/task/`, `/task/:projectId`, `/task/:taskId`

## Environment Variables

The frontend expects the backend API to be running on `http://localhost:3000`. To change this, update the `API_BASE_URL` in `src/services/api.ts`.

## Features Overview

### Authentication Flow
1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. User is redirected to dashboard on successful login

### Multi-tenant Architecture
- Users can belong to multiple tenants
- Each tenant has its own projects and tasks
- Users can switch between tenants
- Role-based access (ADMIN/MEMBER)

### Project Management
- Create projects within tenants (ADMIN only)
- View all projects for current tenant
- Navigate to project tasks

### Task Management
- Create tasks within projects
- View tasks with filtering by status
- Update task details
- Assign tasks to users

## Styling

The application uses Tailwind CSS with custom components:

- `.btn` - Button base styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Form input styles
- `.card` - Card container styles

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new components
3. Follow the established naming conventions
4. Test your changes thoroughly

## License

This project is part of the TenantBase system.