# TopShelf - Frontend

**Modern React application for restaurant bonus calculations and sales performance tracking.**

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/vite-5.0.8-646cff.svg)

---

## 🎯 Overview

TopShelf Frontend is a responsive, feature-rich React application that provides an intuitive interface for managing restaurant bonus calculations. It replaces slow, error-prone Excel + Macros processes with a modern, transparent system that enables same-month payouts.

### Key Benefits
- ⚡ **Fast**: Same-month payouts (vs 2-month delay with Excel)
- ✅ **Accurate**: Eliminates manual calculation errors
- 📊 **Transparent**: Complete visibility into bonus calculations
- 🎨 **Beautiful**: Modern, premium UI with smooth animations

---

## ✨ Features

### 📋 **Participant Management**
- Add, edit, delete sales participants
- View participant sales history
- Track bonus earnings per participant

### 🏷️ **Category & Product Management**
- Organize products into bonus-eligible categories
- Configure calculation modes (PER_ITEM or PER_CATEGORY)
- Manage product catalog with pricing

### 📊 **Tier Rules Configuration**
- Define bonus tiers with minimum quantity thresholds
- Set bonus percentages per tier
- Automatic validation of tier rules

### 🎯 **Forecast Management**
- Set monthly revenue targets
- Define threshold percentages
- Visual forecast status indicators

### 📤 **CSV Receipt Import**
- Upload sales receipts via drag-and-drop or file picker
- Optional month/year filtering during import
- Real-time validation and error reporting
- Month breakdown of imported data

### 💰 **Bonus Calculations**
- Calculate monthly bonuses based on sales performance
- Revenue breakdown (total vs bonus-eligible)
- Data completeness tracking with missing days alerts
- Detailed participant and category breakdowns

### 📈 **Business Intelligence**
- Visual progress bars (revenue vs target)
- Participant leaderboard with rankings
- Category performance charts
- Summary statistics and insights

### 📄 **Receipts Viewing**
- View all imported receipt data
- Filter by month, year, participant
- Pagination support
- READ-ONLY data integrity

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd TopShelf-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── CSVImportModal/ # CSV import modal component
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard with summary cards
│   ├── Participants/   # Participant management
│   ├── Categories/     # Category management
│   ├── Products/       # Product management
│   ├── Forecasts/      # Forecast management
│   ├── Bonuses/        # Bonus calculations
│   └── Receipts/       # Receipt viewing
├── services/           # API service layer
│   ├── api.js         # Base API configuration
│   ├── participantService.js
│   ├── categoryService.js
│   ├── productService.js
│   ├── forecastService.js
│   ├── bonusService.js
│   └── receiptService.js
├── App.jsx            # Main app component with routing
├── App.css            # Global styles
└── main.jsx           # Application entry point
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#4A90E2` (Blue)
- **Success**: `#4CAF50` (Green)
- **Warning**: `#FFA940` (Orange)
- **Danger**: `#F44336` (Red)
- **Background**: `#F5F7FA` (Light Gray)

### Typography
- **Font Family**: 'Inter', -apple-system, system-ui, sans-serif
- **Headings**: 700 weight
- **Body**: 400 weight

### Components
- **Cards**: White background, subtle shadow, 12px border radius
- **Buttons**: Rounded, hover effects, disabled states
- **Inputs**: Bordered, focus states, validation feedback
- **Modals**: Overlay with centered content, smooth animations

---

## 🔌 API Integration

The frontend communicates with the backend API via RESTful endpoints:

### Base URL
```javascript
const API_URL = 'http://localhost:3000/api';
```

### Services
- **Participants**: `/participants`
- **Categories**: `/categories`
- **Products**: `/products`
- **Forecasts**: `/forecasts`
- **Bonuses**: `/bonuses/calculate`, `/bonuses/upload-receipts`
- **Receipts**: `/receipts`

### Example API Call
```javascript
import { participantService } from './services/participantService';

// Get all participants
const participants = await participantService.getAll();

// Create new participant
const newParticipant = await participantService.create({
  firstname: 'John',
  lastname: 'Doe'
});
```

---

## 📊 Key Pages

### Dashboard
- Summary cards (participants, categories, forecasts)
- Quick stats and insights
- Navigation to all features

### Bonuses
- Month/year selection
- Total revenue input
- Forecast validation
- Revenue breakdown display
- Data completeness warnings
- Bonus calculation results
- Participant leaderboard
- Category performance charts

### Receipts
- Filter by month, year, participant
- Pagination (10/25/50/100 per page)
- READ-ONLY data view
- Import status tracking

---

## 🎯 User Flows

### Calculate Monthly Bonuses

1. Navigate to **Bonuses** page
2. Select month and year
3. (Optional) Import receipts via CSV
4. Enter total restaurant revenue
5. Review forecast status
6. Click **Calculate Bonuses**
7. Review results:
   - Revenue breakdown
   - Data completeness
   - Participant payouts
   - Category performance

### Import Receipt Data

1. Click **Import Receipts** button
2. Select CSV file (max 10MB)
3. (Optional) Filter by specific month/year
4. Click **Upload & Process**
5. Review import results:
   - Successfully imported count
   - Month breakdown
   - Error details (if any)

---

## 🛠️ Development

### Available Scripts

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style
- Use functional components with hooks
- Follow React best practices
- Keep components focused and reusable
- Use meaningful variable names
- Add comments for complex logic

### State Management
- Local state with `useState` for component-specific data
- Props for parent-child communication
- Service layer for API calls and data fetching

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: API calls failing with CORS errors  
**Solution**: Ensure backend is running and CORS is configured

**Issue**: CSV import not working  
**Solution**: Check file format (seller, item, quantity, price, date)

**Issue**: Bonus calculation showing empty page  
**Solution**: Verify forecast exists for selected month/year

**Issue**: Data completeness warning showing  
**Solution**: Import receipts for missing days or proceed with calculation

---

## 🚀 Deployment

### Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

### Production Build
```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Hosting Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: Drag-and-drop or Git integration
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Docker**: Containerized deployment

---

## 📝 Version History

### V0.1.0 (February 1, 2026)
- ✅ Initial production release
- ✅ All core features implemented
- ✅ Revenue tracking and data completeness
- ✅ CSV import with filtering
- ✅ Bonus calculations with BI features
- ✅ Responsive design
- ✅ Modern UI with animations

---

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the development team.

---

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Axios](https://axios-http.com/) - HTTP client
- [React Router](https://reactrouter.com/) - Routing

---

**TopShelf - Transforming bonus calculations from chaos to clarity!** 🎯📊💰
