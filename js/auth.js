// Authentication functions for all pages

// Check if user is logged in
function checkAuthState() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("User logged in:", user.email);
      updateUILoggedIn(user);
    } else {
      console.log("User logged out");
      updateUILoggedOut();
    }
  });
}

// Update UI for logged-in users
function updateUILoggedIn(user) {
  // Hide login/signup buttons
  document.querySelectorAll('.auth-required').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show user-specific elements
  document.querySelectorAll('.auth-hidden').forEach(el => {
    el.style.display = 'inline-block';
  });
  
  // Show user email
  const userEmailEl = document.getElementById('userEmail');
  if (userEmailEl) userEmailEl.textContent = user.email;
  
  // Get user role and update dashboard link
  const dashboardLink = document.querySelector('a[href*="dashboard"]');
  if (dashboardLink) {
    db.collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const role = doc.data().role;
        dashboardLink.href = `/LuggageStorage/dashboard/${role}.html`;
      }
    });
  }
}

// Update UI for logged-out users
function updateUILoggedOut() {
  // Show login/signup buttons
  document.querySelectorAll('.auth-required').forEach(el => {
    el.style.display = 'inline-block';
  });
  
  // Hide user-specific elements
  document.querySelectorAll('.auth-hidden').forEach(el => {
    el.style.display = 'none';
  });
}

// Sign up new user
function signUp(email, password, name, role, phone) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Create user profile in Firestore
      return db.collection('users').doc(user.uid).set({
        name: name,
        email: email,
        phone: phone,
        role: role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid
      });
    })
    .then(() => {
      showNotification('Account created successfully!', 'success');
      window.location.href = '/LuggageStorage/dashboard/';
    })
    .catch((error) => {
      showNotification(error.message, 'error');
    });
}

// Log in user
function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showNotification('Logged in successfully!', 'success');
      
      // Redirect based on role
      db.collection('users').doc(userCredential.user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const role = doc.data().role;
            window.location.href = `/LuggageStorage/dashboard/${role}.html`;
          }
        });
    })
    .catch((error) => {
      showNotification(error.message, 'error');
    });
}

// Log out user
function logout() {
  firebase.auth().signOut()
    .then(() => {
      showNotification('Logged out successfully', 'success');
      window.location.href = '/LuggageStorage/';
    })
    .catch((error) => {
      showNotification(error.message, 'error');
    });
}

// Google Sign-in
function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      
      // Check if user exists in Firestore
      db.collection('users').doc(user.uid).get()
        .then(doc => {
          if (!doc.exists) {
            // New user - create profile
            db.collection('users').doc(user.uid).set({
              name: user.displayName,
              email: user.email,
              role: 'customer',
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              uid: user.uid
            });
          }
        });
      
      showNotification('Logged in with Google!', 'success');
      window.location.href = '/LuggageStorage/dashboard/';
    })
    .catch((error) => {
      showNotification(error.message, 'error');
    });
}

// Initialize auth state on every page
document.addEventListener('DOMContentLoaded', checkAuthState);

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 15px 25px;
    border-radius: 50px;
    z-index: 9999;
    animation: slideIn 0.3s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Reauthentication helper
async function reauthenticateUser(password) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error('No user logged in');
    
  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
    
  return user.reauthenticateWithCredential(credential);
}

// Delete account with all associated data
async function deleteUserAccount(password) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error('No user logged in');
    
  // Reauthenticate
  await reauthenticateUser(password);
    
  // Delete user data from Firestore
  await db.collection('users').doc(user.uid).delete();
    
  // Delete user's bookings
  const bookingsSnapshot = await db.collection('bookings')
    .where('userId', '==', user.uid)
    .get();
    
  const batch = db.batch();
  bookingsSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
    
  // Delete user account
  await user.delete();
    
  return { success: true };
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);