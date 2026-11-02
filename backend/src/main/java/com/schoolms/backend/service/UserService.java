package com.schoolms.backend.service;
import com.schoolms.backend.entity.User;
import com.schoolms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Create new user
    public User createUser(String username, String password, String role) {
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(username, hashedPassword, role);
        return userRepository.save(user);
    }

    // Check if username exists
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    // Find user by ID
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // List all users
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // Update user (username or role)
    public User updateUser(Long id, String username, String role) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (username != null && !username.isEmpty())
                user.setUsername(username);
            if (role != null && !role.isEmpty())
                user.setRole(role);
            return userRepository.save(user);
        }
        return null;
    }

    // Delete user
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
