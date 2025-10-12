package com.schoolms.backend.service;

import com.schoolms.backend.entity.User;
import com.schoolms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Create a new user with hashed password
    public User createUser(String username, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(username, hashedPassword);
        return userRepository.save(user);
    }

    // Validate user credentials
    public boolean login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword());
    }

    // Find user by username
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // Check if username already exists
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
