/**
 * Authentication system for ConnectHub
 * 
 * This file handles user registration, login, logout functionality
 * Stores user data in localStorage for this client-side only implementation
 */

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const loggedInControls = document.querySelector('.logged-in-controls');
const loggedOutControls = document.querySelector('.logged-out-controls');

// Check if user is logged in
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('connecthub_current_user');
    return !!currentUser;
}

// Update UI based on login status
function updateAuthUI() {
    const isLoggedIn = checkUserLoggedIn();
    
    if (loggedInControls && loggedOutControls) {
        if (isLoggedIn) {
            loggedInControls.classList.remove('hide');
            loggedOutControls.classList.add('hide');
            
            // Update user profile picture and name if available
            const userData = JSON.parse(localStorage.getItem('connecthub_current_user'));
            const userAvatar = document.querySelector('.user-profile-menu .avatar-small');
            
            if (userAvatar && userData.avatar) {
                userAvatar.src = userData.avatar;
            }
        } else {
            loggedInControls.classList.add('hide');
            loggedOutControls.classList.remove('hide');
        }
    }
}

// Register new user
function registerUser(userData) {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('connecthub_users') || '[]');
    
    // Check if username already exists
    const usernameExists = users.some(user => user.username === userData.username);
    if (usernameExists) {
        showNotification('Username already exists. Please choose another one.', 5000);
        return false;
    }
    
    // Check if email already exists
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
        showNotification('Email already in use. Please use another email address.', 5000);
        return false;
    }
    
    // Add new user
    users.push(userData);
    localStorage.setItem('connecthub_users', JSON.stringify(users));
    
    // Auto login after registration
    loginUser(userData.username, userData.password);
    
    return true;
}

// Login user
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('connecthub_users') || '[]');
    
    // Find user by username and password
    const user = users.find(user => 
        (user.username === username || user.email === username) && 
        user.password === password
    );
    
    if (user) {
        // Store current user in localStorage (don't store password in memory)
        const userData = {...user};
        delete userData.password;
        localStorage.setItem('connecthub_current_user', JSON.stringify(userData));
        
        // Update UI
        updateAuthUI();
        
        return true;
    } else {
        return false;
    }
}

// Logout user
function logoutUser() {
    // Remove current user from localStorage
    localStorage.removeItem('connecthub_current_user');
    
    // Update UI
    updateAuthUI();
    
    // Redirect to home page if not already there
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = '/index.html';
    }
}

// Initialize demo data if no users exist
function initDemoData() {
    const users = JSON.parse(localStorage.getItem('connecthub_users') || '[]');
    
    if (users.length === 0) {
        // Create demo users
        const demoUsers = [
            {
                id: 1,
                username: 'john_doe',
                email: 'john@example.com',
                password: 'password123',
                fullName: 'John Doe',
                avatar: 'assets/images/user-avatar-1.jpg',
                bio: 'Web developer and design enthusiast',
                joinDate: '2023-01-15',
                isVerified: true
            },
            {
                id: 2,
                username: 'jane_smith',
                email: 'jane@example.com',
                password: 'password123',
                fullName: 'Jane Smith',
                avatar: 'assets/images/user-avatar-2.jpg',
                bio: 'UX Designer and photographer',
                joinDate: '2023-02-20',
                isVerified: false
            }
        ];
        
        localStorage.setItem('connecthub_users', JSON.stringify(demoUsers));
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize demo data
    initDemoData();
    
    // Check if user is logged in
    updateAuthUI();
    
    // Login form submit handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = this.querySelector('#login-username').value;
            const password = this.querySelector('#login-password').value;
            
            if (loginUser(username, password)) {
                showNotification('Login successful!', 3000);
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            } else {
                showNotification('Invalid username or password. Please try again.', 5000);
            }
        });
    }
    
    // Register form submit handler
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = this.querySelector('#register-username').value;
            const email = this.querySelector('#register-email').value;
            const password = this.querySelector('#register-password').value;
            const confirmPassword = this.querySelector('#register-confirm-password').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match. Please try again.', 5000);
                return;
            }
            
            // Create user object
            const newUser = {
                id: Date.now(),
                username,
                email,
                password,
                fullName: '',
                avatar: 'assets/images/default-avatar.png',
                bio: '',
                joinDate: new Date().toISOString().split('T')[0],
                isVerified: false
            };
            
            // Register user
            if (registerUser(newUser)) {
                showNotification('Registration successful! Welcome to ConnectHub.', 3000);
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            }
        });
    }
    
    // Logout button handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
            showNotification('You have been logged out.', 3000);
        });
    }
});

// Get current user function (can be used by other modules)
function getCurrentUser() {
    if (checkUserLoggedIn()) {
        return JSON.parse(localStorage.getItem('connecthub_current_user'));
    }
    return null;
}

// Function to show notification (defined in app.js but used here)
function showNotification(message, duration = 5000) {
    // Check if function exists in global scope
    if (window.showNotification) {
        window.showNotification(message, duration);
    } else {
        // Simple fallback if showNotification from app.js is not available
        console.log(message);
        
        const toast = document.getElementById('notification-toast');
        if (toast) {
            const messageElement = toast.querySelector('.notification-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        } else {
            alert(message);
        }
    }
}