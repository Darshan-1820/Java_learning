package com.nimbus.dto;

/**
 * LoginResponse — Returned after successful login.
 * Matches the structure expected by the frontend (storage.js validateLogin format).
 */
public class LoginResponse {
    private boolean success;
    private String message;
    private UserDTO user;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, UserDTO user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    // --- Nested UserDTO (safe — no password) ---
    public static class UserDTO {
        private String userId;
        private String firstName;
        private String middleName;
        private String lastName;
        private String fullName;
        private String email;
        private String countryCode;
        private String mobile;
        private String street;
        private String zipCode;
        private String city;
        private String state;
        private String country;
        private String role;
        private String preferences;
        private String createdAt;

        public UserDTO() {}

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getMiddleName() { return middleName; }
        public void setMiddleName(String middleName) { this.middleName = middleName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getCountryCode() { return countryCode; }
        public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }

        public String getZipCode() { return zipCode; }
        public void setZipCode(String zipCode) { this.zipCode = zipCode; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getPreferences() { return preferences; }
        public void setPreferences(String preferences) { this.preferences = preferences; }

        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}
