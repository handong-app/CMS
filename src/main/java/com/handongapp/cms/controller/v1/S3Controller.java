package com.handongapp.cms.controller.v1;

import com.handongapp.cms.dto.v1.S3Dto;
import com.handongapp.cms.security.PrincipalDetails;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.UploadNotifyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * S3 Presigned URL 발급 컨트롤러
 * <p>
 * course-banner, club-banner, user-profile 용 presigned URL을 발급합니다.
 * 업로드 완료 후에는 별도의 complete 엔드포인트를 통해 상태를 업데이트해야 합니다.
 */
@RestController
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final PresignedUrlService presignedUrlService;
    private final UploadNotifyService uploadNotifyService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/upload-url/node-file")
    public ResponseEntity<S3Dto.UploadUrlResponse> generateNodeFileUploadUrl(
            @RequestBody S3Dto.NodeFileUploadUrlRequest request,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        return ResponseEntity.ok(presignedUrlService.generateNodeFileUploadUrl(request, principalDetails.getTbUser().getId()));
    }

    /**
     * 코스 배너 이미지 업로드용 Presigned URL을 발급합니다.
     *
     * @param courseId  코스 ID (UUID)
     * @param filename  클라이언트가 업로드하려는 원본 파일명
     * @return 업로드용 Presigned URL 및 메타데이터
     */
    @PostMapping("/upload-url/course-banner")
    public ResponseEntity<S3Dto.UploadUrlResponse> getCourseBannerUploadUrl(
            @RequestParam String courseId,
            @RequestParam String filename,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        // UUID를 파일명으로 사용하고, 확장자만 원본에서 추출
        S3Dto.UploadUrlResponse response = presignedUrlService.generateBannerUploadUrl(
                "course-banner", courseId, filename, principalDetails.getTbUser().getId());

        return ResponseEntity.ok(response);
    }

    /**
     * 동아리 배너 이미지 업로드용 Presigned URL을 발급합니다.
     *
     * @param clubId    동아리 ID (UUID)
     * @param filename  클라이언트가 업로드하려는 원본 파일명
     * @return 업로드용 Presigned URL 및 메타데이터
     */
    @PostMapping("/upload-url/club-banner")
    public ResponseEntity<S3Dto.UploadUrlResponse> getClubBannerUploadUrl(
            @RequestParam String clubId,
            @RequestParam String filename,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        S3Dto.UploadUrlResponse response = presignedUrlService.generateBannerUploadUrl(
                "club-banner", clubId, filename, principalDetails.getTbUser().getId());

        return ResponseEntity.ok(response);
    }

    /**
     * 사용자 프로필 이미지 업로드용 Presigned URL을 발급합니다.
     *
     * @param userId    사용자 ID (UUID)
     * @param filename  클라이언트가 업로드하려는 원본 파일명
     * @return 업로드용 Presigned URL 및 메타데이터
     */
    @PostMapping("/upload-url/user-profile")
    public ResponseEntity<S3Dto.UploadUrlResponse> getUserProfileUploadUrl(
            @RequestParam String userId,
            @RequestParam String filename,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        S3Dto.UploadUrlResponse response = presignedUrlService.generateBannerUploadUrl(
                "user-profile", userId, filename, principalDetails.getTbUser().getId());

        return ResponseEntity.ok(response);
    }

    /**
     * 노드 파일 업로드 완료 알림 엔드포인트.
     * <p>
     * 클라이언트로부터 노드 파일 업로드가 완료되었음을 알리는 콜백을 받아, 서버 측에서 관련 처리(파일 리스트 및 노드 정보 업데이트 등)를 수행합니다.
     *
     * @param dto 업로드 완료 요청 DTO
     * @return 200 OK 응답
     */
    @PostMapping("/upload-complete/node-file")
    public ResponseEntity<Void> notifyUploadComplete(@RequestBody S3Dto.UploadCompleteRequest dto) {
        uploadNotifyService.nodeFileUploadComplete(dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    /**
     * 파일 업로드 완료 처리
     *
     * @param request 업로드 완료 요청 (파일 리스트 ID, 실제 업로드된 파일 크기 등)
     * @return 업로드 완료 결과
     */
    @PostMapping("/upload-complete")
    public ResponseEntity<Void> completeUpload(@RequestBody @Valid S3Dto.UploadCompleteRequest request) {
        uploadNotifyService.completeUpload(request);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/download-url")
//    public ResponseEntity<S3Dto.DownloadUrlResponse> generateDownloadUrl(
//            @RequestParam("filename") String filename) {
//        return ResponseEntity.ok(
//                S3Dto.DownloadUrlResponse.builder()
//                        .presignedUrl(presignedUrlService.generateDownloadUrl(filename).toString())
//                        .build()
//        );
//    }
}