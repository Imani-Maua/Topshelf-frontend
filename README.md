# TopShelf

Hey there! 👋 Welcome to TopShelf, an app that automatically calculates your team's bonuses based on their sales data.

## 🤔 So, What's This All About?

You know that frustrating situation where your sales team crushes their targets in January, but they have to wait until March to see their bonuses? And then when the calculation finally happens, nobody really understands how the numbers were crunched? Yeah, we hated that too.

TopShelf changes the game. Think of it as your bonus calculation command center: transparent, fast, and dare we say, actually enjoyable to use.

## 💡 The Story Behind TopShelf

### The Old Way (Spoiler: It Wasn't Great)

Picture this: Excel spreadsheets everywhere. Manual data entry. Formulas that only one person understands. Calculations taking **2+ months** to complete. Sales team members wondering if they'll ever see their hard-earned bonuses. Finance teams pulling their hair out trying to make everything add up.

Sound familiar? That's exactly what we were dealing with.

### The TopShelf Way ✨

Now imagine:
- Upload your sales receipts → **Done** ✅
- Set your monthly targets → **Done** ✅  
- Hit "Calculate" → **Instant results** ⚡
- Everyone sees exactly how bonuses were calculated → **Total transparency** 🔍

**Before TopShelf**: January sales → March payout (60+ day wait)  
**With TopShelf**: January sales → January payout (same day possible!)

That's not just an improvement, that's transformative for team morale.

## 🎯 What Can You Actually Do With This?

### For Operations Teams
- **Import sales data** with a simple CSV upload (drag, drop, done!)
- **Set monthly targets** and thresholds that make sense for your business
- **Calculate bonuses** instantly with complete breakdowns
- **See exactly who earned what** and why

### For HR & Finance
- **View everything** in real-time dashboards
- **Understand the numbers** with visual charts and clear breakdowns
- **Audit trail built-in** - every calculation is documented
- **No edit access** to keep data integrity intact (read-only for HR/Finance roles)

### For Everyone
- **Beautiful dashboard** showing performance at a glance
- **Individual participant tracking** to see top performers
- **Category-level insights** to understand what's selling
- **Mobile-friendly** - check stats from anywhere

## 🛡️ Security & Roles

- **🔐 Secure login** - Your data is protected with industry-standard JWT authentication
- **👥 Role-based access** - Operations folks can edit, HR/Finance can view
- **🔒 Admin controls** - Only admins can manage user accounts
- **📊 Audit-ready** - Everything is tracked and logged

### User Roles Explained:
- **Operations**: Full access - import data, calculate bonuses, manage everything
- **Admin**: View all data + manage user accounts
- **Finance**: View all data (read-only, no editing)

## 🚀 Getting Started


```bash
# Clone the project
git clone <your-repo-url>
cd TopShelf-frontend

# Install everything
npm install

# Fire it up!
npm run dev
```

Visit `http://localhost:5173` and you're off to the races! 🏃‍♂️

**Note**: You'll need the backend running too. Check out the [backend repo](https://github.com/Imani-Maua/TopShelf-backend) for setup instructions.

## 🧪 Testing 

TopShelf has **76 automated tests** making sure everything works as expected. No nasty surprises!

```bash
# Run all tests
npm test

# See pretty test UI
npm run test:ui

# Get coverage report 
npm run test -- --coverage
```

**Current status**: ✅ 76/76 tests passing

## 🐳 Docker? Yeah, We've Got That Too

Want to run everything in containers? We got you:

```bash
# Start both frontend and backend
docker-compose up

# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

It's containerized, tested, and ready for production. Because life's too short for "it works on my machine" problems.

## 📊 What You'll See

### Dashboard
Your command center. See total revenue, bonus pool status, top performers, and trends - all in real-time charts that actually make sense.

### Participants
Manage your team members. Add new folks, update details, import from CSV. Simple as that.

### Products & Categories  
Organize your inventory. Set which products earn bonuses and configure tier rules (e.g., sell 10 steaks = 5% bonus, sell 20 = 7.5%).

### Forecasts
Set your monthly revenue targets and thresholds. This is where you decide "if we hit 90% of target, bonuses get paid."

### Bonuses
The magic happens here. Import receipts, review the forecast, calculate bonuses, and see detailed breakdowns for everyone.

### Receipts
Your data archive. All imported sales receipts are here, searchable and filterable.

## 🔧 Tech Stack

Built with modern, tested tools:
- **React 19** - Because it's awesome
- **Vite** - Lightning-fast builds
- **Recharts** - Beautiful data visualization
- **Vitest** - Testing that doesn't make you cry
- **Docker** - Deploy anywhere
- **Nginx** - Solid production serving


## 🌍 Ready for Production

When you're ready to deploy:

```bash
# Build it
npm run build

# Test the build
npm run preview

# Deploy with Docker
docker build --target production-stage -t topshelf-frontend:prod .
docker run -p 8080:80 topshelf-frontend:prod
```


## 🎨 The Design Philosophy

We built TopShelf with a few core principles:

1. **Transparency First** - Everyone should understand how bonuses are calculated
2. **Speed Matters** - No one wants to wait 2 months for results
3. **Keep It Simple** - Complex problems need simple solutions
4. **Trust Through Clarity** - When people understand the system, they trust it

## 🤝 Want to Contribute?

We'd love your help! Here's the deal:

1. Fork it
2. Create a feature branch
3. Make your changes
4. Run the tests (they better pass! 😄)
5. Submit a PR

**Quality bar**: Tests must pass, linter must be happy, and code should be clean enough that your future self won't curse you out.

## 🐛 Something Broken?

Check the troubleshooting section in the full README, or:

- **CORS errors?** → Backend CORS config needs your frontend URL
- **401 errors?** → Your auth token expired, log in again
- **Empty dashboard?** → Import some data first!
- **Tests failing?** → Run `npm install` again, might be a dependency thing

## 📝 The Legal Stuff

ISC License - basically, use it, modify it, just don't blame us if something breaks. 😉

---

## 🙌 Big Thanks To

- The React team for making frontend development actually fun
- Vite for making builds blazingly fast
- The open source community for all the amazing tools
- Coffee, for obvious reasons ☕

---

**Built with ❤️ by Maua Imani**

*TopShelf - Because your team deserves bonuses that are calculated fairly, quickly, and transparently.*

**Questions? Issues? Ideas?** Open an issue or PR. We're all ears! 👂

---

**PS**: If you're still reading this, you're awesome. Go calculate some bonuses! 🎯

