package com.nimbus.servlet;

import com.nimbus.model.User;
import com.nimbus.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;

/**
 * RegisterServlet — Phase 3 Servlet for customer registration.
 *
 * GET  /servlet/register → Shows the registration form (JSP)
 * POST /servlet/register → Processes registration, redirects to login on success
 */
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/WEB-INF/jsp/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        WebApplicationContext ctx = WebApplicationContextUtils
                .getWebApplicationContext(getServletContext());
        UserService userService = ctx.getBean(UserService.class);

        try {
            User user = userService.register(
                    request.getParameter("firstName"),
                    request.getParameter("middleName"),
                    request.getParameter("lastName"),
                    request.getParameter("email"),
                    request.getParameter("countryCode"),
                    request.getParameter("mobile"),
                    request.getParameter("street"),
                    request.getParameter("zipCode"),
                    request.getParameter("city"),
                    request.getParameter("state"),
                    request.getParameter("country"),
                    request.getParameter("password"),
                    request.getParameter("confirmPassword"),
                    request.getParameter("preferences")
            );

            // Success — redirect to login with the generated User ID
            response.sendRedirect(request.getContextPath() +
                    "/servlet/login?registered=true&userId=" + user.getUserId());

        } catch (IllegalArgumentException e) {
            request.setAttribute("error", e.getMessage());
            request.getRequestDispatcher("/WEB-INF/jsp/register.jsp").forward(request, response);
        }
    }
}
