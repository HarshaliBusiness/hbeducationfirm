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
const selectedBranchesContainer = document.getElementById('selectedBranchesContainer');

// Initialize
updateSelectedCount(0);

collegeForm.addEventListener('submit', handleFormSubmit);

regionCheckboxGroup.addEventListener('change', handleRegionCheckboxChange);


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
        branchCategory: branchCategorySelect.value,
        city: finalRegions,
    };

    // console.log('Form Data:', formData);
    generateCollegeList(formData);
}

document.getElementById('back_to_neet').addEventListener('click',()=>{
  window.location.href = '/neet';
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



// Core Functions
async function generateCollegeList(formData) {
    // console.log(formData);
    try {
        const response = await fetch('/collegePredictorNeet/College_list', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        // console.log(data);
        central_object.formData = formData;
        central_object.collegeList = data;
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
        const card = createCollegeCard(college, count);
        count++;
        collegeCardsContainer.appendChild(card);
    });

    resultsContainer.style.display = 'block';
    updateSelectedCount(colleges.length);

    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function createCollegeCard(college, count) {
    const card = document.createElement('div');
    card.className = 'college-card selected';
    card.dataset.code = college.choice_code;

    let card_content = `
        <div class="college-card-header">
            <div class="college-code">${count}</div>
            <input type="checkbox" checked class="card-checkbox">
        </div>
        <div class="college-name">${college.college_name}</div>
        <div>University: ${college.university}</div>
        <div>${college.branch_name}</div>
        <div class="college-details">
            <div class="college-detail">
                <div class="college-detail-label">OPEN</div>
                <div>${college.lopen}</div>
            </div>
    `;

    if(college.lews){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">EWS</div>
                <div>${college.lews}</div>
            </div>
        `;
    }

    if(college.lnt1){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">NT1</div>
                <div>${college.lnt1}</div>
            </div>
        `;
    }

    if(college.lnt2){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">NT2</div>
                <div>${college.lnt2}</div>
            </div>
        `;
    }

    if(college.lnt3){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">NT3</div>
                <div>${college.lnt3}</div>
            </div>
        `;
    }

    if(college.lobc){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">OBC</div>
                <div>${college.lobc}</div>
            </div>
        `;
    }

    if(college.lsc){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">SC</div>
                <div>${college.lsc}</div>
            </div>
        `;
    }

    if(college.lst){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">ST</div>
                <div>${college.lst}</div>
            </div>
        `;
    }

    if(college.lvj){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">VJ</div>
                <div>${college.lvj}</div>
            </div>
        `;
    }

    if(college.lsebc){
        card_content += `
            <div class="college-detail">
                <div class="college-detail-label">SEBC</div>
                <div>${college.lsebc}</div>
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
    await fetchCity();
}

// fetching city
async function fetchCity() {
    try {
        const response = await fetch('/neet/fetchcity');
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

            child.innerHTML = `
                <input type="checkbox" name="region" value="${element.city}" >
                <span>${element.city}</span>
            `;

            cityholder.appendChild(child);
        });

    } catch (error) {
        console.log(error);
    }
}



document.getElementById('downloadPdf').addEventListener('click', generatePdf);


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
    doc.text(`Rank: ${document.getElementById('percentile').value}`, 14, 30);
    doc.text(`Category: ${document.getElementById('caste').value}`, 14, 37);
    doc.text(`Gender: ${document.querySelector('input[name="gender"]:checked').value}`, 14, 44);
    
    // Get selected colleges
    const selectedColleges = Array.from(document.querySelectorAll('.college-card.selected'));
    
    if (selectedColleges.length === 0) {
        doc.setFontSize(14);
        doc.text('No colleges selected', 105, 70, { align: 'center' });
    } else {

        let headData = ['Sr. No.', 'College Name','College Type', 'Branch', 'OPEN'];

        if(central_object.formData.caste != 'OPEN'){
            headData.push(central_object.formData.caste);
        }
        
        let count = 1;
        const tableData = central_object.collegeList.map(college => {
            
            const code = count;
            count++;
            const name = college.college_name;
            let collegeType = '';
            if(college.college_type == 'G'){
                collegeType = 'GOVERNMENT/AIDED';
            }else{
                collegeType = 'PRIVATE';
            }
            const branch = college.branch_name;
            const open = college.lopen;
            let tableArray = [code, name,collegeType, branch, open,]

            if(central_object.formData.caste != 'OPEN'){
                tableArray.push(college[`l${central_object.formData.caste.toLowerCase()}`]);
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
                    'Note: This list is based on last year\'s MHT CET Neet UG cutoff. It is not your final preference list. Please cross-check with your counselor or teachers.',
                    14,
                    pageHeight - 10
                );
                
            }
        });

    }
    
    // Save the PDF
    doc.save('medical_predictor.pdf');
}


