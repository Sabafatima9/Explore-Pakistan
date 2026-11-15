/* ============================================================
   EXPLORE PAKISTAN -- Contact Page JavaScript
   All logic is written using plain functions -- no classes used.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initContactForm();
  initFaqAccordion();
});

/* ---- Contact form setup and validation ---- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateForm(form)) {
      submitForm(form);
    }
  });

  /* Real-time validation on blur */
  var fields = form.querySelectorAll('input, textarea, select');
  fields.forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(field);
    });
    field.addEventListener('input', function () {
      clearError(field);
    });
  });
}

/* ---- Validate entire form; returns true if all fields valid ---- */
function validateForm(form) {
  var valid = true;

  var nameField    = form.querySelector('#contactName');
  var emailField   = form.querySelector('#contactEmail');
  var subjectField = form.querySelector('#contactSubject');
  var messageField = form.querySelector('#contactMessage');

  if (!validateField(nameField))    valid = false;
  if (!validateField(emailField))   valid = false;
  if (!validateField(subjectField)) valid = false;
  if (!validateField(messageField)) valid = false;

  return valid;
}

/* ---- Validate a single field; returns true if valid ---- */
function validateField(field) {
  if (!field) return true;

  var value = field.value.trim();
  var id    = field.id;

  clearError(field);

  if (value === '') {
    showError(field, getFieldLabel(id) + ' is required.');
    return false;
  }

  if (id === 'contactEmail') {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(field, 'Please enter a valid email address.');
      return false;
    }
  }

  if (id === 'contactName' && value.length < 2) {
    showError(field, 'Name must be at least 2 characters.');
    return false;
  }

  if (id === 'contactMessage' && value.length < 15) {
    showError(field, 'Message must be at least 15 characters.');
    return false;
  }

  field.classList.add('valid');
  return true;
}

/* ---- Show an error message for a field ---- */
function showError(field, message) {
  field.classList.add('error');
  field.classList.remove('valid');

  var errorEl = field.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

/* ---- Clear error state for a field ---- */
function clearError(field) {
  field.classList.remove('error');
  var errorEl = field.parentElement.querySelector('.field-error');
  if (errorEl) errorEl.textContent = '';
}

/* ---- Get a human-readable label for a field id ---- */
function getFieldLabel(id) {
  var labels = {
    contactName:    'Full name',
    contactEmail:   'Email address',
    contactSubject: 'Subject',
    contactMessage: 'Message'
  };
  return labels[id] || 'This field';
}

/* ---- Simulate form submission (no backend needed) ---- */
function submitForm(form) {
  var submitBtn = form.querySelector('#submitBtn');

  if (submitBtn) {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  }

  /* Simulate async delay */
  setTimeout(function () {
    if (submitBtn) {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
    showFormSuccess(form);
  }, 1800);
}

/* ---- Show success state after submission ---- */
function showFormSuccess(form) {
  var successBox = document.getElementById('formSuccess');
  if (successBox) {
    form.style.display = 'none';
    successBox.style.display = 'flex';
  } else {
    showToast('Message sent! We will get back to you soon.');
    form.reset();
    form.querySelectorAll('input, textarea, select').forEach(function (f) {
      f.classList.remove('valid', 'error');
    });
  }
}

/* ---- Reset form from success state ---- */
function resetContactForm() {
  var form       = document.getElementById('contactForm');
  var successBox = document.getElementById('formSuccess');
  if (form && successBox) {
    successBox.style.display = 'none';
    form.style.display = 'block';
    form.reset();
    form.querySelectorAll('input, textarea, select').forEach(function (f) {
      f.classList.remove('valid', 'error');
    });
  }
}

/* ---- FAQ accordion ---- */
function initFaqAccordion() {
  var items = document.querySelectorAll('.faq-item');

  items.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      /* Close all */
      items.forEach(function (i) { i.classList.remove('open'); });

      /* Open clicked if it was closed */
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* Expose globally */
window.resetContactForm = resetContactForm;
