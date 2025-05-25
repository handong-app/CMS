package com.handongapp.cms.security;

import com.handongapp.cms.domain.Tbuser;
import com.handongapp.cms.repository.TbuserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PrincipalDetailsService implements UserDetailsService {

    private final TbuserRepository tbuserRepository;

    public PrincipalDetailsService(TbuserRepository tbuserRepository) {
        this.tbuserRepository = tbuserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        String customUserId = userId;
        if (userId.startsWith("user-")) {
            customUserId = userId.substring(5);
        }

        Tbuser tbuser = tbuserRepository.findByUserId(customUserId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        return new PrincipalDetails(tbuser);
    }
}

