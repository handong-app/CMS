package com.handongapp.cms.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.handongapp.cms.security.LoginProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    private final LoginProperties loginProperties;

    public CacheConfig(LoginProperties loginProperties) {
        this.loginProperties = loginProperties;
    }

    @Bean
    public Cache<String, String> refreshTokenCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(loginProperties.getRefreshTokenExpirationMs(), TimeUnit.MILLISECONDS)
                .maximumSize(100_000)
                .build();
    }

    @Bean
    public Cache<String, Boolean> blacklistCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(loginProperties.getRefreshTokenExpirationMs(), TimeUnit.MILLISECONDS)
                .maximumSize(100_000)
                .build();
    }
}