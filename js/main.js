// Main JavaScript for Luggage Storage Website

// Navigation Toggle for Mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Initialize reviews carousel
    loadReviews();
    
    // Initialize FAQ accordions
    initFAQ();
    
    // Initialize typing effect
    initTypingEffect();
});

// Reviews Data (sample - replace with your own)
const reviews = [
    {
        name: "Sarah Johnson",
        avatar: "SJ",
        rating: 5,
        text: "The accommodation is on the 11th floor on the right. If you speak to the receptionist, they will guide you to the storage area. They speak English and are very friendly.",
        location: "Hong Kong"
    },
    {
        name: "Michael Chen",
        avatar: "MC",
        rating: 5,
        text: "Easy to use, smooth flow. All you need to do is showing the QR code to the staffs. Recommended.",
        location: "Singapore"
    },
    {
        name: "Emma Williams",
        avatar: "EW",
        rating: 5,
        text: "Very convenient solution to leave your luggages for the whole day. Amazing staff, very kind!",
        location: "London"
    },
    {
        name: "David Kim",
        avatar: "DK",
        rating: 5,
        text: "Super friendly, great service. Super smooth process. Very convenient area.",
        location: "Seoul"
    },
    {
        name: "Lisa Rodriguez",
        avatar: "LR",
        rating: 5,
        text: "Amazing service. Great communication. Secure place to leave luggage. Highly recommended!",
        location: "Barcelona"
    },
    {
        name: "James Wilson",
        avatar: "JW",
        rating: 5,
        text: "Enter the building and go to the 13th floor! The owner is Korean and very friendly. I highly recommend it.",
        location: "Tokyo"
    }
];

// Load Reviews Carousel
function loadReviews() {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;
    
    let reviewsHTML = '';
    reviews.forEach(review => {
        reviewsHTML += `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-avatar">${review.avatar}</div>
                    <div>
                        <strong>${review.name}</strong>
                        <div class="review-stars">
                            ${Array(review.rating).fill('<i class="fas fa-star"></i>').join('')}
                        </div>
                    </div>
                </div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-location">
                    <i class="fas fa-map-marker-alt"></i> ${review.location}
                </div>
            </div>
        `;
    });
    
    carousel.innerHTML = reviewsHTML;
}

// Carousel Navigation
let currentPosition = 0;

function moveCarousel(direction) {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;
    
    const cardWidth = 320; // card width + gap
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    currentPosition += direction * cardWidth;
    
    if (currentPosition < 0) currentPosition = 0;
    if (currentPosition > maxScroll) currentPosition = maxScroll;
    
    carousel.scrollTo({
        left: currentPosition,
        behavior: 'smooth'
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Open first FAQ by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// Typing Effect for Cities
function initTypingEffect() {
    const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Hong Kong', 'Sydney', 'Dubai', 'Singapore'];
    let cityIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.city-typing');
    
    if (!typingElement) return;
    
    function type() {
        const currentCity = cities[cityIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentCity.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentCity.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentCity.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cityIndex = (cityIndex + 1) % cities.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    type();
}

// Search Function
function searchLocations() {
    const searchInput = document.getElementById('location-search');
    const location = searchInput.value.trim();
    
    if (location) {
        // Show loading state
        const searchBtn = document.querySelector('.search-box button');
        const originalText = searchBtn.textContent;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchBtn.disabled = true;
        
        // Simulate search (replace with actual search)
        setTimeout(() => {
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;
            
            // Redirect to results page (create this later)
            alert(`Searching for locations near: ${location}`);
            // window.location.href = `/locations?search=${encodeURIComponent(location)}`;
        }, 1500);
    } else {
        // Shake animation for empty search
        const searchBox = document.querySelector('.search-box');
        searchBox.classList.add('shake');
        setTimeout(() => {
            searchBox.classList.remove('shake');
        }, 500);
    }
}

// Newsletter Subscription
function subscribeNewsletter() {
    const form = document.querySelector('.newsletter-form');
    const email = form.querySelector('input[type="email"]').value;
    
    if (email && isValidEmail(email)) {
        // Show success message
        const button = form.querySelector('button');
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        button.style.background = '#10b981';
        
        // Reset after 3 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            form.reset();
        }, 3000);
        
        // Here you would send to your backend
        console.log('Newsletter subscription:', email);
    } else {
        alert('Please enter a valid email address');
    }
}

// Email Validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add Shake Animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .reviewer-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 10px;
    }
    
    .review-stars {
        color: #ffd700;
        font-size: 12px;
    }
    
    .review-location {
        font-size: 14px;
        color: #64748b;
        margin-top: 10px;
    }
    
    .review-location i {
        margin-right: 5px;
    }
    
    /* Loading Spinner */
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);