
document.addEventListener('DOMContentLoaded', async function() {

    await pageLoadData();

    // File upload display
    document.getElementById('paymentScreenshot').addEventListener('change', function(e) {
        const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
        document.getElementById('fileName').textContent = fileName;
    });

    // Form submission
    document.getElementById('studentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const privacyCheckbox = document.getElementById('privacyPolicy');
        if (!privacyCheckbox.checked) {
            alert('Please agree to the Privacy Policy before submitting');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('studentName', document.getElementById('studentName').value);
            formData.append('whatsappNumber', document.getElementById('whatsappNumber').value);
            formData.append('transactionId', document.getElementById('transactionId').value);
            formData.append('privacyPolicyAgreed', 'true');
            formData.append('exam_type', 'Engineering');
            
            // Add the file to FormData
            const fileInput = document.getElementById('paymentScreenshot');
            if (fileInput.files[0]) {
                formData.append('paymentScreenshot', fileInput.files[0]);
            } else {
                alert('Please upload a payment screenshot');
                return;
            }

            const paymentResponse = await fetch('/paymentPagePCM/submit', {
                method: 'POST',
                body: formData // Don't set Content-Type header - the browser will set it with the correct boundary
            });

            const res = await paymentResponse.json();
            
            if (res.isok || res.success) {
                document.getElementById('successModal').style.display = 'block';
            } else {
                console.log(res.message || res.msg);
                alert(res.message || res.msg || 'Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the form');
        }
    });

    document.getElementById('modalOkBtn').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
        window.location.href = '/pcm';
    });
});

document.getElementById('backBtn').addEventListener('click',()=>{
    window.history.back();
});


async function pageLoadData() {
    try {
        const response = await fetch('/paymentPagePCM/LoadData');
        const data = await response.json();
        console.log(data);
        let tfws = '';
        if(data.paymentData.formData.tfws){
            tfws = 'Yes';
        }else{
            tfws = 'No';
        }

        document.getElementById('displayInformation').innerHTML = `
            <p><span class="info-label">Register Phone No.:</span> <span class="info-value" >${data.phone}</span></p>
            <p><span class="info-label">General Rank:</span> <span class="info-value" id="displayGeneralRank">${data.paymentData.formData.generalRank}</span></p>
            <p><span class="info-label">All India Rank:</span> <span class="info-value" id="displayAllIndiaRank">${data.paymentData.formData.allIndiaRank}</span></p>
            <p><span class="info-label">Caste:</span> <span class="info-value" id="displayCaste">${data.paymentData.formData.caste}</span></p>
            <p><span class="info-label">Gender:</span> <span class="info-value" id="displayGender">${data.paymentData.formData.gender}</span></p>
            <p><span class="info-label">Home University:</span> <span class="info-value" id="displayHomeUniversity">${data.paymentData.formData.homeuniversity}</span></p>
            <p><span class="info-label">TFWS:</span> <span class="info-value" id="displayTFWS">${tfws}</span></p>
        </div>
        `;

        function displayArrayItems(array, containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            array.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'array-item';
                itemElement.textContent = item;
                container.appendChild(itemElement);
            });
        }

        displayArrayItems(data.paymentData.formData.branchCategories, 'displayBranchCategory');
        if(data.paymentData.formData.selected_branches.length != 0){
            document.getElementById('selectedBranch').style.display = 'block';
            displayArrayItems(data.paymentData.formData.selected_branches, 'displayOtherBranchSelection');
        }else{
            document.getElementById('selectedBranch').style.display = 'none';
        }
        
        displayArrayItems(data.paymentData.formData.city, 'displayCities');

        const qrContainer = document.getElementById('qrContainer');
        qrContainer.innerHTML = '';
        if(data.paymentData.order == 'basic'){
            qrContainer.innerHTML = `
                <p>Scan the QR code to make payment</p>
                <img src="/assets/qr/phone pay.jpg" alt="Payment QR Code">
                <p style="margin-top: 1rem;">Amount: ₹499</p>
            `;
        }else{
            qrContainer.innerHTML = `
                <p>Scan the QR code to make payment</p>
                <img src="/assets/qr/google pay.jpg" alt="Payment QR Code">
                <p style="margin-top: 1rem;">Amount: ₹999</p>
            `;
        }

    } catch (error) {
        console.log(error);
    }
}