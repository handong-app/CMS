package app.handong.cms.domain;

import app.handong.cms.domain.enums.ClubUserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="tb_club_role",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbClubRole extends AuditingFields {

    @Column(length = 120, nullable = false) @Setter
    @Enumerated(EnumType.STRING)
    private ClubUserRole type;

    @Column(columnDefinition = "TEXT") @Setter private String description;

    public static TbClubRole of(ClubUserRole type, String description) {
        return new TbClubRole(type, description);
    }

}
