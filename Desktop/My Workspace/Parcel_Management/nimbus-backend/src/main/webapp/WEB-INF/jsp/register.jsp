<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Nimbus — Register</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #F0F4F8; display: flex; justify-content: center; padding: 40px; }
        .card { background: white; border-radius: 12px; padding: 40px; width: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #1B2A4A; text-align: center; margin-bottom: 30px; }
        label { display: block; color: #2C3E50; font-weight: 600; margin-bottom: 4px; margin-top: 14px; font-size: 14px; }
        input, select { width: 100%; padding: 10px; border: 1px solid #DDE4EB; border-radius: 8px; font-size: 14px; }
        .row { display: flex; gap: 12px; }
        .row > div { flex: 1; }
        .btn { width: 100%; padding: 14px; background: #1B2A4A; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 24px; }
        .btn:hover { background: #2E86DE; }
        .error { background: #fee; color: #c00; padding: 10px; border-radius: 6px; margin-bottom: 16px; }
        .section { margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; }
        .section h2 { font-size: 16px; color: #2E86DE; margin-bottom: 8px; }
        a { color: #2E86DE; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Nimbus — Register</h1>

        <c:if test="${not empty error}">
            <div class="error">${error}</div>
        </c:if>

        <form method="POST" action="${pageContext.request.contextPath}/servlet/register">
            <div class="section">
                <h2>Personal Information</h2>
                <div class="row">
                    <div><label>First Name *</label><input name="firstName" required></div>
                    <div><label>Middle Name</label><input name="middleName"></div>
                    <div><label>Last Name *</label><input name="lastName" required></div>
                </div>
                <label>Email *</label><input type="email" name="email" required>
                <div class="row">
                    <div><label>Country Code</label><input name="countryCode" value="+91"></div>
                    <div><label>Mobile (10 digits) *</label><input name="mobile" required maxlength="10"></div>
                </div>
            </div>

            <div class="section">
                <h2>Address</h2>
                <label>Street Address *</label><input name="street" required>
                <div class="row">
                    <div><label>ZIP Code *</label><input name="zipCode" required></div>
                    <div><label>City *</label><input name="city" required></div>
                </div>
                <div class="row">
                    <div><label>State *</label><input name="state" required></div>
                    <div><label>Country</label><input name="country" value="India"></div>
                </div>
            </div>

            <div class="section">
                <h2>Security</h2>
                <label>Password *</label><input type="password" name="password" required>
                <label>Confirm Password *</label><input type="password" name="confirmPassword" required>
                <p style="font-size:12px;color:#7F8C9B;margin-top:4px">8-30 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char</p>
            </div>

            <input type="hidden" name="preferences" value="Email notifications">

            <button type="submit" class="btn">Register</button>
        </form>

        <p style="text-align:center;margin-top:16px">Already registered? <a href="${pageContext.request.contextPath}/servlet/login">Login</a></p>
    </div>
</body>
</html>
