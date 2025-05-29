package com.handongapp.cms.service.impl;

import com.handongapp.cms.exception.file.PresignedUrlCreationException;
import com.handongapp.cms.service.PresignedUrlService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URI;
import java.net.URL;
import java.time.Duration;
import java.util.regex.Pattern;

@Slf4j
@Service
public class PresignedUrlServiceImpl implements PresignedUrlService {

    private final S3Presigner presigner;
    private final String bucket;

    public PresignedUrlServiceImpl(
            @Value("${cloud.aws.s3.bucket}") String bucket,
            @Value("${cloud.aws.credentials.access-key}") String accessKey,
            @Value("${cloud.aws.credentials.secret-key}") String secretKey,
            @Value("${cloud.aws.endpoint}") String endpoint
    ) {
        this.bucket = bucket;

        this.presigner = S3Presigner.builder()
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .endpointOverride(URI.create(endpoint))
                .region(Region.US_EAST_1)
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build();
    }

    @Override
    public URL generateUploadUrl(String filename, String contentType) {
        validateInput(filename, "파일명");
        validateInput(contentType, "콘텐츠 타입");

        // 파일명 보안 검증
        if (!isValidFilename(filename)) {
            throw new IllegalArgumentException("유효하지 않은 파일명입니다: " + filename);
        }

        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(filename)
                    .contentType(contentType)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(10))
                    .putObjectRequest(objectRequest)
                    .build();

            return presigner.presignPutObject(presignRequest).url();
        } catch (Exception e) {
            log.error("Presigned URL 생성 실패: filename={}, contentType={}", filename, contentType, e);
            throw new PresignedUrlCreationException("Presigned URL 생성 중 오류가 발생했습니다", e);
        }
    }

    @Override
    public URL generateDownloadUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(getObjectRequest)
                .build();

        return presigner.presignGetObject(presignRequest).url();
    }

    private void validateInput(String input, String fieldName) {
        if (!StringUtils.hasText(input)) {
            throw new IllegalArgumentException(fieldName + "은(는) 필수입니다");
        }
    }
    private boolean isValidFilename(String filename) {
        // 경로 순회 공격 방지 및 특수문자 제한
        Pattern pattern = Pattern.compile("^[a-zA-Z0-9._-]+$");
        return !filename.contains("..")
                && !filename.startsWith("/")
                && pattern.matcher(filename).matches()
                && filename.length() <= 255;
    }
}
