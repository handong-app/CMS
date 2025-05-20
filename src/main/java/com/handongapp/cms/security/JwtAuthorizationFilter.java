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
    private final TokenBlacklistManager tokenBlacklistManager;

    public JwtAuthorizationFilter(AuthServiceImpl authServiceImpl,
                                  UserDetailsService userDetailsService,
                                  LoginProperties loginProperties,
                                  TokenBlacklistManager tokenBlacklistManager) {
        this.authServiceImpl = authServiceImpl;
        this.userDetailsService = userDetailsService;
        this.loginProperties = loginProperties;
        this.tokenBlacklistManager = tokenBlacklistManager;
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

        String token = header.substring(loginProperties.getJwtTokenPrefix().length());

        if (tokenBlacklistManager.isBlacklisted(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("해당 토큰은 로그아웃 처리된 토큰입니다.");
            return;
        }

        if (!authServiceImpl.validateAccessToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("유효하지 않은 토큰입니다.");
            return;
        }

        String email = authServiceImpl.getSubjectFromAccess(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (userDetails == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("인증 정보를 찾을 수 없습니다.");
            return;
        }

        if (logger.isDebugEnabled()) {
            userDetails.getAuthorities().forEach(a ->
                    logger.debug("사용자 권한: " + a.getAuthority())
            );
        }

        try {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.debug("인증 성공: " + userDetails.getUsername());
        } catch (Exception e) {
            logger.error("인증 컨텍스트 설정 중 오류 발생", e);
        }

        filterChain.doFilter(request, response);
    }
}
