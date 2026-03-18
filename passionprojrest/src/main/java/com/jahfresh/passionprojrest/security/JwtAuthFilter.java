package com.jahfresh.passionprojrest.security;

import com.jahfresh.passionprojrest.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Read the Authorization header
        final String authHeader = request.getHeader("Authorization");

        // 2. If no token present, skip — let Spring Security handle it (public routes pass through)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the token (strip "Bearer " prefix)
        final String token = authHeader.substring(7);
        final String username = jwtUtil.extractUsername(token);

        // 4. If we got a username and no auth is already set for this request
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 5. Load the user from the database
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // 6. Validate the token against the loaded user
            if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {

                // 7. Build an authentication object and set it in the SecurityContext
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Continue down the filter chain
        filterChain.doFilter(request, response);
    }
}
