package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import com.example.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }



//     @PostMapping("/login")
// public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {
//     String token = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
//     User user = userRepository.findByEmail(loginRequest.getEmail());
//     user.setPassword(null); // hide password
//     Map<String, Object> response = new HashMap<>();
//     response.put("token", token);
//     response.put("user", user);
//     return response;
// }


@GetMapping("/user")
public User getUserDetails(@RequestHeader("Authorization") String authHeader) {

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Missing or invalid Authorization header");
    }

    String token = authHeader.substring(7);
    String email;
    try {
        email = jwtUtil.extractEmail(token);
        System.out.println("Extracted email: " + email);
    } catch (Exception e) {
        throw new RuntimeException("Invalid token", e);
    }
    

    User user = userRepository.findByEmail(email);
    if (user == null) {
        throw new RuntimeException("User not found for email: " + email);
    }

    user.setPassword(null); // remove sensitive field
    System.out.println("Returning user: " + user.getUserName());
    return user;
}


}
