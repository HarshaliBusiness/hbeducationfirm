// Dummy data for students
const students = [];

// Dummy data for purchases
const purchases = [];

// Dummy data for promo codes
let promoCodes = [];

// Dummy data for assigned promos
let assignedPromos = [];

// Dummy data for special reservations
let specialReservations = [];

// Dummy data for contact forms
let contactForms = [];

// Dummy data for preference lists
let preferenceLists = [];

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
    assigned_promos: document.getElementById('assigned-promos-section'),
    special_reservations: document.getElementById('special-reservations-section'),
    contact_forms: document.getElementById('contact-forms-section'),
    preference_list: document.getElementById('preference-list-section')
};

// Modal elements
const assignPromoModal = document.getElementById('assign-promo-modal');
const paymentModal = document.getElementById('payment-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const studentSearchInput = document.getElementById('student-search-input');
const studentSearchResults = document.getElementById('student-search-results');
const assignPromoBtn = document.getElementById('assign-promo-btn');
const paymentScreenshotImg = document.getElementById('payment-screenshot-img');
let currentPromoCode = '';

// Login functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    // Static login credentials
    if ((phone === '8999741641' && password === '123456') || (phone === '9970303771' && password === '123456') ) {
        loginPage.style.display = 'none';
        adminPanel.style.display = 'block';
        showSection('dashboard');
        populateStudentTable();
        populatePurchaseTable();
        populatePromoCodes();
        populateAssignedPromos();
        populateSpecialReservations();
        populateContactForms();
        populatePreferenceLists();
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

// Populate special reservations
function populateSpecialReservations(searchQuery = '') {
    const container = document.getElementById('reservation-cards-container');
    container.innerHTML = '';
    
    let filteredReservations = specialReservations;
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredReservations = filteredReservations.filter(reservation => 
            reservation.name.toLowerCase().includes(query) || 
            reservation.phone.includes(query) ||
            reservation.promoCode.toLowerCase().includes(query) ||
            reservation.email.toLowerCase().includes(query)
        );
    }
    
    filteredReservations.forEach(reservation => {
        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.innerHTML = `
            <div class="reservation-card-header">
                <div class="reservation-card-title">${reservation.name} (${reservation.phone})</div>

                <button class="reservation-card-delete" data-id="${reservation.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="reservation-card-details">
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Exam</span>
                    <span class="reservation-card-value">${reservation.examType}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Email</span>
                    <span class="reservation-card-value">${reservation.email}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Promo Code</span>
                    <span class="reservation-card-value">${reservation.promoCode}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Payment</span>
                    <span class="reservation-card-value">${reservation.payment}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">General Rank</span>
                    <span class="reservation-card-value">${reservation.generalRank}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">All India Rank</span>
                    <span class="reservation-card-value">${reservation.allIndiaRank}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Caste</span>
                    <span class="reservation-card-value">${reservation.caste}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Gender</span>
                    <span class="reservation-card-value">${reservation.gender}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">TFWS</span>
                    <span class="reservation-card-value">${reservation.tfws ? 'Yes' : 'No'}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Branch Categories</span>
                    <span class="reservation-card-value">${reservation.branchCategories.join(', ')}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Cities</span>
                    <span class="reservation-card-value">${reservation.cities.join(', ')}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Home University</span>
                    <span class="reservation-card-value">${reservation.homeUniversity}</span>
                </div>
                <div class="reservation-card-detail">
                    <span class="reservation-card-label">Special Reservation</span>
                    <span class="reservation-card-value">${reservation.specialReservation}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.reservation-card-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const reservationId = this.getAttribute('data-id');
            deleteReservation(reservationId);
        });
    });
}

// Populate contact forms
function populateContactForms(searchQuery = '') {
    const container = document.getElementById('contact-form-cards-container');
    container.innerHTML = '';
    
    let filteredContactForms = contactForms;
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredContactForms = filteredContactForms.filter(form => 
            form.name.toLowerCase().includes(query) || 
            form.phone.includes(query) ||
            form.email.toLowerCase().includes(query) ||
            form.message.toLowerCase().includes(query)
        );
    }
    
    filteredContactForms.forEach(form => {
        const card = document.createElement('div');
        card.className = 'contact-form-card';
        card.innerHTML = `
            <div class="contact-form-card-header">
                <div class="contact-form-card-title">${form.name} (${form.phone})</div>
                <button class="contact-form-card-delete" data-id="${form.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="contact-form-card-details">
                <div class="contact-form-card-detail">
                    <span class="contact-form-card-label">Email</span>
                    <span class="contact-form-card-value">${form.email}</span>
                </div>
                <div class="contact-form-card-detail">
                    <span class="contact-form-card-label">Message</span>
                    <span class="contact-form-card-value">${form.message}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.contact-form-card-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const formId = this.getAttribute('data-id');
            deleteContactForm(formId);
        });
    });
}

// Populate preference lists
function populatePreferenceLists(examType = '', status = '', searchQuery = '') {
    const container = document.getElementById('preference-list-container');
    container.innerHTML = '';
    
    let filteredPreferenceLists = preferenceLists;
    
    if (examType) {
        filteredPreferenceLists = filteredPreferenceLists.filter(list => list.examType === examType);
    }
    
    if (status) {
        if (status === 'pending') {
            filteredPreferenceLists = filteredPreferenceLists.filter(list => !list.isCheck);
        } else if (status === 'checked') {
            filteredPreferenceLists = filteredPreferenceLists.filter(list => list.isCheck && !list.isAccept);
        } else if (status === 'accepted') {
            filteredPreferenceLists = filteredPreferenceLists.filter(list => list.isAccept);
        }
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPreferenceLists = filteredPreferenceLists.filter(list => 
            list.name.toLowerCase().includes(query) || 
            list.whatsappNumber.includes(query) ||
            list.registerPhone.includes(query) ||
            list.transactionId.toLowerCase().includes(query)
        );
    }
    
    filteredPreferenceLists.forEach(list => {
        const card = document.createElement('div');
        card.className = 'preference-card';
        card.innerHTML = `
            <div class="preference-card-header">
                <div class="preference-card-title">${list.name} (${list.registerPhone})</div>
                <div class="preference-status">
                    ${list.isAccept ? '<span class="status-badge accepted">Accepted</span>' : 
                     list.isCheck ? '<span class="status-badge checked">Checked</span>' : 
                     '<span class="status-badge pending">Pending</span>'}
                </div>
            </div>
            <div class="preference-card-details">
                <div class="preference-card-detail">
                    <span class="preference-card-label">Exam Type</span>
                    <span class="preference-card-value">${list.examType}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">whatsapp Number</span>
                    <span class="preference-card-value">${list.whatsappNumber}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">General Rank</span>
                    <span class="preference-card-value">${list.generalRank}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">All India Rank</span>
                    <span class="preference-card-value">${list.allIndiaRank}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Caste</span>
                    <span class="preference-card-value">${list.caste}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Gender</span>
                    <span class="preference-card-value">${list.gender}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Home University</span>
                    <span class="preference-card-value">${list.homeUniversity}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">TFWS</span>
                    <span class="preference-card-value">${list.tfws ? 'Yes' : 'No'}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Branch Categories</span>
                    <span class="preference-card-value">${list.branchCategories.join(', ')}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Cities</span>
                    <span class="preference-card-value">${list.cities.join(', ')}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Selected Branches</span>
                    <span class="preference-card-value">${list.selectedBranches.join(', ')}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Transaction ID</span>
                    <span class="preference-card-value">${list.transactionId}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Payment Plan</span>
                    <span class="preference-card-value">${list.paymentPlan}</span>
                </div>
                <div class="preference-card-detail">
                    <span class="preference-card-label">Submitted At</span>
                    <span class="preference-card-value">${formatDateTime(list.createdAt)}</span>
                </div>
            </div>
            <div class="preference-card-actions">
                <button class="view-payment-btn" data-id="${list._id}">
                    <i class="fas fa-image"></i> View Payment
                </button>
                <button class="check-btn" data-id="${list._id}" ${list.isCheck ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Check
                </button>
                <button class="accept-btn" data-id="${list._id}" ${list.isAccept || !list.isCheck ? 'disabled' : ''}>
                    <i class="fas fa-check-double"></i> Accept
                </button>
                <button class="download-pdf-btn" data-id="${list.pdfID}">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Add event listeners for buttons
    document.querySelectorAll('.view-payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            viewPaymentScreenshot(listId);
        });
    });
    
    document.querySelectorAll('.check-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            updatePreferenceListStatus(listId, 'check');
        });
    });
    
    document.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            updatePreferenceListStatus(listId, 'accept');
        });
    });
    
    document.querySelectorAll('.download-pdf-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listId = this.getAttribute('data-id');
            
            downloadPreferenceListPDF(listId);
        });
    });
}

// Format date to dd/mm/yyyy and time to hh:mm am/pm
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

// View payment screenshot
function viewPaymentScreenshot(listId) {
    const list = preferenceLists.find(item => item._id === listId);
    if (list && list.paymentScreenshot) {
        // Convert buffer data to base64
        const base64String = arrayBufferToBase64(list.paymentScreenshot.data);
        paymentScreenshotImg.src = `data:${list.paymentScreenshot.contentType};base64,${base64String}`;
        paymentModal.style.display = 'flex';
    } else {
        showError('Payment screenshot not available');
    }
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Update preference list status
async function updatePreferenceListStatus(listId, action) {
    try {
        const response = await fetch(`/adminPanel/updatePreferenceList/${listId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update local data
            const listIndex = preferenceLists.findIndex(item => item._id === listId);
            if (listIndex !== -1) {
                if (action === 'check') {
                    preferenceLists[listIndex].isCheck = true;
                } else if (action === 'accept') {
                    preferenceLists[listIndex].isAccept = true;
                }
            }
            
            // Refresh the list
            const examType = document.getElementById('preference-exam-filter').value;
            const status = document.getElementById('preference-status-filter').value;
            const searchQuery = document.getElementById('preference-search').value;
            populatePreferenceLists(examType, status, searchQuery);
        } else {
            showError(data.message || 'Failed to update preference list');
        }
    } catch (error) {
        console.error('Error updating preference list:', error);
        showError('Error updating preference list');
    }
}

// Download preference list PDF
async function downloadPreferenceListPDF(pdf_id) {


    fetch(`/adminPanel/downloadPreferencePDF/${pdf_id}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pdf_id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error downloading PDF:", error);
        });


    // console.log(pdf_id);
    // try {
    //     const response = await fetch(`/adminPanel/downloadPreferencePDF/${pdf_id}`);
    //     const data = await response.json();

    //     console.log(data);
    //     if (response.isok) {
    //         const blob = data.data.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = `preference_list_${listId}.pdf`;
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //         window.URL.revokeObjectURL(url);
    //     } else {
    //         const data = await response.json();
    //         showError(data.message || 'Failed to download PDF');
    //     }
    // } catch (error) {
    //     console.error('Error downloading PDF:', error);
    //     showError('Error downloading PDF');
    // }
}

// Delete reservation
async function deleteReservation(Id) {
    try {
        // In a real app, you would make an API call here to delete the reservation
        const response = await fetch(`/adminPanel/deleteReservation/${Id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
           
            specialReservations = specialReservations.filter(r => r.id !== Id);
            populateSpecialReservations();
            document.getElementById('totalReservations').textContent = specialReservations.length;
        } else {
            showError(data.message || 'Failed to delete reservation');
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
        showError('Error deleting reservation');
    }
}

// Delete contact form
async function deleteContactForm(Id) {
    try {
        // In a real app, you would make an API call here to delete the contact form
        const response = await fetch(`/adminPanel/deleteContactForm/${Id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            contactForms = contactForms.filter(form => form.id !== Id);
            populateContactForms();
            document.getElementById('totalContactForms').textContent = contactForms.length;
        } else {
            showError(data.message || 'Failed to delete contact form');
        }
    } catch (error) {
        console.error('Error deleting contact form:', error);
        showError('Error deleting contact form');
    }
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
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        assignPromoModal.style.display = 'none';
        paymentModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === assignPromoModal) {
        assignPromoModal.style.display = 'none';
    }
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
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

// Assign promo code to student
assignPromoBtn.addEventListener('click',async function() {
    try {
        
        const selectedStudent = document.querySelector('.student-result.selected');
        
        if (!selectedStudent) {
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
            showError('Already assigned.');
            return;
        }
        
        // Find the promo to get its limit
        const promo = promoCodes.find(p => p.code === currentPromoCode);
        if (!promo) {
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

// Search reservations
document.getElementById('reservation-search').addEventListener('input', function() {
    const searchQuery = this.value;
    populateSpecialReservations(searchQuery);
});

// Search contact forms
document.getElementById('contact-form-search').addEventListener('input', function() {
    const searchQuery = this.value;
    populateContactForms(searchQuery);
});

// Filter preference lists by exam type
document.getElementById('preference-exam-filter').addEventListener('change', function() {
    const examType = this.value;
    const status = document.getElementById('preference-status-filter').value;
    const searchQuery = document.getElementById('preference-search').value;
    populatePreferenceLists(examType, status, searchQuery);
});

// Filter preference lists by status
document.getElementById('preference-status-filter').addEventListener('change', function() {
    const examType = document.getElementById('preference-exam-filter').value;
    const status = this.value;
    const searchQuery = document.getElementById('preference-search').value;
    populatePreferenceLists(examType, status, searchQuery);
});

// Search preference lists
document.getElementById('preference-search').addEventListener('input', function() {
    const examType = document.getElementById('preference-exam-filter').value;
    const status = document.getElementById('preference-status-filter').value;
    const searchQuery = this.value;
    populatePreferenceLists(examType, status, searchQuery);
});

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    await student_info();
    await student_purchases();
    await fetchPromoCodes();
    await fetchSpecialReservations();
    await fetchContactForms();
    await fetchPreferenceLists();
    
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
            <li><a href="#" data-section="special-reservations"><i class="fas fa-star"></i> Special Reservations</a></li>
            <li><a href="#" data-section="contact-forms"><i class="fas fa-envelope"></i> Contact Forms</a></li>
            <li><a href="#" data-section="preference-list"><i class="fas fa-list-check"></i> Preference List</a></li>
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
    document.getElementById('totalReservations').textContent = specialReservations.length;
    document.getElementById('totalContactForms').textContent = contactForms.length;
    document.getElementById('totalPreferenceLists').textContent = preferenceLists.length;
    populateStudentTable();
    populatePurchaseTable();
    populatePromoCodes();
    populateAssignedPromos();
    populateSpecialReservations();
    populateContactForms();
    populatePreferenceLists();
});

// Load student info from API
async function student_info() {
    try {
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

async function student_purchases() {
    try {
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

// Fetch special reservations from API
async function fetchSpecialReservations() {
    try {
        const response = await fetch('/adminPanel/specialReservations');
        const data = await response.json();
        // console.log(data);
        // console.log(data[0].extra_info);

        // Assuming the API returns an array of reservation objects
        data.forEach(reservation => {
            let name = reservation.extra_info[0].first_name + ' ' + reservation.extra_info[0].last_name;
            // console.log();
            specialReservations.push({
                id: reservation._id,
                examType: reservation.examType,
                name: name,
                phone: reservation.phone_number,
                email: reservation.extra_info[0].email,
                promoCode: reservation.code,
                payment: reservation.payment,
                generalRank: reservation.generalRank,
                allIndiaRank: reservation.allIndiaRank,
                caste: reservation.caste,
                gender: reservation.gender,
                tfws: reservation.tfws,
                branchCategories: reservation.branchCategories,
                cities: reservation.city,
                homeUniversity: reservation.homeuniversity,
                specialReservation: reservation.specialReservation
            });
        });

    } catch (error) {
        console.error('Error fetching special reservations:', error);
    }
}

// Fetch contact forms from API
async function fetchContactForms() {
    try {
        const response = await fetch('/adminPanel/contactUsForms');
        const data = await response.json();
        
        
        // Assuming the API returns an array of contact form objects
        data.forEach(form => {
            // console.log(form);
            contactForms.push({
                id: form._id,
                name: form.name,
                phone: form.phone,
                email: form.email,
                message: form.message
            });
        });

    } catch (error) {
        console.error('Error fetching contact forms:', error);
    }
}

// Fetch preference lists from API
async function fetchPreferenceLists() {
    try {
        const response = await fetch('/adminPanel/preferenceLists');
        const data = await response.json();
        
        // Assuming the API returns an array of preference list objects
        data.forEach(list => {
            preferenceLists.push({
                _id: list._id,
                pdfID: list.pdf_id,
                name: list.name,
                isCheck: list.isCheck,
                examType: list.examType,
                isAccept: list.isAccept,
                whatsappNumber: list.whatsappNumber,
                registerPhone: list.registerPhone,
                generalRank: list.generalRank,
                allIndiaRank: list.allIndiaRank,
                caste: list.caste,
                gender: list.gender,
                homeUniversity: list.homeUniversity,
                tfws: list.tfws,
                branchCategories: list.branchCategories,
                cities: list.cities,
                selectedBranches: list.selectedBranches,
                paymentScreenshot: list.paymentScreenshot,
                transactionId: list.transactionId,
                createdAt: list.createdAt,
                paymentPlan: list.paymentPlan
            });
        });

    } catch (error) {
        console.error('Error fetching preference lists:', error);
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