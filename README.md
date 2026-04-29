# OIR Application

Welcome to the OIR application repository. This document provides administrators with the necessary instructions to configure, build, and run the application securely in a production environment.

## ⚙️ Prerequisites & Environment Setup

Before starting the application, the administrator must configure the environment variables so the application can connect to the database securely.

### 1. Create the Environment File

In the root directory of the project (where the `package.json` file is located), create a new file named exactly `.env`.

### 2. Add Configuration Values

Open the `.env` file and paste the following configuration. Replace the values with your production database credentials:

```bash
# Database MongoDB User
DB_USERNAME=admin
DB_PASSWORD=superSecretPassword123
DB_NAME=oir

# The MongoDB connection string:
MONGODB_URI="mongodb://admin:superSecretPassword123@localhost:27017/oir?authSource=admin"

# Private and Public Key
PRIVATE_KEY_PATH="./private.pem"
PUBLIC_KEY_PATH="./public.pem"
```

### 3. Start Databse in MongoDB

Make sure you has already downloaded the docker

```bash
docker compose up -d
```

### 4. Generate Private and Public Key

```bash
# Create Private Key
 openssl genrsa -out private.pem 2048

 # Taking Out Public Key
 openssl rsa -in private.pem -pubout -out public.pem
```

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the production server:

```bash
pnpm build

pm2 start ecosystem.config.js
```
