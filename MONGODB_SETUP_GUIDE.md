# MongoDB Atlas Setup Guide

## 🚨 Current Issue: "command insert not found"

This error typically occurs when:
1. The MongoDB Atlas database isn't properly configured
2. The connection string is incorrect
3. The database user lacks proper permissions
4. IP whitelist restrictions

## 🔧 Step-by-Step Fix

### 1. Check Your Environment Variables

First, create a `.env.local` file in your project root:

```bash
cp env.template .env.local
```

### 2. MongoDB Atlas Configuration

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com/)**
2. **Sign in to your account**
3. **Select your cluster**
4. **Click "Connect" → "Connect your application"**
5. **Copy the connection string**

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/your-database-name?retryWrites=true&w=majority
```

### 3. Common Issues & Solutions

#### Issue 1: Wrong Database User Permissions
- Go to Database Access in MongoDB Atlas
- Ensure your user has "Read and write to any database" permissions
- Or at minimum: "readWrite" role for your specific database

#### Issue 2: IP Whitelist
- Go to Network Access in MongoDB Atlas
- Add your current IP address
- For development, you can temporarily use `0.0.0.0/0` (allow from anywhere)
- **Important**: Don't use `0.0.0.0/0` in production!

#### Issue 3: Incorrect Database Name
- Make sure the database name in your connection string exists
- MongoDB will create it automatically if it doesn't exist, but sometimes there are permission issues

### 4. Test Your Connection

After setting up your `.env.local`, test the connection:

```bash
# Start your development server
npm run dev

# In another terminal, test the database health
curl http://localhost:3000/api/health/database
```

### 5. Example .env.local File

```env
# MongoDB Atlas - Replace with your actual values
DATABASE_URL="mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/your-database-name?retryWrites=true&w=majority"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-secret-here"

# Other environment variables...
NODE_ENV="development"
```

### 6. Verify Database Connection

You can test your database connection by visiting:
- `http://localhost:3000/api/health/database`

This endpoint will tell you:
- ✅ If the database connection is working
- ✅ If read operations work
- ✅ If write operations work
- ❌ Any specific errors

### 7. Alternative Connection Strings

If you're still having issues, try these variations:

**With SSL disabled (not recommended for production):**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority&ssl=false
```

**With specific authSource:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority&authSource=admin
```

### 8. Troubleshooting Commands

```bash
# Regenerate Prisma client
npm run db:generate

# Check if Prisma can connect to your database
npx prisma db pull

# Open Prisma Studio to browse your data
npm run db:studio
```

## 🆘 Still Having Issues?

1. **Check the MongoDB Atlas logs:**
   - Go to your cluster in MongoDB Atlas
   - Click "Metrics" tab
   - Look for connection errors

2. **Verify your cluster is active:**
   - Make sure your cluster isn't paused
   - Check that you have available connections

3. **Test with MongoDB Compass:**
   - Download MongoDB Compass
   - Use the same connection string to test the connection

4. **Contact Support:**
   - If all else fails, check MongoDB Atlas support documentation
   - Verify your MongoDB Atlas tier supports your use case

## 📋 Quick Checklist

- [ ] `.env.local` file created with correct DATABASE_URL
- [ ] MongoDB Atlas user has proper permissions
- [ ] Your IP address is whitelisted
- [ ] Database name exists or user can create databases
- [ ] Connection string format is correct
- [ ] Prisma client has been regenerated
- [ ] Database health check passes

Once all items are checked, your registration API should work correctly!


