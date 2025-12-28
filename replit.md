# IndustriaPack - B2B Packaging Catalog

## Overview

This is a production-ready B2B website for a Plastic & Pharmaceutical Packaging Manufacturing Company. The application provides a public-facing product catalog where customers can browse industrial packaging products (plastic caps, foils, trays, measuring cups, etc.), view detailed specifications, and send inquiries via WhatsApp. It includes a hidden admin panel for managing products and viewing customer inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Carousel**: Embla Carousel with autoplay for hero sliders and image galleries

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Pattern**: RESTful API with typed route definitions in `shared/routes.ts`
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Password Security**: scrypt for password hashing with timing-safe comparison

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Key Tables**:
  - `users` - Admin user accounts with hashed passwords
  - `products` - Product catalog with JSONB specs field for flexible specifications
  - `inquiries` - Customer inquiry records linked to products
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route page components
│       ├── hooks/        # Custom React hooks for data fetching
│       └── lib/          # Utilities and query client setup
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database access layer
│   ├── auth.ts       # Authentication setup
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route type definitions
└── migrations/       # Database migration files
```

### Key Design Decisions
1. **Shared Type Definitions**: Route definitions and schemas are shared between frontend and backend via the `shared/` directory, ensuring type safety across the stack
2. **JSONB for Product Specs**: Product specifications use a flexible JSONB field allowing dynamic key-value pairs for different product types
3. **Hidden Admin Routes**: Admin dashboard is accessible via `/admin/dashboard` but not visible in main navigation for security through obscurity
4. **WhatsApp Integration**: Customer inquiries are designed to redirect to WhatsApp with pre-filled product details

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication & Sessions
- **Passport.js**: Authentication middleware with local username/password strategy
- **connect-pg-simple**: PostgreSQL session store for persistent sessions

### UI Component Libraries
- **Radix UI**: Headless UI primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-styled component collection built on Radix
- **Lucide React**: Icon library

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation for both client and server
- **drizzle-zod**: Auto-generates Zod schemas from Drizzle tables

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (defaults to development value if not set)