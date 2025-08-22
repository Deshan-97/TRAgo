// TravelGo Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadHireDetails();
    initializeBidForm();
});

// Load hire details from server
async function loadHireDetails() {
    try {
        const response = await fetch('/api/hire');
        const hireRequests = await response.json();
        
        const container = document.getElementById('hireDetailsContainer');
        
        if (hireRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>දැනට හයර් නොමැත</h3>
                    <p>දැනට හයර් නොමැත.</p>
                </div>
            `;
            return;
        }
        
        // Display the most recent hire request
        const latestHire = hireRequests[0];
        displayHireDetails(latestHire);
        
    } catch (error) {
        console.error('Error loading hire details:', error);
        showAlert('විස්තර ඇතුලත් කිරීමේ දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න.', 'error');
    }
}

// Display hire details
function displayHireDetails(hire) {
    const container = document.getElementById('hireDetailsContainer');
    
    const hireTypeDisplay = formatHireType(hire.hire_type);
    const vehicleTypeDisplay = formatVehicleType(hire.vehicle_type);
    const acPreferenceDisplay = formatAcPreference(hire.ac_preference);
    const durationDisplay = hire.duration_days === 1 ? '1 දිනය' : `දින ${hire.duration_days}`;
    const pickupDateDisplay = new Date(hire.pickup_date).toLocaleDateString();
    const passengersDisplay = hire.passengers === 1 ? '1 පුද්ගලයා' : `${hire.passengers} පුද්ගලයින්`;
    
    container.innerHTML = `
        <div class="hire-details">
            <h2>හයර් විස්තර​</h2>
            
            <div class="detail-item">
                <span class="detail-label">ගමන් ආරම්භ ස්ථානය:</span>
                <span class="detail-value highlight">${hire.pickup_location}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">ගමන් අවසාන ස්ථානය:</span>
                <span class="detail-value highlight">${hire.dropoff_location}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">දිනය:</span>
                <span class="detail-value highlight">${pickupDateDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">HireType:</span>
                <span class="detail-value">${hireTypeDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">අවශ්‍ය වාහන වර්ගය:</span>
                <span class="detail-value">${vehicleTypeDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">මගීන් සංඛ්‍යාව:</span>
                <span class="detail-value">${passengersDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">වායු සමීකරණ පහසුකම:</span>
                <span class="detail-value">${acPreferenceDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">කාලසීමාව:</span>
                <span class="detail-value">${durationDisplay}</span>
            </div>
            
            ${hire.additional_data ? `
            <div class="detail-item">
                <span class="detail-label">අමතර අවශ්‍යතා:</span>
                <span class="detail-value">${hire.additional_data}</span>
            </div>
            ` : ''}
            
            <button onclick="openBidModal(${hire.id})" class="btn btn-primary">
                හයර් එක ලබාගැනීමට
            </button>
        </div>
    `;
}

// Format hire type for display
function formatHireType(type) {
    const types = {
        'wedding': 'Wedding',
        'trip': 'Trip',
        'airport_transport': 'Airport Transport'
    };
    return types[type] || type;
}

// Format vehicle type for display
function formatVehicleType(type) {
    const types = {
        'car': 'Car',
        'van': 'Van',
        'bus': 'Bus'
    };
    return types[type] || type;
}

// Format AC preference for display
function formatAcPreference(preference) {
    const preferences = {
        'AC': 'වායු සමීකරණ සහිතව',
        'Non-AC': 'වායු සමීකරණ රහිතව',
        'Both': 'දෙකම පිළිගන්නවා'
    };
    return preferences[preference] || preference;
}

// Open bid modal - first show terms
function openBidModal(hireId) {
    console.log('Opening terms modal for hire ID:', hireId);
    
    // Store hire ID for later use
    window.currentHireId = hireId;
    
    // Show terms modal first
    const termsModal = document.getElementById('termsModal');
    if (!termsModal) {
        console.error('termsModal not found!');
        return;
    }
    
    termsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    console.log('Terms modal opened successfully');
}

// Close terms modal
function closeTermsModal() {
    document.getElementById('termsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// User agrees to terms - now show bid form
function agreeToTerms() {
    console.log('User agreed to terms, opening bid form for hire ID:', window.currentHireId);
    
    // Close terms modal
    closeTermsModal();
    
    // Set hire ID in the bid form
    const hireRequestIdField = document.getElementById('hireRequestId');
    if (!hireRequestIdField) {
        console.error('hireRequestId field not found!');
        return;
    }
    hireRequestIdField.value = window.currentHireId;
    console.log('Set hire request ID to:', hireRequestIdField.value);
    
    // Show bid modal
    const bidModal = document.getElementById('bidModal');
    if (!bidModal) {
        console.error('bidModal not found!');
        return;
    }
    
    bidModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    console.log('Bid modal opened successfully');
}

// Close bid modal
function closeBidModal() {
    document.getElementById('bidModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetBidForm();
}

// Initialize bid form
function initializeBidForm() {
    console.log('Initializing bid form...');
    const form = document.getElementById('bidForm');
    
    if (!form) {
        console.error('Bid form not found!');
        return;
    }
    
    console.log('Bid form found, adding event listener...');
    form.addEventListener('submit', handleBidSubmission);
    
    // Test if the handler is attached
    form.addEventListener('submit', function(e) {
        console.log('Form submit event triggered!');
    });
    
    // Close bid modal when clicking outside
    const bidModal = document.getElementById('bidModal');
    bidModal.addEventListener('click', function(event) {
        if (event.target === bidModal) {
            closeBidModal();
        }
    });
    
    // Close terms modal when clicking outside
    const termsModal = document.getElementById('termsModal');
    termsModal.addEventListener('click', function(event) {
        if (event.target === termsModal) {
            closeTermsModal();
        }
    });
    
    // Prevent modals from closing when clicking inside modal content
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(function(modalContent) {
        modalContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
}

// Handle bid form submission
async function handleBidSubmission(event) {
    event.preventDefault();
    
    console.log('Bid form submission started');
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitText');
    const submitLoading = document.getElementById('submitLoading');
    
    // Show loading state
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-block';
    
    try {
        const formData = new FormData(event.target);
        
        console.log('Form data created:', formData);
        
        // Debug: Log all form data
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Validate required fields
        const requiredFields = ['owner_name', 'vehicle_type', 'price_per_km_ac', 
                               'price_per_km_non_ac', 'full_hire_price', 'phone_number'];
        
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                throw new Error(`${field.replace('_', ' ')} is required`);
            }
        }
        
        // Validate prices are positive
        const prices = ['price_per_km_ac', 'price_per_km_non_ac', 'full_hire_price'];
        for (const price of prices) {
            const value = parseFloat(formData.get(price));
            if (isNaN(value) || value < 0) {
                throw new Error(`${price.replace('_', ' ')} must be a valid positive number`);
            }
        }
        
        // Validate phone number (exactly 10 digits)
        const phoneNumber = formData.get('phone_number');
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            throw new Error('දුරකථන අංකය නිවරදිව ඇතුලත් කරන්න​');
        }
        
        console.log('Validation passed, sending request to server...');
        
        const response = await fetch('/api/bid', {
            method: 'POST',
            body: formData
        });
        
        console.log('Response received:', response.status, response.statusText);
        
        const result = await response.json();
        console.log('Response data:', result);
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to submit bid');
        }
        
        showAlert('ඔබේ ලංසුව සාර්ථකව ඉදිරිපත් කරන ලදී! පරිපාලක ගණය සමාලෝචනය කර ඔබ සම්බන්ධ කර ගනු ඇත.', 'success');
        closeBidModal();
        
    } catch (error) {
        console.error('Error submitting bid:', error);
        showAlert(error.message, 'error');
    } finally {
        // Reset loading state
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    }
}

// Reset bid form
function resetBidForm() {
    const form = document.getElementById('bidForm');
    form.reset();
    
    // Clear file inputs and previews
    clearFilePreview('photo1');
    clearFilePreview('photo2');
}

// Clear file preview
function clearFilePreview(photoId) {
    const input = document.getElementById(photoId);
    const preview = document.getElementById(`${photoId}Preview`);
    
    if (input) {
        input.value = '';
        input.classList.remove('has-file');
    }
    
    if (preview) {
        preview.classList.remove('show');
    }
}

// Show alert message
function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-error' : 'alert-info';
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert ${alertClass}`;
    alertElement.textContent = message;
    
    container.appendChild(alertElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
        }
    }, 5000);
    
    // Scroll to top to show alert
    window.scrollTo(0, 0);
}

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Validate file size and type
function validateFile(fileInput) {
    const file = fileInput.files[0];
    if (!file) return true;
    
    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
        showAlert('ප්‍රමාණය 20MB ට වඩා අඩු විය යුතුය', 'error');
        fileInput.value = '';
        return false;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('JPEG, PNG, සහ GIF ඡායාරූප පමණක්', 'error');
        fileInput.value = '';
        return false;
    }
    
    return true;
}

// Add file validation to file inputs
document.addEventListener('DOMContentLoaded', function() {
    const photo1Input = document.getElementById('photo1');
    const photo2Input = document.getElementById('photo2');
    const phoneInput = document.getElementById('phoneNumber');
    
    photo1Input.addEventListener('change', function() {
        handleFileSelection(this, 'photo1');
    });
    
    photo2Input.addEventListener('change', function() {
        handleFileSelection(this, 'photo2');
    });
    
    // Add phone number input validation
    phoneInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        e.target.value = value;
        
        // Add visual feedback
        if (value.length === 10) {
            e.target.classList.remove('error');
            e.target.classList.add('valid');
        } else {
            e.target.classList.remove('valid');
            if (value.length > 0) {
                e.target.classList.add('error');
            } else {
                e.target.classList.remove('error');
            }
        }
    });
});

// Handle file selection and preview
function handleFileSelection(input, photoId) {
    const file = input.files[0];
    const preview = document.getElementById(`${photoId}Preview`);
    const image = document.getElementById(`${photoId}Image`);
    
    if (!file) {
        // No file selected - hide preview
        preview.classList.remove('show');
        input.classList.remove('has-file');
        return;
    }
    
    // Validate file
    const validation = validateFileDetailed(file);
    
    if (!validation.valid) {
        input.value = '';
        input.classList.remove('has-file');
        preview.classList.remove('show');
        showAlert(validation.error, 'error');
        return;
    }
    
    // File is valid - show preview only
    input.classList.add('has-file');
    
    // Show image preview if it's an image
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);
    } else {
        preview.classList.add('show');
    }
}

// Remove file
function removeFile(photoId) {
    const input = document.getElementById(photoId);
    const preview = document.getElementById(`${photoId}Preview`);
    
    input.value = '';
    input.classList.remove('has-file');
    preview.classList.remove('show');
}

// Enhanced file validation
function validateFileDetailed(file) {
    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
        return {
            valid: false,
            error: 'ප්‍රමාණය 20MB ට වඩා අඩු විය යුතුය'
        };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'JPEG, PNG, සහ GIF ඡායාරූප පමණයි'
        };
    }
    
    return { valid: true };
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Auto-refresh hire details every 30 seconds
setInterval(loadHireDetails, 30000);
