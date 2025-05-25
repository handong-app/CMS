package com.handongapp.cms.security.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter
@ToString
public class GooglePeopleResponse {

    private Metadata metadata;

    private List<Organization> organizations;

    /* ───────── nested types ───────── */

    @Getter @Setter
    public static class Metadata {
        @JsonProperty("objectType")
        private String objectType;   // e.g. "PERSON"
        // 필요한 필드가 더 있으면 추가
    }

    @Getter @Setter
    public static class Organization {
        private String name;        // 학교/회사 이름
        private String title;       // 역할(직책/학년 등)
        private String department;  // 학과
        private String domain;      // handong.ac.kr
        private Boolean current;    // 재학/재직 중인지
        private String type;        // "school" 또는 "work"
        // 시작·종료 날짜 등도 필요하면 추가
    }
}
