package app.handong.cms.dto.v1;

import app.handong.cms.domain.TbUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class UserDto {

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class TbUserBasicDto {
        private String googleSub;
        private String name;
        private String email;
        private String phone;
        private String fileKey;
        private String studentId;
        private Boolean isAdmin;

        public static TbUserBasicDto of(TbUser user) {
            return new TbUserBasicDto(user.getGoogleSub(), user.getName(), user.getEmail(), user.getPhone(), user.getFileKey(), user.getStudentId(), user.getIsAdmin());
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
            return new UserProfileResDto(user.getId(), user.getName(), user.getStudentId(), user.getEmail(), user.getPhone(), user.getFileKey());
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public class UserProfileImageReqDto {
        private String fileKey;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class UserProfileLastResDto {
        @Getter
        @Setter
        private ArrayList<LastProgramResDto> lastProgramsProfile;

        public static UserProfileLastResDto of(ArrayList<LastProgramResDto> userProfileLastResDto) {
            return new UserProfileLastResDto(userProfileLastResDto);
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class LastProgramResDto {
        private String clubId;
        private String courseId;
        private String nodeGroupId;
        private LocalDateTime lastSeenAt;
    }
}
