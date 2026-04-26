package com.nimbus.servlet;

import com.nimbus.model.Booking;
import com.nimbus.model.User;
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
 * BookingServlet — Phase 3 Servlet for creating bookings.
 *
 * GET  /servlet/booking → Shows the booking form (JSP)
 * POST /servlet/booking → Processes booking, shows confirmation
 */
public class BookingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Check if user is logged in
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/servlet/login");
            return;
        }

        User user = (User) session.getAttribute("user");
        request.setAttribute("sender", user);
        request.getRequestDispatcher("/WEB-INF/jsp/booking.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/servlet/login");
            return;
        }

        WebApplicationContext ctx = WebApplicationContextUtils
                .getWebApplicationContext(getServletContext());
        BookingService bookingService = ctx.getBean(BookingService.class);

        User user = (User) session.getAttribute("user");

        try {
            int weight = Integer.parseInt(request.getParameter("weight"));

            Booking booking = bookingService.createBooking(
                    user.getUserId(),
                    request.getParameter("recName"),
                    request.getParameter("recAddress"),
                    request.getParameter("recPin"),
                    request.getParameter("recMobile"),
                    weight,
                    request.getParameter("contents"),
                    request.getParameter("deliveryType"),
                    request.getParameter("packagingType"),
                    request.getParameter("paymentMethod")
            );

            request.setAttribute("booking", booking);
            request.setAttribute("success", "Booking confirmed! ID: " + booking.getBookingId());
            request.setAttribute("sender", user);
            request.getRequestDispatcher("/WEB-INF/jsp/booking.jsp").forward(request, response);

        } catch (Exception e) {
            request.setAttribute("error", e.getMessage());
            request.setAttribute("sender", user);
            request.getRequestDispatcher("/WEB-INF/jsp/booking.jsp").forward(request, response);
        }
    }
}
