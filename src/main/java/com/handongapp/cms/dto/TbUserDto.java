package com.handongapp.cms.dto;

import com.handongapp.cms.domain.TbUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class TbUserDto {

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class TbUserBasicDto {
        private String googleSub;
        private String name;
        private String email;
        private String phone;
        private String pictureUrl;
        private String studentId;
        private Boolean isAdmin;

        public static TbUserBasicDto of(TbUser user) {
            return new TbUserBasicDto(user.getGoogleSub(), user.getName(), user.getEmail(), user.getPhone(), user.getPictureUrl(), user.getStudentId(), user.getIsAdmin());
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class UserProfileReqDto {
        private String userId;
        private String name;
        private String studentId;
        private String email;
        private String phone;
        private String profileImage;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class UserProfileResDto {
        private String userId;
        private String name;
        private String studentId;
        private String email;
        private String phone;
        private String profileImage;

        public static UserProfileResDto of(TbUser user) {
            return new UserProfileResDto(user.getId(), user.getName(), user.getStudentId(), user.getEmail(), user.getPhone(), user.getPictureUrl());
        }
    }


}
