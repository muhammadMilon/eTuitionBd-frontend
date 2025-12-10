# eTuitionBd - Tuition Management System

## Project Overview

eTuitionBd is a comprehensive tuition management platform that connects students with qualified tutors. The platform enables students to post tuition requirements, allows tutors to browse and apply for tuitions, and provides admins with tools to manage and monitor all platform activities.

## Purpose

To solve the real problem of finding qualified tutors and verified tuition opportunities by:
- Reducing friction between students and tutors through automated workflows
- Enabling digital class tracking, transparent payment, and structured communication
- Assisting admins in monitoring and regulating all platform activities

## Features

### For Students
- Post tuition requirements with detailed specifications (class, budget, location, subject, schedule)
- Browse and connect with verified tutors
- Manage tuition applications
- Track payment history
- Profile management

### For Tutors
- Browse available tuition posts
- Apply to suitable tuitions
- Manage student relationships
- Track earnings and payment history
- Profile and portfolio management

### For Admins
- Review and approve/reject tuition posts
- Verify tutors
- Manage users
- Monitor platform activities
- Handle disputes
- Oversee platform performance

## Live URL

[Add your live deployment URL here]

## Tech Stack & Packages

### Frontend
- **React** (^18.2.0) - UI library
- **React Router DOM** (^6.20.0) - Routing
- **Vite** (^5.0.8) - Build tool
- **Tailwind CSS** (^3.3.6) - Styling
- **DaisyUI** (^4.4.19) - Component library
- **Lucide React** (^0.294.0) - Icons
- **React Hot Toast** (^2.4.1) - Notifications

### Backend & Services
- **Firebase** (^10.7.1) - Authentication and backend services

### Development Tools
- **ESLint** (^9.39.1) - Code linting
- **PostCSS** (^8.4.32) - CSS processing
- **Autoprefixer** (^10.4.16) - CSS vendor prefixing

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── MainLayout.jsx
│   ├── DashboardLayout.jsx
│   ├── PrivateRoute.jsx
│   └── ErrorBoundary.jsx
├── pages/            # Page components
│   ├── Home.jsx
│   ├── Tuitions.jsx
│   ├── TuitionDetails.jsx
│   ├── Tutors.jsx
│   ├── TutorProfile.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Dashboard.jsx
│   ├── PaymentHistory.jsx
│   ├── ProfileSettings.jsx
│   ├── NotFound.jsx
│   └── dashboards/
│       ├── AdminDashboard.jsx
│       ├── TutorDashboard.jsx
│       └── StudentDashboard.jsx
├── context/          # React context providers
│   └── AuthContext.jsx
├── firebase/         # Firebase configuration
│   └── firebase.config.js
└── hooks/            # Custom React hooks
    └── useDocumentTitle.js
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

All Firebase configuration keys are stored in environment variables for security. Create a `.env` file in the root directory with the required variables (see `.env.example` for reference).

## Key Features Implementation

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Authentication (Email/Password & Google Sign-In)
- ✅ Role-based access control (Student, Tutor, Admin)
- ✅ Private routes with authentication
- ✅ Error boundary for error handling
- ✅ Dynamic page titles
- ✅ 404 error page
- ✅ Toast notifications
- ✅ Protected routes

## License

This project is private and proprietary.
