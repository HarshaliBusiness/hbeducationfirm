

async function profileData(){
    try {
        const response = await fetch('/profile/profileData');
        const data = await response.json();
        console.log(data);

        let profile_title = 'Profile';
        document.getElementById('profileTitle').textContent = profile_title;
        document.getElementById('name-value').textContent = data.name;
        document.getElementById('phone-value').textContent = data.phone_number;
        document.getElementById('email-value').textContent = data.email;

        const promoSection = document.getElementById('promoSection');
        let count = 1;
        // <div class="promo_div"><p>Expire</p> <p>Expire</p></div> 
        data.promo_code.forEach(element => {
            const para = document.createElement('div');
            para.classList.add('promo_div');
            para.innerHTML = `
                <p>${count}. ${element.code}</p> 
                <p>Limit: ${element.count}</p>
            `;

            promoSection.appendChild(para);
            count++;
        });

        if(data.pdf.length == 0){
            document.getElementById('downloads_section').style.display = 'none';
        }else{
            document.getElementById('downloads_section').style.display = 'block';
            count = 0;
            const downloadsList = document.getElementById('downloadsList');
            data.pdf.forEach(element => {
                const downloadsPdf = document.createElement('div');
                downloadsPdf.classList.add('download-item');

                let paymentType;
                if(element.code != ''){
                    paymentType = `150 college list.`;
                }else{
                    if(element.payment == '500'){
                        paymentType = `75 college list.`;
                    }else{
                        paymentType = `150 college list.`;
                    }
                }

                downloadsPdf.innerHTML = `
                    <i class="fas fa-file-pdf"></i>
                    <h4>${element.examType}</h4>
                    <p>${paymentType}</p>
                    <a href="#" class="download-btn" onclick="DownloadPdfBtn(${count})">Download PDF</a>
                `;
                downloadsList.appendChild(downloadsPdf);
                count++;
            });

        }

    } catch (error) {
        console.log(error);
    }
}

function DownloadPdfBtn(index) {
    fetch(`/profile/download/${index}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `college_list.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error downloading PDF:", error);
        });
}

document.addEventListener('DOMContentLoaded',async function() {
    
    await profileData();
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            const valueElement = document.getElementById(`${field}-value`);
            const editField = valueElement.parentElement.nextElementSibling;
            const input = editField.querySelector('input');
            
            // Set current value in input
            input.value = valueElement.textContent;
            
            // Show edit field
            valueElement.parentElement.style.display = 'none';
            editField.style.display = 'block';
        });
    });

    // // Save buttons functionality
    // document.querySelectorAll('.save-btn').forEach(btn => {
    //     btn.addEventListener('click',async function() {
    //         const field = this.getAttribute('data-field');
    //         const input = document.getElementById(`${field}-input`);
    //         const valueElement = document.getElementById(`${field}-value`);
    //         const editField = input.parentElement;
            
    //         // Validate input
    //         if (field === 'email' && !validateEmail(input.value)) {
    //             showError('Please enter a valid email address');
    //             return;
    //         }
            
    //         if (field === 'phone' && !validatePhone(input.value)) {
    //             showError('Please enter a valid phone number');
    //             return;
    //         }
            
    //         if (field === 'name' && input.value.trim() === '') {
    //             showError('Name cannot be empty');
    //             return;
    //         }

    //         const response = await fetch('/profile/saveName');
            
    //         // Update value (in a real app, this would call an API)
    //         valueElement.textContent = input.value;
    //         // userData[field] = input.value;
            
    //         // Hide edit field
    //         editField.style.display = 'none';
    //         editField.previousElementSibling.style.display = 'flex';
            
    //         // Show success message
    //         showError(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
    //     });
    // });

    // // Cancel buttons functionality
    // document.querySelectorAll('.cancel-btn').forEach(btn => {
    //     btn.addEventListener('click', function() {
    //         const field = this.getAttribute('data-field');
    //         const valueElement = document.getElementById(`${field}-value`);
    //         const editField = valueElement.parentElement.nextElementSibling;
            
    //         // Hide edit field without saving
    //         editField.style.display = 'none';
    //         valueElement.parentElement.style.display = 'flex';
    //     });
    // });

    // // Validation functions
    // function validateEmail(email) {
    //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return re.test(email);
    // }

    // function validatePhone(phone) {
    //     // Simple validation - at least 6 digits
    //     return phone.replace(/\D/g, '').length >= 6;
    // }

    // Error popup functionality
    const errorPopup = document.getElementById('error-popup');
    const errorMessage = document.getElementById('error-message');
    const closeErrorPopup = document.querySelector('.close-error-popup');

    function showError(message) {
        errorMessage.textContent = message;
        errorPopup.style.display = 'flex';
    }

    function hideError() {
        errorPopup.style.display = 'none';
    }

    closeErrorPopup.addEventListener('click', hideError);
    errorPopup.addEventListener('click', function(e) {
        if (e.target === errorPopup) {
            hideError();
        }
    });

    // Back button functionality
    function goBack() {
        window.history.back();
    }

    // Attach back button events
    document.getElementById('back-btn').addEventListener('click', goBack);
    document.getElementById('mobile-back-btn').addEventListener('click', goBack);
});