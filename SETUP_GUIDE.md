# 🚀 HireTrack Complete Setup Guide

## 📋 What You'll Get

This project includes:
- ✅ Complete NestJS Backend API with authentication
- ✅ PostgreSQL database with Prisma ORM
- ✅ Redis for background jobs
- ✅ Next.js frontend (structure provided)
- ✅ Flutter mobile app (structure provided)
- ✅ Docker configuration
- ✅ Proper .gitignore (environment files protected)

## 🔐 Environment Security

**CRITICAL**: Your `.env` files are now protected!
- `.gitignore` prevents .env files from being committed
- Use `.env.example` files as templates
- Never commit secrets to Git

## 📝 Step-by-Step Setup

### Step 1: Clone & Navigate
```bash
# You should already be in the hiretrack directory
cd hiretrack
ls  # You should see: backend/, web/, docker-compose.yml, etc.
```

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Web (Next.js)
```bash
cd ../web
npm install
```

#### Mobile (Flutter) - Optional
```bash
cd ../mobile
flutter pub get
```

### Step 3: Setup Environment Variables

#### Root .env
```bash
# From project root
cp .env.example .env
code .env  # or nano .env, vim .env
```

Fill in:
- `POSTGRES_PASSWORD` - Choose a strong password
- `JWT_SECRET` - Generate: `openssl rand -base64 32`
- Other values as needed

#### Backend .env
```bash
cd backend
cp .env.example .env
code .env
```

**Required values:**
- `JWT_SECRET` (same as root)
- `REFRESH_TOKEN_SECRET` - Generate: `openssl rand -base64 32`
- `DATABASE_URL` - Use password from root .env
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (get from Google Cloud Console)
- `STRIPE_SECRET_KEY` (get from Stripe Dashboard in test mode)

#### Web .env
```bash
cd ../web
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
EOF
```

### Step 4: Start Docker Services
```bash
# From project root
docker-compose up -d

# Check if services are running
docker ps

# You should see: hiretrack-postgres and hiretrack-redis
```

### Step 5: Setup Database
```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Optional: Seed database with test data
npm run prisma:seed
```

### Step 6: Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

You should see:
```
🚀 HireTrack API is running on: http://localhost:3001
📚 Swagger Docs: http://localhost:3001/api/docs
```

#### Terminal 2 - Web
```bash
cd web
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Step 7: Test the API

Open browser and go to:
- http://localhost:3001/api/docs (Swagger UI)

Try these endpoints:
1. POST `/api/auth/signup` - Create account
2. POST `/api/auth/login` - Login
3. GET `/api/auth/me` - Get profile (requires auth token)

## 🔑 Getting External API Keys

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "HireTrack"
3. Enable Google+ API
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3001/auth/google/callback`
     - `http://localhost:3000/auth/callback`
5. Copy Client ID and Secret to `.env`

### Stripe (Test Mode)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle "Test mode" ON
3. Go to Developers → API keys
4. Copy:
   - Secret key (sk_test_...) → `STRIPE_SECRET_KEY`
   - Publishable key (pk_test_...) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Create products:
   - Free Plan: $0/month
   - Pro Plan: $9.99/month
6. Copy Pro plan price ID → `STRIPE_PRICE_ID_PRO`

### Email (Gmail)
1. Enable 2-Factor Authentication on Gmail
2. Go to: Account → Security → App passwords
3. Generate app password
4. Use in `.env` as `EMAIL_PASSWORD`

### AWS S3 (Optional - for CV uploads)
1. Create S3 bucket: `hiretrack-cvs`
2. Create IAM user with S3 permissions
3. Copy Access Key ID and Secret to `.env`

## ✅ Verify Everything Works

### Test Backend
```bash
# Check database connection
cd backend
npm run prisma:studio
# Opens Prisma Studio at http://localhost:5555

# Run tests
npm run test
```

### Test API Endpoints
```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Test Frontend
1. Open http://localhost:3000
2. Should see Next.js app
3. API calls should work (check network tab)

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port
# In backend/.env: PORT=3002
# In web/.env.local: NEXT_PUBLIC_API_URL=http://localhost:3002
```

### "Cannot connect to PostgreSQL"
```bash
# Check if Docker is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### "Prisma Client not generated"
```bash
cd backend
npm run prisma:generate
```

### "JWT Secret not configured"
```bash
# Generate new secret
openssl rand -base64 32

# Add to backend/.env
JWT_SECRET=<generated_secret>
```

## 📚 Next Steps

1. **Customize the code** - It's your project now!
2. **Add features** - Check TODO comments in code
3. **Deploy** - See deployment section in README.md
4. **Learn** - Explore Prisma Studio, Swagger docs

## 🔒 Security Checklist Before Pushing to GitHub

- [ ] `.env` files are in `.gitignore`
- [ ] No secrets in code
- [ ] `.env.example` files have placeholders only
- [ ] All sensitive values use environment variables

## 📖 Useful Commands

```bash
# Backend
cd backend
npm run start:dev          # Start dev server
npm run prisma:studio      # Open database GUI
npm run prisma:migrate     # Run migrations
npm test                   # Run tests

# Frontend
cd web
npm run dev                # Start dev server
npm run build              # Build for production
npm run lint               # Lint code

# Docker
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
docker-compose ps          # List running services

# Database
docker exec -it hiretrack-postgres psql -U hiretrack_user -d hiretrack_db
```

## 🎓 Learning Resources

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Flutter Docs](https://docs.flutter.dev/)

## 🆘 Need Help?

1. Check error messages carefully
2. Review logs: `docker-compose logs backend`
3. Check Swagger docs: http://localhost:3001/api/docs
4. Google the error message
5. Check GitHub Issues (if repo is public)

---

**You're all set! Happy coding! 🎉**
