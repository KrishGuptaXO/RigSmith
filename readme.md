# RigSmith

### Build Smarter.

RigSmith is a MERN stack application for PC retailers that brings together inventory management, pre-built PC browsing, shopping, order processing, and customer order tracking in one platform.

Built as a portfolio project and internship assessment, RigSmith focuses on practical full-stack development, reusable React components, REST APIs, authentication, role-based access control, and database-backed workflows.

---

## Features

### Customer Portal

- **Interactive Dashboard** — Browse featured PCs and discover available components.
- **Featured Builds** — Explore pre-configured PC builds and their specifications.
- **Build Details** — View build components, pricing, and configuration details.
- **Component Inventory** — Browse available PC components with category filters and search.
- **Persistent Shopping Cart** — Add inventory items and pre-built PCs to the cart.
- **Wishlist** — Save favorite components and builds.
- **Checkout** — Place orders with delivery or pickup details.
- **Order History** — View previous orders and their current statuses.
- **Order Tracking** — Inspect individual orders and their status timelines.
- **Account Settings** — Manage account and session-related settings.

### Authentication & Security

- User registration and login.
- Argon2id password hashing.
- JWT-based authentication.
- Protected frontend routes.
- Backend authentication middleware.
- Role-based access control for customers, partners, and administrators.
- Server-side role verification using the current database user role.

### Inventory & Order Processing

- MongoDB-backed inventory and pre-built PC data.
- Component categories, search, and filtering.
- Inventory stock validation during order creation.
- Automatic inventory deduction when orders are placed.
- Order records with unique order numbers.
- Persistent order history and detailed order views.
- Backend APIs for cart, wishlist, builds, authentication, and orders.

### Experimental: Custom PC Build Import

- Import a PCPartPicker component list using copied text.
- Parse component names, quantities, and source prices.
- Match imported components against RigSmith inventory.
- Identify unavailable components.
- Display matching inventory and stock information.

**Limitations:** This is an experimental feature. Hardware compatibility is not automatically validated, currency conversion is not yet implemented, and imported prices are reference prices rather than guaranteed local retail prices.

### Admin Portal

The Admin Portal is under development. Planned functionality includes inventory administration, supplier management, customer management, order administration, and basic operational reports.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Zustand
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- Argon2
- REST APIs

### Development Tools

- Git and GitHub
- Postman or browser-based API testing alternatives
- MongoDB Compass
- npm

---

## Project Structure

```text
RigSmith/
├── client/
│   ├── public/
│   │   ├── images/
│   │   │   └── inventory/
│   │   └── Improvements/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── dashboard/
│       │   │   ├── FeaturedBuilds/
│       │   │   ├── ImportBuild/
│       │   │   └── RecentOrders/
│       │   └── layout/
│       ├── pages/
│       │   ├── Auth/
│       │   ├── Checkout/
│       │   └── user/
│       │       ├── FeaturedBuilds/
│       │       ├── Inventory/
│       │       ├── orders/
│       │       ├── Settings/
│       │       ├── ViewBuild/
│       │       ├── Wishlist/
│       │       ├── CustomBuildResults.jsx
│       │       ├── Dashboard.jsx
│       │       ├── Orders.jsx
│       │       └── SavedBuilds.jsx
│       ├── routes/
│       └── store/
│
└── server/
    ├── config/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    │   └── pcpartpicker/
    ├── tests/
    ├── server.js
    └── package.json
```

*Note: This is a high-level representation of the current structure. Individual files and subdirectories may change during development.*

---

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas cluster or another compatible MongoDB deployment
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd RigSmith
```

Replace `<repository-url>` with your Git repository URL.

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal from the project root:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server/` directory.

Configure the required values using the variable names expected by the existing backend configuration. A typical setup includes:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Check the backend configuration for any additional required variables before starting the application.

**Security:** Never commit `.env` files, database credentials, or JWT secrets to Git.

### 5. Start the backend

From the `server/` directory, run the development script defined in `server/package.json`. If it is configured as `dev`, use:

```bash
npm run dev
```

### 6. Start the frontend

From the `client/` directory, run:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

Keep both development servers running while using the application.

---

## Future Possibilities

- Native PC build configurator
- Hardware compatibility checking
- Intelligent component recommendations
- Price history and comparison
- Notifications and email integration
- Advanced analytics

These are potential extensions, not commitments for the current MVP.

---

## Author

**Krish Gupta**

RigSmith is developed as a MERN stack portfolio project, with an emphasis on full-stack engineering, practical application architecture, and real-world business workflows.