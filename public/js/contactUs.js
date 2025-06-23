const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const overlay = document.querySelector('.overlay');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

overlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

const contact_form = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

contact_form.addEventListener('submit', async function(e) {
    try {

        e.preventDefault();
            
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        const contactForm = {
            name: name,
            email: email,
            phone: phone,
            message: message
        };
        const response = await fetch('/contactUS/msgSend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactForm)
        });

        const data = await response.json()
        // console.log(data);
        if(data.isSend){
            statusMessage.textContent = "Thank you for your message! We'll get back to you soon.";
            statusMessage.className = "status-message success";
                    
            contact_form.reset();
                    
            setTimeout(() => {
                statusMessage.className = "status-message";
                statusMessage.textContent = "";
            }, 5000);
        }else{
            alert('Server error..');
        }
    } catch (error) {
        console.log(error);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
