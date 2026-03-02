// Main JavaScript file

// Search function
function searchLocations() {
    const searchInput = document.getElementById('location-search');
    const location = searchInput.value.trim();
    
    if (location) {
        // You'll replace this with actual search logic
        alert(`Searching for locations near: ${location}`);
        // In the future, this will redirect to a results page
        // window.location.href = `locations.html?search=${encodeURIComponent(location)}`;
    } else {
        alert('Please enter a location');
    }
}

// Mobile menu toggle (for smaller screens)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add smooth scrolling for anchor links
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

// You can add more features later:
// - Form validation for bookings
// - Dynamic review loading
// - Interactive map integration
// - QR code generation