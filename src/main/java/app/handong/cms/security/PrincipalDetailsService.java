package app.handong.cms.security;

import app.handong.cms.domain.TbUser;
import app.handong.cms.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository tbuserRepository;

    public PrincipalDetailsService(UserRepository tbuserRepository) {
        this.tbuserRepository = tbuserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        String customUserId = userId;
        if (userId.startsWith("user-")) {
            customUserId = userId.substring(5);
        }

        TbUser tbuser = tbuserRepository.findById(customUserId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        return new PrincipalDetails(tbuser);
    }
}

