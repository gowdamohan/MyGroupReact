Environment setup

Backend
- Files: backend/.env (base), backend/.env.development (dev), backend/.env.production (prod)
- server.js loads .env based on NODE_ENV automatically
- Local dev recommended:
  - NODE_ENV=development
  - FRONTEND_URL=http://localhost:3000
  - BACKEND_URL=http://localhost:5000
  - DB_* point to my_group

Frontend
- Files: frontend/.env.development, frontend/.env.production
- REACT_APP_API_BASE controls the API base (e.g., http://localhost:5000/api)

Run locally
1) Backend
   cd backend
   npm run dev
2) Frontend
   cd ../frontend
   npm start

Deploy
- Set NODE_ENV=production and ensure .env.production values are correct
- FRONTEND should point to deployed domain and REACT_APP_API_BASE to your backend domain + /api

