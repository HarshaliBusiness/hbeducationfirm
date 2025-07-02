const central_object = {
    mainCaste: '',
    casteColumn: '',
    specialReservation: '',
    branchCategories: [],
    final_college_list : [],
    formData : {}
};

let selectedBranches = [];

// DOM elements
const casteSelect = document.getElementById('caste');
const tfwsContainer = document.getElementById('tfwsContainer');
const tfwsCheckbox = document.getElementById('tfws');
const collegeForm = document.getElementById('collegeForm');
const resultsContainer = document.getElementById('resultsContainer');
const collegeCardsContainer = document.getElementById('collegeCards');
const selectedCountElement = document.getElementById('selectedCount');
const regionCheckboxGroup = document.getElementById('regionCheckboxGroup');
const homeuniversitySelect = document.getElementById('homeUniversity');
const selectedBranchesContainer = document.getElementById('selectedBranchesContainer');
const branchSelectionGroup = document.getElementById('branchSelectionGroup');
const otherBranchCheckbox = document.getElementById('otherBranchCheckbox');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const overlay = document.querySelector('.overlay');

// Initialize
updateSelectedCount(0);

collegeForm.addEventListener('submit', handleFormSubmit);
regionCheckboxGroup.addEventListener('change', handleRegionCheckboxChange);
// mobileMenuBtn.addEventListener('click', toggleMobileMenu);
closeMenuBtn.addEventListener('click', toggleMobileMenu);
overlay.addEventListener('click', toggleMobileMenu);
document.getElementById('downloadPdfBtn').addEventListener('click', printPdf);

document.getElementById('back_to_pcb').addEventListener('click',()=>{
    window.location.href = '/pcb';
});

// Initialize the application
document.addEventListener("DOMContentLoaded", initilise);

async function initilise() {
    document.getElementById('generate_college_list').style.display = 'block';
    await fetchCity();
    await fetchUniversity();
    initBranchSelection();
}

// Mobile Menu Functions
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Branch Category Checkbox Functions
function initBranchSelection() {
    const checkboxes = document.querySelectorAll('.branch-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleBranchCategoryChange(this);
        });
    });
    
    // Initialize with "All" selected
    const allCheckbox = document.querySelector('.branch-checkbox[data-all="true"]');
    allCheckbox.checked = true;
    central_object.branchCategories = ['All'];
}

function handleBranchCategoryChange(checkbox) {
    if (checkbox.dataset.all === 'true') {
        // "All" was checked
        if (checkbox.checked) {
            // Uncheck all other checkboxes
            document.querySelectorAll('.branch-checkbox:not([data-all="true"])').forEach(cb => {
                cb.checked = false;
            });
            branchSelectionGroup.classList.add('hidden');
            central_object.branchCategories = ['All'];
        }
    } else {
        // Other checkbox was changed
        if (checkbox.checked) {
            // Uncheck "All" if it was checked
            const allCheckbox = document.querySelector('.branch-checkbox[data-all="true"]');
            allCheckbox.checked = false;
            central_object.branchCategories = central_object.branchCategories.filter(cat => cat !== 'All');
            
            // Show branch selection if "Other" was checked
            if (checkbox === otherBranchCheckbox) {
                branchSelectionGroup.classList.remove('hidden');
            }
        } else {
            // If "Other" was unchecked, hide the branch selection
            if (checkbox === otherBranchCheckbox) {
                branchSelectionGroup.classList.add('hidden');
            }
        }
        
        // Update the central_object.branchCategories
        updateSelectedBranchCategories();
        
        // If no checkboxes are selected, check "All"
        if (central_object.branchCategories.length === 0) {
            const allCheckbox = document.querySelector('.branch-checkbox[data-all="true"]');
            allCheckbox.checked = true;
            central_object.branchCategories = ['All'];
            branchSelectionGroup.classList.add('hidden');
        }
    }
}

function updateSelectedBranchCategories() {
    central_object.branchCategories = [];
    document.querySelectorAll('.branch-checkbox:checked').forEach(checkbox => {
        central_object.branchCategories.push(checkbox.value);
    });
}


function updateSelectedBranchesDisplay() {
    selectedBranchesContainer.innerHTML = '';
    
    selectedBranches.forEach(branchValue => {
        // const branchText = branchSelect.querySelector(`option[value="${branchValue}"]`)?.text || branchValue;
        
        const tag = document.createElement('div');
        tag.className = 'branch-tag';
        tag.innerHTML = `
            ${branchText}
            <button type="button" data-value="${branchValue}">&times;</button>
        `;
        
        tag.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            removeBranch(branchValue);
        });
        
        selectedBranchesContainer.appendChild(tag);
    });
}


function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get all checked region checkboxes
    const regionCheckboxes = document.querySelectorAll('input[name="region"]:checked');
    const regions = Array.from(regionCheckboxes).map(cb => cb.value);
    
    central_object.specialReservation = document.getElementById('specialReservation').value;
    
    // If "All Regions" is selected, ignore other selections
    const finalRegions = regions.includes("All") ? ["All"] : regions;
    
    const formData = {
        generalRank: parseInt(document.getElementById('generalRank').value),
        caste: casteSelect.value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        branchCategories: central_object.branchCategories,
        city: finalRegions,
        homeuniversity: homeuniversitySelect.value
    };

    // console.log(formData);
    central_object.formData = formData;

    // Validate rank is positive integer
    if (isNaN(formData.generalRank)) {
        alert('Please enter a valid rank number');
        return;
    }

    generateCollegeList(formData);
}

function handleRegionCheckboxChange(e) {
    if (e.target.value === "All" && e.target.checked) {
        const otherCheckboxes = document.querySelectorAll('input[name="region"]:not([value="All"])');
        otherCheckboxes.forEach(cb => cb.checked = false);
    } else if (e.target.value !== "All" && e.target.checked) {
        const allCheckbox = document.querySelector('input[name="region"][value="All"]');
        allCheckbox.checked = false;
    }
}

async function fetchCity() {
    try {
        const response = await fetch('/prefernceListPCB/fetchcity');
        const data = await response.json();

        regionCheckboxGroup.innerHTML = `
            <label class="checkbox-label">
                <input type="checkbox" name="region" value="All" checked>
                <span>All Regions</span>
            </label>
        `;

        data.forEach(element => {
            const child = document.createElement('label');
            child.classList.add('checkbox-label');

            child.innerHTML = `
                <input type="checkbox" name="region" value="${element.city}">
                <span>${element.city}</span>
            `;

            regionCheckboxGroup.appendChild(child);
        });
    } catch (error) {
        console.log(error);
    }
}

async function fetchUniversity() {
    try {
        const response = await fetch('/prefernceListPCB/fetchUniversity');
        const data = await response.json();

        homeuniversitySelect.innerHTML = `<option value="" disabled selected>Select your home university</option>`;

        data.forEach(element => {
            const option = document.createElement('option');
            option.value = `${element.university}`;
            option.innerHTML = `${element.university}`;
            homeuniversitySelect.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}


// Add these DOM elements at the top with your other DOM elements
const paymentSuccessModal = document.getElementById('paymentSuccessModal');
const paymentErrorModal = document.getElementById('paymentErrorModal');
const errorMessage = document.getElementById('errorMessage');
const continueAfterPayment = document.getElementById('continueAfterPayment');
const retryPayment = document.getElementById('retryPayment');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Add event listeners for modal close buttons
closeModalButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    paymentSuccessModal.style.display = 'none';
    paymentErrorModal.style.display = 'none';
  });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === paymentSuccessModal) {
    paymentSuccessModal.style.display = 'none';
  }
  if (e.target === paymentErrorModal) {
    paymentErrorModal.style.display = 'none';
  }
});

// Updated generateCollegeList function
async function generateCollegeList(formData) {
    try {
        collegeCardsContainer.innerHTML = '';
        
        // Handle special reservation case
        if (central_object.specialReservation != 'No') {
            document.getElementById('downloadPdfBtn').style.display = 'none';
            let exam_type = 'Pharmacy';
            let special_reservation = central_object.specialReservation;
            
            const response = await fetch('/prefernceListPCB/specialReservationMsg', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({formData, special_reservation, exam_type})
            });

            const data = await response.json();
            
            collegeCardsContainer.innerHTML = `
                <div class="contact-message">
                    <h3>Thank you for your application!</h3>
                    <p>${data.isSave ? 
                        'Our team will contact you within 24 hours regarding your special reservation.' : 
                        'Internal server error.'}</p>
                </div>
            `;
            resultsContainer.style.display = 'block';
            return;
        }

        // Handle payment flow
        const paymentResponse = await fetch('/payment');
        const paymentData = await paymentResponse.json();
        
        if(!paymentData.isOk) {
            showErrorModal(paymentData.msg || 'Failed to initialize payment');
            return;
        }

        // If no payment needed (promo code case)
        if(paymentData.order === '') {
            showSuccessCodeModal();
            await processCollegeList(formData);
            return;
        }

        // Store formData for retry functionality
        let currentFormData = formData;
        
        // Setup payment handler
        const handlePayment = async () => {
            const paymentPromise = new Promise((resolve, reject) => {
                const options = {
                    key: "rzp_test_MrwlI2gihncL5U",
                    amount: paymentData.order.amount,
                    currency: paymentData.order.currency,
                    name: "HB Educational Firm",
                    description: "Basic Plan",
                    order_id: paymentData.order.id,
                    handler: async function(response) {
                        try {
                            const verifyRes = await fetch("/payment/verify-payment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(response)
                            });

                            const verifyData = await verifyRes.json();
                            if(verifyData.isOk) {
                                showSuccessModal();
                                resolve(true);
                            } else {
                                throw new Error(verifyData.msg || 'Payment verification failed');
                            }
                        } catch (error) {
                            reject(error);
                        }
                    },
                    prefill: {
                        name: "Test User",
                        email: "test@example.com",
                        contact: "9876543210"
                    },
                    theme: { color: "#3399cc" },
                    modal: {
                        ondismiss: function() {
                            reject(new Error('Payment window closed'));
                        }
                    }
                };

                const rzp = new Razorpay(options);
                rzp.open();
            });

            try {
                await paymentPromise;
                await processCollegeList(currentFormData);
            } catch (error) {
                showErrorModal(error.message);
            }
        };

        // Start payment process
        await handlePayment();

        // Retry payment button handler
        retryPayment.onclick = () => {
            paymentErrorModal.style.display = 'none';
            handlePayment();
        };

        // Continue button handler (in case they close success modal early)
        continueAfterPayment.onclick = () => {
            paymentSuccessModal.style.display = 'none';
        };

        await processCollegeList(formData);

    } catch (error) {
        console.error('Error:', error);
        showErrorModal(error.message || 'An error occurred during payment processing');
    }
}

// Helper functions for showing modals
function showSuccessModal() {
    document.getElementById('show_Success_Modal_h3').textContent = 'Payment Successful!';
    document.getElementById('show_Success_Modal_p').textContent = 'Your payment has been processed successfully. Please wait a few seconds.';
    document.getElementById('continueAfterPayment').style.display = 'block';
    paymentSuccessModal.style.display = 'block';
}

function showSuccessCodeModal() {
    document.getElementById('show_Success_Modal_h3').textContent = 'Code used..';
    document.getElementById('show_Success_Modal_p').textContent = 'Please wait a few seconds.';
    document.getElementById('continueAfterPayment').style.display = 'none';
    paymentSuccessModal.style.display = 'block';
}


function showErrorModal(message) {
    errorMessage.textContent = message;
    paymentErrorModal.style.display = 'block';
}


async function processCollegeList(formData) {
    try {
        const response = await fetch('/prefernceListPCB/College_list', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        // Get student name
        const nameResponse = await fetch('/prefernceListPCB/student_name');
        const nameData = await nameResponse.json();
        central_object.name = nameData.name;

        // Process results
        central_object.final_college_list = data;
        generatePdfList();
        await savepdfintodatabase();
        displayColleges(data, formData);
        document.getElementById('generate_college_list').style.display = 'none';
    } catch (error) {
        console.error('Error processing college list:', error);
        throw error;
    }
}


function displayColleges(colleges, formData) {
    collegeCardsContainer.innerHTML = '';
    document.getElementById('downloadPdfBtn').style.display = 'block';
    // Original college list display logic
    if (!colleges || colleges.length === 0) {
        collegeCardsContainer.innerHTML = '<p>No colleges found matching your criteria.</p>';
        resultsContainer.style.display = 'block';
        return;
    }

    let count = 1;
    colleges.forEach(college => {
        if(formData.tfws){
            const card_tfws = createCollegeCard(college, formData, count,true);
            count++;
            collegeCardsContainer.appendChild(card_tfws);
        }
        const card = createCollegeCard(college, formData, count,false);
        count++;
        collegeCardsContainer.appendChild(card);
    });
    
    resultsContainer.style.display = 'block';
    updateSelectedCount(colleges.length);
}

function createCollegeCard(college, formData, count, tfws) {
    
    const card = document.createElement('div');
    card.className = 'college-card selected';
    card.dataset.code = college.choice_code;
    let college_code = college.choice_code;
    if(tfws){
        college_code = `${college_code}T`;
    }

    let card_content = `
        <div class="college-card-header">
            <div class="college-code">${count}</div>
            <div class="college-code">${college_code}</div>
            <div class="college-code">Seat type: ${college.seat_type}</div>
            
        </div>
        <div class="college-name">${college.college_name}</div>
        <div>University: ${college.university}</div>
        <div>${college.branch_name}</div>
        <div class="college-details">
            <div class="college-detail">
                <div class="college-detail-label">GOPEN</div>
                <div>${college.gopen}</div>
            </div>
    `;
    
    
    if (formData.gender == 'Female') {
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">LOPEN</div>
                <div>${college.lopen}</div>
            </div>
        `;
        
        if (formData.caste != 'OPEN' && formData.caste != 'EWS') {
            let caste_column = `L${formData.caste}`;
            card_content += `
            <div class="college-detail">
                <div class="college-detail-label">${caste_column}</div>
                <div>${college[caste_column.toLowerCase()]}</div>
            </div>
            `;
        }
    } else {
        if (formData.caste != 'OPEN' && formData.caste != 'EWS') {
            let caste_column = `G${formData.caste}`;
            card_content += `
            <div class="college-detail">
                <div class="college-detail-label">${caste_column}</div>
                <div>${college[caste_column.toLowerCase()]}</div>
            </div>
            `;
        }
    }

    if(formData.caste == 'EWS'){
        card_content = card_content + `
            <div class="college-detail">
                <div class="college-detail-label">EWS</div>
                <div>${college.ews}</div>
            </div>
        `;
    }

    if (formData.tfws) {
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">TFWS</div>
                <div>${college.tfws}</div>
            </div>
        `;
    }

    card.innerHTML = card_content + `</div>`;

    return card;
}

function updateSelectedCount(count) {
    if (typeof count === 'number') {
        selectedCountElement.textContent = `${count} selected`;
    } else {
        const selectedCount = document.querySelectorAll('.college-card.selected').length;
        selectedCountElement.textContent = `${selectedCount} selected`;
    }
}

function generatePdfList() {
    

    const pdfTableBody = document.getElementById('pdfTableBody');
    pdfTableBody.innerHTML = '';
    let index = 1;
    central_object.final_college_list.forEach((college) => {

        if(central_object.formData.tfws){
            const row_1 = document.createElement('tr');
            row_1.innerHTML = `
                <td>${index}</td>
                <td>${college.choice_code}T</td>
                <td>${college.college_name}</td>
                <td>${college.branch_name}</td>
                <td>${college.university}</td>
                <td>${college.seat_type}</td>
            `;
            index++;
            pdfTableBody.appendChild(row_1);
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index}</td>
            <td>${college.choice_code}</td>
            <td>${college.college_name}</td>
            <td>${college.branch_name}</td>
            <td>${college.university}</td>
            <td>${college.seat_type}</td>
        `;
        index++;
        pdfTableBody.appendChild(row);
        
        
    });
    
}

async function savepdfintodatabase() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Add student info
        doc.setFontSize(16);
        doc.text('Student Information', 14, 20);
        doc.setFontSize(12);
        doc.text(`Name: ${central_object.name}`, 14, 30);
        doc.text(`General Rank: ${central_object.formData.generalRank}`, 14, 36);

        doc.text(`Gender: ${central_object.formData.gender}`, 14, 42);
        doc.text(`Home University: ${central_object.formData.homeuniversity}`, 14, 48);
        doc.text(`Caste: ${central_object.formData.caste}`, 14, 54);

        // Add table
        const table = document.getElementById('pdfTable');
        const rows = [];
        
        // Get table headers
        const headers = [];
        table.querySelectorAll('th').forEach(th => {
            headers.push(th.textContent);
        });
        
        // Get table rows
        table.querySelectorAll('tr').forEach(tr => {
            const row = [];
            tr.querySelectorAll('td').forEach(td => {
                row.push(td.textContent);
            });
            if (row.length) rows.push(row);
        });

        // Add table to PDF
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 70,
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            margin: { left: 14 }
        });

        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('pdf', pdfBlob, 'preference_list.pdf');
        formData.append('name',JSON.stringify(central_object.name));
        formData.append('exam',JSON.stringify('Pharmacy'));
        // console.log(formData);
        // 4. Send to backend for storage
        const response = await fetch('/prefernceListPCB/savePdf', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            return;
        } else {
            throw new Error('Failed to store PDF');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error saving PDF: ' + error.message);
    }
}

// Helper function to convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function printPdf(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    
    // Add student info
    doc.setFontSize(20);
    doc.text('HB Educational Firm', 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${central_object.name}`, 14, 30);
    doc.text(`General Rank: ${central_object.formData.generalRank}`, 14, 36);
    doc.text(`Gender: ${central_object.formData.gender}`, 14, 42);
    doc.text(`Home University: ${central_object.formData.homeuniversity}`, 14, 48);
    doc.text(`Caste: ${central_object.formData.caste}`, 14, 54);
    // Add table
    const table = document.getElementById('pdfTable');
    const rows = [];
    
    // Get table headers
    const headers = [];
    table.querySelectorAll('th').forEach(th => {
        headers.push(th.textContent);
    });
    
    // Get table rows
    table.querySelectorAll('tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push(td.textContent);
        });
        if (row.length) rows.push(row);
    });

    // Add table to PDF
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 70,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        margin: { left: 14 }
    });

    doc.save('MHT_CET_Pharmacy_Preference_List.pdf');
}


