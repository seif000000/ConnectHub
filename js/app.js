/**
 * Main application script for ConnectHub
 * Handles UI interactions, mobile menu, notifications, etc.
 */

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const body = document.body;
const notificationToast = document.getElementById('notification-toast');
const closeNotificationBtn = document.querySelector('.close-notification');
const userProfileMenu = document.querySelector('.user-profile-menu');
const filterButtons = document.querySelectorAll('.filter-options button');
const logoutBtn = document.getElementById('logout-btn');

// Mobile Menu Toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        body.classList.toggle('mobile-menu-active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.mobile-menu-toggle') && 
        !event.target.closest('.main-nav') && 
        body.classList.contains('mobile-menu-active')) {
        body.classList.remove('mobile-menu-active');
    }
});

// Filter buttons click event
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // In a real app, you would filter posts here
            console.log(`Filtering by: ${filter}`);
            
            // Show notification as feedback
            showNotification(`Showing ${filter} posts`);
        });
    });
}

// Notification System
function showNotification(message, duration = 5000) {
    // Update notification message
    const notificationMessage = document.querySelector('.notification-message');
    if (notificationMessage) {
        notificationMessage.textContent = message;
    }
    
    // Show notification
    if (notificationToast) {
        notificationToast.classList.add('show');
        
        // Auto hide after duration
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, duration);
    }
}

// Close notification on button click
if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', function() {
        notificationToast.classList.remove('show');
    });
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.getAttribute('data-src');
                    image.removeAttribute('data-src');
                    observer.unobserve(image);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Load more posts button
const loadMoreBtn = document.querySelector('.load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        this.textContent = 'Loading...';
        this.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            // In a real application, you would fetch more posts from a server here
            // For now, we'll just add sample posts
            loadDummyPosts();
            
            this.textContent = 'Load More Posts';
            this.disabled = false;
        }, 1000);
    });
}

// Function to load dummy posts for demo purposes
function loadDummyPosts() {
    const postsContainer = document.querySelector('.posts-container');
    
    if (!postsContainer) return;
    
    const samplePost = `
        <article class="post">
            <div class="post-header">
                <img src="assets/images/user-avatar-${Math.floor(Math.random() * 6) + 1}.jpg" alt="User Avatar" class="avatar-small">
                <div class="post-info">
                    <div class="post-author">
                        <a href="pages/profile.html" class="author-name">Example User</a>
                    </div>
                    <div class="post-meta">
                        <span class="post-time">Just now</span>
                        <span class="post-category"><a href="#">Example Category</a></span>
                    </div>
                </div>
                <div class="post-actions-menu">
                    <button class="post-menu-btn"><i class="fas fa-ellipsis-h"></i></button>
                    <div class="dropdown-menu">
                        <a href="#"><i class="fas fa-bookmark"></i> Save</a>
                        <a href="#"><i class="fas fa-flag"></i> Report</a>
                        <a href="#"><i class="fas fa-volume-mute"></i> Mute</a>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <p>This is a dynamically loaded post. In a real application, this would be fetched from a server.</p>
            </div>
            <div class="post-footer">
                <div class="post-reactions">
                    <button class="reaction-btn like-btn"><i class="far fa-heart"></i> <span>0</span></button>
                    <button class="reaction-btn comment-btn"><i class="far fa-comment"></i> <span>0</span></button>
                    <button class="reaction-btn share-btn"><i class="far fa-share-square"></i> <span>0</span></button>
                </div>
            </div>
            <div class="comments-section">
                <form class="comment-form">
                    <img src="assets/images/default-avatar.png" alt="Your Avatar" class="avatar-small">
                    <input type="text" placeholder="Write a comment..." class="comment-input">
                    <button type="submit" class="submit-comment-btn"><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </article>
    `;
    
    // Insert two new posts
    postsContainer.insertAdjacentHTML('beforeend', samplePost);
    postsContainer.insertAdjacentHTML('beforeend', samplePost);
    
    // Reinitialize post interactions for new posts
    initPostInteractions();
    
    // Show notification
    showNotification('New posts loaded!');
}

// Initialize post interactions
function initPostInteractions() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function() {
                const countSpan = this.querySelector('span');
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    // Like
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#e74a3b';
                    countSpan.textContent = parseInt(countSpan.textContent) + 1;
                } else {
                    // Unlike
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    countSpan.textContent = Math.max(0, parseInt(countSpan.textContent) - 1);
                }
            });
        }
    });
    
    // Comment buttons
    document.querySelectorAll('.comment-btn').forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function() {
                const commentsSection = this.closest('.post').querySelector('.comments-section');
                const commentInput = commentsSection.querySelector('.comment-input');
                
                // Show comments section and focus on input
                commentsSection.style.display = 'block';
                commentInput.focus();
            });
        }
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        if (!btn.hasAttribute('data-initialized')) {
            btn.setAttribute('data-initialized', 'true');
            btn.addEventListener('click', function() {
                const postText = this.closest('.post').querySelector('.post-content p').textContent;
                
                // Check if Web Share API is available
                if (navigator.share) {
                    navigator.share({
                        title: 'ConnectHub Post',
                        text: postText,
                        url: window.location.href
                    })
                    .then(() => showNotification('Post shared successfully!'))
                    .catch(error => console.log('Error sharing:', error));
                } else {
                    // Fallback - copy to clipboard
                    const textArea = document.createElement('textarea');
                    textArea.value = `${postText} - via ConnectHub`;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    showNotification('Post link copied to clipboard!');
                }
                
                // Update share count
                const countSpan = this.querySelector('span');
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
            });
        }
    });
    
    // Comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        if (!form.hasAttribute('data-initialized')) {
            form.setAttribute('data-initialized', 'true');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const input = this.querySelector('.comment-input');
                const commentText = input.value.trim();
                
                if (commentText) {
                    const commentsContainer = this.closest('.comments-section').querySelector('.comments-container');
                    
                    // Create new comment HTML
                    const newComment = `
                        <div class="comment">
                            <img src="assets/images/default-avatar.png" alt="Your Avatar" class="avatar-small">
                            <div class="comment-content">
                                <div class="comment-header">
                                    <a href="#" class="commenter-name">You</a>
                                    <span class="comment-time">Just now</span>
                                </div>
                                <p>${commentText}</p>
                                <div class="comment-actions">
                                    <button class="comment-like-btn"><i class="far fa-heart"></i> <span>0</span></button>
                                    <button class="comment-reply-btn">Reply</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // If commentsContainer doesn't exist, create it
                    if (!commentsContainer) {
                        const commentsSection = this.closest('.comments-section');
                        const newCommentsContainer = document.createElement('div');
                        newCommentsContainer.className = 'comments-container';
                        commentsSection.insertBefore(newCommentsContainer, commentsSection.firstChild);
                        
                        // Now add the comment
                        newCommentsContainer.innerHTML = newComment;
                    } else {
                        // Add comment to existing container
                        commentsContainer.insertAdjacentHTML('beforeend', newComment);
                    }
                    
                    // Clear input
                    input.value = '';
                    
                    // Update comment count
                    const post = this.closest('.post');
                    const commentBtn = post.querySelector('.comment-btn span');
                    commentBtn.textContent = parseInt(commentBtn.textContent) + 1;
                    
                    // Initialize the new comment's like button
                    initPostInteractions();
                }
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize post interactions
    initPostInteractions();
    
    // Example notification - remove in production
    setTimeout(() => {
        showNotification('Welcome to ConnectHub! Explore communities and connect with others.');
    }, 3000);
});