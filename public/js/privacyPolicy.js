// Mobile Menu Functions
function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}


document.getElementById('back_to_pcm').addEventListener('click',()=>{
    window.history.back();
});

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Modal Functions (placeholder - implement as needed)
function openLoginModal() {
    closeMobileMenu();
    alert('Login modal would open here');
    // Implement your login modal functionality
}

function openRegisterModal() {
    closeMobileMenu();
    alert('Register modal would open here');
    // Implement your register modal functionality
}

// Close mobile menu when clicking on links
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
});