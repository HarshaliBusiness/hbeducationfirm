const central_object = {
    mainCaste: '',
    casteColumn: '',
    specialReservation: ''
};

let selectedBranches = [];

// DOM elements
const casteSelect = document.getElementById('caste');
const tfwsContainer = document.getElementById('tfwsContainer');
const tfwsCheckbox = document.getElementById('tfws');
const branchCategorySelect = document.getElementById('branchCategory');
const collegeForm = document.getElementById('collegeForm');
const resultsContainer = document.getElementById('resultsContainer');
const collegeCardsContainer = document.getElementById('collegeCards');
const selectedCountElement = document.getElementById('selectedCount');
const regionCheckboxGroup = document.getElementById('regionCheckboxGroup');
const roundSelect = document.getElementById('round');
const homeuniversitySelect = document.getElementById('homeUniversity');
const customBranchBtn = document.getElementById('customBranchBtn');
const branchSelect = document.getElementById('branch');
const selectedBranchesContainer = document.getElementById('selectedBranchesContainer');

// Initialize
updateSelectedCount(0);

// Event Listeners
casteSelect.addEventListener('change', handleCasteChange);
collegeForm.addEventListener('submit', handleFormSubmit);

regionCheckboxGroup.addEventListener('change', handleRegionCheckboxChange);
customBranchBtn.addEventListener('click', () => {
    customBranchBtn.style.display = 'none';
    toggleBranchSelection();
});
branchSelect.addEventListener('change', handleBranchSelection);

// Event Handlers
function handleCasteChange() {
    if (this.value === 'OPEN' || this.value === 'OBC') {
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

    // If "All Regions" is selected, ignore other selections
    const finalRegions = regions.includes("All") ? ["All"] : regions;

    const formData = {
        percentile: parseFloat(document.getElementById('percentile').value),
        caste: casteSelect.value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        specialReservation: document.getElementById('specialReservation').value,
        tfws: tfwsCheckbox.checked,
        branchCategory: branchCategorySelect.value,
        city: finalRegions,
        selected_branches: [],
        round: roundSelect.value,
        homeuniversity: homeuniversitySelect.value
    };

    console.log('Form Data:', formData);
    generateCollegeList(formData);
}

document.getElementById('back_to_pcm').addEventListener('click',()=>{
  window.location.href = '/pcm';
});

function handleRegionCheckboxChange(e) {
    if (e.target.value === "All" && e.target.checked) {
        // If "All Regions" is checked, uncheck all other regions
        const otherCheckboxes = document.querySelectorAll('input[name="region"]:not([value="All"])');
        otherCheckboxes.forEach(cb => cb.checked = false);
    } else if (e.target.value !== "All" && e.target.checked) {
        // If any other region is checked, uncheck "All Regions"
        const allCheckbox = document.querySelector('input[name="region"][value="All"]');
        allCheckbox.checked = false;
    }
}

function handleBranchSelection() {
    if (this.value && !selectedBranches.includes(this.value)) {
        selectedBranches.push(this.value);
        updateSelectedBranchesDisplay();

        // Remove selected option from dropdown
        this.querySelector(`option[value="${this.value}"]`).remove();

        // Reset dropdown
        this.value = '';

        // Hide dropdown if all branches are selected
        if (this.options.length <= 1) {
            branchSelect.classList.add('hidden');
        }
    }
}

function toggleBranchSelection() {
    branchSelect.classList.remove('hidden');
    branchSelect.focus();
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

    // Show/hide the add button based on remaining branches
    if (branchSelect.options.length > 1) {
        customBranchBtn.style.display = 'block';
    }
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

// Core Functions
async function generateCollegeList(formData) {
    formData.selected_branches = selectedBranches;
    
    try {
        const response = await fetch('/collegePredictorPCM/College_list', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        
        const data = await response.json();
        central_object.formData = formData;
        central_object.collegeList = data;
        // console.log(data);
        displayColleges(data, formData);

    } catch (error) {
        console.log('Error:', error);
        alert('An error occurred while fetching college data');
    }
}

function displayColleges(colleges, formData) {
    collegeCardsContainer.innerHTML = '';

    if (!colleges || colleges.length === 0) {
        collegeCardsContainer.innerHTML = '<p>No colleges found matching your criteria.</p>';
        resultsContainer.style.display = 'block';
        return;
    }

    let count = 1;
    colleges.forEach(college => {
        const card = createCollegeCard(college, formData, count);
        count++;
        collegeCardsContainer.appendChild(card);
    });

    resultsContainer.style.display = 'block';
    updateSelectedCount(colleges.length);

    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function createCollegeCard(college, formData, count) {
    const card = document.createElement('div');
    card.className = 'college-card selected';
    card.dataset.code = college.choice_code;

    let card_content = `
        <div class="college-card-header">
            <div class="college-code">${count}</div>
            <div class="college-code">Seat type: ${college.seat_type}</div>
            <input type="checkbox" checked class="card-checkbox">
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
        card_content = card_content + `
            <div class="college-detail">
                <div class="college-detail-label">LOPEN</div>
                <div>${college.lopen}</div>
            </div>
        `;

        if (formData.caste != 'OPEN' && formData.caste != 'EWS') {
            let caste_column = `L${formData.caste}`;
            card_content = card_content + `
            <div class="college-detail">
                <div class="college-detail-label">${caste_column}</div>
                <div>${college[caste_column.toLowerCase()]}</div>
            </div>
        `;
        }
    } else {
        if (formData.caste != 'OPEN' && formData.caste != 'EWS') {
            let caste_column = `G${formData.caste}`;
            card_content = card_content + `
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
        card_content = card_content + `
            <div class="college-detail">
                <div class="college-detail-label">TFWS</div>
                <div>${college.tfws}</div>
            </div>
        `;
    }

    if (formData.specialReservation != 'No') {
        card_content = card_content + `
            <div class="college-detail">
                <div class="college-detail-label">${formData.specialReservation}</div>
                <div>${college[formData.specialReservation.toLowerCase()]}</div>
            </div>
        `;
    }

    card.innerHTML = card_content + `
        </div>
    `;

    card.addEventListener('click', function (e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = this.querySelector('.card-checkbox');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
            updateSelectedCount();
        }
    });

    const checkbox = card.querySelector('.card-checkbox');
    checkbox.addEventListener('change', function () {
        card.classList.toggle('selected', this.checked);
        updateSelectedCount();
    });

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

// Initialization
document.addEventListener("DOMContentLoaded", initialize());

async function initialize() {
    await fetchBranches();
    await fetchCity();
    await fetchUniversity();
}

// fetching branches
async function fetchBranches() {
    try {
        const response = await fetch('/collegePredictorPCM/fetchBranches');
        let data = await response.json();

        const optionsHolder = document.getElementById('branch');
        optionsHolder.innerHTML = '<option value="" disabled selected>Select branches</option>';

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

            optionsHolder.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

// fetching city
async function fetchCity() {
    try {
        const response = await fetch('/collegePredictorPCM/fetchcity');
        const data = await response.json();

        const cityholder = document.getElementById('regionCheckboxGroup');
        cityholder.innerHTML = `
            <label class="checkbox-label">
                <input type="checkbox" name="region" value="All" checked>
                <span>All Regions</span>
            </label>
        `;

        data.forEach(element => {
            const child = document.createElement('label');
            child.classList.add('checkbox-label');

            let cityName = '';
            if(element.city == 'Ahmednagar'){
                cityName = 'Ahilyanagar';
            }else if(element.city == 'Aurangabad'){
                cityName = 'Chatrapati Sambhaji Nagar';
            }else if(element.city == 'Osmanabad'){
                cityName = 'Dharashiv';
            }else{
                cityName = element.city;
            }

            child.innerHTML = `
                <input type="checkbox" name="region" value="${element.city}" >
                <span>${cityName}</span>
            `;

            cityholder.appendChild(child);
        });

    } catch (error) {
        console.log(error);
    }
}

// Home university
async function fetchUniversity() {
    try {
        const response = await fetch('/collegePredictorPCM/fetchUniversity');
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


// Add this at the bottom of your collegePredictorPCM.js file

// document.getElementById('downloadPdf').addEventListener('click', generatePdf);


function generatePdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Add title
    doc.setFontSize(25);
    doc.setTextColor(0);
    doc.text('HB Educational Firm ', 148, 15, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`College Predictor Results`, 148, 22, { align: 'center' });
    
    // Add user details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Percentile: ${document.getElementById('percentile').value}`, 14, 30);
    doc.text(`Category: ${document.getElementById('caste').value}`, 14, 37);
    doc.text(`Gender: ${document.querySelector('input[name="gender"]:checked').value}`, 14, 44);
    doc.text(`Round: ${document.getElementById('round').value}`, 14, 51);
    
    // Get selected colleges
    const selectedColleges = Array.from(document.querySelectorAll('.college-card.selected'));
    
    if (selectedColleges.length === 0) {
        doc.setFontSize(14);
        doc.text('No colleges selected', 105, 70, { align: 'center' });
    } else {

        let headData = ['Sr. No.', 'College Name', 'Branch', 'GOPEN'];

        if(central_object.formData.caste == 'EWS'){
            headData.push('EWS');
        }

        if(central_object.formData.caste != 'OPEN' && central_object.formData.caste != 'EWS' && central_object.formData.gender == 'Male'){
            headData.push(`G${central_object.formData.caste}`)
        }

        if(central_object.formData.gender == 'Female'){
            headData.push('LOPEN');

            if(central_object.formData.caste != 'OPEN' && central_object.formData.caste != 'EWS'){
                headData.push(`L${central_object.formData.caste}`)
            }
        }
        
        if(central_object.formData.specialReservation != 'No'){
            headData.push(central_object.formData.specialReservation);
        }

        let count = 1;
        const tableData = central_object.collegeList.map(college => {
            
            const code = count;
            count++;
            const name = college.college_name;
            const branch = college.branch_name;
            const gopen = college.gopen;
            let tableArray = [code, name, branch, gopen,]
            if(central_object.formData.caste == 'EWS'){
                tableArray.push(college.ews);
            }
            if(central_object.formData.caste != 'OPEN' && central_object.formData.caste != 'EWS' && central_object.formData.gender == 'Male'){
                // toLowerCase()
                let c = `G${central_object.formData.caste}`;
                tableArray.push(college[c.toLowerCase()]);
            }

            if(central_object.formData.gender == 'Female'){
               
                tableArray.push(college.lopen);
                if(central_object.formData.caste != 'EWS' && central_object.formData.caste != 'OPEN'){
                    let c = `L${central_object.formData.caste}`;
                    tableArray.push(college[c.toLowerCase()]);
                }
            }
            
            if(central_object.formData.specialReservation != 'No'){
                tableArray.push(college[central_object.formData.specialReservation.toLowerCase()]);
            }

            return tableArray;
        });
        
        // Add table
        doc.autoTable({
            head: [headData],
            body: tableData,
            startY: 60,
            theme: 'grid',
            headStyles: {
                fillColor: [26, 58, 143],
                textColor: 255
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { left: 6 },
            didDrawPage: function (data) {
                // Note position — slightly above the bottom of the page
                const pageHeight = doc.internal.pageSize.height;
                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.text(
                    'Note: This list is based on last year\'s MHT CET Engineering cutoff. It is not your final preference list. Please cross-check with your counselor or teachers. __F indicates branches for girls only,',
                    14,
                    pageHeight - 10
                );
                doc.text(
                    'and __U indicates unaided branches.',
                    14,
                    pageHeight - 6
                );
            }
        });

    }
    
    // Save the PDF
    doc.save('engineering_college_predictor.pdf');
}

