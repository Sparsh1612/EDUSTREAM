# 🚀 Quick Start Guide - EduStream

## Prerequisites
- ✅ Node.js >= 18
- ✅ Docker & Docker Compose
- ✅ Git

---

## Step-by-Step Startup

### 1️⃣ Install Dependencies

```bash
# From the project root (edustream/)
cd C:\Users\spars\OneDrive\Desktop\Minor\edustream

# Install all dependencies (root + workspaces)
npm install --legacy-peer-deps
```

### 2️⃣ Setup Environment Variables

```bash
# Copy environment template (if .env doesn't exist)
# The .env file should already exist, but verify it has the correct values
```

### 3️⃣ Start Infrastructure Services (Docker)

```bash
# Start all Docker services (MongoDB, Redis, RabbitMQ, etc.)
npm run docker:up
```

This starts:
- **MongoDB** on port 27017
- **Redis** on port 6379
- **RabbitMQ** on ports 5672 (AMQP) and 15672 (Management UI)
- **Prometheus** on port 9090
- **Grafana** on port 3003
- **Jaeger** on port 16686
- **MinIO** on ports 9000 and 9001

**Wait 30-60 seconds** for all services to be ready.

### 4️⃣ Start Backend (Terminal 1)

```bash
# From project root
npm run dev:backend
```

Or manually:
```bash
cd apps/backend
npm run start:dev
```

Backend will run on: **http://localhost:3000**
- API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health
- Swagger Docs: http://localhost:3000/api/docs (when available)

### 5️⃣ Start Frontend (Terminal 2)

```bash
# From project root
npm run dev:frontend
```

Or manually:
```bash
cd apps/frontend
npm start
```

Frontend will run on: **http://localhost:3001**

---

## 🎯 Quick Start (All at Once)

If you want to start everything in one command:

```bash
# From project root
npm run dev
```

This will:
1. Start Docker services
2. Start backend in background
3. Start frontend

---

## ✅ Verify Everything is Running

### Check Docker Services
```bash
docker ps
```

You should see 8 containers running:
- edustream-mongo
- edustream-redis
- edustream-rabbitmq
- edustream-ffmpeg
- edustream-prometheus
- edustream-grafana
- edustream-jaeger
- edustream-minio

### Check Backend
Open browser: http://localhost:3000/api/health

Should return: `{"status":"ok","database":"connected"}`

### Check Frontend
Open browser: http://localhost:3001

Should show the EduStream login page.

---

## 🔗 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Backend API** | http://localhost:3000/api | - |
| **Frontend** | http://localhost:3001 | - |
| **Swagger Docs** | http://localhost:3000/api/docs | - |
| **RabbitMQ Management** | http://localhost:15672 | guest/guest |
| **Grafana** | http://localhost:3003 | admin/admin |
| **Jaeger** | http://localhost:16686 | - |
| **MinIO Console** | http://localhost:9001 | minioadmin/minioadmin |
| **Prometheus** | http://localhost:9090 | - |

---

## 🛑 Stop Services

### Stop Backend/Frontend
Press `Ctrl+C` in the terminal windows

### Stop Docker Services
```bash
npm run docker:down
```

Or:
```bash
docker-compose down
```

---

## 🐛 Troubleshooting

### Port Already in Use
If a port is already in use:
- Check what's using it: `netstat -ano | findstr :3000`
- Kill the process or change the port in `.env`

### Docker Services Not Starting
```bash
# Check logs
npm run docker:logs

# Restart services
npm run docker:down
npm run docker:up
```

### Backend Won't Start
```bash
# Make sure dependencies are installed
cd apps/backend
npm install --legacy-peer-deps

# Check if MongoDB is running
docker ps | findstr mongo
```

### Frontend Won't Start
```bash
# Make sure dependencies are installed
cd apps/frontend
npm install --legacy-peer-deps

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📝 First Time Setup Checklist

- [ ] Node.js >= 18 installed
- [ ] Docker Desktop running
- [ ] Dependencies installed (`npm install --legacy-peer-deps`)
- [ ] Docker services started (`npm run docker:up`)
- [ ] Backend running (`npm run dev:backend`)
- [ ] Frontend running (`npm run dev:frontend`)
- [ ] Can access http://localhost:3001
- [ ] Can access http://localhost:3000/api/health

---

## 🎉 You're Ready!

Once everything is running:
1. Open http://localhost:3001
2. Register a new account
3. Start using EduStream!
