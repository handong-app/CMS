package app.handong.cms.dto.v1;

import app.handong.cms.domain.TbNodeGroup;
import app.handong.cms.domain.TbSection;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

public class NodeGroupDto {

    private NodeGroupDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Data
    public static class Response {
        private final String id;
        private final String sectionId;
        private final String title;
        private final Integer order;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String sectionId, String title, Integer order,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.sectionId = sectionId;
            this.title = title;
            this.order = order;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static Response from(TbNodeGroup entity) {
            if (entity == null) return null;
            return new Response(
                    entity.getId(),
                    entity.getSectionId(),
                    entity.getTitle(),
                    entity.getOrder(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }

    // CreateRequest DTO
    @Data
    @NoArgsConstructor
    public static class CreateRequest {
        private String sectionId;
        
        @NotBlank
        private String title;
        private Integer order;

        public CreateRequest(String sectionId, String title, Integer order) {
            this.sectionId = sectionId;
            this.title = title;
            this.order = order;
        }

        public TbNodeGroup toEntity() {
            TbNodeGroup nodeGroup = new TbNodeGroup();
            nodeGroup.setSectionId(this.sectionId);
            nodeGroup.setTitle(this.title);
            nodeGroup.setOrder(this.order);
            return nodeGroup;
        }
    }

    // UpdateRequest DTO
    @Data
    @NoArgsConstructor
    public static class UpdateRequest {
        private String title;
        private Integer order;

        public UpdateRequest(String title, Integer order) {
            this.title = title;
            this.order = order;
        }

        public void applyTo(TbNodeGroup entity) {
            if (this.title != null) {
                entity.setTitle(this.title);
            }
            if (this.order != null) {
                entity.setOrder(this.order);
            }
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class NodeGroupBaseDto {
        private String title;
        private Integer order;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NextNodeGroupResponseDto {
        // Section Info
        private String sectionId;
        private String sectionTitle;
        private Integer sectionOrder;
        private String sectionCourseId;
        private LocalDateTime sectionCreatedAt;
        private LocalDateTime sectionUpdatedAt;

        // NodeGroup Info
        private String nodeGroupId;
        private String nodeGroupTitle;
        private Integer nodeGroupOrder;
        private LocalDateTime nodeGroupCreatedAt;
        private LocalDateTime nodeGroupUpdatedAt;

        public static NextNodeGroupResponseDto buildResponseDto(TbSection section, TbNodeGroup nodeGroup) {
            return NextNodeGroupResponseDto.builder()
                .sectionId(section.getId())
                .sectionTitle(section.getTitle())
                .sectionOrder(section.getOrder().intValue())
                .sectionCourseId(section.getCourseId())
                .sectionCreatedAt(section.getCreatedAt())
                .sectionUpdatedAt(section.getUpdatedAt())
                .nodeGroupId(nodeGroup.getId())
                .nodeGroupTitle(nodeGroup.getTitle())
                .nodeGroupOrder(nodeGroup.getOrder().intValue())
                .nodeGroupCreatedAt(nodeGroup.getCreatedAt())
                .nodeGroupUpdatedAt(nodeGroup.getUpdatedAt())
                .build();
        }
    }
}
