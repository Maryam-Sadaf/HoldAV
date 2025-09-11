#!/bin/bash

echo "🔧 Fixing NextAuth environment variables..."

# Fix NEXTAUTH_URL
sed -i 's/NEXTAUTH_URL=/NEXTAUTH_URL="http:\/\/localhost:3000"/' .env.local

# Fix NEXTAUTH_SECRET
sed -i 's/NEXTAUTH_SECRET=/NEXTAUTH_SECRET="axEfLxVwl2Lf6RsFa9YgJ8kngNiMvqETnGXDKJZ4T+s="/' .env.local

# Fix NODE_ENV
sed -i 's/NODE_ENV=/NODE_ENV="development"/' .env.local

# Add placeholder values for optional ones that are empty
sed -i 's/GOOGLE_CLIENT_ID=/GOOGLE_CLIENT_ID="your-google-client-id"/' .env.local
sed -i 's/GOOGLE_CLIENT_SECRET=/GOOGLE_CLIENT_SECRET="your-google-client-secret"/' .env.local
sed -i 's/EMAIL_SERVER_HOST=/EMAIL_SERVER_HOST="smtp.gmail.com"/' .env.local
sed -i 's/EMAIL_SERVER_USER=/EMAIL_SERVER_USER="your-email@gmail.com"/' .env.local
sed -i 's/EMAIL_SERVER_PASSWORD=/EMAIL_SERVER_PASSWORD="your-email-password"/' .env.local
sed -i 's/EMAIL_FROM=/EMAIL_FROM="your-email@gmail.com"/' .env.local

echo "✅ Fixed NextAuth environment variables"
echo ""
echo "📋 Current NextAuth config:"
grep -E "(NEXTAUTH_|NODE_ENV)" .env.local
echo ""
echo "🚀 Now restart your server"







