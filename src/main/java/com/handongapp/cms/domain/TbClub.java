package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
@Table(name="tb_club",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbClub extends AuditingFields {

    @Column(length = 120, nullable = false) @Setter private String name;

    @Column(length = 100, nullable = false) @Setter private String slug;

    @Column(columnDefinition = "TEXT") @Setter private String bannerUrl;

    @Column(columnDefinition = "TEXT") @Setter  private String description;
}
