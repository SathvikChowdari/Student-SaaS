package com.schoolms.backend.controller;

import com.schoolms.backend.entity.User;
import com.schoolms.backend.service.AuthService;
import com.schoolms.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ LOGIN endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
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
            Map<String, String> response = Map.of(
                    "token", token,
                    "role", user.getRole());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

}
