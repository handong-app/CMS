package com.handongapp.cms.dto;

import com.handongapp.cms.domain.enums.ProgramProgressState;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class NodeDto {

    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Getter
    public static class NodeBaseDto {
//        private String title;  // 노드에 title 추가해야하나?
        private ProgramProgressState type;
        private String order;
    }

}
