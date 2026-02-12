# ExpenseApp - Full Stack MERN Application Documentation

## Project Overview

**ExpenseApp** is a full-stack expense management and splitting application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It allows users to:
- Create and manage expense groups
- Track shared expenses among group members
- Split expenses equally or with custom amounts
- Manage user roles and permissions (RBAC - Role Based Access Control)
- Handle payments via Razorpay integration
- Authenticate via traditional login or Google OAuth SSO

---

## Tech Stack

### Frontend (expense-react-client)
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with components & hooks |
| **Vite** | Build tool & dev server |
| **React Router DOM 7** | Client-side routing |
| **Redux Toolkit** | Global state management |
| **React-Redux** | React bindings for Redux |
| **Axios** | HTTP client for API calls |
| **Bootstrap 5** | CSS framework for styling |
| **React-Bootstrap** | Bootstrap components for React |
| **@react-oauth/google** | Google OAuth integration |

### Backend (expense-server)
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Razorpay** | Payment gateway |

---

## Frontend Architecture

### Directory Structure
```
expense-react-client/
├── src/
│   ├── App.jsx              # Main app with routing configuration
│   ├── main.jsx             # Entry point - renders App with providers
│   ├── store.js             # Redux store configuration
│   ├── components/          # Reusable UI components
│   │   ├── AppLayout.jsx    # Layout for unauthenticated users
│   │   ├── UserLayout.jsx   # Layout for authenticated users
│   │   ├── Header.jsx       # Public header (login/register links)
│   │   ├── UserHeader.jsx   # Authenticated header (dashboard nav)
│   │   ├── Footer.jsx       # Public footer
│   │   ├── UserFooter.jsx   # User footer
│   │   ├── GroupCard.jsx    # Group display component
│   │   ├── CreateGroupModal.jsx # Modal for creating groups
│   │   ├── Can.jsx          # Permission-based rendering component
│   │   └── errors/
│   │       └── UnauthorizedAccess.jsx # 403 error page
│   ├── pages/               # Page components (routes)
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login form + Google OAuth
│   │   ├── Register.jsx     # Registration form
│   │   ├── DashBoard.jsx    # User dashboard
│   │   ├── Groups.jsx       # Groups list with pagination
│   │   ├── GroupExpenses.jsx # Expense management within a group
│   │   ├── ManageUsers.jsx  # Admin: user management
│   │   ├── ManagePayments.jsx # Admin: payment management
│   │   ├── ManageSubscriptions.jsx # Subscription management
│   │   ├── changePassword.jsx # Password change form
│   │   ├── ResetPassword.jsx # Password reset form
│   │   └── Logout.jsx       # Logout handler
│   ├── redux/               # Redux state management
│   │   └── user/
│   │       ├── action.js    # Action constants (SET_USER, CLEAR_USER)
│   │       └── reducers.js  # User reducer
│   ├── rbac/                # Role-Based Access Control
│   │   ├── ProtectedRoute.jsx # Route guard component
│   │   └── userPermissions.js # Permission definitions
│   └── config/
│       └── appConfig.js     # Environment configuration
├── public/                  # Static assets
├── package.json             # Dependencies & scripts
└── vite.config.js           # Vite configuration
```

---

## Frontend Application Flow

### 1. Application Bootstrap (main.jsx)

```
main.jsx
    │
    ├── <StrictMode>              # React strict mode for dev warnings
    │   └── <Provider store>      # Redux store provider (global state)
    │       └── <BrowserRouter>   # Enables client-side routing
    │           └── <App />       # Main application component
```

The app is wrapped with:
- **Redux Provider**: Makes store available throughout the component tree
- **BrowserRouter**: Enables React Router for navigation

---

### 2. Application Initialization (App.jsx)

```
App Component Lifecycle:
    │
    ├── 1. useSelector(state.userDetails)   # Check if user exists in Redux
    ├── 2. useState(loading = true)          # Show loading state
    ├── 3. useEffect → isUserLoggedIn()      # On mount, check session
    │       │
    │       └── POST /auth/is-user-logged-in  # Verify JWT cookie
    │           │
    │           ├── Success → dispatch(SET_USER)  # Store user in Redux
    │           └── Failure → User stays null     # Not logged in
    │
    └── 4. setLoading(false) → Render Routes
```

---

### 3. Routing Structure

```
Routes Configuration:
    │
    ├── "/" (Root)
    │   ├── userDetails EXISTS → <UserLayout><Dashboard /></UserLayout>
    │   └── userDetails NULL   → <AppLayout><Home /></AppLayout>
    │
    ├── "/login"
    │   ├── userDetails EXISTS → <Navigate to="/" />
    │   └── userDetails NULL   → <AppLayout><Login /></AppLayout>
    │
    ├── "/register"
    │   └── <AppLayout><Register /></AppLayout>
    │
    ├── "/groups"
    │   ├── userDetails EXISTS → <UserLayout><Groups /></UserLayout>
    │   └── userDetails NULL   → <Navigate to="/login" />
    │
    ├── "/groups/:groupId"
    │   ├── userDetails EXISTS → <UserLayout><GroupExpenses /></UserLayout>
    │   └── userDetails NULL   → <Navigate to="/login" />
    │
    ├── "/manage-users" (Admin Only)
    │   └── <ProtectedRoute roles={['admin']}>
    │           <UserLayout><ManageUsers /></UserLayout>
    │       </ProtectedRoute>
    │
    ├── "/manage-payments" (Admin Only)
    │   └── <ProtectedRoute roles={['admin']}>
    │           <UserLayout><ManagePayments /></UserLayout>
    │       </ProtectedRoute>
    │
    ├── "/manage-subscriptions"
    │   └── <UserLayout><ManageSubscriptions /></UserLayout>
    │
    ├── "/reset-password"
    │   └── <AppLayout><ResetPassword /></AppLayout>
    │
    ├── "/change-password"
    │   └── <AppLayout><ChangePassword /></AppLayout>
    │
    ├── "/logout"
    │   └── userDetails EXISTS → <Logout />
    │
    └── "/unauthorized-access"
        └── <UnauthorizedAccess />
```

---

### 4. Layout System

```
Two Different Layouts Based on Authentication:

┌─────────────────────────────┐    ┌─────────────────────────────┐
│      AppLayout              │    │      UserLayout             │
│  (Unauthenticated Users)    │    │  (Authenticated Users)      │
├─────────────────────────────┤    ├─────────────────────────────┤
│  ┌───────────────────────┐  │    │  ┌───────────────────────┐  │
│  │       Header          │  │    │  │     UserHeader        │  │
│  │  (Home/Login/Register)│  │    │  │  (Groups/Profile/     │  │
│  └───────────────────────┘  │    │  │   Admin Links/Logout) │  │
│                             │    │  └───────────────────────┘  │
│  ┌───────────────────────┐  │    │                             │
│  │       {children}      │  │    │  ┌───────────────────────┐  │
│  │   (Page Component)    │  │    │  │       {children}      │  │
│  └───────────────────────┘  │    │  │   (Page Component)    │  │
│                             │    │  └───────────────────────┘  │
│  ┌───────────────────────┐  │    │                             │
│  │       Footer          │  │    │  ┌───────────────────────┐  │
│  └───────────────────────┘  │    │  │     UserFooter        │  │
│                             │    │  └───────────────────────┘  │
└─────────────────────────────┘    └─────────────────────────────┘
```

---

### 5. Redux State Management

```
Redux Store Structure:
    │
    └── store.js
        │
        └── configureStore({
                reducer: {
                    userDetails: userReducer
                }
            })

Redux Flow:
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  Component ──dispatch(action)──→ Reducer ──→ New State     │
    │       │                            │              │         │
    │       │                            │              │         │
    │       └────────useSelector()───────┴──────────────┘         │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘

Actions (redux/user/action.js):
    • SET_USER   → Set user data after login
    • CLEAR_USER → Clear user data on logout

Reducer (redux/user/reducers.js):
    • Handles SET_USER → returns payload (user object)
    • Handles CLEAR_USER → returns null
    • Default → returns existing state
```

---

### 6. Authentication Flow

```
LOGIN FLOW:
    │
    ├── Traditional Login
    │   │
    │   ├── 1. User enters email/password
    │   ├── 2. Form validation (client-side)
    │   ├── 3. POST /auth/login (with credentials)
    │   ├── 4. Server validates → returns user + sets JWT cookie
    │   ├── 5. dispatch({ type: SET_USER, payload: user })
    │   └── 6. React re-renders → UserLayout/Dashboard
    │
    └── Google OAuth Login
        │
        ├── 1. User clicks Google Sign-In button
        ├── 2. Google returns idToken
        ├── 3. POST /auth/google-auth { idToken }
        ├── 4. Server validates token → returns user + sets JWT cookie
        ├── 5. dispatch({ type: SET_USER, payload: user })
        └── 6. React re-renders → UserLayout/Dashboard

LOGOUT FLOW:
    │
    ├── 1. User navigates to /logout
    ├── 2. POST /auth/logout
    ├── 3. Clear JWT cookie on client
    ├── 4. dispatch({ type: CLEAR_USER })
    └── 5. React re-renders → AppLayout/Home

SESSION RETENTION (on page refresh):
    │
    ├── 1. App.jsx useEffect runs
    ├── 2. POST /auth/is-user-logged-in (sends JWT cookie)
    ├── 3. Server validates JWT
    │   ├── Valid → Returns user data
    │   └── Invalid → Returns error
    ├── 4. dispatch({ type: SET_USER }) if valid
    └── 5. setLoading(false) → Render appropriate layout
```

---

### 7. Role-Based Access Control (RBAC)

```
User Roles: admin | manager | viewer

Permission Matrix (userPermissions.js):
┌─────────────────────┬───────┬─────────┬────────┐
│ Permission          │ admin │ manager │ viewer │
├─────────────────────┼───────┼─────────┼────────┤
│ canCreateUsers      │   ✓   │    ✗    │   ✗    │
│ canUpdateUsers      │   ✓   │    ✗    │   ✗    │
│ canDeleteUsers      │   ✓   │    ✗    │   ✗    │
│ canViewUsers        │   ✓   │    ✓    │   ✓    │
│ canCreateGroups     │   ✓   │    ✓    │   ✗    │
│ canUpdateGroups     │   ✓   │    ✓    │   ✗    │
│ canDeleteGroups     │   ✓   │    ✗    │   ✗    │
│ canViewGroups       │   ✓   │    ✓    │   ✓    │
│ canCreateExpenses   │   ✓   │    ✓    │   ✗    │
│ canViewExpenses     │   ✓   │    ✓    │   ✓    │
│ canUpdateExpenses   │   ✓   │    ✓    │   ✗    │
│ canDeleteExpenses   │   ✓   │    ✓    │   ✗    │
│ canSettleExpenses   │   ✓   │    ✓    │   ✗    │
└─────────────────────┴───────┴─────────┴────────┘

RBAC Components:

1. ProtectedRoute - Route-level protection
   Usage: <ProtectedRoute roles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
   
   If user.role not in roles → Redirect to /unauthorized-access

2. Can Component - Permission-based rendering
   Usage: <Can requiredPermission="canCreateExpenses">
            <button>Add Expense</button>
          </Can>
   
   If permission not granted → Component doesn't render

3. usePermissions Hook - Permission access in components
   Usage: const permissions = usePermissions();
          if (permissions.canCreateGroups) { ... }
```

---

### 8. API Communication Pattern

```
Every API Call Uses:
    │
    ├── axios (HTTP client)
    ├── serverEndpoint (from config - VITE_SERVER_ENDPOINT)
    └── withCredentials: true (sends cookies with requests)

Typical API Call Flow:
    │
    ├── 1. Component triggers action (button click, form submit, useEffect)
    ├── 2. axios.get/post/put/delete(endpoint, data, { withCredentials: true })
    ├── 3. Request sent with JWT cookie
    ├── 4. Server validates JWT via authMiddleware
    ├── 5. Server processes request → sends response
    ├── 6. Component updates state with response data
    └── 7. React re-renders affected components

Example (Groups page):
    useEffect(() => {
        axios.get(`${serverEndpoint}/group/my-group?page=${page}&limit=${limit}`)
              .then(resp => setGroups(resp.data.groups))
    }, [page, limit]);
```

---

### 9. Key Component Details

#### Groups Page Features:
- Paginated group listing
- Create new group modal
- Sort by newest/oldest
- Page size selection (5, 10, 20, 50, 100)
- RBAC: Only users with `canCreateGroups` see the create button

#### GroupExpenses Page Features:
- View all expenses in a group
- Add new expense with:
  - Equal split among all members
  - Custom split amounts
  - Exclude members from split
- View member balances
- RBAC-controlled actions

---

## Backend API Endpoints

```
Server running on PORT 5001

Authentication Routes (/auth):
    POST /auth/register          - Register new user
    POST /auth/login             - Login with email/password
    POST /auth/google-auth       - Google OAuth login
    POST /auth/logout            - Logout (clear JWT)
    POST /auth/is-user-logged-in - Verify session

Group Routes (/group):
    GET  /group/my-group         - Get user's groups (paginated)
    POST /group/create           - Create new group
    PUT  /group/:id              - Update group
    DELETE /group/:id            - Delete group

Expense Routes (/expense):
    GET  /expense/group/:groupId - Get expenses for a group
    GET  /expense/summary/:groupId - Get balance summary
    POST /expense/create         - Add new expense
    PUT  /expense/:id            - Update expense
    DELETE /expense/:id          - Delete expense

User/RBAC Routes (/users):
    GET  /users                  - Get all users (admin)
    PUT  /users/:id/role         - Update user role
    DELETE /users/:id            - Delete user

Payment Routes (/payment):
    POST /payment/create-order   - Create Razorpay order
    POST /payment/webhook        - Handle Razorpay webhooks

Profile Routes (/profile):
    GET  /profile                - Get user profile
    PUT  /profile                - Update profile
```

---

## Environment Configuration

### Frontend (.env)
```
VITE_SERVER_ENDPOINT=http://localhost:5001
```

### Backend (.env)
```
MONGODB_CONNECTION_KEY=mongodb+srv://...
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
```

---

## Development Commands

### Frontend
```bash
cd expense-react-client
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd expense-server
npm install          # Install dependencies
npm start            # Start server (node server.js)
npm run dev          # Start with nodemon (if configured)
```

---

## Key React Concepts Used

### 1. JSX
- Combination of HTML, CSS, and JavaScript
- React extension that compiles to JavaScript
- Every component returns a single parent element

### 2. Hooks
- **useState**: Manage component state
- **useEffect**: Side effects (API calls, subscriptions)
- **useSelector**: Read Redux state
- **useDispatch**: Dispatch Redux actions
- **useParams**: Get URL parameters
- **useNavigate**: Programmatic navigation
- **useLocation**: Access current route info

### 3. Component Patterns
- **Layouts**: Wrapper components (AppLayout, UserLayout)
- **Protected Routes**: Route guards based on auth/roles
- **Conditional Rendering**: Different UI based on state
- **Props & Children**: Component composition

---

## Payment Integration (Razorpay)

For testing webhooks locally:
```bash
# Use ngrok to expose local server
ngrok http 5001

# Use the generated URL as webhook endpoint in Razorpay dashboard config the webhook with the webhook url(ngrok generated)
# Example: https://abc123.ngrok.io/payment/webhook
```

---

## Quick Reference Notes

- **src folder**: Main development area
- **pages folder**: Each file is a route component
- **Bootstrap**: Used for styling (via react-bootstrap)
- **React-Router-Dom**: Handles client-side routing - wrap App in BrowserRouter
- **Axios**: HTTP client for server communication (like Postman)
- **Redux store.js**: Central state management with reducers
- **Cookies**: JWT tokens stored in HTTP-only cookies for security
- **withCredentials**: Always set to true for API calls to send cookies