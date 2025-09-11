# 🚨 MongoDB Atlas Authentication Error Fix

## Error: "Error code 13 (Unauthorized): auth required"

This error means your MongoDB Atlas database user doesn't have the proper permissions to read/write to the database.

## 🔧 Step-by-Step Fix

### 1. Check Database User Permissions

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com/)**
2. **Sign in to your account**
3. **Select your project**
4. **Click "Database Access" in the left sidebar**
5. **Find your database user**

### 2. Fix User Permissions

Your user needs proper permissions. Click "Edit" on your user and ensure:

**Option A: Full Access (Recommended for Development)**
- Built-in Role: `Atlas admin` or `readWriteAnyDatabase`

**Option B: Specific Database Access**
- Built-in Role: `readWrite`
- Database: Your specific database name (e.g., `your-database-name`)

### 3. Update Connection String

Make sure your connection string is correct:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Important**: Replace with your actual values:
- `USERNAME`: Your MongoDB Atlas username
- `PASSWORD`: Your MongoDB Atlas password (URL encoded if it contains special characters)
- `DATABASE_NAME`: Your database name

### 4. Password Special Characters

If your password contains special characters, you need to URL encode them:

| Character | URL Encoded |
|-----------|-------------|
| @         | %40         |
| :         | %3A         |
| /         | %2F         |
| ?         | %3F         |
| #         | %23         |
| [         | %5B         |
| ]         | %5D         |
| %         | %25         |

**Example**: If password is `Pass@123!`, use `Pass%40123!`

### 5. Test the Fix

1. **Update your `.env.local` file**:
   ```bash
   DATABASE_URL="mongodb+srv://corrected-username:corrected-password@cluster0.xxxxx.mongodb.net/your-db-name?retryWrites=true&w=majority"
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Test the database connection**:
   ```bash
   curl http://localhost:3000/api/health/database
   ```

4. **Test user registration**:
   Try registering a user through your signup form

## 🔍 Common Issues & Solutions

### Issue 1: Wrong Username/Password
- Double-check your MongoDB Atlas credentials
- Make sure you're using the database user credentials, not your MongoDB Atlas account credentials

### Issue 2: User Doesn't Exist
- Create a new database user in MongoDB Atlas
- Go to "Database Access" → "Add New Database User"

### Issue 3: Database Name Mismatch
- The database name in your connection string must match what your user has access to
- If using specific database permissions, ensure the database name is correct

### Issue 4: Cluster Not Active
- Make sure your MongoDB Atlas cluster is running (not paused)
- Free tier clusters pause after inactivity

## 📝 Quick Checklist

- [ ] Database user exists in MongoDB Atlas
- [ ] User has `readWrite` or `Atlas admin` permissions
- [ ] Password is correctly URL encoded if it has special characters
- [ ] Database name in connection string is correct
- [ ] Cluster is active and running
- [ ] Connection string format is correct
- [ ] `.env.local` file has been updated
- [ ] Development server restarted

## 🆘 Still Having Issues?

If the problem persists:

1. **Create a new database user**:
   - Go to Database Access → Add New Database User
   - Username: `testuser`
   - Password: `testpass123` (simple password without special characters)
   - Database User Privileges: `Atlas admin`

2. **Use the new credentials**:
   ```
   DATABASE_URL="mongodb+srv://testuser:testpass123@cluster0.xxxxx.mongodb.net/your-db-name?retryWrites=true&w=majority"
   ```

3. **Test again**:
   ```bash
   npm run dev
   curl http://localhost:3000/api/health/database
   ```

Once this works, you can create a more secure user with limited permissions.


