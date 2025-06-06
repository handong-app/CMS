package app.handong.cms.domain.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TextNodeData {
    private String title;
    private String content;
}
