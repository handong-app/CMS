package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
// SELECT * FROM tbuser WHERE @Index 설정 해준 것들 :: 쿼리 조회 속도 향상
@Table(indexes = {
        @Index(columnList = "deleted")
        , @Index(columnList = "process")
        , @Index(columnList = "createdAt")
        , @Index(columnList = "modifiedAt")
}
)
public class Tbuser extends AuditingFields{

    public enum UserRole {
        SERVICE_ADMIN, CLUB_ADMIN, CLUB_MEMBER, USER
    }

    // general login
    @Setter private String username;
    @Setter private String password;

    // google login (oauth)
    @Setter private String userId;  // googleId를 의미하는!
    @Setter private String name;
    @Setter private String email;
    @Setter private String picture;

    @Setter
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    private Tbuser(String userId , String name, String email, String picture, UserRole role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.role = role;
    }

    public static Tbuser of(String userId, String name, String email, String picture, UserRole role) {
        return new Tbuser(userId, name, email, picture, role);
    }

}
