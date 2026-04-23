// ====== COPY BUTTON ======
function copyCode(button) {
  const codeBlock = button.closest('.code-block');
  const code = codeBlock.querySelector('code').textContent;

  navigator.clipboard.writeText(code).then(() => {
    button.classList.add('copied');
    button.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
    }, 2000);
  });
}

// ====== CODE BREAKDOWN TOGGLE ======
// Usage in HTML:
// <button class="code-breakdown-btn" onclick="toggleBreakdown(this)">
//   <svg width="14" height="14" ...chevron...></svg> Break it down
// </button>
// <div class="code-breakdown">
//   <div class="breakdown-header">Line-by-line explanation</div>
//   <div class="breakdown-line">
//     <div class="breakdown-num">1</div>
//     <div class="breakdown-content">
//       <div class="breakdown-code">public class User {</div>
//       <div class="breakdown-explain">Declares a new class called User...</div>
//     </div>
//   </div>
// </div>
function toggleBreakdown(button) {
  const breakdown = button.nextElementSibling;
  if (!breakdown) return;

  const isOpen = breakdown.classList.contains('open');
  breakdown.classList.toggle('open');
  button.classList.toggle('open');

  if (!isOpen) {
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg> Hide breakdown';
  } else {
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg> Break it down';
  }
}

// ====== ACTIVE SIDEBAR LINK ON SCROLL ======
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.content-section');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  if (sections.length && sidebarLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sidebarLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector('.sidebar-link[href="#' + entry.target.id + '"]');
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  // Highlight current page in sidebar
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});
