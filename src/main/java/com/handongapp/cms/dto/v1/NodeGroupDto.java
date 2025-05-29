package com.handongapp.cms.dto.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class NodeGroupDto {

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class NodeGroupBaseDto {
        private String title;
        private Integer order;
    }
}
