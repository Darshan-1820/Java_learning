<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Nimbus — Login</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #F0F4F8; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: white; border-radius: 12px; padding: 40px; width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #1B2A4A; text-align: center; margin-bottom: 8px; }
        .subtitle { color: #7F8C9B; text-align: center; margin-bottom: 30px; }
        label { display: block; color: #2C3E50; font-weight: 600; margin-bottom: 6px; margin-top: 16px; }
        input { width: 100%; padding: 12px; border: 1px solid #DDE4EB; border-radius: 8px; font-size: 14px; }
        input:focus { outline: none; border-color: #2E86DE; }
        .btn { width: 100%; padding: 14px; background: #1B2A4A; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 24px; }
        .btn:hover { background: #2E86DE; }
        .error { background: #fee; color: #c00; padding: 10px; border-radius: 6px; margin-bottom: 16px; text-align: center; }
        .success { background: #efe; color: #060; padding: 10px; border-radius: 6px; margin-bottom: 16px; text-align: center; }
        .demo { margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; font-size: 13px; }
        .demo h3 { font-size: 14px; color: #1B2A4A; margin-bottom: 8px; }
        .demo code { background: #e9ecef; padding: 2px 6px; border-radius: 4px; }
        a { color: #2E86DE; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Nimbus</h1>
        <p class="subtitle">Parcel Management System — Login</p>

        <c:if test="${not empty error}">
            <div class="error">${error}</div>
        </c:if>

        <c:if test="${param.registered == 'true'}">
            <div class="success">Registration successful! Your User ID: <strong>${param.userId}</strong></div>
        </c:if>

        <form method="POST" action="${pageContext.request.contextPath}/servlet/login">
            <label for="userId">User ID</label>
            <input type="text" id="userId" name="userId" placeholder="e.g., 260401-AK01" required>

            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter password" required>

            <button type="submit" class="btn">Login</button>
        </form>

        <p style="text-align:center; margin-top:16px">
            New user? <a href="${pageContext.request.contextPath}/servlet/register">Register here</a>
        </p>

        <div class="demo">
            <h3>Demo Credentials</h3>
            Customer: <code>260401-AK01</code> / <code>Amit@123</code><br>
            Officer: <code>OFF-001</code> / <code>Officer@123</code><br>
            Support: <code>SUP-001</code> / <code>Support@123</code>
        </div>
    </div>
</body>
</html>
