package com.handongapp.cms.domain.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileNodeData {
    private String title;
    private String description;
    private FileMetaData file;
}
