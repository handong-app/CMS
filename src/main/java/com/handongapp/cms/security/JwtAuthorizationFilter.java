package com.handongapp.cms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final AuthServiceImpl authServiceImpl;
    private final UserDetailsService userDetailsService;
    private final LoginProperties loginProperties;

    public JwtAuthorizationFilter(AuthServiceImpl authServiceImpl,
                                  UserDetailsService userDetailsService,
                                  LoginProperties loginProperties) {
        this.authServiceImpl = authServiceImpl;
        this.userDetailsService = userDetailsService;
        this.loginProperties = loginProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(loginProperties.getJwtAccessTokenPrefix());

        if (header == null || !header.startsWith(loginProperties.getJwtTokenPrefix())) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        if (!authServiceImpl.validateAccessToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = authServiceImpl.getSubjectFromAccess(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        userDetails.getAuthorities().forEach(a ->
                System.out.println("  -> " + a.getAuthority())
        );


        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}
