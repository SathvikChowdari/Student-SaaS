package com.schoolms.backend.controller;

import com.schoolms.backend.entity.User;
import com.schoolms.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ List all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    // ✅ Create a new user
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        String role = data.get("role");

        if (username == null || username.isEmpty() || password == null || password.isEmpty() || role == null
                || role.isEmpty()) {
            return ResponseEntity.badRequest().body("Username, password, and role must be provided");
        }

        if (userService.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        User user = userService.createUser(username, password, role);
        return ResponseEntity.ok(Map.of(
                "message", "User created successfully",
                "userId", user.getId()));
    }

    // ✅ Update user (username or role)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> data) {
        String username = data.get("username");
        String role = data.get("role");

        User updatedUser = userService.updateUser(id, username, role);
        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(Map.of(
                "message", "User updated successfully",
                "userId", updatedUser.getId()));
    }

    // ✅ Delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(Map.of(
                "message", "User deleted successfully",
                "userId", id));
    }
}
