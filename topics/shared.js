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

// ====== BUILD "ON THIS PAGE" SECTION IN SIDEBAR ======
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const headings = document.querySelectorAll('.content-section h3, .content-section[id]');
  const currentPage = window.location.pathname.split('/').pop();

  if (sidebar && headings.length > 0) {
    // Collect sections (h3 with an id, or content-section with id)
    const tocItems = [];
    document.querySelectorAll('.content-section').forEach(section => {
      if (section.id) {
        const h2 = section.querySelector('h2');
        if (h2) tocItems.push({ id: section.id, text: h2.textContent.trim() });
      }
    });

    if (tocItems.length > 1) {
      // Build "On This Page" nav at top of sidebar
      const tocSection = document.createElement('div');
      tocSection.className = 'sidebar-section';
      tocSection.innerHTML = '<div class="sidebar-label" style="color: #22C55E;">On This Page</div>';

      tocItems.forEach(item => {
        const link = document.createElement('a');
        link.href = '#' + item.id;
        link.className = 'sidebar-link toc-link';
        link.textContent = item.text.length > 28 ? item.text.substring(0, 28) + '...' : item.text;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' });
        });
        tocSection.appendChild(link);
      });

      // Add separator
      const sep = document.createElement('div');
      sep.style.cssText = 'border-bottom: 1px solid rgba(148,163,184,0.1); margin: 16px 16px 8px;';

      // Insert at top of sidebar
      sidebar.insertBefore(sep, sidebar.firstChild);
      sidebar.insertBefore(tocSection, sidebar.firstChild);
    }
  }

  // Highlight current page in sidebar topic list
  document.querySelectorAll('.sidebar-link:not(.toc-link)').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Track scroll position for "On This Page" links
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.content-section[id]');

  if (tocLinks.length && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector('.toc-link[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(s => observer.observe(s));
  }
});
