package com.handongapp.cms.domain.model;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class QuizNodeData {
    private String question;
    private List<String> options;
    private String answer;
}
