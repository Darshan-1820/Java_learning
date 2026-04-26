/* ========================================
   NIMBUS — Navbar Builder
   Clean top bar: Logo | Page Title | User Info + Logout
   Hamburger menu for info pages (About, How It Works, Pricing)
   ======================================== */

const NimbusNav = {

  render(pageTitle, activeLink) {
    const session = NimbusDB.getSession();
    if (!session) { window.location.href = '../login.html'; return; }

    const nav = document.createElement('nav');
    nav.className = 'top-nav';
    nav.innerHTML = `
      <div class="nav-left">
        <button class="hamburger-btn" onclick="NimbusNav.toggleMenu()" aria-label="Menu">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <a href="dashboard.html" class="nav-logo">
          <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 40H16a10 10 0 0 1-1.2-19.9 12 12 0 0 1 22.9-2.3A8 8 0 0 1 44 26a8 8 0 0 1-6 7.7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M30 32l6-6m0 0l-6-6m6 6H20" stroke="#54A0FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="54" y="36" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="26" fill="white">nimbus</text>
          </svg>
        </a>
      </div>
      <div class="nav-center">
        ${activeLink !== 'dashboard.html' ? '<a href="dashboard.html" class="nav-back" title="Back to Dashboard"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg></a>' : ''}
        ${pageTitle}
      </div>
      <div class="nav-right">
        <div class="nav-user-info">
          <div class="nav-user-name">${session.fullName}</div>
          <div class="nav-user-id">${session.userId}</div>
        </div>
        <button class="btn-logout" onclick="NimbusAuth.logout()">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    `;

    document.body.prepend(nav);

    // Side menu (slides from left)
    const menu = document.createElement('div');
    menu.className = 'side-menu';
    menu.id = 'sideMenu';
    menu.innerHTML = `
      <div class="side-menu-overlay" onclick="NimbusNav.toggleMenu()"></div>
      <div class="side-menu-panel">
        <div class="side-menu-header">
          <span>Menu</span>
          <button class="side-menu-close" onclick="NimbusNav.toggleMenu()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <a href="dashboard.html" class="side-menu-link ${activeLink === 'dashboard.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </a>
        <a href="profile.html" class="side-menu-link ${activeLink === 'profile.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          My Profile
        </a>

        <div class="side-menu-divider"></div>
        <div class="side-menu-section">Information</div>

        <a href="#" class="side-menu-link" onclick="NimbusNav.showInfoPanel('about'); return false;">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          About Nimbus
        </a>
        <a href="#" class="side-menu-link" onclick="NimbusNav.showInfoPanel('how'); return false;">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          How It Works
        </a>
        <a href="#" class="side-menu-link" onclick="NimbusNav.showInfoPanel('pricing'); return false;">
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Pricing Structure
        </a>

        <!-- Info Panels (hidden by default) -->
        <div class="info-panel" id="infoAbout" style="display:none;">
          <h4>About Nimbus</h4>
          <p>Nimbus is a modern parcel management system built for speed, reliability, and transparency. We handle everything from booking to doorstep delivery with real-time tracking at every step.</p>
          <p style="margin-top:8px;">Whether you're sending documents across the city or shipping products nationwide, Nimbus ensures your parcel reaches safely and on time.</p>
          <p style="margin-top:12px; font-size:0.75rem; color:var(--nimbus-text-light);">Founded 2026 &middot; Trusted by thousands</p>
        </div>

        <div class="info-panel" id="infoHow" style="display:none;">
          <h4>How It Works</h4>
          <div class="info-step"><span class="info-step-num">1</span><div><strong>Book</strong><p>Fill in sender & receiver details, select shipping speed and packaging.</p></div></div>
          <div class="info-step"><span class="info-step-num">2</span><div><strong>Pay</strong><p>Pay securely via card. Get your Booking ID instantly.</p></div></div>
          <div class="info-step"><span class="info-step-num">3</span><div><strong>Pickup</strong><p>Our officer schedules a pickup from your location.</p></div></div>
          <div class="info-step"><span class="info-step-num">4</span><div><strong>Track</strong><p>Track your parcel in real-time — Booked → Picked Up → In Transit → Delivered.</p></div></div>
        </div>

        <div class="info-panel" id="infoPricing" style="display:none;">
          <h4>Pricing Structure</h4>
          <table class="pricing-table">
            <tr><th>Component</th><th>Rate</th></tr>
            <tr><td>Base rate</td><td>₹0.15 / gram</td></tr>
            <tr><td>Standard delivery</td><td>1x (5-7 days)</td></tr>
            <tr><td>Express delivery</td><td>1.8x (2-3 days)</td></tr>
            <tr><td>Overnight delivery</td><td>3x (next day)</td></tr>
            <tr><td>Custom packaging</td><td>+₹50</td></tr>
            <tr><td>Eco-friendly pkg</td><td>+₹30</td></tr>
            <tr><td>Fragile handling</td><td>+₹80</td></tr>
            <tr><td>Basic insurance</td><td>2% of value</td></tr>
            <tr><td>Premium insurance</td><td>5% of value</td></tr>
          </table>
          <p style="margin-top:8px; font-size:0.75rem; color:var(--nimbus-text-light);">Minimum charge: ₹50</p>
        </div>
      </div>
    `;
    document.body.appendChild(menu);
  },

  toggleMenu() {
    const menu = document.getElementById('sideMenu');
    menu.classList.toggle('open');
  },

  showInfoPanel(panel) {
    const panels = { about: 'infoAbout', how: 'infoHow', pricing: 'infoPricing' };
    Object.values(panels).forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    const target = document.getElementById(panels[panel]);
    target.style.display = target.style.display === 'none' ? 'block' : 'none';
  }
};
