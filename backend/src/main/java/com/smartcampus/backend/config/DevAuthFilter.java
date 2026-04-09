package com.smartcampus.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * DEVELOPER BYPASS FILTER
 * This filter allows testing with the 'MOCKED_JWT_TOKEN' without needing real Google JWTs.
 * In a real production environment, this filter should be disabled or protected by a conditional.
 */
public class DevAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.equals("Bearer MOCKED_JWT_TOKEN")) {
            String mockRole = request.getHeader("X-Mock-Role");
            String authority = (mockRole != null) ? "ROLE_" + mockRole.toUpperCase() : "ROLE_USER";

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    "mock-user", null, Collections.singletonList(new SimpleGrantedAuthority(authority)));
            
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
