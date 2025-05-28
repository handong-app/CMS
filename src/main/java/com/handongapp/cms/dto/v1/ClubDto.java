package com.handongapp.cms.dto.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

public class ClubDto {

    @Getter
    public static class ClubProfileResDto {
        private String clubName;
        private String slug;
        private String description;
        private String bannerUrl;

        public ClubProfileResDto(String clubName, String slug, String description, String bannerUrl) {
            this.clubName = clubName;
            this.slug = slug;
            this.description = description;
            this.bannerUrl = bannerUrl;
        }
    }

    @Getter
    public static class ClubProfileReqDto {
        private String slug;
        private String description;
        private String bannerUrl;

        public ClubProfileReqDto(String slug, String description, String bannerUrl) {
            this.slug = slug;
            this.description = description;
            this.bannerUrl = bannerUrl;
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubProgramResDto {
        private String programName;
        private String description;
//        private
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubProgramListResDto {
        private String programName;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubCourseInfoResDto {
        private String courseTitle; // tbCourse의 title
        private String programCreator; // tbCourse의 userId타고, tbUses 가서 name 얻어와
        private String courseDescription; // 코스 설명
        private String coursePictureUrl; // 코스 대표 사진

        List<CategoryOfCommentDto.CategoryOfCommentBaseDto> categoryList; // tbCourse id랑 엮어서 가져오면 됨.
        List<SectionDto.SectionBaseDto> sectionList;
        List<NodeGroupDto.NodeGroupBaseDto> nodeGroupList;
        List<NodeDto.NodeBaseDto> nodeList; // nodeGroup id랑 엮어서 가져오면 됨>
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubCourseListResDto {
        private String courseTitle; // tbCourse의 title
        private String programCreator; // tbCourse의 userId타고, tbUses 가서 name 얻어와
        private String courseDescription; // 코스 설명
        private String coursePictureUrl; // 코스 대표 사진
    }

}
