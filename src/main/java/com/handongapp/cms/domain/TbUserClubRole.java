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
                , @Index(columnList = "process")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "modifiedAt")
        }
)
public class TbUserClubRole extends AuditingFields {

    @Column(name = "user_id", length = 32, nullable = false) @Setter
    private String userId;

    @Column(name = "club_id", length = 32, nullable = false) @Setter
    private String clubId;

    @Column(name = "role_id", length = 32, nullable = false) @Setter
    private String roleId;

    @Column(name = "generation", nullable = false) @Setter
    private Integer generation;
}
