package com.handongapp.cms.dto.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class SectionDto {

    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Getter
    public static class SectionBaseDto {
        private String title;
        private Integer order;
    }

}
