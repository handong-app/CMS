package com.handongapp.cms.dto;

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
        private String order;
    }
}
