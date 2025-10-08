# Medina - Firebase Authentication & Profile Management

A modern web application with Firebase Authentication and Firestore database integration.

## Features

✅ **User Authentication**
- Sign up with email and password
- Sign in for existing users
- Password reset via email
- Secure session persistence

✅ **User Profile Management**
- Collect user information (Name, Email, Phone)
- Store data in Firebase Firestore
- Edit profile information
- View saved profile

## Setup Instructions

### 1. Enable Firestore Database

**IMPORTANT:** You need to enable Firestore in your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **medina-c114c**
3. Click on **Firestore Database** in the left menu
4. Click **Create Database**
5. Choose **Start in test mode** (for development)
6. Select a location (choose one closest to you)
7. Click **Enable**

### 2. Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## How It Works

### Authentication Flow

1. **Login Page** (`index.html`)
   - Users can sign up or sign in
   - After successful authentication, redirects to profile page

2. **Profile Page** (`profile.html`)
   - New users: Fill in name, email, and phone
   - Existing users: View and edit their profile
   - Data is saved to Firestore database

### File Structure

```
Madina-Project/
├── index.html          # Authentication page
├── profile.html        # User profile page
├── main.js            # Authentication logic
├── profile.js         # Profile management & Firestore
├── styles.css         # Authentication page styles
├── profile.css        # Profile page styles
├── .env              # Firebase credentials (secure)
├── vite.config.js    # Vite configuration
└── package.json      # Dependencies
```

## Firebase Collections

### Users Collection (`users`)

Each user document is stored with their UID as the document ID:

```javascript
{
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  userId: "user-uid-here",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Security Notes

- ✅ Firebase credentials are in `.env` file
- ✅ `.env` is in `.gitignore` (not committed to Git)
- ⚠️ Remember to update Firestore rules for production
- ⚠️ Test mode allows all reads/writes - secure this for production!

## Production Firestore Rules

When ready for production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures users can only read/write their own data.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: Vite
- **Backend**: Firebase Authentication
- **Database**: Firebase Firestore
- **Hosting**: Can deploy to Firebase Hosting, Vercel, Netlify, etc.

## Next Steps

1. ✅ Enable Firestore in Firebase Console
2. ✅ Run `npm run dev`
3. ✅ Test sign up and profile creation
4. 🔄 Add more features (dashboard, CRUD operations, etc.)
5. 🔒 Update Firestore security rules for production

---

**Created with ❤️ for CS470**

