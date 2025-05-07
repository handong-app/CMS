package com.handongapp.cms.config;

import com.handongapp.cms.security.AuthServiceImpl;
import com.handongapp.cms.security.JwtAuthorizationFilter;
import com.handongapp.cms.security.LoginProperties;
import com.handongapp.cms.security.PrincipalDetailsService;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
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

    public SecurityConfig(AuthServiceImpl authServiceImpl,
                          PrincipalDetailsService principalDetailsService,
                          CorsFilterConfiguration corsFilterConfiguration, LoginProperties loginProperties) {
        this.authServiceImpl = authServiceImpl;
        this.userDetailsService = principalDetailsService;
        this.corsFilterConfiguration = corsFilterConfiguration;
        this.loginProperties = loginProperties;
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
                .addFilterBefore(
                        new JwtAuthorizationFilter(authServiceImpl, userDetailsService, loginProperties),
                        UsernamePasswordAuthenticationFilter.class
                )

                .authorizeHttpRequests(request -> request
                        .requestMatchers("/api/auth/google/**", "/api/login").permitAll()

                        .requestMatchers("/api/admin/**").hasRole("SERVICE_ADMIN")
                        .requestMatchers("/api/club/**").hasAnyRole("SERVICE_ADMIN", "CLUB_ADMIN")
                        .requestMatchers("/api/member/**").hasAnyRole("SERVICE_ADMIN", "CLUB_ADMIN", "CLUB_MEMBER")
                        .requestMatchers("/api/user/**").hasAnyRole("SERVICE_ADMIN", "CLUB_ADMIN", "CLUB_MEMBER", "USER")
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web
                .ignoring()
                // css/js/images 등 기존 정적 리소스
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations())
                .requestMatchers(new AntPathRequestMatcher("/**/*.html"));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
