# Azure Cloud-Native E-Commerce Platform

A production-grade e-commerce application demonstrating modern Cloud-Native architectures on Microsoft Azure using Next.js, Node.js, and various Azure PaaS and Serverless offerings.

## 🚀 Architecture Overview

### Frontend
- **Framework:** Next.js (App Router), React, TailwindCSS, React Query
- **Hosting:** Azure Static Web Apps (for static export) or Azure App Service (for SSR wrapper)
- **State Management:** React Context API + LocalStorage
- **Validation:** Zod + React Hook Form

### Backend
- **Framework:** Node.js (Express with TypeScript)
- **Hosting:** Azure App Service
- **ORM:** Prisma
- **Security:** Helmet, Bcrypt, JWT Auth
- **Error Handling:** Centralized with Application Insights correlation

### Azure Services Integrations
1. **Azure API Management:** Secures and proxies backend APIs.
2. **Azure Cosmos DB:** NoSQL store for product catalog.
3. **Azure SQL Database:** Relational store for users and orders.
4. **Azure Redis Cache:** Sub-millisecond read access caching for products.
5. **Azure Blob Storage:** Object store for product images.
6. **Azure CDN:** Accelerates serving images globally.
7. **Azure Key Vault:** Centralized secrets management.
8. **Azure Application Insights:** Real-time logging and telemetry.

---

## 🛠 Project Structure

```bash
/ecommerce-platform
├── /frontend       # Next.js Application
├── /backend        # Express.js Application
├── /infrastructure # Bicep/ARM configs (placeholder)
└── docker-compose.yml 
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure Environment variables by copying the example file:
```bash
cp .env.example .env
```

Set up your Azure components or run local emulators, then start:
```bash
# Push Prisma Schema to database
npx prisma db push

# Run the dev server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the application:
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 3. Using Docker Compose

You can boot both applications using docker-compose:
```bash
docker-compose up --build
```

---

## ☁️ Azure Deployment Instructions

### 1. Database Provisioning
- **Cosmos DB:** Create a NoSQL account `ecommerce-db` with container `products`.
- **Azure SQL:** Create a database `orders-db` and whitelist Azure IPs. Provide the Connection String to your backend App Service.

### 2. Secrets Management (Key Vault)
Enable System Assigned Managed Identity for your Backend App Service.
Grant `Key Vault Secrets User` role to the identity over your Key Vault.
Add secrets for SQL, Cosmos DB, JWT_SECRET, Redis password.

### 3. Backend (Azure App Service)
Ensure `backend/Dockerfile` is pushed to ACR (Azure Container Registry).
Create a Linux Web App on App Service targeting the Docker Image.
Set ENV variables:
- `KEY_VAULT_URI`
- `KEY_VAULT_ENABLED=true`
- `APPLICATIONINSIGHTS_CONNECTION_STRING`

### 4. API Management
Import an OpenAPI spec to configure paths `/api/v1/auth`, `/api/v1/products`, `/api/v1/orders`. Point the backend URL to your App Service. Disable public access directly to the App Service using Networking rules.

### 5. Frontend (Azure Static Web Apps / App Service)
If building statically (`output: export`), link your GitHub repository to Azure Static Web Apps. If SSR, use Azure App Service exactly matching the node deployment above.
Set `NEXT_PUBLIC_API_URL` to your API Management gateway endpoint.

---

## 🔌 API Documentation Sample

### `GET /api/v1/products`
Retrieves products. Checked against Redis first.
**Response:** `200 OK`
```json
{
  "success": true,
  "source": "database",
  "data": [
    { "id": "1", "name": "...", "price": 99.99 }
  ]
}
```

### `POST /api/v1/orders`
Creates a user order. Requires Bearer Token.
**Body:**
```json
{
  "total_price": 99.99,
  "items": [
    { "product_id": "1", "quantity": 1, "price": 99.99 }
  ]
}
```

---

### Tests Validation
- Run backend tests: `cd backend && npm run test`
- Run frontend lint: `cd frontend && npm run lint`
