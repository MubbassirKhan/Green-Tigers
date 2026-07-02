# 🐯 Green tigers — Full-Stack E-Commerce Platform

> A feature-rich, modern e-commerce web application built for a Hackathon. Green tigers covers six product categories — Clothing, Sports, Home & Kitchen, Beauty, Electronics, and Books — with a complete shopping flow, JWT-based authentication, and a dedicated admin panel.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Default Admin Credentials](#default-admin-credentials)
- [Pages & Routes](#pages--routes)
- [Admin Panel](#admin-panel)
- [Contributing](#contributing)

---

## Overview

**Green tigers** is a full-stack e-commerce platform featuring:

- 🛒 Product browsing, filtering, and detail views
- 🔐 JWT-powered user authentication (register / login)
- 🛍️ Persistent shopping cart per user
- 📦 Order placement and order history
- ⭐ Product ratings & feedback
- 🛠️ Full admin panel for managing products, orders, users, and feedback
- ☁️ Cloud database via **Supabase** (PostgreSQL)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** (JSX) | UI framework |
| **Vite** | Build tool & dev server |
| **React Router DOM v7** | Client-side routing |
| **Zustand** | Global state management (auth, cart) |
| **Axios** | HTTP client for API calls |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |
| **TypeScript** | Type safety (mixed TS/JSX project) |

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | Python REST API framework |
| **Uvicorn** | ASGI server |
| **Supabase** | Cloud PostgreSQL database |
| **python-jose** | JWT token generation & verification |
| **passlib (bcrypt)** | Password hashing |
| **Pydantic v2** | Request/response validation |
| **python-dotenv** | Environment variable management |

---

## Project Structure

```
Hackathon Main/
├── README.md
│
├── backend/
│   ├── main.py                  # FastAPI app entry point, CORS & router registration
│   ├── requirements.txt         # Python dependencies
│   ├── start.bat                # One-click backend launcher (Windows)
│   ├── .env                     # Environment variables (Supabase, JWT secrets)
│   │
│   ├── database/
│   │   └── schema.sql           # Full DB schema + seed data (run in Supabase SQL Editor)
│   │
│   ├── dependencies/
│   │   └── auth.py              # JWT decode & current-user dependency
│   │
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response schemas
│   │
│   └── routers/
│       ├── auth.py              # /auth — register, login
│       ├── products.py          # /products — list, detail, search
│       ├── categories.py        # /categories — list all
│       ├── cart.py              # /cart — add, update, remove, view
│       ├── orders.py            # /orders — place order, order history
│       ├── feedback.py          # /feedback — submit & view reviews
│       └── admin.py             # /admin — manage users, products, orders
│
└── frontend/
    ├── index.html               # HTML entry point
    ├── package.json             # Node dependencies & scripts
    ├── vite.config.js           # Vite + React plugin config
    ├── tsconfig.json            # TypeScript configuration
    ├── start.bat                # One-click frontend launcher (Windows)
    ├── .env                     # Frontend environment variables (API base URL)
    │
    └── src/
        ├── App.jsx              # Root component — routing & layout
        ├── main.jsx             # React DOM entry point
        ├── index.css            # Global styles & design tokens
        │
        ├── api/                 # Axios instance & API helper functions
        ├── store/
        │   ├── authStore.js     # Zustand auth state (login, logout, token)
        │   └── cartStore.js     # Zustand cart state (add, remove, sync)
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx   # Top navigation bar
        │   │   └── Footer.jsx   # Site footer
        │   └── shop/
        │       └── CartDrawer.jsx  # Slide-out cart sidebar
        │
        └── pages/
            ├── HomePage.jsx         # Landing page with hero & featured products
            ├── ShopPage.jsx         # Product listing with category filters & search
            ├── ProductDetailPage.jsx # Product detail, images, add-to-cart, reviews
            ├── LoginPage.jsx        # User login form
            ├── RegisterPage.jsx     # User registration form
            ├── CheckoutPage.jsx     # Order summary & checkout form
            ├── OrdersPage.jsx       # User order history
            └── admin/
                ├── AdminDashboard.jsx  # Analytics overview & summary cards
                ├── AdminProducts.jsx   # CRUD — manage products
                ├── AdminOrders.jsx     # View & update order statuses
                ├── AdminUsers.jsx      # View registered users
                └── AdminFeedback.jsx   # Moderate product feedback & ratings
```

---

## Features

### 🛍️ Customer Facing

- **Home Page** — Hero banner, featured products, category highlights
- **Shop Page** — Browse all products, filter by category, search by name
- **Product Detail** — Full description, price, stock status, add to cart, customer reviews & ratings
- **Shopping Cart** — Slide-out drawer, quantity management, real-time totals
- **Checkout** — Address input, order summary, place order confirmation
- **Order History** — View all past orders with statuses
- **Authentication** — Secure register/login with JWT tokens (7-day sessions)

### 🔑 Admin Panel (`/admin`)

- **Dashboard** — Key metrics (total users, orders, products, revenue)
- **Products** — Create, edit, delete products; toggle featured status
- **Orders** — View all orders, update order status (pending → confirmed → shipped → delivered → cancelled)
- **Users** — Browse all registered user accounts
- **Feedback** — View all product ratings and reviews

---

## Database Schema

The database is hosted on **Supabase** (PostgreSQL). Run `backend/database/schema.sql` in the Supabase SQL Editor to create all tables and seed initial data.

### Tables

| Table | Description |
|---|---|
| `profiles` | User accounts with roles (`user` / `admin`) |
| `categories` | Product categories (Clothing, Sports, etc.) |
| `products` | Product listings with price, stock, images |
| `cart_items` | Per-user cart (user_id + product_id, unique pair) |
| `orders` | Customer orders with shipping address & status |
| `order_items` | Line items for each order (quantity + unit price) |
| `feedback` | Product ratings (1–5 stars) + comments |

### ER Diagram (simplified)

```
profiles --< cart_items >-- products
profiles --< orders --< order_items >-- products
profiles --< feedback >-- products
products >-- categories
```

---

## API Endpoints

The backend runs on `http://localhost:8000`. Interactive docs are available at **`http://localhost:8000/docs`** (Swagger UI).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | — | Health check |
| `GET` | `/health` | — | Health status |
| **Auth** | | | |
| `POST` | `/auth/register` | — | Create new user |
| `POST` | `/auth/login` | — | Login, returns JWT |
| **Categories** | | | |
| `GET` | `/categories` | — | List all categories |
| **Products** | | | |
| `GET` | `/products` | — | List products (filter, search, pagination) |
| `GET` | `/products/{id}` | — | Single product detail |
| **Cart** | | | |
| `GET` | `/cart` | User | Get current user cart |
| `POST` | `/cart` | User | Add item to cart |
| `PUT` | `/cart/{id}` | User | Update item quantity |
| `DELETE` | `/cart/{id}` | User | Remove item from cart |
| **Orders** | | | |
| `POST` | `/orders` | User | Place new order |
| `GET` | `/orders` | User | Get user order history |
| **Feedback** | | | |
| `POST` | `/feedback` | User | Submit product rating/review |
| `GET` | `/feedback/{product_id}` | — | Get product reviews |
| **Admin** | | | |
| `GET` | `/admin/users` | Admin | List all users |
| `GET` | `/admin/orders` | Admin | List all orders |
| `PUT` | `/admin/orders/{id}` | Admin | Update order status |
| `POST` | `/admin/products` | Admin | Create product |
| `PUT` | `/admin/products/{id}` | Admin | Edit product |
| `DELETE` | `/admin/products/{id}` | Admin | Delete product |

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |
| Supabase Account | (Free tier works) |

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd "Hackathon Main/backend"

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
#    Edit .env with your Supabase credentials

# 5. Set up the database
#    Open Supabase Dashboard > SQL Editor
#    Paste and run: database/schema.sql

# 6. Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# OR double-click start.bat on Windows
```

> API live at: **`http://localhost:8000`**  
> Swagger docs: **`http://localhost:8000/docs`**

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd "Hackathon Main/frontend"

# 2. Install Node dependencies
npm install

# 3. Configure the API URL
#    Edit .env: VITE_API_URL=http://localhost:8000

# 4. Start the development server
npm run dev
# OR double-click start.bat on Windows
```

> App live at: **`http://localhost:5173`**

---

## Environment Variables

### Backend — `backend/.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## Default Admin Credentials

The `schema.sql` seed script creates a default admin account:

| Field | Value |
|---|---|
| **Email** | `admin@greentigers.pk` |
| **Password** | `admin123` |

> **Warning**: Change the admin password immediately before any public deployment.

---

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — hero, featured products | No |
| `/shop` | Shop — browse & filter products | No |
| `/product/:id` | Product detail & reviews | No |
| `/login` | Login form | No |
| `/register` | Registration form | No |
| `/checkout` | Checkout & order placement | User |
| `/orders` | Order history | User |
| `/admin` | Admin dashboard | Admin |
| `/admin/products` | Manage products | Admin |
| `/admin/orders` | Manage orders | Admin |
| `/admin/users` | View users | Admin |
| `/admin/feedback` | View feedback | Admin |

---

## Admin Panel

Access the admin panel by logging in with an `admin` role account and navigating to `/admin`.

The admin panel provides:

- **Dashboard** — At-a-glance statistics
- **Products** — Add, edit, or delete products; mark as featured
- **Orders** — View all customer orders, track and update statuses
- **Users** — Browse the registered user base
- **Feedback** — Monitor product ratings and customer comments

---

## Contributing

This project was built for a Hackathon. To contribute or extend it:

Green Tigers – Core Team

1. Founder – Dhanuja Prakash
Provides overall vision, leadership, and strategic guidance for the Green Tigers project, ensuring its successful planning, execution, and long-term growth.

2. Co-Founder – Rohan
Leads project management, collaborations, and oversees the Data Science & Analytics division, driving innovation through data-driven solutions.

3. Mubbassir Khan – Full Stack Web Developer
Responsible for designing, developing, and maintaining both the frontend and backend architecture of the Green Tigers web platform.

4. Devika Joshi – Frontend Developer
Designs and develops responsive, user-friendly frontend interfaces to enhance the user experience.

5. Dinesh – Web Designer & Developer
Contributes to the overall web design, layout, and functionality, ensuring a visually appealing and seamless platform.

6. Akash – Frontend Developer
Develops the About Us page and various frontend sections, focusing on intuitive design and user engagement.

7. Sruthi – Framework Developer
Designs and develops the core framework and structural foundation of the web application, ensuring scalability and maintainability.

Built with love for Hackathon — Green tigers 🐯
