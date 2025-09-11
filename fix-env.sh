#!/bin/bash

# Fix the malformed DATABASE_URL in .env.local
echo "🔧 Fixing .env.local file..."

# Create a backup
cp .env.local .env.local.backup
echo "✅ Backup created: .env.local.backup"

# Fix the DATABASE_URL line
sed -i 's/DATABASE_URL="MONGODB_URI="mongodb+srv:/DATABASE_URL="mongodb+srv:/' .env.local
sed -i 's/mongodb.net\/myDatabase/mongodb.net\/myDatabase/' .env.local

# Clean up any extra quotes or characters at the end
sed -i 's/".*"$//' .env.local
# Re-add the proper line
sed -i '/^DATABASE_URL=/c\DATABASE_URL="mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0"' .env.local

# Also fix NEXTAUTH_SECRET if it's a placeholder
sed -i '/NEXTAUTH_SECRET="your-nextauth-secret/c\NEXTAUTH_SECRET="axEfLxVwl2Lf6RsFa9YgJ8kngNiMvqETnGXDKJZ4T+s="' .env.local

echo "✅ Fixed .env.local file"
echo ""
echo "📋 Current DATABASE_URL:"
grep "DATABASE_URL" .env.local
echo ""
echo "🚀 Now restart your server with: npm run dev"

