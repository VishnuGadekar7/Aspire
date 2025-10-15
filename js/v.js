// Use the official Firebase CDN for more reliable imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD56GEXY9Kjy6-Cwkk8mUcWhXFCd8gSqmM",
  authDomain: "aspirehub-16de7.firebaseapp.com",
  projectId: "aspirehub-16de7",
  storageBucket: "aspirehub-16de7.appspot.com", // Fixed the storage bucket URL
  messagingSenderId: "981417689605",
  appId: "1:981417689605:web:b1e8e6955d151fecad526c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Log Firebase initialization
console.log("Firebase app initialized:", app);
console.log("Firebase auth initialized:", auth);

// DOM Elements
const container = document.querySelector('.container');
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const loginForm = document.querySelector('.login form');
const registerForm = document.querySelector('.register form');
const forgotPasswordLink = document.querySelector('.forgot-link a');

// Toggle between login and registration forms
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('.login #email').value;
    const password = document.querySelector('.login #password').value;
    
    console.log("Login attempt with:", email, password);
    
    // Sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            console.log("User logged in:", user);
            alert("Login successful!");
            
            // Redirect to dashboard or home page
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Login error:", errorCode, errorMessage);
            
            // Display appropriate error messages
            if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/invalid-email' || errorCode === 'auth/wrong-password') {
                alert("Invalid email or password. Please try again.");
            } else {
                alert("Login failed: " + errorMessage);
            }
        });
});

// Handle registration form submission
// Handle registration form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.querySelector('.register input[placeholder="Username"]').value;
    const email = document.querySelector('.register input[type="email"]').value;
    const password = document.querySelector('.register input[type="password"]').value;
    
    console.log("Registration attempt with:", username, email, password);
    
    // Create user with email and password - using the modular v9 syntax
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Update Firebase Auth profile - using the appropriate v9 method
            // Note: updateProfile needs to be imported from firebase/auth
            // You'll need to add this import at the top:
            // import { updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
            
            // For now, we'll just log this action
            console.log("Would update profile for:", user.uid, "with username:", username);
            
            // You'll also need to import the Firestore functionality if you want to save user data
            // This function doesn't exist in the current code, so you'll need to implement it
            // setupUserData(user.uid, email, username);
            
            alert("Registration successful! You can now login.");
            container.classList.remove('active'); // Switch back to login form
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Registration error:", errorCode, errorMessage);
            
            // Display appropriate error messages
            if (errorCode === 'auth/email-already-in-use') {
                alert("Email is already in use. Please use a different email or login.");
            } else if (errorCode === 'auth/weak-password') {
                alert("Password is too weak. Please use a stronger password.");
            } else if (errorCode === 'auth/invalid-email') {
                alert("Invalid email format. Please enter a valid email.");
            } else {
                alert("Registration failed: " + errorMessage);
            }
        });
});

// Handle Forgot Password
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('.login #email').value;
    
    if (!email) {
        alert("Please enter your email address first.");
        return;
    }
    
    console.log("Password reset requested for:", email);
    
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Please check your inbox.");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Password reset error:", errorCode, errorMessage);
            
            if (errorCode === 'auth/invalid-email') {
                alert("Invalid email address. Please enter a valid email.");
            } else if (errorCode === 'auth/user-not-found') {
                alert("No account found with this email address.");
            } else {
                alert("Failed to send password reset email: " + errorMessage);
            }
        });
});

// Logout functionality (add this to any logout button)
function logout() {
    signOut(auth).then(() => {
        // Sign-out successful
        console.log("User signed out");
        // Redirect to login page if needed
        window.location.href = "index.html";
    }).catch((error) => {
        // An error happened
        console.error("Logout error:", error);
    });
}

// You can expose this function globally if needed
window.logout = logout;

// Add event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, Firebase initialized");
    
    // Test if Firebase auth is working
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("User is signed in:", user.email);
        } else {
            console.log("No user is signed in");
        }
    });
});