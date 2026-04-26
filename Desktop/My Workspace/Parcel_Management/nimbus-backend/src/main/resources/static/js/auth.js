/* ========================================
   NIMBUS — Authentication
   Login, registration, session guard
   ======================================== */

const NimbusAuth = {

  // --- Login ---
  login(userId, password) {
    if (!userId || !userId.trim()) {
      return { success: false, message: 'Please enter your User ID.' };
    }
    if (!password || !password.trim()) {
      return { success: false, message: 'Please enter your password.' };
    }

    userId = userId.trim();
    const result = NimbusDB.validateLogin(userId, password);

    if (result.success) {
      NimbusDB.setSession(result.user);
      const role = result.user.role;
      const basePath = NimbusAuth.getBasePath();

      switch (role) {
        case 'customer':
          window.location.href = basePath + 'customer/dashboard.html';
          break;
        case 'officer':
          window.location.href = basePath + 'officer/dashboard.html';
          break;
        case 'support':
          window.location.href = basePath + 'support/dashboard.html';
          break;
      }
    }

    return result;
  },

  // --- Logout ---
  logout() {
    NimbusDB.clearSession();
    window.location.href = NimbusAuth.getBasePath() + 'login.html';
  },

  // --- Register ---
  register(formData) {
    const errors = [];

    // First Name — required
    if (!formData.firstName || formData.firstName.trim().length === 0) {
      errors.push({ field: 'firstName', message: 'First name is required.' });
    } else if (formData.firstName.trim().length > 25) {
      errors.push({ field: 'firstName', message: 'First name must be under 25 characters.' });
    }

    // Last Name — required
    if (!formData.lastName || formData.lastName.trim().length === 0) {
      errors.push({ field: 'lastName', message: 'Last name is required.' });
    } else if (formData.lastName.trim().length > 25) {
      errors.push({ field: 'lastName', message: 'Last name must be under 25 characters.' });
    }

    // Combined name check (max 50 as per requirement)
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ').trim();
    if (fullName.length > 50) {
      errors.push({ field: 'firstName', message: 'Full name must be under 50 characters total.' });
    }

    // Email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address.' });
    }

    // Mobile — 10 digits
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      errors.push({ field: 'mobile', message: 'Please enter a valid 10-digit mobile number.' });
    }

    // Address — street required
    if (!formData.street || formData.street.trim().length < 5) {
      errors.push({ field: 'street', message: 'Please enter your street address.' });
    }

    // ZIP code required
    if (!formData.zipCode || formData.zipCode.trim().length < 4) {
      errors.push({ field: 'zipCode', message: 'Please enter a valid ZIP / postal code.' });
    }

    // City required
    if (!formData.city || formData.city.trim().length === 0) {
      errors.push({ field: 'city', message: 'City is required.' });
    }

    // State required
    if (!formData.state || formData.state.trim().length === 0) {
      errors.push({ field: 'state', message: 'State is required.' });
    }

    // Password — requirement: max 30, min 1 uppercase, 1 lowercase, 1 special
    if (!formData.password || formData.password.length < 8 || formData.password.length > 30) {
      errors.push({ field: 'password', message: 'Password must be 8-30 characters.' });
    } else {
      if (!/[A-Z]/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter.' });
      }
      if (!/[a-z]/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter.' });
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one special character.' });
      }
      if (!/\d/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one digit.' });
      }
      if (NimbusAuth.hasSequentialChars(formData.password)) {
        errors.push({ field: 'password', message: 'Password must not contain 3 sequential characters (abc, 123).' });
      }
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Check duplicate email
    if (NimbusDB.getUserByEmail(formData.email.trim().toLowerCase())) {
      return { success: false, errors: [{ field: 'email', message: 'This email is already registered.' }] };
    }

    // Generate User ID
    const userId = NimbusDB.generateUserId(formData.firstName.trim(), formData.lastName.trim());

    // Build full address string (for backward compat / display)
    const fullAddress = [formData.street, formData.city, formData.state, formData.zipCode, formData.country].filter(Boolean).join(', ');

    const newUser = {
      userId,
      firstName: formData.firstName.trim(),
      middleName: (formData.middleName || '').trim(),
      lastName: formData.lastName.trim(),
      fullName,
      email: formData.email.trim().toLowerCase(),
      countryCode: formData.countryCode || '+91',
      mobile: formData.mobile,
      street: formData.street.trim(),
      zipCode: formData.zipCode.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country || 'India',
      address: fullAddress,
      password: formData.password,
      role: 'customer',
      preferences: formData.preferences || 'Email notifications',
      createdAt: new Date().toISOString()
    };

    NimbusDB.addUser(newUser);

    return {
      success: true,
      user: newUser,
      message: 'Consumer Registration successful.'
    };
  },

  // --- Route Guard ---
  requireAuth(allowedRoles) {
    const session = NimbusDB.getSession();

    if (!session) {
      window.location.href = NimbusAuth.getBasePath() + 'login.html';
      return null;
    }

    if (allowedRoles && !allowedRoles.includes(session.role)) {
      window.location.href = NimbusAuth.getBasePath() + 'login.html';
      return null;
    }

    return session;
  },

  // --- Sequential character check (abc, 123, cba, 321) ---
  hasSequentialChars(pwd) {
    const s = pwd.toLowerCase();
    for (let i = 0; i < s.length - 2; i++) {
      const a = s.charCodeAt(i);
      const b = s.charCodeAt(i + 1);
      const c = s.charCodeAt(i + 2);
      // ascending (abc, 123) or descending (cba, 321)
      if ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) return true;
    }
    return false;
  },

  // --- Helper: detect base path ---
  getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/customer/') || path.includes('/officer/') || path.includes('/support/')) {
      return '../';
    }
    return './';
  }
};
