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
const customBranchBtn = document.getElementById('customBranchBtn');
const branchSelect = document.getElementById('branch');
const selectedBranchesContainer = document.getElementById('selectedBranchesContainer');
const branchSelectionGroup = document.getElementById('branchSelectionGroup');
const otherBranchCheckbox = document.getElementById('otherBranchCheckbox');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const overlay = document.querySelector('.overlay');

// Initialize
updateSelectedCount(0);

// Event Listeners
casteSelect.addEventListener('change', handleCasteChange);
collegeForm.addEventListener('submit', handleFormSubmit);
regionCheckboxGroup.addEventListener('change', handleRegionCheckboxChange);
customBranchBtn.addEventListener('click', toggleBranchSelection);
branchSelect.addEventListener('change', handleBranchSelection);
// mobileMenuBtn.addEventListener('click', toggleMobileMenu);
closeMenuBtn.addEventListener('click', toggleMobileMenu);
overlay.addEventListener('click', toggleMobileMenu);
document.getElementById('downloadPdfBtn').addEventListener('click', printPdf);

document.getElementById('back_to_pcm').addEventListener('click',()=>{
    window.location.href = '/pcm';
});

// Initialize the application
document.addEventListener("DOMContentLoaded", initilise);

async function initilise() {
    document.getElementById('generate_college_list').style.display = 'block';
    await fetchBranches();
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

// Branch Selection Functions
function toggleBranchSelection() {
    customBranchBtn.style.display = 'none';
    branchSelect.classList.remove('hidden');
    branchSelect.focus();
}

function handleBranchSelection() {
    if (this.value && !selectedBranches.includes(this.value)) {
        selectedBranches.push(this.value);
        updateSelectedBranchesDisplay();
        
        // Remove selected option from dropdown
        this.querySelector(`option[value="${this.value}"]`).remove();
        
        // Reset dropdown but keep it visible
        this.value = '';
    }
}

function updateSelectedBranchesDisplay() {
    selectedBranchesContainer.innerHTML = '';
    
    selectedBranches.forEach(branchValue => {
        const branchText = branchSelect.querySelector(`option[value="${branchValue}"]`)?.text || branchValue;
        
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

function removeBranch(branchValue) {
    selectedBranches = selectedBranches.filter(b => b !== branchValue);
    
    // Add the option back to the dropdown
    const optionText = [...branchSelect.options].find(opt => opt.value === branchValue)?.text || branchValue;
    if (optionText) {
        const option = new Option(optionText, branchValue);
        branchSelect.appendChild(option);
    }
    
    updateSelectedBranchesDisplay();
}

// Form Handling Functions
function handleCasteChange() {
    if (this.value === 'OPEN' || this.value === 'OBC' || this.value === 'SEBC') {
        tfwsContainer.style.display = 'block';
    } else {
        tfwsContainer.style.display = 'none';
        tfwsCheckbox.checked = false;
    }
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
        allIndiaRank : parseInt(document.getElementById('allIndiaRank').value),
        caste: casteSelect.value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        tfws: tfwsCheckbox.checked,
        branchCategories: central_object.branchCategories,
        city: finalRegions,
        selected_branches: selectedBranches,
        homeuniversity: homeuniversitySelect.value
    };

    central_object.formData = formData;

    // Validate rank is positive integer
    if (isNaN(formData.generalRank)) {
        alert('Please enter a valid rank number');
        return;
    }

    if (isNaN(formData.allIndiaRank)) {
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

// Data Fetching Functions
async function fetchBranches() {
    try {
        const response = await fetch('/prefernceListPCM/fetchBranches');
        let data = await response.json();

        branchSelect.innerHTML = '<option value="" disabled selected>Select branches</option>';

        data = data.reduce((acc, curr) => {
            if (!acc.some(item => item.branch_name === curr.branch_name)) {
                acc.push(curr);
            }
            return acc;
        }, []);

        data.forEach(element => {
            const option = document.createElement('option');
            option.value = `${element.branch_name}`;
            option.innerHTML = `${element.branch_name}`;
            branchSelect.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function fetchCity() {
    try {
        const response = await fetch('/prefernceListPCM/fetchcity');
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
        const response = await fetch('/prefernceListPCM/fetchUniversity');
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
            let exam_type = 'Engineering';
            let special_reservation = central_object.specialReservation;
            
            const response = await fetch('/prefernceListPCM/specialReservationMsg', {
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
        if(paymentData.order === 'code') {
            showSuccessCodeModal();
            await processCollegeList(formData, true, paymentData.order);
            return;
        }

        if(paymentData.order === 'basic') {
            await processCollegeList(formData, false, paymentData.order);
            return;
        }

        if(paymentData.order === 'premium') {
            await processCollegeList(formData, false, paymentData.order);
            return;
        }
        
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

async function processCollegeList(formData, isVerified, order) {
    try {
        // Step 1: Get college list
        const response = await fetch('/prefernceListPCM/College_list', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Step 2: Get student name
        const nameResponse = await fetch('/prefernceListPCM/student_name');
        if (!nameResponse.ok) {
            throw new Error('Failed to fetch student name');
        }
        const nameData = await nameResponse.json();
        central_object.name = nameData.name;

        // Step 3: Process results
        central_object.final_college_list = data;
        generatePdfList();
        await savepdfintodatabase(isVerified);
        
        if (isVerified) {
            // Case 1: Verified - show colleges
            displayColleges(data, formData);
            document.getElementById('generate_college_list').style.display = 'none';
        } else {
            // Case 2: Not verified - proceed to payment
            const paymentResponse = await fetch('/paymentPagePCM/paymentPagePCMData', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formData, order })
            });

            if (!paymentResponse.ok) {
                throw new Error(`Payment error! status: ${paymentResponse.status}`);
            }

            const paymentData = await paymentResponse.json();
            
            if (paymentData.success) {
                // Store data in session and redirect
                window.location.href = '/paymentPagePCM';
            } else {
                console.error('Payment failed:', paymentData.message);
                alert('Payment processing failed: ' + (paymentData.message || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error processing college list:', error);
        alert('An error occurred: ' + error.message);
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

    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
            <div class="college-detail">
                <div class="college-detail-label">AI</div>
                <div>${college.all_india}</div>
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
    const pdfHead = document.getElementById('pdfHead');

    let pdfHeadContent = `<tr>  
                        <th>No.</th>
                        <th>Choice code</th>
                        <th>College Name</th>
                        <th>Branch</th>
                        <th>GOPEN</th>
                        <th>AI</th>`;
    
    if(central_object.formData.gender == 'Female' && central_object.formData.caste == 'OPEN'){
        pdfHeadContent+= '<th>LOPEN</th>';
    }
    
    if(central_object.formData.caste == 'EWS'){
        pdfHeadContent+= '<th>EWS</th>';
    }
    
    if(central_object.formData.caste != 'OPEN' && central_object.formData.caste != 'EWS'){
        if(central_object.formData.gender == 'Female'){
            pdfHeadContent+= `<th>L${central_object.formData.caste}</th>`;
        }else{
            pdfHeadContent+= `<th>G${central_object.formData.caste}</th>`;
        }
    }

    if(central_object.formData.tfws) {
        pdfHeadContent += '<th>TFWS</th>';
    }

    pdfHeadContent += '</tr>'; 
    pdfHead.innerHTML = pdfHeadContent;
   
    pdfTableBody.innerHTML = '';
    let index = 1;
    
    central_object.final_college_list.forEach((college) => {
        const row = document.createElement('tr');
        let rowContent = `
            <td>${index}</td>
            <td>${college.choice_code}</td>
            <td>${college.college_name}</td>
            <td>${college.branch_name}</td>
            <td>${college.gopen}</td>
            <td>${college.all_india}</td>
        `;
        
        if(central_object.formData.gender == 'Female' && central_object.formData.caste == 'OPEN'){
            rowContent += `<td>${college.lopen}</td>`;
        }
        
        if(central_object.formData.caste == 'EWS'){
            rowContent += `<td>${college.ews}</td>`;
        }
        
        if(central_object.formData.caste != 'OPEN' && central_object.formData.caste != 'EWS'){
            if(central_object.formData.gender == 'Female'){
                let caste = `l${central_object.formData.caste}`;
                rowContent += `<td>${college[caste.toLowerCase()]}</td>`;
            }else{
                let caste = `g${central_object.formData.caste}`;
                rowContent += `<td>${college[caste.toLowerCase()]}</td>`;
            }
        }

        if(central_object.formData.tfws) {
            rowContent += `<td>${college.tfws}</td>`;
        }

        row.innerHTML = rowContent;
        index++;
        pdfTableBody.appendChild(row);
    });
}

async function savepdfintodatabase(isVerified) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Add student info
        doc.setFontSize(20);
        doc.text('HB Educational Firm', 14, 20); //HB Educational Firm
        doc.setFontSize(12);
        doc.text(`Name: ${central_object.name}`, 14, 30);
        doc.text(`General Rank: ${central_object.formData.generalRank}`, 14, 36);
        doc.text(`All India Rank: ${central_object.formData.allIndiaRank}`, 14, 42);
        doc.text(`Gender: ${central_object.formData.gender}`, 14, 48);
        doc.text(`Home University: ${central_object.formData.homeuniversity}`, 14, 54);
        doc.text(`Caste: ${central_object.formData.caste}`, 14, 60);

        // Start dynamic Y position from 66
        let currentY = 66;

        // Branch Categories
        const branch_cat_obj = {
            All: 'All',
            CIVIL: 'Civil',
            COMP: 'Computer Science',
            IT: 'Information Technology',
            COMPAI: 'CSE (Artificial Intelligence)',
            AI: 'Artificial Intelligence',
            ELECTRICAL: 'Electrical',
            ENTC: 'ENTC',
            MECH: 'Mechanical',
            OTHER: 'Other'
        };

        const branch_categories = central_object.formData.branchCategories
            .map(el => branch_cat_obj[el] || el)
            .join(", ");
        const wrappedBranch = doc.splitTextToSize(`Branch Category: ${branch_categories}`, 270);
        doc.text(wrappedBranch, 14, currentY);
        currentY += wrappedBranch.length * 6;

        // City
        const cityString = central_object.formData.city.join(", ") + ".";
        const wrappedCity = doc.splitTextToSize(`City: ${cityString}`, 270);
        doc.text(wrappedCity, 14, currentY);
        currentY += wrappedCity.length * 6;

        // TFWS
        const tfwsText = central_object.formData.tfws ? 'TFWS: Yes' : 'TFWS: No';
        doc.text(tfwsText, 14, currentY);
        currentY += 10;

        // Add table
        const table = document.getElementById('pdfTable');
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
        const rows = Array.from(table.querySelectorAll('tr')).map(tr =>
            Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
        ).filter(row => row.length);

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: currentY,
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            margin: { left: 14 }
        });

        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);

        let pdfId = `${central_object.name}${randomFourDigitNumber}`;

        // Convert PDF to blob and send to server
        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('pdf', pdfBlob, 'preference_list.pdf');
        formData.append('name', JSON.stringify(central_object.name));
        formData.append('exam', JSON.stringify('Engineering'));
        formData.append('is_verified', JSON.stringify(isVerified ? 'true' : 'false'));
        formData.append('pdfID', JSON.stringify(pdfId));

        const response = await fetch('/prefernceListPCM/savePdf', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
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

function printPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Add student info
    doc.setFontSize(20);
    doc.text('HB Educational Firm', 14, 20); //HB Educational Firm
    doc.setFontSize(12);
    doc.text(`Name: ${central_object.name}`, 14, 30);
    doc.text(`General Rank: ${central_object.formData.generalRank}`, 14, 36);
    doc.text(`All India Rank: ${central_object.formData.allIndiaRank}`, 14, 42);
    doc.text(`Gender: ${central_object.formData.gender}`, 14, 48);
    doc.text(`Home University: ${central_object.formData.homeuniversity}`, 14, 54);
    doc.text(`Caste: ${central_object.formData.caste}`, 14, 60);

    // Format branch category
    const branch_cat_obj = {
        All: 'All',
        CIVIL: 'Civil',
        COMP: 'Computer Science',
        IT: 'Information Technology',
        COMPAI: 'CSE (Artificial Intelligence)',
        AI: 'Artificial Intelligence',
        ELECTRICAL: 'Electrical',
        ENTC: 'ENTC',
        MECH: 'Mechanical',
        OTHER: 'Other'
    };

    const branch_categories = central_object.formData.branchCategories
        .map(el => branch_cat_obj[el] || el)
        .join(", ");

    const wrappedBranchText = doc.splitTextToSize(`Branch Category: ${branch_categories}`, 270);
    let currentY = 66;
    doc.text(wrappedBranchText, 14, currentY);
    currentY += wrappedBranchText.length * 6; // adjust Y for next section

    // Format city list
    const cityString = central_object.formData.city.join(", ") + ".";
    const wrappedCityText = doc.splitTextToSize(`City: ${cityString}`, 270);
    doc.text(wrappedCityText, 14, currentY);
    currentY += wrappedCityText.length * 6;

    // TFWS
    const tfwsText = central_object.formData.tfws ? 'TFWS: Yes' : 'TFWS: No';
    doc.text(tfwsText, 14, currentY);
    currentY += 10; // padding before table

    // Extract table
    const table = document.getElementById('pdfTable');
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    const rows = Array.from(table.querySelectorAll('tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
    ).filter(row => row.length);

    // Add table
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: currentY,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        margin: { left: 14 }
    });

    doc.save('MHT_CET_Preference_List.pdf');
}


