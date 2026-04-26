/* ========================================
   NIMBUS — API Storage Layer
   Drop-in replacement for storage.js

   Instead of LocalStorage, this calls the REST API
   at http://localhost:8080/api/*

   HOW TO USE:
   In your HTML files, replace:
     <script src="js/storage.js"></script>
   with:
     <script src="js/storage-api.js"></script>

   The NimbusDB interface is identical — all existing code works.
   ======================================== */

const API_BASE = 'http://localhost:8080/api';

const NimbusDB = {

  // --- Keys (kept for compatibility) ---
  KEYS: {
    USERS: 'nimbus_users',
    BOOKINGS: 'nimbus_bookings',
    ISSUES: 'nimbus_issues',
    SESSION: 'nimbus_session',
    INITIALIZED: 'nimbus_initialized',
    VERSION: 'nimbus_version'
  },

  CURRENT_VERSION: 5,

  // --- Initialize (no-op — backend handles seeding) ---
  init() {
    console.log('[NimbusDB] API mode active. Backend: ' + API_BASE);
  },

  // ====== USER OPERATIONS ======

  async getUsers() {
    try {
      const res = await fetch(API_BASE + '/auth/users');
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error('API error:', e);
      return [];
    }
  },

  async getUserById(userId) {
    try {
      const res = await fetch(API_BASE + '/auth/user/' + userId);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (e) {
      return null;
    }
  },

  getUserByEmail(email) {
    // This is used for duplicate check — handled server-side during registration
    return null;
  },

  async addUser(user) {
    // Registration is handled by NimbusAuth.register() which calls the API
    return user;
  },

  async validateLogin(userId, password) {
    try {
      const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      const data = await res.json();

      if (data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Invalid credentials.' };
      }
    } catch (e) {
      return { success: false, message: 'Server connection failed.' };
    }
  },

  generateUserId(firstName, lastName) {
    // Server generates this during registration
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const initials = (firstName[0] + lastName[0]).toUpperCase();
    return `${yy}${mm}${dd}-${initials}00`;
  },

  // ====== SESSION (still uses sessionStorage — browser-side) ======

  setSession(user) {
    const session = {
      userId: user.userId,
      fullName: user.fullName,
      role: user.role,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
  },

  getSession() {
    return JSON.parse(sessionStorage.getItem(this.KEYS.SESSION) || 'null');
  },

  clearSession() {
    sessionStorage.removeItem(this.KEYS.SESSION);
  },

  isLoggedIn() {
    return this.getSession() !== null;
  },

  // ====== BOOKING OPERATIONS ======

  async getBookings() {
    try {
      const res = await fetch(API_BASE + '/bookings/history?role=officer');
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      return [];
    }
  },

  async getBookingById(bookingId) {
    try {
      const res = await fetch(API_BASE + '/bookings/' + bookingId);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (e) {
      return null;
    }
  },

  async getBookingsByUser(userId) {
    try {
      const res = await fetch(API_BASE + '/bookings/history?userId=' + userId + '&role=customer');
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      return [];
    }
  },

  async getBookingsByDateRange(userId, startDate, endDate) {
    let url = API_BASE + '/bookings/history?role=officer';
    if (userId) url += '&userId=' + userId;
    if (startDate) url += '&startDate=' + startDate;
    if (endDate) url += '&endDate=' + endDate;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      return [];
    }
  },

  async addBooking(booking) {
    try {
      const res = await fetch(API_BASE + '/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: booking.userId,
          recName: booking.recName,
          recAddress: booking.recAddress,
          recPin: booking.recPin,
          recMobile: booking.recMobile,
          parWeightGram: booking.parWeightGram,
          parContentsDescription: booking.parContentsDescription,
          parDeliveryType: booking.parDeliveryType,
          parPackingPreference: booking.parPackingPreference,
          paymentMethod: booking.paymentMethod || 'card'
        })
      });
      const data = await res.json();
      return data.data || booking;
    } catch (e) {
      console.error('Booking API error:', e);
      return null;
    }
  },

  async updateBooking(bookingId, updates) {
    try {
      if (updates.parStatus) {
        const res = await fetch(API_BASE + '/bookings/' + bookingId + '/delivery-status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: updates.parStatus })
        });
        const data = await res.json();
        return data.data || null;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  generateBookingId() {
    // Server generates this — return placeholder
    return 'NMB-000000-0000';
  },

  // ====== ISSUE OPERATIONS ======

  async getIssues() {
    try {
      const res = await fetch(API_BASE + '/issues');
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      return [];
    }
  },

  async addIssue(issue) {
    try {
      const res = await fetch(API_BASE + '/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue)
      });
      const data = await res.json();
      return data.data || issue;
    } catch (e) {
      return null;
    }
  },

  async updateIssue(issueId, updates) {
    try {
      const res = await fetch(API_BASE + '/issues/' + issueId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      return data.data || null;
    } catch (e) {
      return null;
    }
  },

  // ====== UTILITY ======

  resetAll() {
    sessionStorage.removeItem(this.KEYS.SESSION);
    console.log('[NimbusDB] Session cleared. Database managed by server.');
  }
};

// Initialize on load
NimbusDB.init();
