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

// College List Functions
async function generateCollegeList(formData) {
    try {

        const response_1 = await fetch('/payment');
        const data_1 = await response_1.json();
        // console.log(data_1);

        if(data_1.isOk){

            const response = await fetch('/prefernceListPCM/College_list', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            const response_2 = await fetch('/prefernceListPCM/student_name');
            const data_2 = await response_2.json();
            central_object.name = data_2.name;

            central_object.final_college_list = data;
            generatePdfList();
            await savepdfintodatabase();
            displayColleges(data, formData);

        }else{
            alert(data_1.msg);
        }

    } catch (error) {
        console.log('Error:', error);
    }
}


function displayColleges(colleges, formData) {
    collegeCardsContainer.innerHTML = '';

    // console.log(central_object.specialReservation);
    if (central_object.specialReservation != 'No') {
        collegeCardsContainer.innerHTML = `
            <div class="contact-message">
                <h3>Thank you for your application!</h3>
                <p>Our team will contact you within 24 hours regarding your ${formData.specialReservation} reservation.</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }
    
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
    // const selectedColleges = document.querySelectorAll('.college-card.selected');
    // if (selectedColleges.length === 0) {
    //     alert('Please select at least one college');
    //     return;
    // }

    const pdfTableBody = document.getElementById('pdfTableBody');
    pdfTableBody.innerHTML = '';
    let index = 1;
    central_object.final_college_list.forEach((college) => {
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
        doc.text(`All India Rank: ${central_object.formData.allIndiaRank}`, 14, 42);
        doc.text(`Gender: ${central_object.formData.gender}`, 14, 48);
        doc.text(`Home University: ${central_object.formData.homeuniversity}`, 14, 54);
        doc.text(`Caste: ${central_object.formData.caste}`, 14, 60);

        if(central_object.formData.tfws){
            doc.text('TFWS: Yes', 14, 66);
        }else{
            doc.text('TFWS: No', 14, 66);
        }

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
        formData.append('name',JSON.stringify(central_object.name))
        console.log(formData);
        // 4. Send to backend for storage
        const response = await fetch('/prefernceListPCM/savePdf', {
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
    doc.setFontSize(16);
    doc.text('Student Information', 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${central_object.name}`, 14, 30);
    doc.text(`General Rank: ${central_object.formData.generalRank}`, 14, 36);
    doc.text(`All India Rank: ${central_object.formData.allIndiaRank}`, 14, 42);
    doc.text(`Gender: ${central_object.formData.gender}`, 14, 48);
    doc.text(`Home University: ${central_object.formData.homeuniversity}`, 14, 54);
    doc.text(`Caste: ${central_object.formData.caste}`, 14, 60);
    if(central_object.formData.tfws){
        doc.text('TFWS: Yes', 14, 66);
    }else{
         doc.text('TFWS: No', 14, 66);
    }

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

    doc.save('MHT_CET_Preference_List.pdf');
}


