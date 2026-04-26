/* ========================================
   NIMBUS — Storage Layer
   All LocalStorage operations go through here.
   In Sprint 2+, swap these functions with API calls.
   ======================================== */

const NimbusDB = {

  // --- Keys ---
  KEYS: {
    USERS: 'nimbus_users',
    BOOKINGS: 'nimbus_bookings',
    ISSUES: 'nimbus_issues',
    SESSION: 'nimbus_session',
    INITIALIZED: 'nimbus_initialized',
    VERSION: 'nimbus_version'
  },

  // Bump this number whenever seed data structure changes
  CURRENT_VERSION: 4,

  // --- Initialize with seed data if first time or version mismatch ---
  init() {
    const storedVersion = parseInt(localStorage.getItem(this.KEYS.VERSION) || '0');

    // Also force re-seed if existing users lack structured fields
    let needsReseed = storedVersion < this.CURRENT_VERSION;
    if (!needsReseed) {
      try {
        const existing = JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
        if (existing.length > 0 && !existing[0].firstName) needsReseed = true;
      } catch(e) { needsReseed = true; }
    }
    if (!needsReseed) return;

    // Clear old data and re-seed
    localStorage.removeItem(this.KEYS.USERS);
    localStorage.removeItem(this.KEYS.BOOKINGS);
    localStorage.removeItem(this.KEYS.ISSUES);
    localStorage.removeItem(this.KEYS.INITIALIZED);

    // Seed users: 5 customers, 2 officers, 1 support
    const seedUsers = [
      {
        userId: '260401-AK01',
        firstName: 'Amit',
        middleName: '',
        lastName: 'Kumar',
        fullName: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        countryCode: '+91',
        mobile: '9876543210',
        street: '45 MG Road',
        zipCode: '560001',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        password: 'Amit@123',
        role: 'customer',
        preferences: 'Email notifications',
        createdAt: '2026-04-01T10:00:00'
      },
      {
        userId: '260401-PS02',
        firstName: 'Priya',
        middleName: '',
        lastName: 'Sharma',
        fullName: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        countryCode: '+91',
        mobile: '9876543211',
        street: '12 Nehru Place',
        zipCode: '110019',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        password: 'Priya@123',
        role: 'customer',
        preferences: 'SMS notifications',
        createdAt: '2026-04-01T10:15:00'
      },
      {
        userId: '260401-RV03',
        firstName: 'Rahul',
        middleName: '',
        lastName: 'Verma',
        fullName: 'Rahul Verma',
        email: 'rahul.verma@email.com',
        countryCode: '+91',
        mobile: '9876543212',
        street: '78 Park Street',
        zipCode: '700016',
        city: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        password: 'Rahul@123',
        role: 'customer',
        preferences: 'Email notifications',
        createdAt: '2026-04-01T10:30:00'
      },
      {
        userId: '260401-SM04',
        firstName: 'Sneha',
        middleName: '',
        lastName: 'Menon',
        fullName: 'Sneha Menon',
        email: 'sneha.menon@email.com',
        countryCode: '+91',
        mobile: '9876543213',
        street: '23 Anna Salai',
        zipCode: '600002',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        password: 'Sneha@123',
        role: 'customer',
        preferences: 'Both Email and SMS',
        createdAt: '2026-04-01T11:00:00'
      },
      {
        userId: '260401-DP05',
        firstName: 'Deepak',
        middleName: '',
        lastName: 'Patel',
        fullName: 'Deepak Patel',
        email: 'deepak.patel@email.com',
        countryCode: '+91',
        mobile: '9876543214',
        street: '56 SG Highway',
        zipCode: '380015',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        password: 'Deepak@123',
        role: 'customer',
        preferences: 'Email notifications',
        createdAt: '2026-04-01T11:15:00'
      },
      {
        userId: 'OFF-001',
        firstName: 'Rajesh',
        middleName: '',
        lastName: 'Nair',
        fullName: 'Rajesh Nair',
        email: 'rajesh.nair@nimbus.com',
        countryCode: '+91',
        mobile: '9000000001',
        street: 'TCS MIHAN SEZ',
        zipCode: '441108',
        city: 'Nagpur',
        state: 'Maharashtra',
        country: 'India',
        password: 'Officer@123',
        role: 'officer',
        preferences: '',
        createdAt: '2026-03-15T09:00:00'
      },
      {
        userId: 'OFF-002',
        firstName: 'Meera',
        middleName: '',
        lastName: 'Joshi',
        fullName: 'Meera Joshi',
        email: 'meera.joshi@nimbus.com',
        countryCode: '+91',
        mobile: '9000000002',
        street: 'Nimbus Branch, Koramangala',
        zipCode: '560034',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        password: 'Officer@123',
        role: 'officer',
        preferences: '',
        createdAt: '2026-03-15T09:00:00'
      },
      {
        userId: 'SUP-001',
        firstName: 'Karan',
        middleName: '',
        lastName: 'Singh',
        fullName: 'Karan Singh',
        email: 'karan.singh@nimbus.com',
        countryCode: '+91',
        mobile: '9000000003',
        street: 'Nimbus Support Center',
        zipCode: '201301',
        city: 'Noida',
        state: 'Uttar Pradesh',
        country: 'India',
        password: 'Support@123',
        role: 'support',
        preferences: '',
        createdAt: '2026-03-15T09:00:00'
      }
    ];

    // Seed bookings
    const seedBookings = [
      {
        bookingId: 'NMB-260401-0001',
        userId: '260401-AK01',
        recName: 'Vikram Reddy',
        recAddress: '90 Jubilee Hills, Hyderabad',
        recPin: '500033',
        recMobile: '+91-8765432100',
        parWeightGram: 500,
        parContentsDescription: 'Books and documents',
        parDeliveryType: 'Standard',
        parPackingPreference: 'Standard Packaging',
        parPickupTime: '2026-04-02T10:00:00',
        parDropoffTime: '2026-04-05T18:00:00',
        parServiceCost: 150,
        parPaymentTime: '2026-04-01T12:00:00',
        parStatus: 'In Transit',
        paymentMethod: 'card',
        createdAt: '2026-04-01T12:00:00'
      },
      {
        bookingId: 'NMB-260401-0002',
        userId: '260401-PS02',
        recName: 'Anita Desai',
        recAddress: '34 FC Road, Pune',
        recPin: '411005',
        recMobile: '+91-8765432101',
        parWeightGram: 1200,
        parContentsDescription: 'Electronics - Laptop charger',
        parDeliveryType: 'Express',
        parPackingPreference: 'Fragile Item Handling',
        parPickupTime: '2026-04-02T09:00:00',
        parDropoffTime: '2026-04-03T18:00:00',
        parServiceCost: 350,
        parPaymentTime: '2026-04-01T14:30:00',
        parStatus: 'Booked',
        paymentMethod: 'card',
        createdAt: '2026-04-01T14:30:00'
      },
      {
        bookingId: 'NMB-260401-0003',
        userId: '260401-RV03',
        recName: 'Suman Das',
        recAddress: '15 Salt Lake, Kolkata',
        recPin: '700091',
        recMobile: '+91-8765432102',
        parWeightGram: 2500,
        parContentsDescription: 'Clothing and accessories',
        parDeliveryType: 'Standard',
        parPackingPreference: 'Eco-friendly Packaging',
        parPickupTime: '2026-04-03T11:00:00',
        parDropoffTime: '2026-04-07T18:00:00',
        parServiceCost: 200,
        parPaymentTime: '2026-04-01T16:00:00',
        parStatus: 'Delivered',
        paymentMethod: 'card',
        createdAt: '2026-04-01T16:00:00'
      }
    ];

    localStorage.setItem(this.KEYS.USERS, JSON.stringify(seedUsers));
    localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(seedBookings));
    localStorage.setItem(this.KEYS.ISSUES, JSON.stringify([]));
    localStorage.setItem(this.KEYS.INITIALIZED, 'true');
    localStorage.setItem(this.KEYS.VERSION, String(this.CURRENT_VERSION));
  },

  // ====== USER OPERATIONS ======

  getUsers() {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
  },

  getUserById(userId) {
    return this.getUsers().find(u => u.userId === userId);
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email === email);
  },

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    return user;
  },

  validateLogin(userId, password) {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User ID not found.' };
    if (user.password !== password) return { success: false, message: 'Incorrect password.' };
    return { success: true, user };
  },

  generateUserId(firstName, lastName) {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const initials = (firstName[0] + lastName[0]).toUpperCase();

    const users = this.getUsers();
    const todayPrefix = `${yy}${mm}${dd}-${initials}`;
    const existingCount = users.filter(u => u.userId.startsWith(todayPrefix)).length;
    const seq = String(existingCount + 1).padStart(2, '0');

    return `${todayPrefix}${seq}`;
  },

  // ====== SESSION ======

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

  getBookings() {
    return JSON.parse(localStorage.getItem(this.KEYS.BOOKINGS) || '[]');
  },

  getBookingById(bookingId) {
    return this.getBookings().find(b => b.bookingId === bookingId);
  },

  getBookingsByUser(userId) {
    return this.getBookings()
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getBookingsByDateRange(userId, startDate, endDate) {
    return this.getBookings()
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        const matchUser = userId ? b.userId === userId : true;
        const matchStart = startDate ? bookingDate >= new Date(startDate) : true;
        const matchEnd = endDate ? bookingDate <= new Date(endDate + 'T23:59:59') : true;
        return matchUser && matchStart && matchEnd;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  addBooking(booking) {
    const bookings = this.getBookings();
    bookings.push(booking);
    localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    return booking;
  },

  updateBooking(bookingId, updates) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);
    if (index === -1) return null;
    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  },

  generateBookingId() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const bookings = this.getBookings();
    const seq = String(bookings.length + 1).padStart(4, '0');
    return `NMB-${yy}${mm}${dd}-${seq}`;
  },

  // ====== ISSUE OPERATIONS ======

  getIssues() {
    return JSON.parse(localStorage.getItem(this.KEYS.ISSUES) || '[]');
  },

  addIssue(issue) {
    const issues = this.getIssues();
    issues.push(issue);
    localStorage.setItem(this.KEYS.ISSUES, JSON.stringify(issues));
    return issue;
  },

  updateIssue(issueId, updates) {
    const issues = this.getIssues();
    const index = issues.findIndex(i => i.issueId === issueId);
    if (index === -1) return null;
    issues[index] = { ...issues[index], ...updates };
    localStorage.setItem(this.KEYS.ISSUES, JSON.stringify(issues));
    return issues[index];
  },

  // ====== UTILITY ======

  resetAll() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem(this.KEYS.SESSION);
  }
};

// Initialize on load
NimbusDB.init();
