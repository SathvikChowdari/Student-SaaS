package com.schoolms.backend.controller;

import com.schoolms.backend.entity.User;
import com.schoolms.backend.service.AuthService;
import com.schoolms.backend.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    private ResponseEntity<Map<String, Object>> buildResponse(String message, boolean success, Object data, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("success", success);
        response.put("data", data);
        return new ResponseEntity<>(response, status);
    }

    // ✅ LOGIN endpoint — issues JWT cookie
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletResponse response) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return buildResponse("Username and password must be provided", false, null, HttpStatus.BAD_REQUEST);
        }

        User user = authService.findByUsername(username);
        boolean isValid = authService.login(username, password);

        if (isValid) {
            String token = jwtUtil.generateToken(username, user.getRole());

            // Set JWT as HttpOnly cookie
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
            cookie.setSecure(false); // true for HTTPS
            response.addCookie(cookie);

            Map<String, Object> data = Map.of(
                    "role", user.getRole(),
                    "username", user.getUsername()
            );

            return buildResponse("Login successful", true, data, HttpStatus.OK);
        } else {
            return buildResponse("Invalid username or password", false, null, HttpStatus.UNAUTHORIZED);
        }
    }

    // ✅ VERIFY endpoint — checks cookie JWT validity
    @GetMapping("/verify")
    public ResponseEntity<?> verify(HttpServletRequest request) {
        String token = extractJwtFromCookies(request);
        if (token == null) {
            return buildResponse("No token found", false, Map.of("valid", false), HttpStatus.OK);
        }

        try {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            if (jwtUtil.isTokenValid(token, username)) {
                Map<String, Object> data = Map.of("valid", true, "username", username, "role", role);
                return buildResponse("Token is valid", true, data, HttpStatus.OK);
            } else {
                return buildResponse("Invalid token", false, Map.of("valid", false), HttpStatus.OK);
            }
        } catch (Exception e) {
            return buildResponse("Token validation failed", false, Map.of("valid", false), HttpStatus.OK);
        }
    }

    // ✅ LOGOUT endpoint — clears cookie
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(false);
        response.addCookie(cookie);

        return buildResponse("Logged out successfully", true, null, HttpStatus.OK);
    }

    private String extractJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if ("jwt".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
