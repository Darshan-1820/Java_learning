/* ========================================
   NIMBUS — Shared Utilities
   Auto-applied to all pages that include this file.
   ======================================== */

// Block non-numeric input on fields with inputmode="numeric" or data-numeric
document.addEventListener('DOMContentLoaded', function () {

  // Any input with data-numeric="true" or inputmode="numeric" — strip letters on input
  document.addEventListener('input', function (e) {
    const el = e.target;
    if (el.tagName !== 'INPUT') return;

    if (el.dataset.numeric === 'true' || el.getAttribute('inputmode') === 'numeric') {
      // Allow only digits (and / for expiry fields)
      if (el.dataset.allowSlash === 'true') {
        el.value = el.value.replace(/[^\d\/]/g, '');
      } else if (el.dataset.allowSpace === 'true') {
        el.value = el.value.replace(/[^\d ]/g, '');
      } else {
        el.value = el.value.replace(/\D/g, '');
      }
    }
  });

  // Also block keypress for numeric fields (prevents letters from appearing at all)
  document.addEventListener('keypress', function (e) {
    const el = e.target;
    if (el.tagName !== 'INPUT') return;

    if (el.dataset.numeric === 'true' || el.getAttribute('inputmode') === 'numeric') {
      // Allow: digits, backspace, delete, tab, arrow keys, enter
      const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'];
      if (allowed.includes(e.key)) return;

      // Allow / for expiry
      if (el.dataset.allowSlash === 'true' && e.key === '/') return;

      // Block anything that's not a digit
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }
  });
});
