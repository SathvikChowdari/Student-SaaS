package com.schoolms.backend.filter;

import com.schoolms.backend.entity.User;
import com.schoolms.backend.service.UserService;
import com.schoolms.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        System.out.println("=== JWT Filter hit for URL: " + request.getRequestURI());        
        // 1️⃣ Get Authorization header
        final String authHeader = request.getHeader("Authorization");
        System.out.println("Request: " + request);

        System.out.println("Authorization header: " + authHeader);

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("Extracted token: " + token);
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("Extracted username: " + username);
            } catch (Exception e) {
                logger.warn("JWT token is invalid: " + e.getMessage());
                System.out.println("Error extracting username from JWT: " + e.getMessage());
            }
        }

        // 2️⃣ Validate token and set authentication in context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            final String finalUsername = username;

            User user = userService.findAllUsers().stream()
                    .filter(u -> u.getUsername().equals(finalUsername))
                    .findFirst()
                    .orElse(null);

            if (user != null && jwtUtil.isTokenValid(token, user.getUsername())) {
                // Create authentication token with user's role
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("✅ Authentication set successfully for user: " + username);
            }
        }

        // 3️⃣ Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
