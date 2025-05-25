package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@Table(name="tb_user_club_role",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbUserClubRole extends AuditingFields {

    @Column(name = "user_id", columnDefinition = "CHAR(32)", nullable = false) @Setter
    private String userId;

    @Column(name = "club_id", columnDefinition = "CHAR(32)", nullable = false) @Setter
    private String clubId;

    @Column(name = "role_id", columnDefinition = "CHAR(32)", nullable = false) @Setter
    private String roleId;

    @Column(name = "generation", nullable = false) @Setter
    private Integer generation;

    public TbUserClubRole(String userId, String clubId, String roleId, Integer generation) {
        this.userId = userId;
        this.clubId = clubId;
        this.roleId = roleId;
        this.generation = generation;
    }

    public static TbUserClubRole of(String userId, String clubId, String roleId, Integer generation) {
        return new TbUserClubRole(userId, clubId, roleId, generation);
    }
}
