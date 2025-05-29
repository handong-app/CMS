package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@Table(name="tb_user",
        indexes = {
        @Index(columnList = "deleted")
        , @Index(columnList = "createdAt")
        , @Index(columnList = "updatedAt")
}
)
public class TbUser extends AuditingFields{

    // general login
    @Setter private String username;
    @Setter private String password;

    // google login (oauth)
    @Column(length = 21, unique = true) private String googleSub;
    @Column(length = 30)  @Setter private String name;
    @Column(length = 320) @Setter private String email;
    @Column(length = 15) @Setter private String phone;
    @Column(columnDefinition = "TEXT") @Setter private String pictureUrl;
    @Column(columnDefinition = "CHAR(8)") @Setter private String studentId;
    @Column(name = "is_admin", nullable = false) @Setter private Boolean isAdmin;

    private TbUser(String googleSub , String name, String email, String pictureUrl, Boolean isAdmin) {
        this.googleSub = googleSub;
        this.name = name;
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.isAdmin = isAdmin;
    }

    public static TbUser of(String userId, String name, String email, String picture, Boolean isAdmin) {
        return new TbUser(userId, name, email, picture, isAdmin);
    }

}
