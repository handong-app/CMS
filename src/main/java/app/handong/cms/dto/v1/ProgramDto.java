package app.handong.cms.dto.v1;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import app.handong.cms.domain.TbProgram;

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

    @Schema(description = "Program Create Request Dto")
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "프로그램 이름은 필수입니다.")
        @Size(max = 120, message = "프로그램 이름은 120자를 넘을 수 없습니다.")
        private String name;

        @NotBlank(message = "프로그램 슬러그는 필수입니다.")
        @Size(max = 100, message = "프로그램 슬러그는 100자를 넘을 수 없습니다.")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "슬러그는 영어 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.")
        private String slug;

        private String description;

        @NotNull(message = "시작일은 필수입니다.")
        private LocalDateTime startDate;

        @NotNull(message = "종료일은 필수입니다.")
        private LocalDateTime endDate;

        public TbProgram toEntity(String clubId, String userId) {
            TbProgram program = new TbProgram();
            program.setClubId(clubId);
            program.setUserId(userId);
            program.setName(this.name);
            program.setSlug(this.slug);
            program.setDescription(this.description);
            program.setStartDate(this.startDate);
            program.setEndDate(this.endDate);
            // AuditingFields (id, deleted, createdAt, updatedAt)는 JPA에 의해 자동 관리
            return program;
        }
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
