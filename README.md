# L'Étoile Sucrée — Artisan Cake Atelier

A premium, fullstack, single-page application for an artisan cake bakery store. Customers can browse gourmet cakes, filter them by category, manage their cart, authenticate securely using their mobile number via OTP, and place delivery orders.

---

## 🚀 Use Case & Features

- **Artisan Catalog**: Dynamic cake gallery categorized into Signature, Chocolate, Fruity, and Gourmet collections.
- **Mobile OTP Login**: Verification via mobile numbers. Generates a secure JWT token for session persistence.
- **Local Database Store**: Powered by SQLite for zero-configuration, robust local operations.
- **Persisted Cart System**: LocalStorage-backed cart selection surviving page refreshes.
- **Checkout Flow**: Complete order creation with delivery dates, notes, and totals stored in the database.
- **Premium UI/UX**: Complies with elite web aesthetics, including responsive grids, glassmorphism elements, custom scrollbars, and interactive micro-animations for both light and dark mode preferences.

---

## 🏗️ Architecture & Stack

### Directory Structure
```
site/
├── client/              # React Frontend (Vite + TS)
│   ├── src/
│   │   ├── components/  # Header, layouts
│   │   ├── hooks/       # useAuth, useCart hooks
│   │   ├── pages/       # Cakes (catalog), Checkout, Login
│   │   ├── utils/       # API axios client
│   │   └── index.css    # Premium CSS Variables & global styling
├── server/              # Node/Express Backend (TS)
│   ├── prisma/          # Prisma database schema, migrations & seed
│   ├── src/
│   │   ├── config/      # db (Prisma client) config
│   │   ├── controllers/ # auth, cake, order handlers
│   │   ├── middleware/  # JWT auth guard
│   │   ├── routes/      # express api routing table
│   │   └── index.ts     # express server entry point
```

### Technology Matrix
| Domain | Tech / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | React 19 + TypeScript | Stateful reactive UI build |
| **Frontend Tooling** | Vite | Ultra-fast local dev and compilation |
| **Icons & Motion** | Lucide React + Framer Motion | SVG icons and smooth interactive animations |
| **Backend Core** | Express.js + TypeScript | REST API server with custom types |
| **Database & ORM** | Prisma + SQLite | File-based local SQL database & type-safe queries |
| **Security & Auth** | JSONWebTokens + BcryptJS | Session token management and payload signing |

---

## 🛠️ Getting Started

### 1. Prerequisite
Ensure you have **Node.js (v18+)** installed.

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Copy the environment template and configure settings:
   ```bash
   copy .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the database migrations & generation:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with gourmet cake data:
   ```bash
   npx prisma db seed
   ```
6. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The backend will be running at [http://localhost:5000](http://localhost:5000).*

### 3. Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client website will be running at [http://localhost:5173](http://localhost:5173).*

---

## 🎨 Premium Theme & Styling tokens

The application implements standard tokens from our UI/UX guidelines:
- **Heading Font**: `Outfit` (sleek, bold, editorial)
- **Body Font**: `Inter` (neutral, high readability)
- **Primary Color**: HSL `24, 85%, 50%` (Warm Bakery Caramel)
- **Light Theme Background**: `#FAF9F6` (Warm Alabaster)
- **Dark Theme Background**: `#0F0E0D` (Dark Chocolate Slate)
- **Borders & Dividers**: Thin 1px borders with low-opacity caramel accents for elegant layering.
