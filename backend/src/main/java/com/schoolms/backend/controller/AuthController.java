package com.schoolms.backend.controller;

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

        boolean isValid = authService.login(username, password);
        if (isValid) {
            // Generate JWT token
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

    // ✅ REGISTER endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password must be provided");
        }

        if (authService.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        authService.createUser(username, password); 

        return ResponseEntity.ok("User created successfully");
    }
}
