// TravelGo Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    populatePassengersDropdown();
    showSection('addHire'); // Show add hire section by default
});

// Initialize admin panel
function initializeAdmin() {
    initializeHireForm();
    initializeDateInput();
    loadActiveHires();
    loadAllBids();
}

// Initialize date input with minimum date as today
function initializeDateInput() {
    const pickupDateInput = document.getElementById('pickupDate');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    pickupDateInput.min = todayString;
}

// Initialize hire form
function initializeHireForm() {
    const form = document.getElementById('hireForm');
    form.addEventListener('submit', handleHireSubmission);
}

// Populate passengers dropdown (1-50)
function populatePassengersDropdown() {
    const select = document.getElementById('passengers');
    for (let i = 1; i <= 50; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} ${i === 1 ? 'Person' : 'People'}`;
        select.appendChild(option);
    }
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    document.getElementById('addHireSection').style.display = 'none';
    document.getElementById('viewHiresSection').style.display = 'none';
    document.getElementById('viewBidsSection').style.display = 'none';
    
    // Show selected section
    switch(sectionName) {
        case 'addHire':
            document.getElementById('addHireSection').style.display = 'block';
            break;
        case 'viewHires':
            document.getElementById('viewHiresSection').style.display = 'block';
            loadActiveHires();
            break;
        case 'viewBids':
            document.getElementById('viewBidsSection').style.display = 'block';
            loadAllBids();
            break;
    }
}

// Handle hire form submission
async function handleHireSubmission(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const submitText = document.getElementById('hireSubmitText');
    const submitLoading = document.getElementById('hireSubmitLoading');
    
    // Show loading state
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-block';
    
    try {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // Debug: Log the form data
        console.log('Form data being submitted:', data);
        
        // Validate required fields
        const requiredFields = ['pickup_location', 'dropoff_location', 'pickup_date', 'hire_type', 'vehicle_type', 'passengers', 'ac_preference', 'duration_days'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                missingFields.push(field.replace('_', ' '));
            }
        }
        
        if (missingFields.length > 0) {
            throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }
        
        // Convert passengers and duration to numbers
        data.passengers = parseInt(data.passengers);
        data.duration_days = parseInt(data.duration_days);
        
        if (isNaN(data.passengers) || isNaN(data.duration_days)) {
            throw new Error('Passengers and duration must be valid numbers');
        }
        
        // Validate pickup date
        const pickupDate = new Date(data.pickup_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (pickupDate < today) {
            throw new Error('Pickup date cannot be in the past');
        }
        
        console.log('Sending request to server...');
        
        const response = await fetch('/api/hire', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response data:', result);
        
        if (!response.ok) {
            throw new Error(result.error || `Server error: ${response.status}`);
        }
        
        showAlert('Hire request created successfully!', 'success');
        event.target.reset();
        
        // Reset date input minimum
        initializeDateInput();
        
        // Refresh the active hires list if viewing that section
        if (document.getElementById('viewHiresSection').style.display !== 'none') {
            loadActiveHires();
        }
        
    } catch (error) {
        console.error('Error creating hire request:', error);
        showAlert(error.message || 'Failed to create hire request', 'error');
    } finally {
        // Reset loading state
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    }
}

// Load active hire requests
async function loadActiveHires() {
    try {
        const response = await fetch('/api/hire');
        const hires = await response.json();
        
        const container = document.getElementById('activeHiresContainer');
        
        if (hires.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Active Hire Requests</h3>
                    <p>You haven't created any hire requests yet.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = hires.map(hire => createHireCard(hire)).join('');
        
    } catch (error) {
        console.error('Error loading active hires:', error);
        showAlert('Error loading active hires', 'error');
    }
}

// Create hire card HTML
function createHireCard(hire) {
    const hireTypeDisplay = formatHireType(hire.hire_type);
    const vehicleTypeDisplay = formatVehicleType(hire.vehicle_type);
    const durationDisplay = hire.duration_days === 1 ? '1 Day' : `${hire.duration_days} Days`;
    const createdDate = new Date(hire.created_at).toLocaleDateString();
    const pickupDateDisplay = new Date(hire.pickup_date).toLocaleDateString();
    
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${hire.pickup_location} → ${hire.dropoff_location}</h3>
                <p class="card-subtitle">Pickup: ${pickupDateDisplay} | Created: ${createdDate}</p>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Hire Type:</span>
                <span class="detail-value">${hireTypeDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Vehicle Type:</span>
                <span class="detail-value">${vehicleTypeDisplay}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Passengers:</span>
                <span class="detail-value">${hire.passengers}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">AC Preference:</span>
                <span class="detail-value">${hire.ac_preference}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${durationDisplay}</span>
            </div>
            
            ${hire.additional_data ? `
            <div class="detail-item">
                <span class="detail-label">Additional Requirements:</span>
                <span class="detail-value">${hire.additional_data}</span>
            </div>
            ` : ''}
            
            <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button onclick="viewHireBids(${hire.id})" class="btn btn-primary">
                    View Bids
                </button>
                <button onclick="deactivateHire(${hire.id})" class="btn btn-danger">
                    Deactivate
                </button>
            </div>
        </div>
    `;
}

// Load all bids
async function loadAllBids() {
    try {
        const response = await fetch('/api/bid');
        const bids = await response.json();
        
        const container = document.getElementById('allBidsContainer');
        
        if (bids.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Bids Submitted</h3>
                    <p>No vehicle owners have submitted bids yet.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = bids.map(bid => createBidCard(bid)).join('');
        
    } catch (error) {
        console.error('Error loading bids:', error);
        showAlert('Error loading bids', 'error');
    }
}

// Create bid card HTML
function createBidCard(bid) {
    const submittedDate = new Date(bid.submitted_at).toLocaleDateString();
    const submittedTime = new Date(bid.submitted_at).toLocaleTimeString();
    const hireTypeDisplay = formatHireType(bid.hire_type);
    
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${bid.owner_name} - ${bid.vehicle_type}</h3>
                <p class="card-subtitle">
                    For: ${bid.pickup_location} → ${bid.dropoff_location} (${hireTypeDisplay})<br>
                    Submitted: ${submittedDate} at ${submittedTime}
                </p>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Vehicle Type:</span>
                <span class="detail-value">${formatVehicleType(bid.vehicle_type)}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Price per KM (AC):</span>
                <span class="detail-value highlight">LKR ${parseFloat(bid.price_per_km_ac).toFixed(2)}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Price per KM (Non-AC):</span>
                <span class="detail-value highlight">LKR ${parseFloat(bid.price_per_km_non_ac).toFixed(2)}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Full Hire Price:</span>
                <span class="detail-value highlight">LKR ${parseFloat(bid.full_hire_price).toFixed(2)}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Phone Number:</span>
                <span class="detail-value">${bid.phone_number}</span>
            </div>
            
            ${(bid.photo1_path || bid.photo2_path) ? `
            <div style="margin: 1rem 0;">
                <strong>Vehicle Photos:</strong>
                <div class="photo-container">
                    ${bid.photo1_path ? `
                    <div class="photo-item">
                        <img src="${bid.photo1_path}" alt="Vehicle Photo 1" onclick="openPhotoModal('${bid.photo1_path}')">
                    </div>
                    ` : ''}
                    ${bid.photo2_path ? `
                    <div class="photo-item">
                        <img src="${bid.photo2_path}" alt="Vehicle Photo 2" onclick="openPhotoModal('${bid.photo2_path}')">
                    </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 1rem;">
                <button onclick="deleteBid(${bid.id})" class="btn btn-danger">
                    Delete Bid
                </button>
            </div>
        </div>
    `;
}

// View bids for specific hire request
async function viewHireBids(hireId) {
    try {
        const response = await fetch(`/api/hire/${hireId}/bids`);
        const bids = await response.json();
        
        if (bids.length === 0) {
            showAlert('No bids have been submitted for this hire request yet.', 'info');
            return;
        }
        
        // Switch to bids section and filter by hire ID
        showSection('viewBids');
        
        const container = document.getElementById('allBidsContainer');
        container.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <button onclick="loadAllBids()" class="btn btn-secondary">Show All Bids</button>
            </div>
            ${bids.map(bid => createBidCard(bid)).join('')}
        `;
        
    } catch (error) {
        console.error('Error loading hire bids:', error);
        showAlert('Error loading bids for this hire request', 'error');
    }
}

// Deactivate hire request
async function deactivateHire(hireId) {
    if (!confirm('Are you sure you want to deactivate this hire request? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/hire/${hireId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to deactivate hire request');
        }
        
        showAlert('Hire request deactivated successfully', 'success');
        loadActiveHires(); // Refresh the list
        
    } catch (error) {
        console.error('Error deactivating hire:', error);
        showAlert(error.message, 'error');
    }
}

// Delete bid
async function deleteBid(bidId) {
    if (!confirm('Are you sure you want to delete this bid? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/bid/${bidId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to delete bid');
        }
        
        showAlert('Bid deleted successfully', 'success');
        loadAllBids(); // Refresh the list
        
    } catch (error) {
        console.error('Error deleting bid:', error);
        showAlert(error.message, 'error');
    }
}

// Open photo modal (simple implementation)
function openPhotoModal(photoPath) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90%; max-height: 90%; padding: 0; background: transparent;">
            <div style="position: relative;">
                <button onclick="this.closest('.modal').remove()" class="close" 
                        style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); 
                               color: white; border: none; padding: 5px 10px; border-radius: 5px; z-index: 1001;">
                    &times;
                </button>
                <img src="${photoPath}" alt="Vehicle Photo" 
                     style="width: 100%; height: auto; border-radius: 8px;">
            </div>
        </div>
    `;
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
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

// Auto-refresh data every 30 seconds when viewing bids or hires
setInterval(() => {
    if (document.getElementById('viewHiresSection').style.display !== 'none') {
        loadActiveHires();
    }
    if (document.getElementById('viewBidsSection').style.display !== 'none') {
        loadAllBids();
    }
}, 30000);
