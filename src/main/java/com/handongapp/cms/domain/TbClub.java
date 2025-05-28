package com.handongapp.cms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

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

    @Column(length = 120, nullable = false) @NotBlank @Setter private String name;

    @Column(length = 100, nullable = false) @NotBlank @Setter private String slug;

    @Column(columnDefinition = "TEXT") @URL @Setter private String bannerUrl;

    @Column(columnDefinition = "TEXT") @Setter  private String description;

    public TbClub(String name, String slug, String bannerUrl, String description) {
        this.name = name;
        this.slug = slug;
        this.bannerUrl = bannerUrl;
        this.description = description;
    }
}
