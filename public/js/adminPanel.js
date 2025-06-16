// Dummy data for students
const students = [
    { name: "Rahul", surname: "Sharma", phone: "9876543210", email: "rahul.sharma@example.com", stream: "Engineering" },
    { name: "Priya", surname: "Patel", phone: "8765432109", email: "priya.patel@example.com", stream: "Pharmacy" },
    { name: "Amit", surname: "Singh", phone: "7654321098", email: "amit.singh@example.com", stream: "BBA/BMS" },
    { name: "Neha", surname: "Gupta", phone: "6543210987", email: "neha.gupta@example.com", stream: "BCA" },
    { name: "Vikram", surname: "Joshi", phone: "5432109876", email: "vikram.joshi@example.com", stream: "Engineering" },
    { name: "Anjali", surname: "Desai", phone: "4321098765", email: "anjali.desai@example.com", stream: "Pharmacy" },
    { name: "Suresh", surname: "Kumar", phone: "3210987654", email: "suresh.kumar@example.com", stream: "BBA/BMS" },
    { name: "Meera", surname: "Iyer", phone: "2109876543", email: "meera.iyer@example.com", stream: "BCA" },
    { name: "Arjun", surname: "Reddy", phone: "1098765432", email: "arjun.reddy@example.com", stream: "Engineering" },
    { name: "Divya", surname: "Nair", phone: "9988776655", email: "divya.nair@example.com", stream: "Pharmacy" }
];

// Dummy data for purchases
const purchases = [
    { name: "Rahul Sharma", phone: "9876543210", email: "rahul.sharma@example.com", stream: "Engineering", date: "2023-05-15", amount: "₹1,499" },
    { name: "Priya Patel", phone: "8765432109", email: "priya.patel@example.com", stream: "Pharmacy", date: "2023-05-16", amount: "₹1,299" },
    { name: "Amit Singh", phone: "7654321098", email: "amit.singh@example.com", stream: "BBA/BMS", date: "2023-05-17", amount: "₹999" },
    { name: "Neha Gupta", phone: "6543210987", email: "neha.gupta@example.com", stream: "BCA", date: "2023-05-18", amount: "₹899" },
    { name: "Vikram Joshi", phone: "5432109876", email: "vikram.joshi@example.com", stream: "Engineering", date: "2023-05-19", amount: "₹1,499" },
    { name: "Anjali Desai", phone: "4321098765", email: "anjali.desai@example.com", stream: "Pharmacy", date: "2023-05-20", amount: "₹1,299" },
    { name: "Suresh Kumar", phone: "3210987654", email: "suresh.kumar@example.com", stream: "BBA/BMS", date: "2023-05-21", amount: "₹999" },
    { name: "Meera Iyer", phone: "2109876543", email: "meera.iyer@example.com", stream: "BCA", date: "2023-05-22", amount: "₹899" }
];

// Dummy data for promo codes
let promoCodes = [
    { code: "WELCOME20", limit: "100 uses", remaining: 45 },
    { code: "STUDENT15", limit: "50 uses", remaining: 12 },
    { code: "EARLYBIRD", limit: "Unlimited", remaining: "∞" },
    { code: "SUMMER25", limit: "200 uses", remaining: 87 },
    { code: "SPECIAL10", limit: "30 uses", remaining: 5 }
];

// DOM elements
const loginPage = document.getElementById('login-page');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const sections = {
    dashboard: document.getElementById('dashboard-section'),
    students: document.getElementById('students-section'),
    purchases: document.getElementById('purchases-section'),
    promoCodes: document.getElementById('promo-codes-section')
};

// Login functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    // Static login credentials
    if (phone === '8999741641' && password === '123456') {
        loginPage.style.display = 'none';
        adminPanel.style.display = 'block';
        showSection('dashboard');
        populateStudentTable();
        populatePurchaseTable();
        populatePromoCodes();
    } else {
        alert('Invalid phone number or password');
    }
});

// Logout functionality
logoutBtn.addEventListener('click', function() {
    adminPanel.style.display = 'none';
    loginPage.style.display = 'flex';
    document.getElementById('phone').value = '';
    document.getElementById('password').value = '';
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', function() {
    document.querySelector('.mobile-menu').classList.add('active');
    document.querySelector('.overlay').classList.add('active');
});

// Section navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        showSection(section);
        
        // Update active state
        sidebarLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Close mobile menu if open
        document.querySelector('.mobile-menu').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    });
});

// Show specific section
function showSection(section) {
    Object.values(sections).forEach(sec => {
        sec.style.display = 'none';
    });
    sections[section].style.display = 'block';
}

// Populate student table
function populateStudentTable(filterStream = '', searchQuery = '') {
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';
    
    let filteredStudents = students;
    
    if (filterStream) {
        filteredStudents = filteredStudents.filter(student => student.stream === filterStream);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
            student.name.toLowerCase().includes(query) || 
            student.surname.toLowerCase().includes(query) ||
            student.phone.includes(query) ||
            student.email.toLowerCase().includes(query)
        );
    }
    
    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.surname}</td>
            <td>${student.phone}</td>
            <td>${student.email}</td>
            <td>${student.stream}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate purchase table
function populatePurchaseTable(filterStream = '', searchQuery = '') {
    const tbody = document.getElementById('purchase-table-body');
    tbody.innerHTML = '';
    
    let filteredPurchases = purchases;
    
    if (filterStream) {
        filteredPurchases = filteredPurchases.filter(purchase => purchase.stream === filterStream);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPurchases = filteredPurchases.filter(purchase => 
            purchase.name.toLowerCase().includes(query) || 
            purchase.phone.includes(query) ||
            purchase.email.toLowerCase().includes(query)
        );
    }
    
    filteredPurchases.forEach(purchase => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purchase.name}</td>
            <td>${purchase.phone}</td>
            <td>${purchase.email}</td>
            <td>${purchase.stream}</td>
            <td>${purchase.date}</td>
            <td>${purchase.amount}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate promo codes
function populatePromoCodes() {
    const container = document.getElementById('promo-codes-list');
    container.innerHTML = '';
    
    promoCodes.forEach(promo => {
        const promoCard = document.createElement('div');
        promoCard.className = 'promo-card';
        promoCard.innerHTML = `
            <div class="promo-info">
                <div class="promo-code">${promo.code}</div>
                <div class="promo-limit">Limit: ${promo.limit} | Remaining: ${promo.remaining}</div>
            </div>
            <div class="promo-actions">
                <button class="edit-promo" data-code="${promo.code}"><i class="fas fa-edit"></i></button>
                <button class="delete-promo" data-code="${promo.code}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(promoCard);
    });
    
    // Add event listeners for promo actions
    document.querySelectorAll('.edit-promo').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            editPromoCode(code);
        });
    });
    
    document.querySelectorAll('.delete-promo').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            deletePromoCode(code);
        });
    });
}

// Add new promo code
document.getElementById('add-promo-btn').addEventListener('click', function() {
    const code = document.getElementById('new-promo-code').value.trim();
    const limit = document.getElementById('new-promo-limit').value.trim();
    
    if (!code) {
        alert('Please enter a promo code');
        return;
    }
    
    if (!limit) {
        alert('Please enter a usage limit');
        return;
    }
    
    const limitText = limit === '0' ? 'Unlimited' : `${limit} uses`;
    const remaining = limit === '0' ? '∞' : parseInt(limit);
    
    promoCodes.push({
        code: code.toUpperCase(),
        limit: limitText,
        remaining: remaining
    });
    
    populatePromoCodes();
    document.getElementById('new-promo-code').value = '';
    document.getElementById('new-promo-limit').value = '';
});

// Edit promo code (simplified for demo)
function editPromoCode(code) {
    const promo = promoCodes.find(p => p.code === code);
    const newLimit = prompt(`Edit usage limit for ${code} (current: ${promo.limit})`, 
                          promo.limit === 'Unlimited' ? '0' : promo.limit.split(' ')[0]);
    
    if (newLimit !== null) {
        const limitText = newLimit === '0' ? 'Unlimited' : `${newLimit} uses`;
        const remaining = newLimit === '0' ? '∞' : parseInt(newLimit);
        
        promo.limit = limitText;
        promo.remaining = remaining;
        populatePromoCodes();
    }
}

// Delete promo code
function deletePromoCode(code) {
    if (confirm(`Are you sure you want to delete promo code ${code}?`)) {
        promoCodes = promoCodes.filter(p => p.code !== code);
        populatePromoCodes();
    }
}

// Filter students by stream
document.getElementById('student-stream-filter').addEventListener('change', function() {
    const stream = this.value;
    const searchQuery = document.getElementById('student-search').value;
    populateStudentTable(stream, searchQuery);
});

// Search students
document.getElementById('student-search').addEventListener('input', function() {
    const stream = document.getElementById('student-stream-filter').value;
    const searchQuery = this.value;
    populateStudentTable(stream, searchQuery);
});

// Filter purchases by stream
document.getElementById('purchase-stream-filter').addEventListener('change', function() {
    const stream = this.value;
    const searchQuery = document.getElementById('purchase-search').value;
    populatePurchaseTable(stream, searchQuery);
});

// Search purchases
document.getElementById('purchase-search').addEventListener('input', function() {
    const stream = document.getElementById('purchase-stream-filter').value;
    const searchQuery = this.value;
    populatePurchaseTable(stream, searchQuery);
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', function() {
        document.querySelector('.mobile-menu').classList.remove('active');
        this.classList.remove('active');
    });
    document.body.appendChild(overlay);
    
    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <button class="close-menu-btn"><i class="fas fa-times"></i></button>
        <ul class="sidebar-menu">
            <li><a href="#" class="active" data-section="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="#" data-section="students"><i class="fas fa-users"></i> Student Information</a></li>
            <li><a href="#" data-section="purchases"><i class="fas fa-shopping-cart"></i> Purchase List</a></li>
            <li><a href="#" data-section="promo-codes"><i class="fas fa-tag"></i> Promo Codes</a></li>
        </ul>
        <div class="auth-buttons">
            <button class="btn btn-outline" id="logout-btn-mobile"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
    `;
    document.body.appendChild(mobileMenu);
    
    // Close mobile menu button
    document.querySelector('.close-menu-btn').addEventListener('click', function() {
        document.querySelector('.mobile-menu').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    });
    
    // Mobile logout button
    document.getElementById('logout-btn-mobile').addEventListener('click', function() {
        adminPanel.style.display = 'none';
        loginPage.style.display = 'flex';
        document.getElementById('phone').value = '';
        document.getElementById('password').value = '';
        document.querySelector('.mobile-menu').classList.remove('active');
        document.querySelector('.overlay').classList.remove('active');
    });
    
    // Mobile menu links
    document.querySelectorAll('.mobile-menu .sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.querySelector(`.sidebar-menu a[data-section="${section}"]`).classList.add('active');
            
            // Close mobile menu
            document.querySelector('.mobile-menu').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
        });
    });
});