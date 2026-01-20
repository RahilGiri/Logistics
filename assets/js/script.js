'use strict';



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < navToggler.length; i++) {
  navToggler[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  });
}



/**
 * header
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

// Super Fast Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 1500; // 1.5 seconds for super fast animation
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        // Format the number based on size
        if (target >= 1000) {
          counter.textContent = Math.floor(current / 1000) + 'K+';
        } else {
          counter.textContent = Math.floor(current) + (target < 100 ? '+' : '');
        }
        requestAnimationFrame(updateCounter);
      } else {
        // Final value
        if (target >= 1000) {
          counter.textContent = (target / 1000) + 'K+';
        } else {
          counter.textContent = target + (target < 100 ? '+' : '');
        }
      }
    };
    
    // Start animation when element comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// Initialize counter animations
document.addEventListener('DOMContentLoaded', animateCounters);
window.addEventListener('load', animateCounters);

// Re-initialize on page refresh
window.addEventListener('beforeunload', () => {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    counter.textContent = '0';
  });
});

// Requirement Form Handler
function handleRequirementForm() {
  const form = document.getElementById('requirementForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Create email body
      const emailBody = `
New Logistics Requirement Submitted

CUSTOMER INFORMATION:
Name: ${data.customerName}
Phone: ${data.customerPhone}
Email: ${data.customerEmail}
Company: ${data.companyName || 'Not provided'}

SHIPMENT DETAILS:
Pickup Location: ${data.pickupLocation}
Delivery Location: ${data.deliveryLocation}
Shipment Type: ${data.shipmentType}
Truck Type: ${data.truckType || 'Not specified'}

CARGO SPECIFICATIONS:
Weight: ${data.weight} tons
Height: ${data.height || 'Not specified'} feet
Length: ${data.length || 'Not specified'} feet
Width: ${data.width || 'Not specified'} feet
Cargo Description: ${data.cargoDescription}

ADDITIONAL REQUIREMENTS:
Special Requirements: ${data.specialRequirements || 'None'}
Urgency Level: ${data.urgency || 'Normal'}
Budget Range: ${data.budget || 'Not specified'}

---
This requirement was submitted from your website.
      `;
      
      // Send email using mailto
      const mailtoLink = `mailto:info@transcorelogistics.in?subject=New Logistics Requirement - ${data.customerName}&body=${encodeURIComponent(emailBody)}`;
      
      // Show success message
      showNotification('Form submitted successfully! Please check your email client to send the details.', 'success');
      
      // Open email client
      window.open(mailtoLink);
      
      // Reset form
      form.reset();
    });
  }
}

// Contact Form Handler
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Collect form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission (replace with actual Formspree endpoint)
      setTimeout(() => {
        // Show success message
        showNotification('Thank you for your message! Our team will contact you within 24 hours.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
}

// Improved Reset Functionality for Requirement Form
function improveResetFunctionality() {
  const resetBtn = document.querySelector('.btn-secondary');
  
  if (resetBtn) {
    resetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show confirmation dialog
      if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        const form = document.getElementById('requirementForm');
        form.reset();
        
        // Show success notification
        showNotification('Form has been reset successfully!', 'success');
        
        // Reset all form field styles
        const formFields = form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
          field.style.borderColor = '';
        });
      }
    });
  }
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Add icon based on type
  let icon = '';
  switch(type) {
    case 'success':
      icon = '✓';
      break;
    case 'error':
      icon = '✕';
      break;
    case 'info':
      icon = 'ℹ';
      break;
  }
  
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#51cf66' : type === 'error' ? '#ff6b6b' : '#339af0'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto remove after 6 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 6000);
}

// Form validation
function validateForm() {
  const form = document.getElementById('requirementForm');
  
  if (form) {
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      field.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.style.borderColor = '#ff6b6b';
          showNotification('Please fill in all required fields.', 'error');
        } else {
          this.style.borderColor = '#51cf66';
        }
      });
    });
  }
}

// Initialize all form handlers
document.addEventListener('DOMContentLoaded', function() {
  handleRequirementForm();
  handleContactForm();
  validateForm();
  improveResetFunctionality();
});

// Add enhanced CSS for notifications
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-left: 10px;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .notification-close:hover {
    opacity: 1;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  
  .notification-icon {
    font-size: 18px;
    font-weight: bold;
  }
  
  .notification-message {
    flex: 1;
    line-height: 1.4;
  }
  
  /* Loading state for submit buttons */
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
document.head.appendChild(enhancedStyle);