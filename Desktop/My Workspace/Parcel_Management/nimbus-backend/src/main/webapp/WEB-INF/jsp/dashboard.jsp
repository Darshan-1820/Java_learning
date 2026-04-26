<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Nimbus — Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #F0F4F8; }
        .nav { background: #1B2A4A; color: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; }
        .nav h1 { font-size: 20px; }
        .nav a { color: #54A0FF; text-decoration: none; }
        .container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
        .welcome { background: white; border-radius: 12px; padding: 30px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .welcome h2 { color: #1B2A4A; margin-bottom: 8px; }
        .welcome p { color: #7F8C9B; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .card { background: white; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        .card a { text-decoration: none; color: #1B2A4A; font-weight: 600; font-size: 15px; }
        .card .icon { font-size: 36px; margin-bottom: 12px; }
        .role-badge { display: inline-block; background: #2E86DE; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="nav">
        <h1>Nimbus</h1>
        <div>
            <span>${sessionScope.fullName}</span> |
            <span class="role-badge">${sessionScope.role}</span> |
            <a href="${pageContext.request.contextPath}/servlet/login">Logout</a>
        </div>
    </div>

    <div class="container">
        <div class="welcome">
            <h2>Welcome, ${sessionScope.fullName}!</h2>
            <p>User ID: ${sessionScope.userId} | Role: ${sessionScope.role}</p>
        </div>

        <c:if test="${sessionScope.role == 'customer'}">
            <div class="grid">
                <div class="card"><div class="icon">📦</div><a href="${pageContext.request.contextPath}/servlet/booking">Book Parcel</a></div>
                <div class="card"><div class="icon">🔍</div><a href="${pageContext.request.contextPath}/servlet/tracking">Track Parcel</a></div>
                <div class="card"><div class="icon">📋</div><a href="#">Booking History</a></div>
                <div class="card"><div class="icon">🎧</div><a href="#">Contact Support</a></div>
            </div>
        </c:if>

        <c:if test="${sessionScope.role == 'officer'}">
            <div class="grid">
                <div class="card"><div class="icon">📦</div><a href="${pageContext.request.contextPath}/servlet/booking">Book (Walk-in)</a></div>
                <div class="card"><div class="icon">🔍</div><a href="${pageContext.request.contextPath}/servlet/tracking">Track Parcel</a></div>
                <div class="card"><div class="icon">🚚</div><a href="#">Update Delivery</a></div>
                <div class="card"><div class="icon">📋</div><a href="#">All History</a></div>
                <div class="card"><div class="icon">⚠️</div><a href="#">Manage Issues</a></div>
            </div>
        </c:if>

        <c:if test="${sessionScope.role == 'support'}">
            <div class="grid">
                <div class="card"><div class="icon">📝</div><a href="#">Assigned Issues</a></div>
                <div class="card"><div class="icon">✅</div><a href="#">Update Issues</a></div>
            </div>
        </c:if>
    </div>
</body>
</html>
