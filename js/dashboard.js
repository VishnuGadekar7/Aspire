  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD56GEXY9Kjy6-Cwkk8mUcWhXFCd8gSqmM",
    authDomain: "aspirehub-16de7.firebaseapp.com",
    projectId: "aspirehub-16de7",
    storageBucket: "aspirehub-16de7.appspot.com",
    messagingSenderId: "981417689605",
    appId: "1:981417689605:web:b1e8e6955d151fecad526c",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Check authentication state
  auth.onAuthStateChanged(function (user) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const dashboardContent = document.getElementById("dashboardContent");

    loadingIndicator.style.display = "block";
    dashboardContent.style.display = "none";

    if (user) {
      // User is signed in
      loadUserDashboard(user);
    } else {
      // User is signed out, redirect to login page
      window.location.href = "/login.html";
    }
  });

  // Load user dashboard data
  function loadUserDashboard(user) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const lastLoginDate = document.getElementById("lastLoginDate");
    const welcomeSection = document.querySelector(".welcome-section");

    // Format date for last login
    const now = new Date();
    lastLoginDate.textContent =
      now.toLocaleDateString() + " " + now.toLocaleTimeString();

    // Fetch user data
    const userRef = db.collection("users").doc(user.uid);
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();

          // Display welcome message with username instead of email
          welcomeMessage.textContent = `Welcome back, ${
            userData.username || user.displayName || user.email
          }!`;

          // Update last login time
          userRef.update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          // Create user document if it doesn't exist
          setupUserData(
            user.uid,
            user.email,
            user.displayName || extractUsernameFromEmail(user.email)
          );

          // Display welcome message with default
          welcomeMessage.textContent = `Welcome, ${
            user.displayName || extractUsernameFromEmail(user.email)
          }!`;
        }

        // Hide loading indicator and show content
        document.getElementById("loadingIndicator").style.display = "none";
        document.getElementById("dashboardContent").style.display = "block";

        // Set timer to hide welcome section after 5 seconds
        setTimeout(() => {
          // Get current height and set explicit height
          const initialHeight = welcomeSection.offsetHeight;
          welcomeSection.style.height = `${initialHeight}px`;
          // Trigger transition
          setTimeout(() => {
            welcomeSection.style.opacity = "0";
            welcomeSection.style.height = "0";
            welcomeSection.style.marginBottom = "0";
            welcomeSection.style.padding = "0";
          }, 50);
          // After fade out animation, hide completely
          setTimeout(() => {
            welcomeSection.style.display = "none";
          }, 550); // 500ms transition + 50ms buffer
        }, 5000);
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  }

  // Create initial user data
  function setupUserData(userId, userEmail, username) {
    const userRef = db.collection("users").doc(userId);

    userRef.set({
      email: userEmail,
      username: username,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      notes: [],
      mocks: {
        attempted: [],
        scores: {},
      },
      watchedTopics: [],
    });
  }

  // Extract username from email if needed
  function extractUsernameFromEmail(email) {
    if (!email) return "User";
    return email.split("@")[0];
  }

  // Logout function
  document
    .getElementById("logoutButton")
    .addEventListener("click", function (e) {
      e.preventDefault();
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.href = "/login.html";
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    });



    document.addEventListener("DOMContentLoaded", () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const mockCards = entry.target.querySelectorAll(".mock-card");
            if (entry.isIntersecting) {
              mockCards.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add("animate");
                }, index * 200);
              });
            } else {
              mockCards.forEach((card) => {
                card.classList.remove("animate");
              });
            }
          });
        },
        {
          threshold: 0.25,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      // Observe the mocks section container
      const mocksContainer = document.querySelector("#mocks .container");
      if (mocksContainer) {
        observer.observe(mocksContainer);
      }
    });
    document.addEventListener("DOMContentLoaded", () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const mockCards = entry.target.querySelectorAll(".mock-card");
            if (entry.isIntersecting) {
              mockCards.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add("animate");
                }, index * 200);
              });
            } else {
              mockCards.forEach((card) => {
                card.classList.remove("animate");
              });
            }
          });
        },
        { threshold: 0.25 }
      );

      const mocksContainer = document.querySelector("#mocks .container");
      if (mocksContainer) observer.observe(mocksContainer);
    });