package com.handongapp.cms.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
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
    // general login
    @Setter private String username;
    @Setter private String password;

    // google login (oauth)
    @Setter private String userId;  // googleId를 의미하는!
    @Setter private String name;
    @Setter private String email;
    @Setter private String picture;

    @Setter private String role;

    private Tbuser(String userId , String name, String email, String picture, String role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.role = role;
    }

    public static Tbuser of(String userId, String name, String email, String picture, String role) {
        return new Tbuser(userId, name, email, picture, role);
    }

}
