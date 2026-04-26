package com.nimbus.servlet;

import com.nimbus.model.User;
import com.nimbus.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;
import java.util.Optional;

/**
 * LoginServlet — Phase 3 traditional Servlet for login.
 *
 * GET  /servlet/login  → Shows the login JSP page
 * POST /servlet/login  → Processes login form, creates session, redirects to dashboard
 *
 * This demonstrates the Servlet lifecycle:
 *   1. Client sends HTTP request
 *   2. Tomcat routes to this Servlet based on URL mapping
 *   3. doGet/doPost handles the request
 *   4. Forward to JSP (view) or redirect to another URL
 */
public class LoginServlet extends HttpServlet {

    /**
     * GET — Display the login page.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Forward to the JSP view
        request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request, response);
    }

    /**
     * POST — Process login form submission.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String userId = request.getParameter("userId");
        String password = request.getParameter("password");

        // Get Spring's UserRepository from the application context
        WebApplicationContext ctx = WebApplicationContextUtils
                .getWebApplicationContext(getServletContext());
        UserRepository userRepository = ctx.getBean(UserRepository.class);

        // Validate login
        Optional<User> userOpt = userRepository.findByUserIdAndPassword(userId, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Create HTTP session (stores user info on the server)
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("fullName", user.getFullName());
            session.setAttribute("role", user.getRole());

            // Redirect to dashboard JSP
            response.sendRedirect(request.getContextPath() + "/servlet/dashboard?role=" + user.getRole());
        } else {
            // Login failed — show error on login page
            request.setAttribute("error", "Invalid User ID or Password.");
            request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request, response);
        }
    }
}
