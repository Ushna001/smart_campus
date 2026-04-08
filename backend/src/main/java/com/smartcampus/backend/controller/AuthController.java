package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.entity.User;
import com.smartcampus.backend.model.enums.Role;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
             return ResponseEntity.status(401).build();
        }

        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        }

        // Provision user on first login
        User newUser = User.builder()
                .email(email)
                .name(name != null ? name : "Unknown User")
                .role(Role.USER) // Default role
                .build();
        
        return ResponseEntity.ok(userRepository.save(newUser));
    }
}
