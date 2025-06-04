package com.handongapp.cms.domain;

import com.handongapp.cms.domain.enums.FileStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="tb_club",
        indexes = {
                @Index(columnList = "deleted")
                , @Index(columnList = "createdAt")
                , @Index(columnList = "updatedAt")
        }
)
public class TbClub extends AuditingFields {

    @Column(length = 120, nullable = false) @NotBlank private String name;

    @Column(length = 100, nullable = false, unique = true) @NotBlank private String slug;

    @Column(columnDefinition = "TEXT") private String description;

    @Column(name = "file_key", length = 255, nullable = false) private String fileKey;

    @Enumerated(EnumType.STRING) private FileStatus fileStatus;
}
