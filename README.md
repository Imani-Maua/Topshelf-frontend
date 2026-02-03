# TopShelf: Upsell Bonus Calculation System - Frontend

Modern, secure React application for managing restaurant bonus calculations with complete transparency, role-based access control, and real-time business intelligence.

## 💡 Why TopShelf Frontend?

### The Problem: Manual Chaos

Before TopShelf, bonus calculations relied on **slow, manual spreadsheet processes** that caused:

- **⏱️ 2-Month Delays**: Participants who met their threshold requirements in **January** had to wait until **March** to receive their payouts—a **60+ day delay** that hurt morale and retention.
- **❌ Error-Prone**: Manual data entry and formula errors led to incorrect calculations.
- **🔒 Opaque**: No visibility into how bonuses were calculated or why thresholds weren't met.
- **📊 No Insights**: Unable to track performance patterns or provide actionable feedback.

### The Solution: Real-Time Transparency

TopShelf frontend **eliminates the 2-month processing delay** by providing instant, automated bonus calculations:

> **Before**: Meet threshold in January → Get paid in March (**60+ days**)  
> **After**: Meet threshold in January → Get paid in January (**same month**)

#### Key Benefits:

- **⚡ Instant Processing**: Same-day bonus calculations with live results and visual feedback.
- **🎯 Zero Calculation Errors**: Automated validation eliminates manual mistakes.
- **🔍 Complete Audit Trail**: Detailed breakdowns show exactly how each bonus was calculated, with category-level performance insights.
- **📈 Business Intelligence**: Real-time dashboards, performance charts, and actionable analytics.
- **💰 Employee Trust**: Full transparency builds confidence in the bonus system.
- **🔐 Secure Authentication**: JWT-based auth with role-based access control (Admin/User).

## 🚀 Features

### Core Functionality
- **🔐 Authentication System**: Secure login with JWT tokens, password management, and role-based access
- **📊 Real-Time Dashboard**: Live metrics, revenue tracking, performance visualization, top performers leaderboard
- **📤 CSV Receipt Import**: Drag-and-drop uploads with month filtering, validation, and error reporting
- **💰 Bonus Calculator**: Automated calculations with detailed category breakdowns and forecast comparisons
- **👥 Participant Management**: Full CRUD operations with search, bulk import, and detailed profiles
- **📁 Category & Product Catalog**: Organize inventory with bonus-eligible flags, tier rules, and bonus modes
- **📈 Forecast Planning**: Set monthly revenue targets with threshold configuration and visual progress indicators
- **🧾 Receipt History**: View all imported sales data with filtering and search
- **👤 User Management** (Admin Only): Create, edit, deactivate, and delete user accounts
- **⚙️ Settings**: User profile management and password changes

### Technical Features
- **✅ Comprehensive Testing**: 76 automated tests (unit + integration) ensuring reliability
- **🐳 Docker Support**: Multi-stage Dockerfile for development, testing, and production
- **🔄 CI/CD Pipeline**: GitHub Actions with automated linting and testing
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with visual feedback and loading states

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/) 19.2.0
- **Build Tool**: [Vite](https://vitejs.dev/) 7.2.4
- **Routing**: [React Router](https://reactrouter.com/) 7.12.0
- **HTTP Client**: [Axios](https://axios-http.com/) 1.13.4
- **Charts**: [Recharts](https://recharts.org/) 3.7.0
- **Testing**: [Vitest](https://vitest.dev/) 4.0.18 + [React Testing Library](https://testing-library.com/react) 16.3.2
- **Linting**: [ESLint](https://eslint.org/) 9.39.1
- **Styling**: Vanilla CSS with modern design patterns
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```text
├── .github/
│   └── workflows/
│       └── ci.yaml              # GitHub Actions CI/CD pipeline
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Sidebar.jsx          # Navigation sidebar with role-based menu
│   │   ├── MetricCard.jsx       # Dashboard metric display cards
│   │   ├── CSVImportModal/      # CSV file upload modal
│   │   ├── MonthYearPicker/     # Date selection dropdown
│   │   └── ParticipantDetail/   # Participant detail modal
│   ├── pages/                   # Route-level page components
│   │   ├── Login/               # Authentication page
│   │   ├── SetPassword/         # Password setup for new users
│   │   ├── Dashboard/           # Command center with BI
│   │   ├── Participants/        # Participant CRUD interface
│   │   ├── Categories/          # Category & tier rule management
│   │   ├── Products/            # Product catalog with filtering
│   │   ├── Forecasts/           # Monthly revenue target planning
│   │   ├── Bonuses/             # Bonus calculation engine
│   │   ├── Receipts/            # Receipt history (read-only)
│   │   └── UserManagement/      # User admin panel (admin only)
│   ├── services/                # API communication layer
│   │   ├── authService.js       # Authentication and user management
│   │   ├── dashboardService.js  # Multi-endpoint data aggregation
│   │   ├── participantService.js
│   │   ├── categoryService.js
│   │   ├── productService.js
│   │   ├── forecastService.js
│   │   ├── bonusService.js
│   │   └── receiptService.js
│   ├── context/                 # React Context providers
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── tests/                   # Automated test suites
│   │   ├── unit/services/       # Service layer unit tests (35 tests)
│   │   └── integration/         # Component & page tests (41 tests)
│   ├── App.jsx                  # Main app with protected routes
│   └── main.jsx                 # Application entry point
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yaml          # Full-stack orchestration
├── nginx.conf                   # Production web server config
├── .dockerignore                # Docker build exclusions
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore rules
├── vite.config.js               # Vite build configuration
└── package.json                 # Dependencies and scripts
```

## 🛠 Getting Started

### Prerequisites

- **Node.js** v20+ - [Download Node](https://nodejs.org/)
- **TopShelf Backend** running on `http://localhost:3000` - [Backend Repository](../TopShelf-backend)

### 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

> **Note**: All Vite environment variables must be prefixed with `VITE_` to be accessible in the application.

---

## 💻 Local Development

### 1. Clone the repository
```bash
git clone <repository-url>
cd TopShelf-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

The app will be available at **`http://localhost:5173`**

### 4. Build for production
```bash
npm run build
```

Output will be in the `dist/` directory.

### 5. Preview production build
```bash
npm run preview
```

### 6. Run linter
```bash
npm run lint
```

---

## 🐳 Docker Development

### Using Docker Compose (Recommended)

Start both frontend and backend together:

```bash
docker-compose up --build
```

Access the application:
- **Frontend**: `http://localhost:8080`
- **Backend**: `http://localhost:3000`

Stop services:
```bash
docker-compose down
```

### Manual Docker Commands

#### Development Mode
```bash
# Build dev image
docker build --target dev-stage -t topshelf-frontend:dev .

# Run dev container
docker run -p 5173:5173 topshelf-frontend:dev
```

#### Production Mode
```bash
# Build production image
docker build --target production-stage -t topshelf-frontend:prod .

# Run production container
docker run -p 8080:80 topshelf-frontend:prod
```

#### Run Tests in Docker
```bash
# Build test image
docker build --target test -t topshelf-frontend:test .

# Run tests
docker run --rm topshelf-frontend:test
```

#### Run Linter in Docker
```bash
# Build lint image
docker build --target lint -t topshelf-frontend:lint .

# Run linter
docker run --rm topshelf-frontend:lint
```

---

## 🧪 Testing

The project maintains high quality via **76 automated tests** covering all services, components, and pages.

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test
# Press 'h' for help, 'a' to run all tests
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests once (CI mode)
```bash
npm run test -- --run
```

### Run tests with coverage
```bash
npm run test -- --coverage
```

### Test Coverage

| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| **Service Unit Tests** | 7 | 35 | ✅ 100% |
| **Component Integration Tests** | 4 | 28 | ✅ 100% |
| **Page Integration Tests** | 7 | 13 | ✅ 100% |
| **TOTAL** | **18** | **76** | ✅ **100%** |

**Latest Test Results**: 76/76 passing ✅

---

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration with Docker-based testing.

### Workflow Overview

On every push to `main` or pull request:

1. **Lint Job**: Builds Docker lint image and runs ESLint
2. **Test Job**: Builds Docker test image and runs all 76 tests

Both jobs run in parallel for faster feedback.

### Workflow File

Located at `.github/workflows/ci.yaml`

```yaml
name: CI

on: 
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build --target lint -t topshelf-frontend:lint .
      - run: docker run --rm topshelf-frontend:lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build --target test -t topshelf-frontend:test .
      - run: docker run --rm topshelf-frontend:test
```

### Branch Protection (Recommended)

Enable branch protection rules on GitHub:
1. Go to **Settings → Branches → Add Rule**
2. Branch name pattern: `main`
3. ✅ Require status checks to pass before merging
4. Select: `lint` and `test`

This prevents merging code that fails tests or linting.

---

## 📡 API Integration

The frontend communicates with the TopShelf backend via RESTful API endpoints.

### Base URL
```javascript
const API_URL = import.meta.env.VITE_API_URL; // http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Key Endpoints

| Resource | Methods | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/auth/login` | POST | User login | ❌ |
| `/auth/set-password` | POST | Set password for new users | ❌ |
| `/auth/change-password` | POST | Change user password | ✅ |
| `/users` | GET, POST, PUT, DELETE | User management (admin) | ✅ Admin |
| `/participants` | GET, POST, PUT, DELETE | Manage sellers/staff | ✅ |
| `/categories` | GET, POST, PUT, DELETE | Product groups & bonus modes | ✅ |
| `/products` | GET, POST, PUT, DELETE | Individual item management | ✅ |
| `/forecasts` | GET, POST, PUT, DELETE | Monthly targets & thresholds | ✅ |
| `/bonuses/calculate` | POST | Trigger bonus calculation | ✅ |
| `/bonuses/upload-receipts` | POST | Import CSV receipts | ✅ |
| `/receipts` | GET | View historical sales | ✅ |
| `/dashboard` | GET | Aggregated dashboard data | ✅ |

### Example Service Usage
```javascript
import { participantService } from './services/participantService';

// Get all participants
const participants = await participantService.getParticipants();

// Create new participant
const result = await participantService.createParticipant({
  firstname: 'John',
  lastname: 'Doe',
  employeeId: 'E001'
});
```

---

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full access to all features including user management
- **User**: Access to all features except user management

### Login Flow

1. User enters username and password
2. Backend validates credentials and returns JWT token
3. Token stored in `localStorage`
4. Token included in all subsequent API requests
5. On logout, token is removed from `localStorage`

### First-Time Login

New users must set their password:
1. Admin creates user account with temporary credentials
2. User logs in with username and temporary password
3. Redirected to "Set Password" page
4. User sets new password
5. Redirected to dashboard

### Protected Routes

All routes except `/login` and `/set-password` require authentication. Unauthenticated users are redirected to login.

---

## 🎯 User Workflows

### Calculate Monthly Bonuses (End-to-End)

1. **Navigate** to **Bonuses** page
2. **Select** target month and year using date picker
3. **Import Receipts** (if not already done):
   - Click "Import Receipts" button
   - Upload CSV file (`seller,item,quantity,price,date` format)
   - Optional: Filter by specific month/year
   - Review import results
4. **Enter Total Revenue** from restaurant POS system
5. **Review Forecast Status**:
   - Green: Threshold met (bonuses will be paid)
   - Yellow/Red: Below threshold (potential bonuses only)
6. **Click "Calculate Bonuses"**
7. **Review Results**:
   - Revenue breakdown (total vs bonus-eligible)
   - Participant rankings and payout amounts
   - Category-level performance details
   - Individual breakdowns (expandable per participant)

### Manage Users (Admin Only)

1. **Navigate** to **Users** page (admin-only menu item)
2. **View** all users with their roles and status
3. **Create** new user:
   - Click "Add User" button
   - Enter firstname, lastname, username, role
   - System generates temporary password
4. **Edit** existing user:
   - Click edit icon
   - Update user details
   - Save changes
5. **Deactivate/Activate** user:
   - Toggle user status
   - Deactivated users cannot log in
6. **Delete** user:
   - Permanently remove user account

---

## 🔍 Debugging & Troubleshooting

### Browser DevTools - Network Tab

1. Open DevTools (F12 or Cmd+Opt+I)
2. Navigate to **Network** tab
3. Trigger an action (e.g., load Dashboard, calculate bonuses)
4. Inspect API requests:
   - **Status**: Should be `200 OK`
   - **Headers**: Check `Authorization` header, CORS headers
   - **Payload**: Verify request body for POST/PUT
   - **Response**: Confirm data structure matches expected format
   - **Timing**: Should complete quickly (<1s for most endpoints)

### Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| CORS errors | Backend not allowing frontend origin | Update backend CORS configuration |
| "Loading..." stuck | Backend not running | Start backend: `npm start` in backend directory |
| 401 Unauthorized | Token expired or invalid | Log out and log back in |
| Empty Dashboard | No data in database | Seed database or import CSV data |
| CSV import fails | Wrong file format | Check CSV format: `seller,item,quantity,price,date` |
| Bonus calculation error | Missing forecast for period | Create forecast in Forecasts page |
| "Participant not found" | CSV has names not in DB | Import participants first |
| Charts show no data | No receipts for selected month | Import receipts via CSV |
| Can't access Users page | Not admin role | Only admins can manage users |

### Console Logging

The frontend includes debug logs for troubleshooting:
```javascript
console.log("Dashboard Debug - Raw Data:", { forecast, revenue, participantsCount });
console.log("Dashboard Debug - Bonus Data:", bonusData);
```

Check browser console (F12 → Console tab) for these logs to understand data flow.

---

## � Deployment

### Environment Variables for Production

Create a `.env.production` file:

```env
VITE_API_URL=https://api.yourproduction.com/api
```

### Build for Production

```bash
npm run build
```

Output files will be in `dist/` directory.

### Docker Production Deployment

```bash
# Build production image
docker build --target production-stage -t topshelf-frontend:prod .

# Run production container
docker run -p 8080:80 topshelf-frontend:prod
```

### Hosting Options

#### 🥇 Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

**Pros**: Auto-deploy from GitHub, free tier, global CDN, zero config

#### 🥈 Netlify
```bash
npm run build
# Drag dist/ folder to Netlify dashboard
```

**Pros**: Simple drag-and-drop, free tier, form handling

#### 🥉 Docker + Cloud Platform
```bash
# Push to Docker Hub
docker tag topshelf-frontend:prod yourusername/topshelf-frontend:latest
docker push yourusername/topshelf-frontend:latest

# Deploy to AWS ECS, Google Cloud Run, or Azure Container Instances
```

**Pros**: Full control, same environment everywhere, scalable

### Pre-Deployment Checklist

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Run `npm run build` locally to verify
- [ ] Test production build with `npm run preview`
- [ ] Ensure backend CORS allows production domain
- [ ] Set up SSL certificate (HTTPS)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Enable branch protection on GitHub
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

---

## 🏗 Architecture Highlights

### Service Layer Pattern
All API communication is abstracted into service modules (`services/`), separating concerns:
- **Components**: Focus on UI and user interaction
- **Services**: Handle HTTP requests, data transformation, error handling
- **Pages**: Orchestrate components and services

### Authentication Context
The `AuthContext` provides global authentication state:
- Current user information
- Login/logout functions
- Token management
- Loading states

### Protected Routes
React Router guards routes based on authentication status:
```javascript
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<Dashboard />} />
  {/* ... other protected routes */}
</Route>
```

### State Management
- **React useState**: Local component state
- **useEffect**: Side effects (data fetching, subscriptions)
- **Context API**: Shared state (authentication)
- **No Redux**: Keeping it simple with built-in React features

### Performance Optimizations
- **Parallel API Calls**: `Promise.all()` for independent requests
- **Conditional Rendering**: Only fetch/render data when needed
- **Memoization**: `useMemo` for expensive calculations
- **Vite HMR**: Instant hot module replacement during development

---

## 📊 Bundle Size

Current production bundle:
- **HTML**: 0.46 KB (gzipped: 0.30 KB)
- **CSS**: 53.51 KB (gzipped: 8.90 KB)
- **JavaScript**: 719.84 KB (gzipped: 217.76 KB)

**Total**: ~227 KB gzipped

> **Note**: Bundle size is acceptable for V1. Future optimization can include code splitting and lazy loading.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Quality Standards

- All tests must pass (76/76)
- ESLint must pass with no errors
- New features must include tests
- Follow existing code style and patterns

---

## 📝 License

ISC

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices:
- React team for the amazing framework
- Vite team for blazing-fast build tooling
- Vitest team for delightful testing experience
- Recharts team for beautiful, composable charts

---

**Developed by Maua Imani**  
**TopShelf - Transforming bonus calculations from chaos to clarity!** 🎯📊💰
