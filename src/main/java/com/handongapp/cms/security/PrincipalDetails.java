package com.handongapp.cms.security;

import com.handongapp.cms.domain.TbUser;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@Getter
public class PrincipalDetails implements UserDetails {

    private TbUser tbuser;

    public PrincipalDetails(TbUser tbuser) {
        this.tbuser = tbuser;
    }

    public TbUser getTbuser() {
        return tbuser;
    }

    @Override
    public String getPassword() {
        return tbuser.getPassword();
    }

    @Override
    public String getUsername() {
//        return tbuser.getUsername();
        return tbuser.getEmail();  // 난 email 기반을 작업을 하니.. mismatch지만..
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> "ROLE_" + "USER" /*tbuser.getRole()*/);  // ROLE_ 접두사 붙여서 권한 설정 (일반적으로 권한 앞에는 ROLE_ 이 붙음)
        return authorities;
    }


}
