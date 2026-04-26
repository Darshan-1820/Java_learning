<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Nimbus — Track Parcel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #F0F4F8; padding: 40px; }
        .card { background: white; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #1B2A4A; margin-bottom: 24px; }
        label { display: block; color: #2C3E50; font-weight: 600; margin-bottom: 6px; }
        input { width: 100%; padding: 12px; border: 1px solid #DDE4EB; border-radius: 8px; font-size: 14px; }
        .btn { padding: 12px 24px; background: #1B2A4A; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; margin-top: 12px; }
        .btn:hover { background: #2E86DE; }
        .error { background: #fee; color: #c00; padding: 10px; border-radius: 6px; margin: 16px 0; }
        .result { margin-top: 24px; border-top: 2px solid #1B2A4A; padding-top: 20px; }
        .result h2 { color: #1B2A4A; margin-bottom: 16px; }
        .field { display: flex; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .field-label { width: 140px; font-weight: 600; color: #555; }
        .field-value { flex: 1; color: #2C3E50; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .status-booked { background: #FFF3CD; color: #856404; }
        .status-transit { background: #CCE5FF; color: #004085; }
        .status-delivered { background: #D4EDDA; color: #155724; }
        .status-returned { background: #F8D7DA; color: #721C24; }
        a { color: #2E86DE; text-decoration: none; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Track Parcel</h1>
        <p><a href="${pageContext.request.contextPath}/servlet/dashboard">&larr; Back to Dashboard</a></p>

        <form method="POST" action="${pageContext.request.contextPath}/servlet/tracking" style="margin-top:20px">
            <label for="bookingId">Booking ID</label>
            <input type="text" id="bookingId" name="bookingId" placeholder="e.g., NMB-260401-0001" required>
            <button type="submit" class="btn">Track</button>
        </form>

        <c:if test="${not empty error}">
            <div class="error">${error}</div>
        </c:if>

        <c:if test="${not empty booking}">
            <div class="result">
                <h2>Booking Details</h2>

                <div class="field"><span class="field-label">Booking ID</span><span class="field-value">${booking.bookingId}</span></div>
                <div class="field"><span class="field-label">Status</span><span class="field-value">
                    <span class="status
                        <c:choose>
                            <c:when test="${booking.parStatus == 'Booked'}">status-booked</c:when>
                            <c:when test="${booking.parStatus == 'In Transit' || booking.parStatus == 'Picked Up'}">status-transit</c:when>
                            <c:when test="${booking.parStatus == 'Delivered'}">status-delivered</c:when>
                            <c:when test="${booking.parStatus == 'Returned'}">status-returned</c:when>
                        </c:choose>
                    ">${booking.parStatus}</span>
                </span></div>
                <div class="field"><span class="field-label">Receiver</span><span class="field-value">${booking.recName}</span></div>
                <div class="field"><span class="field-label">Address</span><span class="field-value">${booking.recAddress}, ${booking.recPin}</span></div>
                <div class="field"><span class="field-label">Weight</span><span class="field-value">${booking.parWeightGram}g</span></div>
                <div class="field"><span class="field-label">Contents</span><span class="field-value">${booking.parContentsDescription}</span></div>
                <div class="field"><span class="field-label">Delivery Type</span><span class="field-value">${booking.parDeliveryType}</span></div>
                <div class="field"><span class="field-label">Packaging</span><span class="field-value">${booking.parPackingPreference}</span></div>
                <div class="field"><span class="field-label">Cost</span><span class="field-value">Rs. ${booking.parServiceCost}</span></div>
            </div>
        </c:if>
    </div>
</body>
</html>
