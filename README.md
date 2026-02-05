# 🚀 HireTrack - Job Application Tracking Platform

> A full-stack SaaS platform for tracking job applications with analytics, reminders, and insights.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

## ✨ Features

### Core Features
- ✅ **Authentication** - Email/Password + Google OAuth
- ✅ **Application Tracking** - Manage job applications with status updates
- ✅ **CV Management** - Upload and version control for resumes
- ✅ **Analytics Dashboard** - Visual insights into application outcomes
- ✅ **Smart Reminders** - Email notifications for follow-ups
- ✅ **Multi-Platform** - Web app (Next.js) + Mobile app (Flutter)

### SaaS Features
- ✅ **Subscription Tiers** - Free & Pro plans
- ✅ **Stripe Integration** - Secure payment processing (test mode)
- ✅ **Multi-Tenancy** - Isolated user data
- ✅ **Background Jobs** - Async email sending & analytics processing

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis + BullMQ
- **ORM**: Prisma
- **Auth**: JWT + Passport.js

### Frontend (Web)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: React Query + Zustand

### Mobile
- **Framework**: Flutter 3.x
- **State Management**: Provider/Riverpod
- **HTTP**: Dio

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Cloud**: AWS (EC2, RDS, S3)
- **Payments**: Stripe
- **Email**: SendGrid / Gmail SMTP

## 📁 Project Structure

```
hiretrack/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── applications/   # Job applications
│   │   ├── analytics/      # Analytics & reports
│   │   ├── subscriptions/  # Stripe integration
│   │   ├── notifications/  # Email & push notifications
│   │   ├── storage/        # S3 file uploads
│   │   └── jobs/           # Background jobs (BullMQ)
│   ├── prisma/             # Database schema & migrations
│   ├── Dockerfile
│   └── package.json
│
├── web/                     # Next.js web app
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities & API client
│   ├── public/             # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── mobile/                  # Flutter mobile app
│   ├── lib/
│   │   ├── models/
│   │   ├── screens/
│   │   ├── services/
│   │   └── widgets/
│   ├── android/
│   ├── ios/
│   └── pubspec.yaml
│
├── docker-compose.yml       # Local development environment
├── .env.example             # Environment variables template
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))
- **Flutter** 3.x (for mobile development) ([Install](https://docs.flutter.dev/get-started/install))
- **VS Code** (recommended IDE)

### VS Code Extensions (Recommended)
- Prisma
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Flutter (Dart-Code)

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd hiretrack

# Install backend dependencies
cd backend
npm install

# Install web dependencies
cd ../web
npm install

# Install mobile dependencies (optional)
cd ../mobile
flutter pub get
```

### 2️⃣ Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
code .env  # or use any text editor
```

**🔴 CRITICAL**: Fill in these values in `.env`:
- `JWT_SECRET` - Generate: `openssl rand -base64 32`
- `POSTGRES_PASSWORD` - Use a strong password
- `STRIPE_SECRET_KEY` - Get from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- `GOOGLE_CLIENT_ID` - Get from [Google Cloud Console](https://console.cloud.google.com/)

### 3️⃣ Start Development Environment

```bash
# From project root, start all services
docker-compose up -d

# Run database migrations
cd backend
npm run prisma:migrate
npm run prisma:seed  # Optional: seed test data

# Start backend
npm run start:dev

# In another terminal, start frontend
cd ../web
npm run dev
```

### 4️⃣ Access Applications

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs (Swagger)

## 🔐 Environment Setup (Detailed)

### Database Setup
```bash
# The Docker Compose will handle PostgreSQL setup
# Check connection:
docker exec -it hiretrack-postgres psql -U hiretrack_user -d hiretrack_db
```

### Stripe Setup (Test Mode)
1. Create account at https://stripe.com
2. Get test API keys from Dashboard → Developers → API Keys
3. Create products and prices:
   - Free plan: $0/month
   - Pro plan: $9.99/month
4. Copy price IDs to `.env`

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback`
   - `http://localhost:3000/auth/callback`
5. Copy Client ID and Secret to `.env`

### Email Setup (Gmail)
1. Enable 2FA on your Gmail account
2. Generate App Password: Account → Security → App passwords
3. Use app password in `.env` as `EMAIL_PASSWORD`

### AWS S3 Setup (Optional - for CV uploads)
1. Create S3 bucket: `hiretrack-cvs`
2. Create IAM user with S3 permissions
3. Copy Access Key ID and Secret to `.env`

## 💻 Development

### Backend Development

```bash
cd backend

# Run in watch mode
npm run start:dev

# Run tests
npm run test
npm run test:e2e

# Generate Prisma client after schema changes
npm run prisma:generate

# Create new migration
npm run prisma:migrate:dev --name <migration_name>

# View database in Prisma Studio
npm run prisma:studio
```

### Frontend Development

```bash
cd web

# Start dev server
npm run dev

# Build for production
npm run build
npm run start

# Lint and format
npm run lint
npm run format
```

### Mobile Development

```bash
cd mobile

# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Build APK
flutter build apk

# Build iOS
flutter build ios
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f web

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Reset database (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d
```

## 📊 Database Management

```bash
# Access PostgreSQL
docker exec -it hiretrack-postgres psql -U hiretrack_user -d hiretrack_db

# Backup database
docker exec hiretrack-postgres pg_dump -U hiretrack_user hiretrack_db > backup.sql

# Restore database
docker exec -i hiretrack-postgres psql -U hiretrack_user hiretrack_db < backup.sql
```

## 🚢 Deployment

### Backend (AWS EC2)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker and Docker Compose
# Clone repository
# Copy .env file with production values
# Run docker-compose up -d
```

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web directory
cd web
vercel --prod
```

### Database (AWS RDS)
1. Create PostgreSQL RDS instance
2. Update `DATABASE_URL` in production `.env`
3. Run migrations: `npm run prisma:migrate:deploy`

## 📚 API Documentation

Once the backend is running, access interactive API documentation:

- **Swagger UI**: http://localhost:3001/api/docs
- **Postman Collection**: See `backend/docs/postman-collection.json`

### Key Endpoints

```
POST   /auth/signup              # Register new user
POST   /auth/login               # Login
GET    /auth/google              # Google OAuth
POST   /applications             # Create application
GET    /applications             # List applications
PATCH  /applications/:id         # Update application
GET    /analytics/dashboard      # Get analytics
POST   /subscriptions/checkout   # Create Stripe session
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port in .env
BACKEND_PORT=3002
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Prisma Issues
```bash
# Reset and regenerate
npm run prisma:generate
npm run prisma:migrate:reset
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/hiretrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hiretrack/discussions)

## 🌟 Acknowledgments

- [NestJS](https://nestjs.com/)
- [Next.js](https://nextjs.org/)
- [Flutter](https://flutter.dev/)
- [Stripe](https://stripe.com/)

---

**Made with ❤️ for job seekers everywhere**
