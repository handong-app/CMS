package com.handongapp.cms.dto;

import com.handongapp.cms.domain.TbNode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

public class NodeDto {

    private NodeDto() {
        // Prevent instantiation
    }

    // Response DTO
    @Data
    public static class Response {
        private final String id;
        private final String nodeGroupId;
        private final TbNode.NodeType type;
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;
        private final String attachmentUrl;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(String id, String nodeGroupId, TbNode.NodeType type, Boolean commentPermitted, Map<String, Object> data, Integer order, String attachmentUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.nodeGroupId = nodeGroupId;
            this.type = type;
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.attachmentUrl = attachmentUrl;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }

    // CreateRequest DTO
    @Data
    public static class CreateRequest {
        // @NotBlank // @NotBlank 제거
        private String nodeGroupId; // final 제거, Lombok이 getter/setter 생성
        
        @NotNull
        private final TbNode.NodeType type;
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;
        private final String attachmentUrl;

        // 생성자는 유지하되, nodeGroupId는 setter로 설정될 것을 기대
        // 또는, nodeGroupId를 받는 생성자를 유지하고, 컨트롤러에서 new CreateRequest(...) 시 null을 전달 후 setter로 설정
        // 여기서는 nodeGroupId를 받는 생성자를 유지하고, 컨트롤러에서 new CreateRequest를 직접 만들지 않으므로
        // Jackson이 JSON 바디를 객체로 변환할 때 이 생성자를 사용하지 않거나, nodeGroupId가 JSON에 없으면 null로 들어옴.
        // 컨트롤러에서 setter로 덮어쓰게 됨.
        public CreateRequest(String nodeGroupId, TbNode.NodeType type, Boolean commentPermitted, Map<String, Object> data, Integer order, String attachmentUrl) {
            this.nodeGroupId = nodeGroupId; // final이 아니므로 여기서 할당 가능
            this.type = type;
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.attachmentUrl = attachmentUrl;
        }
    }

    // UpdateRequest DTO
    @Data
    public static class UpdateRequest {
        private final Boolean commentPermitted;
        private final Map<String, Object> data;
        private final Integer order;
        private final String attachmentUrl;

        public UpdateRequest(Boolean commentPermitted, Map<String, Object> data, Integer order, String attachmentUrl) {
            this.commentPermitted = commentPermitted;
            this.data = data;
            this.order = order;
            this.attachmentUrl = attachmentUrl;
        }
    }
}
