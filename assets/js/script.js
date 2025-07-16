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

// === TESTIMONIALS CAROUSEL ===
function initTestimonialsCarousel() {
  const carousel = document.getElementById('testimonialsCarousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const leftBtn = carousel.querySelector('.carousel-arrow.left');
  const rightBtn = carousel.querySelector('.carousel-arrow.right');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  let current = 0;
  let interval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
      dots[i].classList.toggle('active', i === idx);
    });
    current = idx;
  }
  function nextSlide() { showSlide((current + 1) % slides.length); }
  function prevSlide() { showSlide((current - 1 + slides.length) % slides.length); }
  function goToSlide(idx) { showSlide(idx); resetInterval(); }

  leftBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
  rightBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

  // Auto-play
  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }
  resetInterval();

  // Swipe support for mobile
  let startX = null;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  carousel.addEventListener('touchend', e => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 40) { prevSlide(); resetInterval(); }
    else if (startX - endX > 40) { nextSlide(); resetInterval(); }
    startX = null;
  });
}
document.addEventListener('DOMContentLoaded', initTestimonialsCarousel);

// === FAQ ACCORDION ===
function initFAQAccordion() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;
  const items = accordion.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const expanded = question.getAttribute('aria-expanded') === 'true';
      // Collapse all
      accordion.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));
      accordion.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Expand this one if it was not already open
      if (!expanded) {
        question.setAttribute('aria-expanded', 'true');
        item.classList.add('open');
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', initFAQAccordion);

// === CHATBOT WIDGET ===
function initChatbotWidget() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const prompt = document.getElementById('chatbot-prompt');

  function openChat() {
    windowEl.classList.remove('chatbot-closed');
    windowEl.classList.add('chatbot-open');
    if (prompt) prompt.style.display = 'none';
    setTimeout(() => { input.focus(); }, 200);
  }
  function closeChat() {
    windowEl.classList.remove('chatbot-open');
    windowEl.classList.add('chatbot-closed');
    if (prompt) prompt.style.display = '';
  }
  toggleBtn.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  // Expanded FAQ/Info responses
  const faqAnswers = [
    // Shipping & Tracking
    { q: ["how do i book a shipment", "book a shipment"], a: "You can book a shipment through our website, app, or by sharing your pickup and delivery details here." },
    { q: ["maximum package weight", "max weight", "weight limit"], a: "We handle packages up to 1000 kg. For heavier cargo, please contact our support." },
    { q: ["cancel a shipment", "cancel shipment"], a: "Yes, cancellations are allowed before pickup. Let me know your tracking number to proceed." },
    { q: ["shipment is delayed", "delayed shipment", "my shipment is delayed"], a: "I’m sorry to hear that. Please provide your tracking ID so I can check the current status." },
    { q: ["proof of delivery", "pod"], a: "You can download the POD from our tracking page or request it here." },
    { q: ["shipment insurance", "offer insurance"], a: "Yes, we offer optional insurance for high-value shipments. Would you like to know the rates?" },
    { q: ["schedule pickups daily", "daily pickup", "business pickup"], a: "Absolutely! We offer scheduled daily pickups for business clients. Share your business details to get started." },
    { q: ["delivery from delhi to mumbai", "delivery time delhi mumbai"], a: "Standard delivery takes 2–3 days. Express delivery is available in 24–36 hours." },
    { q: ["no one available at delivery", "recipient not available"], a: "We will attempt delivery again or contact the recipient. You can reschedule or update the address." },
    { q: ["ship fragile items", "fragile item"], a: "Yes, just mark them as ‘Fragile’ during booking and we’ll handle them with extra care." },
    { q: ["packaging required", "packaging for shipping"], a: "Packages must be properly sealed and labeled. Fragile items should be bubble-wrapped." },
    { q: ["provide packing materials", "packing materials"], a: "Yes, we offer packing materials at an additional cost. Would you like to include them?" },
    { q: ["track parcel without logging in", "track without login"], a: "Yes, just enter your tracking ID on our Track Shipment page." },
    { q: ["cod available", "cash on delivery"], a: "Yes, COD is available for select pin codes and package types." },
    { q: ["change delivery address after dispatch", "change address after dispatch"], a: "Address changes are only possible before dispatch. Share your tracking number so I can check." },
    // Pricing, Payments & Charges
    { q: ["shipping rates calculated", "how are rates calculated"], a: "Rates depend on distance, weight, dimensions, and delivery speed." },
    { q: ["price calculator", "rate calculator"], a: "Yes, you can use our Rate Calculator or I can help you get an estimate." },
    { q: ["payment methods", "accept payment"], a: "We accept UPI, credit/debit cards, net banking, and wallet payments." },
    { q: ["hidden charges"], a: "No, all charges are shown upfront during booking." },
    { q: ["discounts for bulk shipping", "bulk shipping discount"], a: "Yes, we offer discounts for B2B clients and bulk orders." },
    { q: ["get invoice", "invoice for shipment"], a: "Invoices are automatically generated and can be downloaded after delivery." },
    { q: ["extra for express delivery", "express delivery fee"], a: "Yes, express delivery has a premium fee. I can show you the options." },
    { q: ["return policy for undelivered", "return undelivered"], a: "Undelivered shipments are returned to sender. Return charges may apply." },
    { q: ["charge for redelivery", "redelivery fee"], a: "First redelivery is free. Subsequent attempts may incur fees." },
    { q: ["monthly billing cycle", "monthly invoice"], a: "Yes, we provide monthly invoicing for registered business partners." },
    // Returns, Refunds & Complaints
    { q: ["package is damaged", "damaged package"], a: "Please share your tracking number and images. We’ll initiate a claim process." },
    { q: ["received wrong package", "wrong package"], a: "I’m sorry to hear that. Please provide your tracking ID for immediate help." },
    { q: ["raise a complaint", "complaint"], a: "You can use our support form or tell me your issue here and I’ll raise a ticket." },
    { q: ["refund process"], a: "Refunds are processed within 5–7 business days after verification." },
    { q: ["return a package", "return to sender"], a: "Yes, reverse logistics is supported. I’ll need your tracking number to start the return." },
    { q: ["complaint is resolved", "complaint status"], a: "We’ll notify you via SMS/email. You can also check status via your ticket ID." },
    { q: ["charge for returning goods", "return charge"], a: "Returns may involve charges depending on the agreement with the sender." },
    { q: ["reverse logistics for ecommerce", "reverse logistics"], a: "Yes, we handle returns, RTOs, and refunds for multiple eCommerce partners." },
    { q: ["how long do returns take", "returns take"], a: "Returns are usually completed within 4–7 business days." },
    { q: ["payment failed but money was deducted", "payment failed"], a: "Don’t worry — share your payment reference number. We’ll verify and process your refund." },
    // Business Clients & Partnerships
    { q: ["partner with you for my online store", "partner for online store"], a: "Awesome! Please share your store name and contact info — our sales team will connect with you." },
    { q: ["fulfillment services"], a: "Yes, we offer storage, packing, and dispatch services for online sellers." },
    { q: ["integrate with shopify", "integrate with woocommerce"], a: "Yes, we support plugins and APIs for easy integration with major platforms." },
    { q: ["refrigerated goods", "temperature-sensitive goods", "cold chain"], a: "Yes, we have cold chain logistics options. Please specify your product type." },
    { q: ["contact your business sales team", "business sales team"], a: "You can email us at business@transcorelogistics.com or share your contact here." },
    { q: ["gst-compliant invoices", "gst invoice"], a: "Yes, all invoices are GST-compliant and downloadable after delivery." },
    { q: ["warehouse locations"], a: "We have warehouses in Mumbai, Delhi, Ahmedabad, and Bengaluru. More locations coming soon." },
    { q: ["cross-docking services", "cross docking"], a: "Yes, we do. It helps speed up delivery and reduce storage time." },
    { q: ["schedule pickups from multiple locations", "multi-origin pickup"], a: "Yes, multi-origin pickup is available for business clients." },
    { q: ["delivery in rural areas", "rural areas"], a: "Yes, we serve over 15,000 pin codes including rural and semi-urban regions." },
    // General & Technical
    { q: ["mobile app"], a: "Yes, our Android and iOS apps are available on Play Store and App Store." },
    { q: ["data safe", "data security"], a: "Absolutely. We use end-to-end encryption and comply with GDPR/IT rules." },
    { q: ["api-based shipment creation", "api integration"], a: "Yes, we offer REST APIs for booking, tracking, and label generation." },
    { q: ["apply for a job", "careers"], a: "Visit our Careers Page or send your CV to careers@transcorelogistics.com." },
    { q: ["customer service hours", "service hours"], a: "We’re available from 9 AM to 8 PM, Monday to Saturday." },
    // Owner/Team
    { q: ["owner", "owners"], a: "Our owners are <b>Vikas</b> and <b>Anshul</b>." },
    { q: ["chief engineer", "engineer"], a: "Our chief engineer is <b>Rahil</b>." },
    { q: ["marketing chief", "marketing"], a: "Our marketing chief is <b>Rahil</b>." },
    { q: ["who", "company", "about"], a: "Transcore Logistics is a leading logistics company with 10+ years of experience, serving clients across India." },
    { q: ["hi", "hello", "hey"], a: "Hello! How can I help you today?" },
    // Default
    { q: ["phone", "contact", "number", "call"], a: "You can reach us at <b>+91 9664874523</b> or <b>+91 93068 62567</b>." },
    { q: ["email", "mail"], a: "Our email address is <b>info@transcorelogistics.in</b>." },
    { q: ["address", "office", "location"], a: "Our office is in <b>Vadodara, Gujarat, India</b>. We serve all India." },
    { q: ["city", "cities", "area", "cover", "where"], a: "We cover <b>all major cities and regions across India</b>." },
    { q: ["service", "work", "do", "offer", "provide"], a: "We provide <b>road freight, full truckload (FTL), LTL, express delivery, last mile delivery</b> and more." },
    { q: ["track", "tracking", "shipment", "consignment"], a: "You can track your shipment on our website or contact our support team 24/7." },
    { q: ["support", "help", "assist", "customer"], a: "Our support team is available <b>24/7</b> for your assistance." },
    { q: ["quote", "price", "cost", "estimate", "charge"], a: "For a quote, please fill out the 'Tell Us Your Requirements' form or contact us directly." },
  ];

  function getBotReply(text) {
    const t = text.toLowerCase();
    let bestMatch = null;
    let bestLength = 0;
    for (const entry of faqAnswers) {
      for (const phrase of entry.q) {
        // Match if phrase is a word or substring in the message
        if (t.includes(phrase) && phrase.length > bestLength) {
          bestMatch = entry.a;
          bestLength = phrase.length;
        } else {
          // Also match if any word in the phrase is present
          const words = phrase.split(/\s+/);
          for (const w of words) {
            if (w.length > 2 && t.includes(w) && w.length > bestLength - 2) {
              bestMatch = entry.a;
              bestLength = w.length;
            }
          }
        }
      }
    }
    if (bestMatch) return bestMatch;
    return "I'm sorry, I can answer questions about our company, services, contact, and logistics. Please ask something else or call us at <b>+91 9664874523</b>.";
  }

  function addMessage(msg, sender) {
    const div = document.createElement('div');
    div.className = 'chatbot-message chatbot-' + sender;
    div.innerHTML = msg;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    addMessage(userMsg, 'user');
    input.value = '';
    setTimeout(() => {
      const reply = getBotReply(userMsg);
      addMessage(reply, 'bot');
    }, 400);
  });
}
document.addEventListener('DOMContentLoaded', initChatbotWidget);