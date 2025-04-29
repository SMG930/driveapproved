# DriveApproved MVP

DriveApproved is an AI-powered auto loan pre-approval platform designed for modern car dealerships. This MVP provides a streamlined process for customers to apply for financing and for dealers to manage applications efficiently.

## Features

### Customer-Facing Portal

*   **Homepage:** Clean, modern landing page with "Get Started" and "Live Demo" buttons.
*   **Live Demo:** Simulates the application process and shows a mock AI pre-approval result.
*   **Multi-Step Application Form:**
    *   Step 1: Personal Information (Name, Address, Contact)
    *   Step 2: Employment & Income Details
    *   Step 3: Vehicle Information (Optional)
    *   Step 4: Document Upload (Pay Stubs, Bank Statements, ID)
    *   Step 5: Confirmation Page
*   **Responsive Design:** Mobile-friendly interface for all devices.
*   **Firebase Integration:** Application data saved to Firestore, documents uploaded to Firebase Storage.
*   **Progress Bar:** Visual indicator for application progress.

### Dealer Admin Dashboard

*   **Secure Login:** Firebase Authentication (Email/Password).
*   **Application Listing:** View all submitted applications with key details (Name, Status, Income, Submitted Date).
*   **Filtering:** Filter applications by status (New, In Review, Approved, Declined).
*   **Detailed View:** Access full application details, view uploaded documents (links), and see AI summary.
*   **Application Management:** Update application status and assign to team members (basic dropdown).
*   **AI Summary (Placeholder):** Mock AI-generated summary based on income and employment data.
*   **CSV Export:** Download a list of applications in CSV format.

### Optional Features Implemented

*   **Progress Bar:** Included in the multi-step application form.
*   **(Future)** Email Notification: Basic structure in place, can be easily extended with SendGrid/Mailgun.

## Tech Stack

*   **Frontend:** Next.js (React Framework)
*   **Styling:** Tailwind CSS
*   **Backend:** Firebase (Firestore, Storage, Authentication)
*   **Deployment:** Railway (Recommended) or Firebase Hosting

## Project Structure

```
/driveapproved-mvp
├── public/             # Static assets (images, etc.)
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── (public)/   # Public routes (homepage, demo, apply)
│   │   │   ├── page.tsx
│   │   │   ├── apply/page.tsx
│   │   │   └── demo/page.tsx
│   │   ├── admin/      # Admin routes (login, dashboard, application details)
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── applications/[id]/page.tsx
│   │   ├── api/        # API routes (if needed for serverless functions)
│   │   ├── layout.tsx  # Root layout
│   │   └── globals.css # Global styles
│   ├── components/     # Reusable UI components
│   │   └── application/ # Application form step components
│   └── lib/            # Utility functions, Firebase config, types
│       ├── firebase.ts
│       ├── types.ts
│       └── ai-processing.ts
├── .env.example        # Environment variable template
├── next.config.mjs     # Next.js configuration
├── package.json
├── tailwind.config.ts
└── README.md           # This file
```

## Getting Started (Local Development)

### Prerequisites

*   Node.js (v18 or later)
*   pnpm (or npm/yarn)
*   Firebase Project (with Firestore, Storage, Authentication enabled)

### Setup

1.  **Clone the repository (or extract the ZIP file):**
    ```bash
    # If using git
    # git clone <repository_url>
    # cd driveapproved-mvp
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install / yarn install
    ```

3.  **Set up Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project (or use an existing one).
    *   Enable **Firestore Database**, **Storage**, and **Authentication** (Email/Password method).
    *   In your Project settings > General tab, register a new **Web app**.
    *   Copy the `firebaseConfig` object provided.

4.  **Configure Environment Variables:**
    *   Create a `.env.local` file in the project root (copy from `.env.example`).
    *   Fill in the Firebase configuration values from the `firebaseConfig` object you copied:
        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
        ```

5.  **Set up Firebase Authentication:**
    *   In the Firebase Console, go to Authentication > Sign-in method.
    *   Enable the **Email/Password** provider.
    *   Go to Authentication > Users and add at least one user (e.g., `admin@example.com`) to test the admin login.

6.  **Set up Firebase Storage Rules:**
    *   Go to Storage > Rules.
    *   Use the following rules for development (adjust for production security):
        ```
        rules_version = '2';
        service firebase.storage {
          match /b/{bucket}/o {
            // Allow reads and writes for authenticated users for application files
            match /applications/{allPaths=**} {
              allow read, write: if request.auth != null;
            }
          }
        }
        ```

7.  **Set up Firestore Rules:**
    *   Go to Firestore Database > Rules.
    *   Use the following rules for development (adjust for production security):
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Allow reads and writes for authenticated users on applications
            match /applications/{applicationId} {
              allow read, write: if request.auth != null;
            }
            // Allow creating new applications for anyone (public form)
            match /applications/{applicationId} {
              allow create: if true;
            }
          }
        }
        ```

8.  **Run the development server:**
    ```bash
    pnpm dev
    # or npm run dev / yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Recommended: Railway

1.  **Push your code to a GitHub repository.**
2.  **Create a new project on [Railway](https://railway.app/).**
3.  **Connect your GitHub repository** and select the `driveapproved-mvp` project.
4.  **Configure Environment Variables:**
    *   Go to your Railway project > Variables.
    *   Add all the `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local` file.
5.  **Deployment Settings:**
    *   Railway should automatically detect it's a Next.js app.
    *   Ensure the Build Command is `pnpm build` (or `npm run build` / `yarn build`).
    *   Ensure the Start Command is `pnpm start` (or `npm start` / `yarn start`).
6.  **Deploy:** Railway will automatically build and deploy your application. You'll get a public URL.

### Alternative: Firebase Hosting

1.  **Install Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase:**
    ```bash
    firebase login
    ```
3.  **Initialize Firebase in your project:**
    ```bash
    firebase init hosting
    ```
    *   Select your Firebase project.
    *   Set your public directory to `.next` (or the output directory if customized).
    *   Configure as a single-page app (SPA): **Yes**.
    *   Set up automatic builds and deploys with GitHub: **No** (for manual deployment).
4.  **Build the project:**
    ```bash
    pnpm build
    # or npm run build / yarn build
    ```
5.  **Deploy to Firebase Hosting:**
    ```bash
    firebase deploy --only hosting
    ```
    You'll get a public URL for your hosted application.

## Future Enhancements (DriveSuiteAI)

*   Full AI integration for document analysis (OCR + GPT).
*   Advanced fraud detection models.
*   Integration with CRM systems (e.g., DealerCenter).
*   Role-based access control for team members.
*   Automated email/SMS notifications.
*   Reporting and analytics dashboard.
*   Multi-tenant architecture for SaaS.
