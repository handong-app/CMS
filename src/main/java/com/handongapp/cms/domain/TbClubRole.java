package com.handongapp.cms.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@Table(name="tb_club_role",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "process")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "modifiedAt")
        }
)
public class TbClubRole extends AuditingFields {

    public enum ClubUserRole {
        CLUB_ADMIN, CLUB_MEMBER, USER
    }

    @Column(length = 120, nullable = false) @Setter
    @Enumerated(EnumType.STRING)
    private ClubUserRole type;

    @Column(columnDefinition = "TEXT") @Setter private String description;

}
