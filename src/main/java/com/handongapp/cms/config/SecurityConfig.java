package com.handongapp.cms.config;

import com.handongapp.cms.auth.service.impl.AuthServiceImpl;
import com.handongapp.cms.security.*;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final AuthServiceImpl authServiceImpl;
    private final UserDetailsService userDetailsService;
    private final CorsFilterConfiguration corsFilterConfiguration;
    private final LoginProperties loginProperties;
    private final TokenBlacklistManager tokenBlacklistManager;

    public SecurityConfig(AuthServiceImpl authServiceImpl,
                          UserDetailsService userDetailsService,
                          CorsFilterConfiguration corsFilterConfiguration,
                          LoginProperties loginProperties,
                          TokenBlacklistManager tokenBlacklistManager) {
        this.authServiceImpl = authServiceImpl;
        this.userDetailsService = userDetailsService;
        this.corsFilterConfiguration = corsFilterConfiguration;
        this.loginProperties = loginProperties;
        this.tokenBlacklistManager = tokenBlacklistManager;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsFilterConfiguration.corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new JwtExceptionHandlers.JwtAuthenticationEntryPoint())
                        .accessDeniedHandler(new JwtExceptionHandlers.JwtAccessDeniedHandler())
                );
                .addFilterBefore(
                        new JwtAuthorizationFilter(authServiceImpl, userDetailsService, loginProperties, tokenBlacklistManager),
                        UsernamePasswordAuthenticationFilter.class
                )

                .authorizeHttpRequests(request -> request
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/**/*.html")).permitAll()

                        .requestMatchers("/api/auth/google/**", "/api/login").permitAll()

                        .requestMatchers("/api/admin/**").hasRole("SERVICE_ADMIN")
                        .requestMatchers("/api/club/**").hasAnyRole("SERVICE_ADMIN", "CLUB_ADMIN")
                        .requestMatchers("/api/member/**").hasAnyRole("SERVICE_ADMIN", "CLUB_ADMIN", "CLUB_MEMBER")
                        .requestMatchers("/api/user/**").hasAnyRole("SERVICE_ADMIN", "CLUB_ADMIN", "CLUB_MEMBER", "USER")
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
