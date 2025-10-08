// --- Firebase config from environment variables ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// ------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Debug: Check if Firebase config is loaded
console.log('Firebase Config loaded:', {
  apiKey: !!firebaseConfig.apiKey,
  authDomain: !!firebaseConfig.authDomain,
  projectId: !!firebaseConfig.projectId,
  appId: !!firebaseConfig.appId
});

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence); // keep session across reloads

console.log('Firebase initialized successfully!');
console.log('Analytics initialized:', !!analytics);

const $ = (id) => document.getElementById(id);
const statusEl = $("status");
const authForm = $("auth-form");
const userActions = $("user-actions");
const messageEl = $("message");

// Helper functions
const showMessage = (message, type = 'error') => {
  messageEl.innerHTML = `<div class="${type}-message">${message}</div>`;
  setTimeout(() => {
    messageEl.innerHTML = '';
  }, 5000);
};

const showLoading = (button) => {
  const loading = button.querySelector('.loading');
  loading.style.display = 'inline-block';
  button.disabled = true;
};

const hideLoading = (button) => {
  const loading = button.querySelector('.loading');
  loading.style.display = 'none';
  button.disabled = false;
};

const updateUI = (user) => {
  if (user) {
    statusEl.textContent = `Welcome back, ${user.email}`;
    statusEl.className = 'status signed-in';
    authForm.classList.add('hidden');
    userActions.classList.remove('hidden');
  } else {
    statusEl.textContent = 'Please sign in to continue';
    statusEl.className = 'status signed-out';
    authForm.classList.remove('hidden');
    userActions.classList.add('hidden');
  }
};

onAuthStateChanged(auth, (user) => {
  updateUI(user);
});

$("signup").onclick = async () => {
  const email = $("email").value.trim();
  const pass = $("password").value;
  
  if (!email || !pass) {
    showMessage('Please fill in all fields');
    return;
  }
  
  if (pass.length < 6) {
    showMessage('Password must be at least 6 characters long');
    return;
  }
  
  showLoading($("signup"));
  
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    showMessage('Account created successfully! Welcome to Medina!', 'success');
    $("email").value = '';
    $("password").value = '';
  } catch (e) {
    let errorMessage = 'An error occurred';
    switch (e.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Try signing in instead.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please choose a stronger password';
        break;
      default:
        errorMessage = e.message || 'Failed to create account';
    }
    showMessage(errorMessage);
  } finally {
    hideLoading($("signup"));
  }
};

$("signin").onclick = async () => {
  const email = $("email").value.trim();
  const pass = $("password").value;
  
  if (!email || !pass) {
    showMessage('Please fill in all fields');
    return;
  }
  
  showLoading($("signin"));
  
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    showMessage('Welcome back!', 'success');
    $("email").value = '';
    $("password").value = '';
  } catch (e) {
    let errorMessage = 'An error occurred';
    switch (e.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email. Please create an account first.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = e.message || 'Failed to sign in';
    }
    showMessage(errorMessage);
  } finally {
    hideLoading($("signin"));
  }
};

$("reset").onclick = async () => {
  const email = $("email").value.trim();
  
  if (!email) {
    showMessage('Please enter your email address');
    return;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('Password reset email sent! Check your inbox.', 'success');
  } catch (e) {
    let errorMessage = 'An error occurred';
    switch (e.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        break;
      default:
        errorMessage = e.message || 'Failed to send reset email';
    }
    showMessage(errorMessage);
  }
};

$("logout").onclick = async () => {
  try {
    await signOut(auth);
    showMessage('You have been signed out successfully', 'success');
  } catch (e) {
    showMessage('Failed to sign out. Please try again.');
  }
};
