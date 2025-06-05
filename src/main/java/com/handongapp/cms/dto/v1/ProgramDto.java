package com.handongapp.cms.dto.v1;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

public class ProgramDto {
    @Schema(description = "Program Response Dto")
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDto {
        private String programId;

        @NonNull
        private String clubId;

        private String clubSlug;

        @NonNull
        private String userId;

        private String name;

        private String slug;

        private String description;

        @NonNull
        private LocalDateTime startDate;

        @NonNull
        private LocalDateTime endDate;
    }

    @Schema(description = "Program Join Request Dto")
    @Getter
    @Setter
    @NoArgsConstructor
    // @AllArgsConstructor // 제거
    public static class ProgramJoinRequestDto {
        // 현재 프로그램 가입 시 요청 본문에 필요한 추가 데이터는 없다고 가정합니다.
        // 필요시 여기에 필드를 추가합니다. (예: @NotNull private String participantType;)
        // 만약 이 DTO가 계속 비어있다면, 컨트롤러에서 @RequestBody를 사용하지 않을 수도 있습니다.
    }
}
