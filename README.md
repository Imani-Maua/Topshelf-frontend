# 🏆 TopShelf v1.0

**TopShelf** is a modern, production-ready React frontend application that revolutionizes sales bonus calculations and performance analytics. Built to replace error-prone Excel workflows, this SPA provides real-time dashboards, transparent bonus calculations, and role-based access control, reducing the payout processing time by **50%** while empowering teams with data-driven insights.

## 🎯 Key Features

- **Real-Time Analytics Dashboard** – Interactive visualizations powered by Recharts displaying revenue trends, top performers, and bonus pool metrics
- **Automated Bonus Calculations** – Instant processing of complex tiered bonus rules with category-level breakdowns and audit trails
- **CSV Import Pipeline** – Drag-and-drop sales receipt uploads with client-side validation and batch processing
- **Role-Based Access Control** – JWT-authenticated routes with granular permissions (Operations, Admin, Finance roles)
- **Production-Ready Architecture** – Multi-stage Docker builds, Nginx reverse proxy, and comprehensive Vitest test coverage (76 tests)

## 🛠️ Tech Stack

**Core Framework**
- **React 19** 
- **Vite** 

**Data Visualization**
- **Recharts**

**Testing & Quality**
- **Vitest** 
- **React Testing Library** 

**DevOps**
- **Docker** 
- **Nginx** 

**API Integration**
- **Axios** 

## 📁 Project Structure

```
TopShelf-frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── services/         # API service layer (auth, participants, bonuses)
│   ├── context/          # React Context providers (AuthContext)
│   ├── utils/            # Helper functions and validators
│   └── __tests__/        # Vitest test suites
├── public/               # Static assets
├── Dockerfile            # Multi-stage containerization
├── vite.config.js        # Vite build configuration
└── package.json          # Dependencies and scripts
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js >= 18
- npm or yarn
- Backend API running ([TopShelf Backend](https://github.com/Imani-Maua/TopShelf-backend))

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd TopShelf-frontend

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Docker Deployment

```bash
# Development build
docker-compose up

# Production build
docker build --target production-stage -t topshelf-frontend:prod .
docker run -p 8080:80 topshelf-frontend:prod
```

**Configuration**: Ensure the backend API URL is set in your environment variables or `.env` file.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository and create a feature branch
2. **Code Standards**: Follow existing patterns, use ESLint, and write clear commit messages
3. **Testing**: Add tests for new features (maintain >80% coverage)
4. **Pull Request**: Submit a PR with a detailed description of changes

**Quality Checklist**:
- ✅ All tests passing (`npm test`)
- ✅ No linting errors (`npm run lint`)
- ✅ Build succeeds (`npm run build`)
- ✅ Code reviewed for security and performance

---

**Developed by Maua Imani** 🚀
