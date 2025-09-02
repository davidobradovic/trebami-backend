# 🌱 Database Seeding Instructions

## 📋 Overview

Trebami-backend sada automatski testira konekcije sa MySQL i MongoDB bazama podataka i može da popuni baze test podacima.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env with your database credentials
nano .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Project
```bash
npm run build
```

### 4. Start Server (with auto-seeding)
```bash
npm start
```

## 🔧 Manual Seeding Commands

### Seed All Data
```bash
npm run seed
```

### Reset Database (clear + reseed)
```bash
npm run seed:reset
```

## 📊 What Gets Seeded

### MySQL Data:
- **Categories**: 8 kategorija usluga (Čišćenje, Popravka, Gradnja, itd.)
- **Subcategories**: 24 podkategorije
- **Users**: 3 test korisnika (admin, worker, customer)

### MongoDB Data:
- **Workers**: 5 test radnika sa različitim kategorijama
- **Orders**: 3 test porudžbine
- **Messages**: 3 test poruke
- **Advertisements**: 2 test banera

## 🔍 Database Connection Testing

Server automatski testira konekcije pri pokretanju:

```
🔍 Testing database connections...
✅ MySQL connection established successfully
✅ MongoDB connection established successfully
```

## ⚙️ Environment Variables

```env
# Enable/disable auto-seeding
SEED_DATA=true

# Database connections
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=workerapp
MYSQL_USERNAME=your_username
MYSQL_PASSWORD=your_password

MONGODB_URI=mongodb://localhost:27017/ondemand_admin
```

## 🎯 Test Users

### Admin User (MySQL)
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

### Test Users (MySQL)
- **Email**: worker@example.com, **Password**: worker123, **Role**: worker
- **Email**: customer@example.com, **Password**: customer123, **Role**: user

### Test Workers (MongoDB)
- **Marko Petrović** - Električne Instalacije (Beograd)
- **Ana Jovanović** - Čišćenje (Novi Sad)
- **Milan Đorđević** - Stolarija (Niš)
- **Stefan Nikolić** - Vodoinstalaterske Usluge (Kragujevac)
- **Jelena Marković** - Klima Uređaji (Subotica)

## 🛠️ Troubleshooting

### Connection Issues
```bash
# Test MySQL connection
mysql -h localhost -u your_username -p your_database

# Test MongoDB connection
mongosh mongodb://localhost:27017/ondemand_admin
```

### Clear All Data
```bash
npm run seed:reset
```

### Manual Database Reset
```bash
# MySQL
mysql -u root -p -e "DROP DATABASE workerapp; CREATE DATABASE workerapp;"

# MongoDB
mongosh --eval "db.dropDatabase()" ondemand_admin
```

## 📝 Notes

- Seeding se izvršava samo ako `SEED_DATA=true` ili `NODE_ENV=development`
- Postojeći podaci se ne brišu - samo se dodaju novi
- Za potpuno resetovanje koristite `npm run seed:reset`
- Sve lozinke su hash-ovane sa bcrypt
