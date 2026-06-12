# L'Étoile Sucrée — Server-Side Development Guidelines

Guidelines, commands, and code styling rules for building the Node/Express/Prisma backend server.

---

## 🛠️ Essential Commands

- **Development Server**: `npm run dev` (starts the server with hot-reload via `ts-node-dev`)
- **Compile TypeScript**: `npm run build` (compiles TS to JS into the `dist/` directory)
- **Start Production Bundle**: `npm run start` (runs the compiled JS code via Node)
- **Prisma Generate**: `npx prisma generate` (updates Prisma Client types)
- **Prisma Migrate**: `npx prisma migrate dev --name <migration_name>` (creates and runs SQL migrations)
- **Prisma Seed**: `npx prisma db seed` (re-seeds SQLite database with catalog records)

---

## 📐 Code Style & Architecture

### 1. Types & Return Values
- **Explicit Returns**: Always declare explicit return types for functions, especially Express request controllers (e.g. `Promise<void>`).
- **Strict Typing**: Use strict TS typing. Cast request objects explicitly when attaching middleware properties (e.g., using `AuthRequest` interface to access `req.user`).
  - *Correct*: `export const getMe = async (req: AuthRequest, res: Response): Promise<void> => { ... }`

### 2. Naming Conventions
- **Controllers & Routes**: camelCase (e.g., `authController.ts`, `cakeController.ts`, `api.ts`).
- **Middlewares**: camelCase (e.g., `authMiddleware.ts`).
- **Database Models**: PascalCase in `schema.prisma` (e.g., `User`, `Cake`, `Order`).

### 3. Folder Layout & Architecture
- **Routes (`/src/routes/`)**: Bind paths directly to controller exports. Keep routing files thin.
- **Controllers (`/src/controllers/`)**: Handle incoming request payloads, validate request bodies, wrap async operations in try/catch, and format HTTP responses.
- **Middlewares (`/src/middleware/`)**: Perform request interception (e.g. JWT verification, validation schemas).
- **Services (`/src/services/`)**: Colocate non-express specific utility logic (e.g. actual Twilio SMS calls, token generators).

### 4. Database & Transactions
- **Integrity**: Always use Prisma transactions (`prisma.$transaction`) for operations creating multiple rows with foreign keys (such as checking out an `Order` and its constituent `OrderItem` rows).
- **SQLite Limitations**: SQLite does not support advanced concurrent operations. Keep transactions fast and avoid nested blocking database calls.

### 5. Error & Response Management
- **No Crash Rule**: Never let unhandled promise rejections crash the Node.js server. Wrap controller calls in try/catch and send a `500` JSON response.
- **Semantic HTTP Codes**:
  - `200 OK`: Successful fetch/update.
  - `201 Created`: Successfully created resource (orders, users).
  - `400 Bad Request`: Validation failure or bad input format.
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: Insufficient permissions.
  - `404 Not Found`: Entity not found in DB.
  - `500 Internal Server Error`: Database or server-side exception.
