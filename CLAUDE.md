# Financial Tracker Backend - Development Progress

## Session Date: 2025-10-24

### ✅ Completed Today

1. **Successfully Deployed Backend to Railway**
   - Created new Railway project linked to GitHub repository
   - Configured environment variables in Railway dashboard
   - Generated public domain: `https://financial-tracker-api-production.up.railway.app`
   - Verified deployment with successful API endpoint testing

2. **Fixed Environment Variable Injection Issues**
   - Discovered Railway's "Redeploy" uses old configuration (doesn't pick up new env vars)
   - Solution: Use "Deploy" button with "apply destructive changes" to apply new environment variables
   - Confirmed all environment variables properly injected:
     - `GOOGLE_CLIENT_ID`: SET ✅
     - `GOOGLE_CLIENT_SECRET`: SET ✅
     - `SESSION_SECRET`: SET ✅
     - `NODE_ENV`: production ✅
     - Railway auto-sets `PORT=8080` ✅

3. **Configured Railway Public Networking**
   - Set custom port to 8080 (matches Express app port)
   - Railway routes HTTPS (443) → container port 8080
   - Domain successfully accessible at `https://financial-tracker-api-production.up.railway.app`

4. **Updated Google OAuth Configuration**
   - Added Railway callback URL to Google Cloud Console authorized redirect URIs:
     - `https://financial-tracker-api-production.up.railway.app/api/auth/google/callback`
   - Kept localhost callback for local development

### 🎯 Deployment Status: **LIVE**

Backend is successfully deployed and functional:
- ✅ All environment variables properly loaded
- ✅ API endpoints responding correctly (401 Unauthorized for protected routes)
- ✅ Google OAuth configured for production
- ✅ Public domain generated and accessible
- ⚠️ MemoryStore warning for sessions (acceptable for now, can upgrade to SQLite session store later)

### 🔑 Key Learnings (Session 2025-10-24)

1. **Railway "Redeploy" vs "Deploy" button**
   - **"Redeploy"** = Rebuilds with exact same configuration (OLD env vars)
   - **"Deploy"** = New deployment with current configuration (NEW env vars)
   - After changing environment variables, MUST use "Deploy" (not "Redeploy")
   - "Apply destructive changes" warning is EXPECTED when env vars change

2. **Railway Environment Variables**
   - Remove quotes from values in Railway dashboard (Railway handles them automatically)
   - Variables only take effect after fresh deployment (not redeploy)
   - Railway automatically sets `PORT` environment variable (let Railway control it)

3. **Dotenv in Production**
   - Railway injects env vars directly into the Node.js process
   - No need for `.env` file in production (file won't exist in container anyway)
   - Can safely call `dotenv.config()` - it will find 0 variables and Railway's env vars take precedence

4. **Railway Public Networking**
   - Must configure port number that matches Express app
   - Railway auto-detects running port but manual confirmation is safest
   - Domain generation is immediate and works instantly

5. **Session Store Warning**
   - Default `MemoryStore` is not production-ready (memory leaks, doesn't scale)
   - Acceptable for MVP/testing deployment
   - Can upgrade to `connect-sqlite3` or Redis later for production-grade sessions

### 📝 Environment Variables (Railway Production)

Required environment variables in Railway dashboard:
```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
SESSION_SECRET=<random-secret-key>
NODE_ENV=production
FRONTEND_URL=<frontend-deployment-url>
```

**Notes:**
- Do NOT include `PORT` - Railway sets this automatically
- Remove quotes from all values in Railway dashboard
- `FRONTEND_URL` must be updated when frontend is deployed

### 📝 Deployment Checklist

**Before Deploying:**
1. ✅ Push latest code to GitHub
2. ✅ Build succeeds locally (`yarn build`)
3. ✅ `.env` file in `.gitignore`
4. ✅ No sensitive data committed to git

**Railway Setup:**
1. ✅ Create new Railway project
2. ✅ Link to GitHub repository
3. ✅ Add all environment variables (without quotes)
4. ✅ Click "Deploy" (NOT "Redeploy")
5. ✅ Confirm "apply destructive changes"

**Post-Deployment:**
1. ✅ Generate public domain in Settings → Networking
2. ✅ Set port to 8080
3. ✅ Test API endpoints
4. ✅ Update Google OAuth redirect URIs in Google Cloud Console
5. ⏳ Update `FRONTEND_URL` when frontend is deployed (pending)

### 🌐 Production URLs

- **Backend API**: `https://financial-tracker-api-production.up.railway.app`
- **OAuth Callback**: `https://financial-tracker-api-production.up.railway.app/api/auth/google/callback`
- **Frontend**: TBD (pending deployment)

### 📋 Next Steps

1. **Deploy Frontend**
   - Deploy React frontend (Vercel/Netlify/Railway)
   - Update Railway `FRONTEND_URL` environment variable
   - Click "Deploy" to apply changes

2. **Optional: Upgrade Session Store**
   - Install `connect-sqlite3`
   - Configure session storage in SQLite database
   - Eliminates MemoryStore warning

3. **Testing**
   - Test full OAuth flow with deployed frontend + backend
   - Verify CORS settings work correctly
   - Test all API endpoints end-to-end

---

## Session Date: 2025-10-16

### ✅ Completed Today

1. **Completed Goal Routes Implementation**
   - Created `src/routes/goalRoutes.ts` with all required endpoints
   - Wired up goal routes in `server.ts` at `/api/goals`
   - Applied `requireAuth` middleware to all goal routes
   - All backend API endpoints are now complete and functional

2. **Set Up ESLint and Prettier**
   - Installed and configured ESLint with TypeScript support
   - Configured Prettier for code formatting (single quotes, 100 char width, auto line endings)
   - Added import order rules with `eslint-plugin-import`
   - Created `.eslintrc`, `.prettierrc`, `.eslintignore`, `.prettierignore`
   - Added npm scripts: `lint`, `lint:fix`, `format`, `format:check`
   - Configured VSCode settings for auto-format on save

3. **Implemented Full TypeScript Type Safety**
   - Created `src/types/models.ts` with interfaces for `Goal`, `Investment`, `User`
   - Created `src/types/express.d.ts` to extend `Express.User` interface
   - Removed all `any` types from codebase
   - Fixed passport.ts type issues (removed async, added proper User types)
   - Added proper return types for all functions

4. **Fixed TypeScript Configuration Issues**
   - Resolved `@types/sqlite3` type definition error
   - Added `"files": ["src/types/express.d.ts"]` to `tsconfig.json` to ensure type augmentation works with ts-node
   - Set `noEmit: false` to enable TypeScript compilation
   - Configured proper module resolution for custom types

5. **Fixed Git and Line Ending Issues**
   - Added `.env` to `.gitignore` (was accidentally committed)
   - Removed `.env` from git history and force pushed
   - Configured Prettier `endOfLine: "auto"` to handle Windows CRLF line endings
   - Created `.vscode/settings.json` for consistent editor configuration

6. **Verified Server Startup**
   - Server starts successfully on port 3001
   - All routes properly initialized
   - Zero TypeScript errors
   - Zero ESLint warnings
   - All authentication and API endpoints working

### 🎯 Backend Status: **COMPLETE**

All backend functionality is implemented and tested:
- ✅ Google OAuth authentication with session management
- ✅ User registration and login flow
- ✅ Investment CRUD operations with user isolation
- ✅ Goal management (create, read, update status)
- ✅ Authentication middleware protecting all routes
- ✅ Full TypeScript type safety
- ✅ Code quality tools (ESLint + Prettier)
- ✅ Import sorting and auto-formatting
- ✅ Server runs without errors

### 📋 Next Steps: Frontend Implementation

#### Frontend (Next Session):
1. Add `paths.goals` to `src/utils/constants.ts`
2. Create goal API hooks in `src/hooks/api-hooks.ts`:
   - `useGoals()` - Fetch all goals
   - `useCreateGoalMutation()` - Create new goal
   - `useUpdateGoalMutation()` - Update goal status
3. Update `ProgressBar` component to use dynamic goal from API
4. Add auto-complete logic: when `progress >= 100`, call `updateGoalMutation`
5. Create UI for goal management (create/cancel buttons)
6. Add confirmation modal for cancelling goals

### 🔑 Key Learnings (Session 2025-10-16)

- **Type augmentation files need explicit inclusion** - Use `"files": ["src/types/express.d.ts"]` in tsconfig.json for global type declarations
- **Avoid mixing async/await with callback-based code** - Can cause functions to return before callbacks complete
- **Import order enforcement improves code consistency** - `eslint-plugin-import` with alphabetical sorting keeps imports clean
- **`.gitignore` .env files from the start** - Prevents accidental credential exposure
- **`endOfLine: "auto"` in Prettier** - More flexible for cross-platform development (Windows/Mac/Linux)
- **`skipLibCheck: true` is essential** - Skips type checking for node_modules, avoiding issues with outdated type definitions
- **VSCode requires reload after config changes** - Prettier/ESLint settings need window reload to take effect

### 📝 Development Tools

**Code Quality:**
- `yarn lint` - Check for ESLint errors
- `yarn lint:fix` - Auto-fix ESLint issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check if code is formatted
- `yarn build` - Compile TypeScript to JavaScript

**Development:**
- `yarn start` - Start dev server with nodemon (auto-reload)
- `yarn dev` - Start server with ts-node (no auto-reload)

### 📁 Project Structure

```
src/
├── config/
│   ├── database.ts       # SQLite database setup
│   └── passport.ts       # Google OAuth configuration
├── controllers/
│   ├── authController.ts      # Authentication logic
│   ├── goalController.ts      # Goal CRUD operations
│   └── investmentController.ts # Investment CRUD operations
├── middleware/
│   └── auth.ts           # requireAuth middleware
├── routes/
│   ├── authRoutes.ts     # Auth endpoints
│   ├── goalRoutes.ts     # Goal endpoints
│   └── investmentRoutes.ts # Investment endpoints
├── types/
│   ├── express.d.ts      # Express type augmentation
│   └── models.ts         # Database model types
└── server.ts             # Express app entry point
```

### 🗄️ API Endpoints

**Authentication:**
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler

**Investments:** (All require authentication)
- `GET /api/investments` - Get all user investments
- `POST /api/investments` - Create new investment
- `DELETE /api/investments/:id` - Delete investment

**Goals:** (All require authentication)
- `GET /api/goals` - Get all user goals (supports `?status=active|completed|cancelled`)
- `POST /api/goals` - Create new goal (max 1 active goal per user)
- `PATCH /api/goals/:id` - Update goal status (body: `{ status: 'completed' | 'cancelled' }`)

### 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE investments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('cd', 'tBill')),
  amount REAL NOT NULL,
  rate REAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Goals table
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 📝 Application Workflow

The app implements a "financial ladder" approach:
1. User creates a goal (e.g., save $50k)
2. User makes monthly investments (CDs/T-Bills with 3-month terms)
3. Frontend calculates progress: `SUM(investments) / target_amount * 100`
4. When progress hits 100%, frontend auto-marks goal as completed
5. User creates new goal (e.g., $100k), and progress continues cumulatively
6. All previous investments count toward the new goal

### 📝 Notes

- Google OAuth credentials are in `.env` file (not committed to git)
- Frontend URL: `http://localhost:3000`
- Backend URL: `http://localhost:3001`
- OAuth callback: `http://localhost:3001/api/auth/google/callback`

---

## Session Date: 2025-10-15

### ✅ Completed Today

1. **Fixed Demo Reversion Issues**
   - Added missing `user_id` column to investments table in `database.ts:10`
   - Removed duplicate queries in `investmentController.ts` (lines 15-21 and 60-76)
   - Applied `requireAuth` middleware to all investment routes
   - Ensured all investment operations properly filter by `user_id`

2. **Completed Goal Controller Functions**
   - Implemented `updateGoal` function in `goalController.ts:86-143`
   - Learned proper error handling patterns (always `return` after `res.json()`)
   - Learned proper query nesting for sequential database operations
   - Implemented conditional `completed_at` logic:
     - Set to ISO timestamp when status = 'completed'
     - Set to null when status = 'cancelled'
   - Added validation to only allow transitions from active → completed/cancelled
   - Added check to prevent duplicate status updates

3. **Application Architecture Decisions**
   - Decided to use **cumulative investment tracking** (all investments sum toward current goal)
   - Frontend will handle interest calculations and maturity tracking on-the-fly
   - Frontend will trigger auto-completion when progress reaches 100%
   - Decided **NOT** to implement `getGoalProgress` endpoint (frontend calculates this)
   - Goal status transitions are **one-way only**: active → completed/cancelled (no reversals)
   - Confirmation modals in frontend will prevent accidental status changes

4. **Analyzed Frontend Implementation**
   - Reviewed React frontend in `financial-tracker/` directory
   - Confirmed frontend uses `calculateDerivedData()` for interest/maturity calculations
   - Progress bar sums all investments: `SUM(investments.amount) / goal.target_amount * 100`
   - Currently uses hardcoded `GOAL_AMOUNT = 600000` (will be replaced with dynamic goal API)

### 📋 Next Steps (Todo List)

#### Backend (Current Session):
1. **Create goal routes** - `src/routes/goalRoutes.ts`
   - `GET /api/goals` → `getAllGoals` (with optional ?status= query param)
   - `POST /api/goals` → `createGoal`
   - `PATCH /api/goals/:id` → `updateGoal`
   - ~~`GET /api/goals/progress`~~ - **SKIP** (frontend calculates this)

2. **Wire up goal routes in server.ts**
   - Import goalRoutes: `import goalRoutes from './routes/goalRoutes'`
   - Add route: `app.use('/api/goals', goalRoutes)`

3. **Apply requireAuth middleware to goal routes**

#### Frontend (Future Session):
1. Add `paths.goals` to `src/utils/constants.ts`
2. Create goal API hooks in `src/hooks/api-hooks.ts`:
   - `useGoals()` - Fetch all goals
   - `useCreateGoalMutation()` - Create new goal
   - `useUpdateGoalMutation()` - Update goal status
3. Update `ProgressBar` component to use dynamic goal from API
4. Add auto-complete logic: when `progress >= 100`, call `updateGoalMutation`
5. Create UI for goal management (create/cancel buttons)
6. Add confirmation modal for cancelling goals

### 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE investments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('cd', 'tBill')),
  amount REAL NOT NULL,
  rate REAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Goals table
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 🔑 Key Learnings (Session 2025-10-15)

- **Always `return` after sending responses** - Prevents multiple responses and continued execution
- **Nest database queries** when they depend on each other (check → update → fetch)
- **Use `.toISOString()` for SQLite datetime** - SQLite stores datetimes as strings
- **Frontend-calculated derived data** - Interest, maturity dates, and progress can be calculated on-the-fly instead of stored
- **One-way state transitions** - Terminal states (completed/cancelled) should not be reversible to maintain data integrity
- **Validation messages must match logic** - Error messages should accurately reflect what the validation checks

### 📝 Application Workflow

The app implements a "financial ladder" approach:
1. User creates a goal (e.g., save $50k)
2. User makes monthly investments (CDs/T-Bills with 3-month terms)
3. Frontend calculates progress: `SUM(investments) / target_amount * 100`
4. When progress hits 100%, frontend auto-marks goal as completed
5. User creates new goal (e.g., $100k), and progress continues cumulatively
6. All previous investments count toward the new goal

### 📝 Notes

- Google OAuth credentials are in `.env` file
- Frontend URL: `http://localhost:3000`
- Backend URL: `http://localhost:3001`
- OAuth callback: `http://localhost:3001/api/auth/google/callback`

---

## Session Date: 2025-10-03

### ✅ Completed Today

1. **Added Google OAuth Authentication**
   - Installed passport, passport-google-oauth20, express-session, dotenv
   - Created `src/config/passport.ts` with Google OAuth strategy
   - Added OAuth routes in `src/routes/authRoutes.ts`
   - Created users table in database
   - Configured `.env` with Google credentials and session secret

2. **Reorganized Project Structure**
   - Migrated to conventional Express.js folder structure:
     ```
     src/
     ├── config/           # Configuration files (database, passport)
     ├── controllers/      # Business logic
     ├── routes/          # Route definitions
     ├── middleware/      # Custom middleware
     └── server.ts        # App entry point
     ```

3. **Implemented Goals Feature**
   - Created `goals` table with schema:
     - `id` (TEXT PRIMARY KEY - UUID)
     - `user_id` (TEXT - references users.id)
     - `target_amount` (REAL)
     - `status` (TEXT - 'active' | 'completed' | 'cancelled')
     - `created_at` (DATETIME)
     - `completed_at` (DATETIME)
   - Added `user_id` column to `investments` table
   - Created `src/controllers/goalController.ts` with:
     - `getAllGoals` - Get all user's goals with optional status filter
     - `createGoal` - Create new goal (prevents multiple active goals)

4. **Migrated to UUIDs**
   - Changed all `id` columns from INTEGER to TEXT (UUID)
   - Updated all tables: users, investments, goals
   - Updated passport.ts to generate UUIDs for new users
   - Updated investmentController.ts to use UUIDs
   - Updated goalController.ts to use UUIDs

5. **Created Authentication Middleware**
   - Created `src/middleware/auth.ts` with `requireAuth` function
   - Applied to investment routes
   - Removed redundant auth checks from controllers

6. **Updated Investment Endpoints**
   - Added `user_id` to all investment operations
   - Added `WHERE user_id = ?` filters for data isolation
   - Prevents users from accessing/modifying other users' data

### 📋 Next Steps (Todo List)

1. **Create goal routes** - `src/routes/goalRoutes.ts`
   - `GET /api/goals` - getAllGoals (with optional ?status= query param)
   - `POST /api/goals` - createGoal
   - `PATCH /api/goals/:id` - updateGoalStatus
   - `GET /api/goals/progress` - getGoalProgress

2. **Complete goalController.ts**
   - Implement `updateGoalStatus` function (mark as completed/cancelled)
   - Implement `getGoalProgress` function (calculate: sum of investments / target_amount * 100)

3. **Wire up goal routes in server.ts**
   - Import and use goal routes: `app.use('/api/goals', goalRoutes)`

4. **Test the full flow**
   - Delete existing database file to recreate with UUID schema
   - Test OAuth login
   - Test creating goals
   - Test creating investments
   - Test goal progress calculation

### 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE investments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('cd', 'tBill')),
  amount REAL NOT NULL,
  rate REAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Goals table
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 🔑 Key Learnings

- **Foreign keys** ensure data integrity at database level (prevents orphaned records)
- **Middleware** reduces code duplication for common checks like authentication
- **UUIDs** provide better security than sequential integers (unpredictable, no info leakage)
- **WHERE user_id = ?** is critical for multi-tenant data isolation
- Database `DEFAULT CURRENT_TIMESTAMP` auto-handles timestamps

### 📝 Notes

- Google OAuth credentials are in `.env` file
- Frontend URL: `http://localhost:3000`
- Backend URL: `http://localhost:3001`
- OAuth callback: `http://localhost:3001/api/auth/google/callback`
