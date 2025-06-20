// const { response } = require("express");

// Dummy data for students
const students = [];

// Dummy data for purchases
const purchases = [];

// Dummy data for promo codes
let promoCodes = [];

// Dummy data for assigned promos
let assignedPromos = [];

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
    promo_codes: document.getElementById('promo-codes-section'),
    assigned_promos: document.getElementById('assigned-promos-section')
};

// Modal elements
const assignPromoModal = document.getElementById('assign-promo-modal');
const closeModalBtn = document.querySelector('.close-modal');
const studentSearchInput = document.getElementById('student-search-input');
const studentSearchResults = document.getElementById('student-search-results');
const assignPromoBtn = document.getElementById('assign-promo-btn');
let currentPromoCode = '';

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
        populateAssignedPromos();
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
        // console.log(section);
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
            purchase.phone.includes(query)
        );
    }
    
    filteredPurchases.forEach(purchase => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purchase.name}</td>
            <td>${purchase.phone}</td>
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
    
    // console.log('Show : ', promoCodes);
    promoCodes.forEach(promo => {
        const promoCard = document.createElement('div');
        promoCard.className = 'promo-card';
        promoCard.innerHTML = `
            <div class="promo-info">
                <div class="promo-code">${promo.code}</div>
                <div class="promo-limit">Limit: ${promo.limit}</div>
            </div>
            <div class="promo-actions">
                <button class="assign-promo" data-code="${promo.code}"><i class="fas fa-user-plus"></i> Assign</button>
            </div>
        `;
        container.appendChild(promoCard);
    });
    
    // Add event listeners for promo actions
    document.querySelectorAll('.assign-promo').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            openAssignPromoModal(code);
        });
    });
    
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

// Populate assigned promos
function populateAssignedPromos(searchQuery = '') {
    const tbody = document.getElementById('assigned-promos-table-body');
    tbody.innerHTML = '';
    
    let filteredAssignedPromos = assignedPromos;
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredAssignedPromos = filteredAssignedPromos.filter(ap => 
            ap.studentName.toLowerCase().includes(query) || 
            ap.phone.includes(query) ||
            ap.promoCode.toLowerCase().includes(query)
        );
    }
    
    filteredAssignedPromos.forEach(ap => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ap.studentName}</td>
            <td>${ap.phone}</td>
            <td>${ap.promoCode}</td>
            <td>${ap.limit}</td>
        `;
        tbody.appendChild(row);
    });
}

// Open assign promo modal
function openAssignPromoModal(code) {
    currentPromoCode = code;
    assignPromoModal.style.display = 'flex';
    studentSearchInput.value = '';
    studentSearchResults.innerHTML = '';
    document.querySelector('.modal-title').textContent = `Assign Promo Code: ${code}`;
}

// Close modal
closeModalBtn.addEventListener('click', function() {
    assignPromoModal.style.display = 'none';
});

// Close modal when clicking outside
assignPromoModal.addEventListener('click', function(e) {
    if (e.target === assignPromoModal) {
        assignPromoModal.style.display = 'none';
    }
});

// Search students for promo assignment
studentSearchInput.addEventListener('input', function() {
    const query = this.value.trim();
    studentSearchResults.innerHTML = '';
    
    if (query.length < 3) return;
    
    const filteredStudents = students.filter(student => 
        student.phone.includes(query) ||
        `${student.name} ${student.surname}`.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredStudents.length === 0) {
        studentSearchResults.innerHTML = '<div class="student-result">No students found</div>';
        return;
    }
    
    filteredStudents.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student-result';
        studentDiv.innerHTML = `
            <div>${student.name} ${student.surname}</div>
            <div>${student.phone}</div>
            <div>${student.email}</div>
        `;
        studentDiv.addEventListener('click', function() {
            document.querySelectorAll('.student-result').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
        });
        studentSearchResults.appendChild(studentDiv);
    });
});

// Search students
// document.getElementById('student-search').addEventListener('input', function() {
//     const stream = document.getElementById('student-stream-filter').value;
//     const searchQuery = this.value.trim().toLowerCase();
    
//     // Get all students
//     let filteredStudents = [...students];
    
//     // Apply stream filter if selected
//     if (stream) {
//         filteredStudents = filteredStudents.filter(student => student.stream === stream);
//     }
    
//     // Apply search query if exists
//     if (searchQuery) {
//         filteredStudents = filteredStudents.filter(student => 
//             (student.name && student.name.toLowerCase().includes(searchQuery)) || 
//             (student.surname && student.surname.toLowerCase().includes(searchQuery)) ||
//             (student.phone && student.phone.includes(searchQuery)) ||
//             (student.email && student.email.toLowerCase().includes(searchQuery))
//         );
//     }
    
//     // Repopulate the table with filtered results
//     const tbody = document.getElementById('student-table-body');
//     tbody.innerHTML = '';
    
//     filteredStudents.forEach(student => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${student.name || ''}</td>
//             <td>${student.surname || ''}</td>
//             <td>${student.phone || ''}</td>
//             <td>${student.email || ''}</td>
//             <td>${student.stream || ''}</td>
//         `;
//         tbody.appendChild(row);
//     });
// });

// Assign promo code to student
assignPromoBtn.addEventListener('click',async function() {
    try {
        
        const selectedStudent = document.querySelector('.student-result.selected');
        
        if (!selectedStudent) {
            // alert('Please select a student');
            showError('Please select a student');
            return;
        }
        
        const studentPhone = selectedStudent.querySelector('div:nth-child(2)').textContent;
        const studentName = selectedStudent.querySelector('div:first-child').textContent;
        
        // Check if promo is already assigned to this student
        const alreadyAssigned = assignedPromos.some(ap => 
            ap.phone === studentPhone && ap.promoCode === currentPromoCode
        );
        
        if (alreadyAssigned) {
            // alert('This promo code is  to this student');
            showError('Already assigned.');
            return;
        }
        
        // Find the promo to get its limit
        const promo = promoCodes.find(p => p.code === currentPromoCode);
        if (!promo) {
            // alert('Promo code not found');
            showError('Invalide Promo code.');
            return;
        }
        
        
        
        const response = await fetch('/adminPanel/assignPromoCode', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({phone: studentPhone, promo_code: currentPromoCode})
        });

        const data = await response.json();
        console.log(data);
        
        if(!data.isAssign){
            return showError(data.msg);
        }
        assignedPromos.push({
            studentName: studentName,
            phone: studentPhone,
            promoCode: currentPromoCode,
            limit: promo.limit
        });
        // Update UI
        populatePromoCodes();
        populateAssignedPromos();
        assignPromoModal.style.display = 'none';
        
        // alert(`Promo code ${currentPromoCode} successfully assigned to ${studentName}`);

    } catch (error) {
        console.log(error);
    }
});


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

// Search assigned promos
document.getElementById('assigned-promo-search').addEventListener('input', function() {
    const searchQuery = this.value;
    populateAssignedPromos(searchQuery);
});

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {

    await student_info();
    await student_purchases();
    await fetchPromoCodes();
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
            <li><a href="#" data-section="assigned-promos"><i class="fas fa-list-check"></i> Assigned Promos</a></li>
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

    
   

    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalPurchase').textContent = purchases.length;
    populateStudentTable();
    populatePurchaseTable();
    populatePromoCodes();
    populateAssignedPromos();
});

// Load student info from API
async function student_info() {
    try {
        // This would be your actual API call
        const response = await fetch('/adminPanel/studentInformation');
        const data = await response.json();

        data.forEach(element => {
            let exam;
            if(element.examType == 'MHTCETPCM'){
                exam = 'Engineering';
            }else if(element.examType == 'MHTCETPCB'){
                exam = 'Pharmacy';
            }else if(element.examType == 'NEET'){
                exam = 'NEET';
            }else if(element.examType == 'BBA/BMS'){
                exam = 'BBA/BMS';
            }else if(element.examType == 'BCA'){
                exam = 'BCA';
            }
            let phone = `${element.phone_number}`;
            students.push({
                name: element.first_name,
                surname: element.last_name,
                phone: phone,
                email: element.email,
                stream: exam
            });
        });

    } catch (error) {
        console.log(error);
    }
}

// Load student purchases from API
async function student_purchases() {
    try {
        // This would be your actual API call
        const response = await fetch('/adminPanel/studentPurchase');
        const data = await response.json();
        
        data.forEach(element => {
            const dateOnly = new Date(element.createdAt).toISOString().split('T')[0];
            let amount = element.code ? element.code : element.payment;
            let phone = `${element.phone_number}`;
            purchases.push({
                name: element.title,
                phone: phone,
                stream: element.examType,
                date: dateOnly,
                amount: amount
            });
        });

    } catch (error) {
        console.log(error);
    }
}

async function fetchPromoCodes() {
    
    try {
        const response = await fetch('/adminPanel/promoCodes');
        const data = await response.json();
        // console.log(data);

        data.forEach(element => {
            if(element.phone_number == null){
                promoCodes.push({
                    code: element.code,
                    limit: element.count
                });
            }else{
                let name = element.extra_info[0].first_name +' '+ element.extra_info[0].last_name;
                assignedPromos.push({
                    studentName: name,
                    phone: element.phone_number,
                    promoCode: element.code,
                    limit: element.count
                });
            }
        });

    } catch (error) {
        console.log(error);
    }
}


// Error popup elements
const errorPopup = document.getElementById('error-popup');
const errorMessage = document.getElementById('error-message');
const closeErrorPopup = document.querySelector('.close-error-popup');

// Function to show error popup
function showError(message) {
    errorMessage.textContent = message;
    errorPopup.style.display = 'flex';
}

// Function to hide error popup
function hideError() {
    errorPopup.style.display = 'none';
}

// Close error popup when clicking X
closeErrorPopup.addEventListener('click', hideError);

// Close error popup when clicking outside
errorPopup.addEventListener('click', function(e) {
    if (e.target === errorPopup) {
        hideError();
    }
});


