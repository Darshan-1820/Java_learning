<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Nimbus — Book Parcel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #F0F4F8; padding: 40px; }
        .card { background: white; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #1B2A4A; margin-bottom: 24px; }
        label { display: block; color: #2C3E50; font-weight: 600; margin: 12px 0 4px; font-size: 14px; }
        input, select { width: 100%; padding: 10px; border: 1px solid #DDE4EB; border-radius: 8px; font-size: 14px; }
        .btn { padding: 14px 32px; background: #1B2A4A; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 20px; }
        .btn:hover { background: #2E86DE; }
        .error { background: #fee; color: #c00; padding: 10px; border-radius: 6px; margin-bottom: 16px; }
        .success { background: #efe; color: #060; padding: 14px; border-radius: 6px; margin-bottom: 16px; font-weight: 600; }
        .section { margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; }
        .section h2 { font-size: 16px; color: #2E86DE; margin-bottom: 8px; }
        .sender-info { background: #f8f9fa; padding: 12px; border-radius: 8px; font-size: 14px; color: #555; }
        a { color: #2E86DE; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Book a Parcel</h1>
        <p><a href="${pageContext.request.contextPath}/servlet/dashboard">&larr; Back to Dashboard</a></p>

        <c:if test="${not empty error}">
            <div class="error">${error}</div>
        </c:if>

        <c:if test="${not empty success}">
            <div class="success">
                ${success}<br>
                Cost: Rs. ${booking.parServiceCost}<br>
                Status: ${booking.parStatus}
            </div>
        </c:if>

        <form method="POST" action="${pageContext.request.contextPath}/servlet/booking">
            <div class="section">
                <h2>Sender (You)</h2>
                <div class="sender-info">
                    ${sender.fullName} | ${sender.email} | ${sender.mobile}
                </div>
            </div>

            <div class="section">
                <h2>Receiver Details</h2>
                <label>Receiver Name *</label><input name="recName" required>
                <label>Address *</label><input name="recAddress" required>
                <label>PIN Code</label><input name="recPin">
                <label>Mobile</label><input name="recMobile">
            </div>

            <div class="section">
                <h2>Parcel Details</h2>
                <label>Weight (grams) *</label><input type="number" name="weight" min="1" required>
                <label>Contents Description</label><input name="contents">

                <label>Delivery Type</label>
                <select name="deliveryType">
                    <option value="Standard">Standard (5-7 days)</option>
                    <option value="Express">Express (2-3 days)</option>
                    <option value="Overnight">Overnight (next day)</option>
                </select>

                <label>Packaging</label>
                <select name="packagingType">
                    <option value="Standard Packaging">Standard Packaging</option>
                    <option value="Custom Packaging">Custom Packaging (+Rs.50)</option>
                    <option value="Eco-friendly Packaging">Eco-friendly (+Rs.30)</option>
                    <option value="Fragile Item Handling">Fragile Handling (+Rs.80)</option>
                </select>
            </div>

            <input type="hidden" name="paymentMethod" value="card">

            <button type="submit" class="btn">Book & Pay</button>
        </form>
    </div>
</body>
</html>
