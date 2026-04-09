package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.entity.User;
import com.smartcampus.backend.model.enums.Role;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Object principal) {
        if (principal == null) {
             return ResponseEntity.status(401).build();
        }

        String email;
        String name;
        Role role = Role.USER;

        if (principal instanceof Jwt jwt) {
            email = jwt.getClaimAsString("email");
            name = jwt.getClaimAsString("name");
            String roleClaim = jwt.getClaimAsString("role");
            if (roleClaim != null) role = Role.valueOf(roleClaim.toUpperCase());
        } else {
            // Handle Mock User from DevAuthFilter
            email = "mock@smartcampus.com";
            name = "Mock Developer";
            
            // Extract role from SecurityContext authorities
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                for (GrantedAuthority ga : auth.getAuthorities()) {
                    if (ga.getAuthority().startsWith("ROLE_")) {
                        try {
                            role = Role.valueOf(ga.getAuthority().substring(5));
                        } catch (Exception e) { /* ignore */ }
                    }
                }
            }
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        }

        // Provision user on first login
        User newUser = User.builder()
                .email(email)
                .name(name != null ? name : "Unknown User")
                .role(role)
                .build();
        
        return ResponseEntity.ok(userRepository.save(newUser));
    }
}
