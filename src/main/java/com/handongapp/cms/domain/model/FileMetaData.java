package com.handongapp.cms.domain.model;

import com.handongapp.cms.domain.enums.FileStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileMetaData {
    private String fileKey;
    private String originalFileName;
    private FileStatus status;
    private String contentType;
}