# Backend API of the TIZKOR Memorial Platform

This module is the backend API of the TIZKOR platform, built with NestJS. It provides all core services needed to manage digital memorials, user access, notifications, Yahrzeit reminders, and Hebrew calendar functionalities.

## 📚 Table of Contents

- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Key Modules](#key-modules)
  - [Memorial Management](#memorial-management)
  - [Access Control](#access-control)
  - [Media Management](#media-management)
  - [Authentication](#authentication)
  - [Notification System](#notification-system)
  - [Hebrew Calendar](#hebrew-calendar)
  - [Yahrzeit System](#yahrzeit-system)
  - [Subscriptions](#subscriptions)
  - [Roles and Permissions](#roles-and-permissions)
- [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Project](#running-the-project)
    - [Install Dependencies](#install-dependencies)
    - [Development Server](#development-server)
    - [Production Build](#production-build)
- [API Documentation](#api-documentation)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [E2E Tests](#e2e-tests)
- [Best Practices](#best-practices)

---

## Technical Architecture

- **NestJS (v9+)**: Scalable Node.js framework for building server-side applications
- **TypeScript**: Strongly typed language for backend logic
- **MongoDB**: NoSQL database for flexible data modeling
- **JWT**: Authentication via JSON Web Tokens
- **Swagger**: Interactive API documentation
- **BullMQ**: Task queue for scheduling notifications
- **Day.js & hebcal**: Hebrew and Gregorian calendar date handling

## Project Structure

```bash
assets/
src/
├── common/                    # Modules et utilitaires communs
│   ├── constants/             #
│   ├── decorators/            # Décorateurs personnalisés
│   │   ├── metadata/
│   │   ├── responses/
│   │   ├── validations/
│   │   └── requests/
│   ├── exceptions/            # Gestion des exceptions
│   ├── filters/               # Filtres globaux pour les erreurs
│   ├── guards/                # Gardes pour la sécurité et l'accès
│   ├── interceptors/          # Intercepteurs pour les réponses et les logs
│   ├── interfaces/            # Interfaces pour les types partagés
│   ├── middlewares/           # Middlewares pour les requêtes HTTP
│   ├── pipes/                 # Pipes pour la transformation et la validation
│   └── utils/                 # Utilitaires généraux
├── config/                    # Configuration de l'application
│   ├── api
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   └── configuration.ts
│   ├── app
│   ├── cache
│   ├── database
│   │   └── mongo
│   ├── queue
│   ├── session
│   └── storage
├── core/                      # Services et modules essentiels
│   ├── logger/                # Service de journalisation
│   ├── database/              # Configuration de la base de données
│       ├── factories/
│       ├── migrations/
│       ├── subscribers/
│       └── seeders/
│   ├── cache/                 # Gestion du cache
│   ├── services/              # Services de base
|   ├── jobs
|   │   ├── consumers
|   │   └── producers
│   └── core.module.ts
├── modules/                   # Modules fonctionnels
│   ├── auth/                  # Module d'authentification
│   │   ├── dto/               # DTOs pour l'authentification
|   │   |   └── login-request.dto.ts
│   │   ├── entities/          # Entités pour la persistance
|   │   |   └── auth.entity.ts
│   │   ├── interfaces/        # Interfaces
|   │   |   └── auth.interface.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   ├── users/                 # Module utilisateur
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── repositories/
│   └── ...                    # Autres modules fonctionnels
├── main.ts                    # Fichier principal pour démarrer l'application
├── app.module.ts              # Module racine de l'application
└── test/                      # Tests unitaires et d'intégration
    └── unit/                  # Tests unitaires
```

## Key Modules

### Memorial Management

Handles the creation and update of digital memorials with:

- Biographies, life stories, tributes
- Multimedia attachments
- Timeline of events

#### Access Control

Defines who can view, edit, or manage a memorial:

- Private or public visibility
- Role-based access (e.g., owner, family, rabbi)

#### Media Management

Upload and associate files to memorials:

- Photos
- Videos
- Voice messages
- PDF documents

### Authentication

Secured with JWT:

- Login, registration, password reset
- Role-based guards and permissions
- Token refresh system

### Notification System

Manages scheduled and real-time user notifications:

- Email and in-app messages
- Yahrzeit reminders
- Memorial visit activity

### Hebrew Calendar

Provides accurate Hebrew-Gregorian date conversion:

- Shabbat detection
- Forbidden visitation periods
- Holiday-aware date logic

### Yahrzeit System

Tracks and triggers Yahrzeit reminders:

- Hebrew and secular anniversary dates
- Configurable reminder intervals (e.g., 7 days before)

### Subscriptions

Manages access to premium features:

- Plan tiers (free, standard, pro)
- Billing and payment info

### Roles and Permissions

Predefined roles include:

- Visitor
- Admin
- Client
- Monument Mason (Marbrier)
- Rabbi
- Superadmin

Each role has distinct access levels and capabilities across modules.

## Installation

### Environment Configuration

All environment variables are stored in a `.env` file so copied the `.env.example` and rename to `.env`:

```bash
cp .env.example .env
```

## Running the Project

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:prod
```

## API Documentation

Once running, access the API documentation at:

```
http://localhost:3000/api/docs
```

Provided by Swagger with complete endpoints and model schemas.

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

Tests use Jest and Supertest.

## Best Practices

1. **Security**

   - JWT tokens are HTTP-only when applicable
   - Sensitive data never exposed in responses
   - Input validation and sanitization via class-validator

2. **Scalability**

   - Modular structure
   - Dependency injection
   - Queue-based async tasks (BullMQ)

3. **Data Consistency**

   - MongoDB schema validation with Mongoose
   - Consistent DTOs across modules

4. **Maintainability**

   - Typed interfaces and decorators
   - Clean separation of concerns
   - Auto-generated Swagger docs
