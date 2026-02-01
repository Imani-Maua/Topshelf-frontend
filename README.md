# TopShelf: Upsell Bonus Calculation System - Frontend

Modern, responsive React application for managing restaurant bonus calculations with complete transparency and real-time business intelligence.

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

## 🚀 Features

- **Real-Time Dashboard**: Live metrics, revenue tracking, performance visualization, top performers leaderboard.
- **CSV Receipt Import**: Drag-and-drop uploads with month filtering, validation, and error reporting.
- **Bonus Calculator**: Automated calculations with detailed category breakdowns and forecast comparisons.
- **Participant Management**: Full CRUD operations with search, bulk import, and detailed profiles.
- **Category & Product Catalog**: Organize inventory with bonus-eligible flags, tier rules, and bonus modes.
- **Forecast Planning**: Set monthly revenue targets with threshold configuration and visual progress indicators.
- **Business Intelligence**: Interactive charts (bar, pie), performance leaderboards, category analytics.
- **Comprehensive Testing**: 76 automated tests (unit + integration) ensuring reliability.

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/) 18.2.0
- **Build Tool**: [Vite](https://vitejs.dev/) 5.0.8
- **Routing**: [React Router](https://reactrouter.com/) 6.x
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **Styling**: Vanilla CSS with modern design patterns

## 📁 Project Structure

```text
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Sidebar.jsx         # Navigation sidebar with routing
│   │   ├── MetricCard.jsx      # Dashboard metric display cards
│   │   ├── CSVImportModal/     # CSV file upload modal
│   │   ├── MonthYearPicker/    # Date selection dropdown
│   │   └── ParticipantDetail/  # Participant detail modal
│   ├── pages/                  # Route-level page components
│   │   ├── Dashboard/          # Command center with BI
│   │   ├── Participants/       # Participant CRUD interface
│   │   ├── Categories/         # Category & tier rule management
│   │   ├── Products/           # Product catalog with filtering
│   │   ├── Forecasts/          # Monthly revenue target planning
│   │   ├── Bonuses/            # Bonus calculation engine
│   │   └── Receipts/           # Receipt history (read-only)
│   ├── services/               # API communication layer
│   │   ├── dashboardService.js # Multi-endpoint data aggregation
│   │   ├── participantService.js
│   │   ├── categoryService.js
│   │   ├── productService.js
│   │   ├── forecastService.js
│   │   ├── bonusService.js
│   │   └── receiptService.js
│   ├── tests/                  # Automated test suites
│   │   ├── unit/services/      # Service layer unit tests
│   │   └── integration/        # Component & page integration tests
│   ├── context/                # React Context providers
│   │   └── AuthContext.jsx     # Authentication context
│   ├── App.jsx                 # Main app with routing
│   └── main.jsx                # Application entry point
├── data/                       # Sample CSV files for testing
├── .gitignore                  # Git ignore rules
├── vite.config.js              # Vite build configuration
└── package.json                # Dependencies and scripts
```

## 🛠 Getting Started

### Prerequisites

- **Node.js** v18+ - [Download Node](https://nodejs.org/)
- **TopShelf Backend** running on `http://localhost:3000` - [Backend Repository](../TopShelf-backend)

### 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

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

The app will be available at `http://localhost:5173`

### 4. Build for production
```bash
npm run build
```

### 5. Preview production build
```bash
npm run preview
```

---

## 🧪 Testing

The project maintains high quality via 76 automated tests covering all services, components, and pages.

### Run all tests
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm test -- --coverage
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

## 📡 API Integration

The frontend communicates with the TopShelf backend via RESTful API endpoints.

### Base URL
```javascript
const API_URL = 'http://localhost:3000/api';
```

### Key Endpoints

| Resource | Methods | Description |
| :--- | :--- | :--- |
| `/participants` | GET, POST, PUT, DELETE | Manage sellers/staff |
| `/categories` | GET, POST, PUT, DELETE | Product groups & bonus modes |
| `/products` | GET, POST, PUT, DELETE | Individual item management |
| `/forecasts` | GET, POST, PUT, DELETE | Monthly targets & thresholds |
| `/bonuses/calculate` | POST | Trigger bonus calculation |
| `/bonuses/upload-receipts` | POST | Import CSV receipts with filtering |
| `/receipts` | GET | View historical sales (read-only) |

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

### Import Receipt Data

1. Click **"Import Receipts"** button (Dashboard or Bonuses page)
2. Select CSV file (max 10MB, format: `seller,item,quantity,price,date`)
3. **(Optional)** Enable "Filter by Month" and select target period
4. Click **"Upload & Process"**
5. Review results:
   - Successfully imported count
   - Month-wise breakdown
   - Validation errors (if any: missing seller, invalid product, etc.)

---

## 🔍 Debugging & Troubleshooting

### Browser DevTools - Network Tab

1. Open DevTools (F12 or Cmd+Opt+I)
2. Navigate to **Network** tab
3. Trigger an action (e.g., load Dashboard, calculate bonuses)
4. Inspect API requests:
   - **Status**: Should be `200 OK`
   - **Headers**: Check `Content-Type`, CORS headers
   - **Payload**: Verify request body for POST/PUT
   - **Response**: Confirm data structure matches expected format
   - **Timing**: Should complete quickly (<1s for most endpoints)

### Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| CORS errors | Backend not allowing frontend origin | Update backend CORS configuration |
| "Loading..." stuck | Backend not running | Start backend: `npm start` in backend directory |
| Empty Dashboard | No data in database | Seed database or import CSV data |
| CSV import fails | Wrong file format | Check CSV format: `seller,item,quantity,price,date` |
| Bonus calculation error | Missing forecast for period | Create forecast in Forecasts page |
| "Participant not found" | CSV has names not in DB | Import participants first |
| Charts show no data | No receipts for selected month | Import receipts via CSV |

### Console Logging

The frontend includes debug logs for troubleshooting:
```javascript
console.log("Dashboard Debug - Raw Data:", { forecast, revenue, participantsCount });
console.log("Dashboard Debug - Bonus Data:", bonusData);
```

Check browser console (F12 → Console tab) for these logs to understand data flow.

---

## 🐳 Deployment

### Environment Variables for Production

```env
VITE_API_URL=https://api.yourproduction.com/api
```

### Build for Production

```bash
npm run build
```

Output files will be in `dist/` directory.

### Docker Support (Coming Soon)

Containerize the frontend for consistent deployment:
```bash
docker build -t topshelf-frontend .
docker run -p 5173:5173 topshelf-frontend
```

### Hosting Options

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag-and-drop `dist/` folder or connect Git
- **AWS S3 + CloudFront**: Static hosting with global CDN
- **Docker**: Containerized deployment with Nginx

---

## 🏗 Architecture Highlights

### Service Layer Pattern
All API communication is abstracted into service modules (`services/`), separating concerns:
- **Components**: Focus on UI and user interaction
- **Services**: Handle HTTP requests, data transformation, error handling
- **Pages**: Orchestrate components and services

### State Management
- **React useState**: Local component state
- **useEffect**: Side effects (data fetching, subscriptions)
- **Context API**: Shared state (authentication, theme)
- **No Redux**: Keeping it simple with built-in React features

### Performance Optimizations
- **Parallel API Calls**: `Promise.all()` for independent requests
- **Conditional Rendering**: Only fetch/render data when needed
- **Memoization**: `useMemo` for expensive calculations
- **Code Splitting**: Lazy loading for routes (future enhancement)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 License

ISC

---

## 📚 Learning Resources

Want to understand how everything works? Check out these educational guides:

- **[CSV Import Flow](../brain/csv_import_explained.md)**: Step-by-step explanation of file upload process, FormData, and backend processing
- **[Dashboard Architecture](../brain/dashboard_explained.md)**: Deep dive into frontend-backend communication, data aggregation, and React patterns

---

**Developed by Maua Imani**  
**TopShelf - Transforming bonus calculations from chaos to clarity!** 🎯📊💰
