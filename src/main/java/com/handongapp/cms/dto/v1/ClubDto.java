package com.handongapp.cms.dto.v1;

import com.querydsl.core.annotations.QueryProjection;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

public class ClubDto {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClubProfileResDto {
        private String clubName;
        private String slug;
        private String description;
        private String bannerUrl;
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

    @Data
    @Schema(description = "클럽의 코스 목록 응답 DTO")
    public static class ClubCourseListResDto {
        private String courseTitle;
        private String programCreator;
        private String courseDescription;
        private String coursePictureUrl;
        private String courseFileKey;
        private String courseFileStatus;

        @QueryProjection
        public ClubCourseListResDto(
                String courseTitle,
                String programCreator,
                String courseDescription,
                String coursePictureUrl,
                String courseFileKey,
                String courseFileStatus
        ) {
            this.courseTitle = courseTitle;
            this.programCreator = programCreator;
            this.courseDescription = courseDescription;
            this.coursePictureUrl = coursePictureUrl;
            this.courseFileKey = courseFileKey;
            this.courseFileStatus = courseFileStatus;
        }
    }

}
