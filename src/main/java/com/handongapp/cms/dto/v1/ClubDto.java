package com.handongapp.cms.dto.v1;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

public class ClubDto {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubProfileResDto {
        private String clubName;
        private String slug;
        private String description;
        private String fileKey;

    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubProfileReqDto {
        private String slug;
        private String name;
        private String description;
        private String fileKey;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubCourseInfoResDto {
        private String courseTitle;
        private String programCreator;
        private String courseDescription;
        private String coursePictureUrl;

        List<CategoryOfCommentDto.CategoryOfCommentBaseDto> categoryList; // tbCourse id랑 엮어서 가져오면 됨.
        List<SectionDto.SectionBaseDto> sectionList;
        List<NodeGroupDto.NodeGroupBaseDto> nodeGroupList;
        List<NodeDto.NodeBaseDto> nodeList;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubCourseListResDto {
        private String courseTitle;
        private String programCreator;
        private String courseDescription;
        private String coursePictureUrl;
    }

}
