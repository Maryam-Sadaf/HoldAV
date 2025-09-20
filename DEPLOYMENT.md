# Vercel Deployment Guide

## Environment Variables Required

Set these environment variables in your Vercel project dashboard:

### Firebase Configuration (Required)
```
FIREBASE_PROJECT_ID=hold-av-main
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@hold-av-main.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### NextAuth Configuration (Required)
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### Email Configuration (Required for invitations)
```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=maryamsadaf2002@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=maryamsadaf2002@gmail.com
```

### Node Environment
```
NODE_ENV=production
```

## Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to Firebase Firestore"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables in project settings

3. **Deploy:**
   - Vercel will automatically deploy on push
   - Check deployment logs for any issues

## Important Notes

- Replace `YOUR_PRIVATE_KEY_HERE` with your actual Firebase private key
- Replace `your-secret-key-here` with a strong random string
- Replace `your-app-name.vercel.app` with your actual Vercel domain
- Use Gmail App Password (not regular password) for EMAIL_SERVER_PASSWORD
