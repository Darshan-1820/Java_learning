package com.nimbus.servlet;

import com.nimbus.model.Booking;
import com.nimbus.service.BookingService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;

/**
 * TrackingServlet — Phase 3 Servlet for tracking parcels.
 *
 * GET  /servlet/tracking → Shows tracking search form (JSP)
 * POST /servlet/tracking → Searches by booking ID, shows result
 */
public class TrackingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/jsp/tracking.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String bookingId = request.getParameter("bookingId");

        WebApplicationContext ctx = WebApplicationContextUtils
                .getWebApplicationContext(getServletContext());
        BookingService bookingService = ctx.getBean(BookingService.class);

        try {
            // Get role from session for access control
            HttpSession session = request.getSession(false);
            String userId = session != null ? (String) session.getAttribute("userId") : null;
            String role = session != null ? (String) session.getAttribute("role") : "customer";

            Booking booking = bookingService.trackBooking(bookingId.trim(), userId, role);
            request.setAttribute("booking", booking);

        } catch (Exception e) {
            request.setAttribute("error", e.getMessage());
        }

        request.getRequestDispatcher("/WEB-INF/jsp/tracking.jsp").forward(request, response);
    }
}
