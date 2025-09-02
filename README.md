# Final Backend - Ondemand Admin Analytics

Kompletan backend sistem za upravljanje ondemand uslugama, radnicima, porudžbinama i analitikom.

## 🚀 Funkcionalnosti

### 📊 Kategorije i Podkategorije (MySQL)
- CRUD operacije za kategorije
- CRUD operacije za podkategorije
- Hijerarhijska struktura
- Statistike i analitika

### 👥 Korisnici (MySQL)
- Registracija i autentifikacija
- JWT tokeni
- Role-based access control (admin, worker, user)
- Ban/unban funkcionalnost
- Promena lozinke

### 🛠️ Radnici (MongoDB)
- Kompletan profil radnika
- Lokacija i geografska pretraga
- Ocene i recenzije
- Raspored rada
- Verifikacija i dostupnost

### 📋 Porudžbine (MongoDB)
- Kreiranje i upravljanje porudžbinama
- Status tracking (pending, accepted, in-progress, completed, cancelled)
- Plaćanje i prioriteti
- Napomene i komunikacija

### 📱 Poruke (MongoDB)
- Chat sistem između korisnika i radnika
- Prilaganje fajlova
- Čitanje i status poruka

### 📢 Oglasi (MongoDB)
- Upravljanje oglasima
- Targetiranje po kategorijama
- Statistike klikova i prikaza

### 📈 Dashboard i Analitika
- Kompletna statistika sistema
- Revenue analitika
- User analytics
- Order analytics
- Geographic analytics
- Performance metrics

## 🛠️ Tehnologije

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Sequelize) + MongoDB (Mongoose)
- **Authentication**: JWT
- **Validation**: Express-validator
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript
- **Email**: Nodemailer

## 📋 Preduslovi

- Node.js 18+
- MySQL 8.0+
- MongoDB 6.0+
- npm ili yarn

## 🚀 Instalacija

1. **Kloniraj repozitorijum**
```bash
git clone <repository-url>
cd finalbackend
```

2. **Instaliraj dependencies**
```bash
npm install
```

3. **Konfiguriši environment varijable**
```bash
cp env.example .env
# Uredi .env fajl sa svojim vrednostima
```

4. **Konfiguriši baze podataka**
- MySQL: Kreiraj bazu `workerapp`
- MongoDB: Kreiraj bazu `ondemand_admin`

5. **Build projekta**
```bash
npm run build
```

6. **Pokreni development server**
```bash
npm run dev
```

## 🔧 Konfiguracija

### Environment Varijable (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=workerapp
MYSQL_USERNAME=newuser
MYSQL_PASSWORD=newpassword

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ondemand_admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📚 API Endpoints

### 🔐 Autentifikacija
- `POST /api/users/login` - Login korisnika

### 📊 Kategorije
- `GET /api/categories` - Lista svih kategorija
- `GET /api/categories/:id` - Kategorija po ID
- `POST /api/categories` - Kreiraj kategoriju (admin)
- `PUT /api/categories/:id` - Ažuriraj kategoriju (admin)
- `DELETE /api/categories/:id` - Obriši kategoriju (admin)
- `GET /api/categories/stats/overview` - Statistike kategorija

### 📋 Podkategorije
- `GET /api/subcategories` - Lista svih podkategorija
- `GET /api/subcategories/category/:categoryId` - Podkategorije po kategoriji
- `GET /api/subcategories/:id` - Podkategorija po ID
- `POST /api/subcategories` - Kreiraj podkategoriju (admin)
- `PUT /api/subcategories/:id` - Ažuriraj podkategoriju (admin)
- `DELETE /api/subcategories/:id` - Obriši podkategoriju (admin)

### 👥 Korisnici
- `GET /api/users` - Lista korisnika (admin)
- `GET /api/users/:id` - Korisnik po ID
- `POST /api/users` - Kreiraj korisnika (admin)
- `PUT /api/users/:id` - Ažuriraj korisnika (admin)
- `DELETE /api/users/:id` - Obriši korisnika (admin)
- `POST /api/users/:id/ban` - Ban/unban korisnika (admin)
- `POST /api/users/:id/change-password` - Promena lozinke

### 🛠️ Radnici
- `GET /api/workers` - Lista svih radnika
- `GET /api/workers/nearby` - Radnici u blizini
- `GET /api/workers/:id` - Radnik po ID
- `POST /api/workers` - Kreiraj radnika (admin)
- `PUT /api/workers/:id` - Ažuriraj radnika (admin)
- `DELETE /api/workers/:id` - Obriši radnika (admin)
- `POST /api/workers/:id/toggle-availability` - Toggle dostupnost (admin)
- `POST /api/workers/:id/toggle-verification` - Toggle verifikaciju (admin)

### 📋 Porudžbine
- `GET /api/orders` - Lista svih porudžbina
- `GET /api/orders/:id` - Porudžbina po ID
- `GET /api/orders/number/:orderNumber` - Porudžbina po broju
- `POST /api/orders` - Kreiraj porudžbinu
- `PUT /api/orders/:id` - Ažuriraj porudžbinu
- `DELETE /api/orders/:id` - Obriši porudžbinu (admin)
- `POST /api/orders/:id/status` - Ažuriraj status porudžbine
- `GET /api/orders/customer/:customerId` - Porudžbine po korisniku
- `GET /api/orders/worker/:workerId` - Porudžbine po radniku

### 📱 Poruke
- `GET /api/messages` - Lista poruka
- `GET /api/messages/order/:orderId` - Poruke po porudžbini
- `GET /api/messages/conversation/:userId1/:userId2/:orderId` - Konverzacija
- `POST /api/messages` - Pošalji poruku
- `PUT /api/messages/:id` - Ažuriraj poruku
- `DELETE /api/messages/:id` - Obriši poruku
- `POST /api/messages/:id/read` - Oznaci kao pročitanu

### 📢 Oglasi
- `GET /api/advertisements/active` - Aktivni oglasi (public)
- `GET /api/advertisements` - Lista oglasa (admin)
- `POST /api/advertisements` - Kreiraj oglas (admin)
- `PUT /api/advertisements/:id` - Ažuriraj oglas (admin)
- `DELETE /api/advertisements/:id` - Obriši oglas (admin)

### 📈 Dashboard
- `GET /api/dashboard/overview` - Pregled sistema
- `GET /api/dashboard/revenue` - Revenue analitika
- `GET /api/dashboard/users` - User analytics
- `GET /api/dashboard/orders` - Order analytics
- `GET /api/dashboard/geographic` - Geographic analytics
- `GET /api/dashboard/performance` - Performance metrics

## 🔐 Autentifikacija

Sistem koristi JWT tokene za autentifikaciju. Dodaj token u header:

```
Authorization: Bearer <your-jwt-token>
```

### Role
- **admin**: Puni pristup svim funkcionalnostima
- **worker**: Pristup porudžbinama i porukama
- **user**: Osnovni pristup (kreiranje porudžbina)

## 📊 Baze Podataka

### MySQL (Sequelize)
- **categories**: Kategorije usluga
- **subcategories**: Podkategorije usluga
- **users**: Korisnici sistema

### MongoDB (Mongoose)
- **workers**: Profili radnika
- **orders**: Porudžbine i usluge
- **messages**: Chat poruke
- **advertisements**: Oglasi i promocije

## 🚀 Skripte

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database seeding
npm run seed

# Reset database
npm run seed:reset
```

## 🌱 Database Seeding

Sistem dolazi sa predefinisanim test podacima:

### Test Korisnici
- **Admin**: admin@example.com / admin123
- **Worker**: worker@example.com / worker123
- **Customer**: customer@example.com / customer123

### Kategorije
- Čišćenje, Popravka, Gradnja, Transport
- IT Podrška, Kozmetika, Edukacija, Zdravlje

### Podkategorije
- Svaka kategorija ima 3-4 podkategorije

## 📖 API Dokumentacija

Swagger dokumentacija je dostupna na:
```
http://localhost:5000/api-docs
```

## 🔍 Health Check

Proveri status servera:
```
GET /health
```

## 📁 Struktura Projekta

```
src/
├── controllers/          # Kontroleri za svaki model
│   ├── CategoryController.ts
│   ├── SubcategoryController.ts
│   ├── UserController.ts
│   ├── WorkerController.ts
│   ├── OrderController.ts
│   ├── MessageController.ts
│   ├── AdvertisementController.ts
│   └── DashboardController.ts
├── models/              # Modeli baza podataka
│   ├── Category.ts
│   ├── Subcategory.ts
│   ├── User.ts
│   ├── Worker.ts
│   ├── Order.ts
│   ├── Message.ts
│   ├── Advertisement.ts
│   └── index.ts
├── routes/              # API rute
│   ├── CategoryRoutes.ts
│   ├── SubcategoryRoutes.ts
│   ├── UserRoutes.ts
│   ├── WorkerRoutes.ts
│   ├── OrderRoutes.ts
│   ├── MessageRoutes.ts
│   ├── AdvertisementRoutes.ts
│   └── DashboardRoutes.ts
├── middleware/          # Middleware funkcije
│   ├── auth.ts
│   ├── upload.ts
│   └── validation.ts
├── services/            # Servisi
│   └── emailService.ts
├── utils/               # Pomoćne funkcije
│   ├── orderNumberGenerator.ts
│   └── databaseSeeder.ts
├── database.ts          # Konfiguracija baza
└── server.ts            # Glavni server fajl
```

## 🐛 Troubleshooting

### Česti problemi:

1. **Database connection error**
   - Proveri da li su MySQL i MongoDB pokrenuti
   - Proveri credentials u .env fajlu

2. **Port already in use**
   - Promeni PORT u .env fajlu
   - Ili zaustavi proces koji koristi port 5000

3. **JWT errors**
   - Proveri JWT_SECRET u .env fajlu
   - Proveri da li je token validan

4. **TypeScript build errors**
   - Proveri da li su svi dependencies instalirani
   - Proveri TypeScript konfiguraciju

## 🧪 Testiranje

### Pokretanje test servera
```bash
npm run dev
```

### Test API endpoints
```bash
# Health check
curl http://localhost:5000/health

# Get categories
curl http://localhost:5000/api/categories

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 📧 Email Konfiguracija

Za slanje email-ova, konfiguriši SMTP u .env fajlu:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Napomena**: Za Gmail, koristi App Password umesto obične lozinke.

## 🔒 Sigurnost

- JWT autentifikacija
- Role-based access control
- Input validacija
- SQL injection protection
- File upload security
- CORS konfiguracija

## 📈 Performance

- Database indexing
- Connection pooling
- Efficient queries
- Pagination
- Caching ready

## 🤝 Doprinosi

1. Fork projekta
2. Kreiraj feature branch
3. Commit promene
4. Push na branch
5. Otvori Pull Request

## 📄 Licenca

ISC License

## 📞 Podrška

Za pitanja i podršku, otvori issue na GitHub-u.

## 🎯 Roadmap

- [ ] Real-time notifications (Socket.io)
- [ ] File storage (AWS S3, Cloudinary)
- [ ] Payment integration (Stripe, PayPal)
- [ ] SMS notifications (Twilio)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app API
- [ ] Webhook system
- [ ] Rate limiting
- [ ] API versioning
