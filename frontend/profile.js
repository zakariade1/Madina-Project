// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

let currentUser = null;

// Helper functions
const showMessage = (message, type = 'error') => {
  const messageEl = $('message');
  messageEl.innerHTML = `<div class="${type}-message">${message}</div>`;
  setTimeout(() => {
    messageEl.innerHTML = '';
  }, 5000);
};

const showLoading = (button) => {
  const loading = button.querySelector('.loading');
  if (loading) {
    loading.style.display = 'inline-block';
  }
  button.disabled = true;
};

const hideLoading = (button) => {
  const loading = button.querySelector('.loading');
  if (loading) {
    loading.style.display = 'none';
  }
  button.disabled = false;
};

// Check authentication
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    $('email').value = user.email;
    
    // Check if user profile exists
    await loadUserProfile();
  } else {
    // Redirect to login if not authenticated
    window.location.href = './index.html';
  }
});

// Load user profile from Firestore
async function loadUserProfile() {
  try {
    // Debug: Log the user ID being used
    console.log('Loading profile for user ID:', currentUser.uid);
    console.log('Current user email:', currentUser.email);
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Debug: Log the loaded data
      console.log('Loaded user data:', userData);
      console.log('Data belongs to user ID:', userData.userId);
      
      // Verify the data belongs to the current user
      if (userData.userId !== currentUser.uid) {
        console.error('⚠️ SECURITY WARNING: Loaded data belongs to different user!');
        showMessage('Security error: Data mismatch detected', 'error');
        return;
      }
      
      // Show profile status and hide form
      $('full-name').value = userData.fullName || '';
      $('phone').value = userData.phone || '';
      
      displayProfile(userData);
    } else {
      console.log('No profile found for this user - showing form');
      // Show form for new user
      $('profile-form').parentElement.querySelector('#profile-status')?.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    showMessage('Failed to load profile data: ' + error.message);
  }
}

// Display profile information
function displayProfile(userData) {
  $('display-name').textContent = userData.fullName;
  $('display-email').textContent = userData.email;
  $('display-phone').textContent = userData.phone;
  
  $('profile-form').style.display = 'none';
  $('profile-status').classList.remove('hidden');
}

// Profile form submit
$('profile-form').onsubmit = async (e) => {
  e.preventDefault();
  
  const fullName = $('full-name').value.trim();
  const phone = $('phone').value.trim();
  const email = $('email').value.trim();
  
  if (!fullName || !phone) {
    showMessage('Please fill in all fields');
    return;
  }
  
  // Basic phone validation
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    showMessage('Please enter a valid phone number');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  showLoading(submitBtn);
  
  try {
    // Save to Firestore
    await setDoc(doc(db, 'users', currentUser.uid), {
      fullName,
      email,
      phone,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    showMessage('Profile saved successfully!', 'success');
    
    // Display the saved profile
    setTimeout(() => {
      displayProfile({ fullName, email, phone });
    }, 1000);
    
  } catch (error) {
    console.error('Error saving profile:', error);
    showMessage('Failed to save profile. Please try again.');
  } finally {
    hideLoading(submitBtn);
  }
};

// Edit profile button
$('edit-profile-btn')?.addEventListener('click', () => {
  $('profile-form').style.display = 'flex';
  $('profile-status').classList.add('hidden');
});

// Logout
$('logout-btn').onclick = async () => {
  try {
    await signOut(auth);
    window.location.href = './index.html';
  } catch (error) {
    console.error('Logout error:', error);
    showMessage('Failed to logout. Please try again.');
  }
};

