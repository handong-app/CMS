package com.handongapp.cms.security;

import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class TokenBlacklistManager {

    private final Cache<String, Boolean> blacklist;
    private final LoginProperties loginProperties;

    public TokenBlacklistManager(LoginProperties loginProperties,
                                 @Qualifier("blacklistCache") Cache<String, Boolean> blacklist) {
        this.loginProperties = loginProperties;
        this.blacklist = blacklist;
    }

    public void blacklist(String token) {
        long durationMillis = loginProperties.getRefreshTokenExpirationMs();
        blacklist.policy().expireVariably().ifPresent(policy ->
                policy.put(token, true, Duration.ofMillis(durationMillis))
        );
    }

    public boolean isBlacklisted(String token) {
        return blacklist.getIfPresent(token) != null;
    }
}
