# Render Deployment Guide for TRAgo 🚀

## 🌐 Free Hosting on Render

Your TravelGo platform can be hosted completely FREE on Render with the following services:
- **Web Service** (Free tier: 750 hours/month)
- **PostgreSQL Database** (Free tier: 1GB storage)

## 📋 Pre-Deployment Checklist

### ✅ Repository Requirements
- [x] Git repository on GitHub ✓
- [x] package.json with start script ✓
- [x] Environment variables setup ✓
- [x] PostgreSQL database schema ✓

## 🚀 Deployment Steps

### 1. **Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with your GitHub account
- Connect your GitHub repositories

### 2. **Deploy PostgreSQL Database**

1. **Create Database Service:**
   - Click "New +" → "PostgreSQL"
   - **Name**: `trago-database`
   - **Database**: `travelgo_db`
   - **User**: `travelgo_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free
   - Click "Create Database"

2. **Note Database Details:**
   - Internal Database URL (for app connection)
   - External Database URL (for external access)
   - Keep these URLs safe!

### 3. **Deploy Web Application**

1. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `TRAgo`
   - **Name**: `trago-platform`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

2. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=[Your PostgreSQL Internal Host]
   DB_PORT=5432
   DB_NAME=travelgo_db
   DB_USER=travelgo_user
   DB_PASSWORD=[Your Database Password]
   DB_URL=[Your Internal Database URL]
   ```

### 4. **Initialize Database**

Once both services are deployed:

1. **Connect to Database:**
   - Use the External Database URL
   - Connect via psql or database client

2. **Run Database Setup:**
   ```sql
   -- Copy and paste content from database/schema.sql
   -- This will create all necessary tables
   ```

## 🔗 **Expected URLs**

After deployment:
- **Main Platform**: `https://trago-platform.onrender.com`
- **Admin Panel**: `https://trago-platform.onrender.com/admin`
- **Database**: Internal connection via Render network

## ⚡ **Free Tier Limitations**

### Web Service
- **Sleep Mode**: Spins down after 15 minutes of inactivity
- **Cold Start**: ~30 seconds to wake up
- **Bandwidth**: 100GB/month
- **Build Time**: 10 minutes max

### PostgreSQL
- **Storage**: 1GB limit
- **Connections**: 97 max concurrent
- **Backup**: 7-day retention

## 🎯 **Performance Tips**

1. **Keep Service Awake** (Optional):
   - Use UptimeRobot or similar to ping every 14 minutes
   - Prevents sleep mode during business hours

2. **Database Optimization**:
   - Monitor storage usage
   - Clean up old data periodically
   - Index important queries

3. **File Uploads**:
   - Files stored on Render's ephemeral storage
   - Consider upgrading to paid plan for persistent storage

## 🚨 **Important Notes**

- **File Uploads**: On free tier, uploaded files are lost during service restarts
- **Database**: Permanent storage, data persists
- **Environment**: Always use environment variables for sensitive data
- **Scaling**: Easy upgrade to paid plans when needed

## 📞 **Support**

If you encounter issues:
1. Check Render logs in dashboard
2. Verify environment variables
3. Test database connection
4. Review build logs

Your TravelGo platform will be live and accessible worldwide! 🌍

---

**Next Steps**: Follow the deployment guide above to get your platform online.
