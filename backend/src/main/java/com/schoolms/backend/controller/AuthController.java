package com.schoolms.backend.controller;

import com.schoolms.backend.entity.User;
import com.schoolms.backend.service.AuthService;
import com.schoolms.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ LOGIN endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletResponse response) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password must be provided");
        }
        User user = authService.findByUsername(username);
        boolean isValid = authService.login(username, password);
        if (isValid) {
            // Generate JWT token
            String token = jwtUtil.generateToken(username, user.getRole());

            // Set JWT as HttpOnly cookie
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
            cookie.setSecure(false); // Set to true in production with HTTPS
            response.addCookie(cookie);

            Map<String, String> res = Map.of(
                    "role", user.getRole(),
                    "username", user.getUsername()
            );
            return ResponseEntity.ok(res);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

    // ✅ VERIFY endpoint (checks JWT cookie)
    @GetMapping("/verify")
    public ResponseEntity<?> verify(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
        String token = null;
        for (Cookie cookie : cookies) {
            if ("jwt".equals(cookie.getName())) {
                token = cookie.getValue();
                break;
            }
        }
        if (token == null) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
        try {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);
            if (jwtUtil.isTokenValid(token, username)) {
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "username", username,
                        "role", role
                ));
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    // ✅ LOGOUT endpoint (clears JWT cookie)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expire immediately
        cookie.setSecure(false); // Set to true in production with HTTPS
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}