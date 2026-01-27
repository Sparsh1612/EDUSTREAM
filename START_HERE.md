# 🚀 START HERE - EduStream Quick Commands

## ⚠️ Important: Always run commands from the `edustream` directory!

```bash
# Navigate to project root first
cd C:\Users\spars\OneDrive\Desktop\Minor\edustream
```

---

## 📋 Quick Start Commands

### 1. Start Docker Services (Infrastructure)
```bash
npm run docker:up
```

### 2. Start Backend (Terminal 1)
```bash
npm run dev:backend
```

### 3. Start Frontend (Terminal 2)
```bash
npm run dev:frontend
```

---

## 🔍 Verify Everything is Running

### Check Docker Containers
```bash
docker ps
```

Should show 8 containers:
- edustream-mongo
- edustream-redis
- edustream-rabbitmq
- edustream-ffmpeg
- edustream-prometheus
- edustream-grafana
- edustream-jaeger
- edustream-minio

### Check Backend
Open: http://localhost:3000/api/health

### Check Frontend
Open: http://localhost:3001

---

## 🛑 Stop Services

### Stop Backend/Frontend
Press `Ctrl+C` in terminal windows

### Stop Docker
```bash
npm run docker:down
```

---

## 📍 Current Working Directory

**Always make sure you're in:**
```
C:\Users\spars\OneDrive\Desktop\Minor\edustream
```

**NOT in:**
```
C:\Users\spars\OneDrive\Desktop\Minor  ❌
```

---

## 💡 Quick Navigation

```powershell
# PowerShell - Navigate to project
cd C:\Users\spars\OneDrive\Desktop\Minor\edustream

# Verify you're in the right place
Get-Location
# Should show: C:\Users\spars\OneDrive\Desktop\Minor\edustream
```
