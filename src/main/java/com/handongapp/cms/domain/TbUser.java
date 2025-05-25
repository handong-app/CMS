package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@Table(indexes = {
        @Index(columnList = "deleted")
        , @Index(columnList = "process")
        , @Index(columnList = "createdAt")
        , @Index(columnList = "modifiedAt")
}
)
public class TbUser extends AuditingFields{

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

    @Setter
    private String studentId;

    private TbUser(String userId , String name, String email, String picture, UserRole role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.role = role;
    }

    public static TbUser of(String userId, String name, String email, String picture, UserRole role) {
        return new TbUser(userId, name, email, picture, role);
    }

}
