# 🔧 Environment Configuration Fix

## Current Issue
Your `.env.local` file has a malformed `DATABASE_URL` that needs to be fixed.

## ✅ Steps to Fix

### 1. Edit your `.env.local` file

Replace this malformed line:
```bash
DATABASE_URL="MONGODB_URI="mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0"                            
"
```

With this corrected line:
```bash
DATABASE_URL="mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0"
```

### 2. Update NEXTAUTH_SECRET

Replace this:
```bash
NEXTAUTH_SECRET="your-nextauth-secret-generate-a-random-string"
```

With this (generated secure secret):
```bash
NEXTAUTH_SECRET="axEfLxVwl2Lf6RsFa9YgJ8kngNiMvqETnGXDKJZ4T+s="
```

### 3. Complete .env.local file should look like:

```bash
# MongoDB Atlas Configuration
DATABASE_URL="mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="axEfLxVwl2Lf6RsFa9YgJ8kngNiMvqETnGXDKJZ4T+s="

# Google OAuth (if using Google authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Configuration (if using nodemailer)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="maryamsadaf2002@gmail.com"
EMAIL_SERVER_PASSWORD="ankb bjdx sxnh hlad"  
EMAIL_FROM="maryamsadaf2002@gmail.com"

# Environment
NODE_ENV="development"
```

## 🧪 After fixing the .env.local file, run:

```bash
# Test environment configuration
npm run check-env

# Push schema to MongoDB Atlas
npx prisma db push

# Test database connectivity
npm run dev
curl http://localhost:3000/api/health/database
```

