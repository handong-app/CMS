package com.handongapp.cms.service.impl;

import com.handongapp.cms.config.S3Config;
import com.handongapp.cms.service.PresignedUrlService;
import com.handongapp.cms.service.VideoNodeHlsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.Duration;
import java.util.Set;
import java.util.stream.Collectors;


/**
 * HLS (HTTP Live Streaming) 비디오 노드의 플레이리스트(m3u8)를 처리하는 서비스입니다.
 * <p>
 * - 마스터 m3u8 파일을 고정된 형태로 반환합니다.
 * - 480p, 1080p 등 해상도별 output.m3u8 파일의 segment 경로를 Presigned URL로 변환하여 반환합니다.
 * - 프론트엔드는 /api/v1/stream/{nodeId}/master.m3u8 로 마스터를,
 *   /api/v1/stream/{nodeId}/{resolution}/output.m3u8 로 해상도별 output.m3u8을 받아 스트리밍할 수 있습니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VideoNodeHlsServiceImpl implements VideoNodeHlsService {
    private final S3Client s3Client;
    private final PresignedUrlService presignedUrlService;
    private final S3Config s3Config;

    private static final Set<String> ALLOWED_RESOLUTIONS = Set.of("480p", "1080p");

    /**
     * 고정된 형태의 마스터 m3u8 내용을 반환합니다.
     * <p>
     * 클라이언트는 이 마스터 m3u8을 받아서 해상도 선택 UI를 구성할 수 있습니다.
     *
     * @param nodeId 비디오 노드의 ID
     * @return 마스터 m3u8 문자열
     */
    @Override
    public String getMasterPlaylist(String nodeId) {
        return "#EXTM3U\n" +
                "#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480\n" +
                "480p/output.m3u8\n" +
                "#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n" +
                "1080p/output.m3u8";
    }

    /**
     * S3에서 output.m3u8을 읽어, segment 경로를 Presigned URL로 변환하여 반환합니다.
     * <p>
     * 클라이언트는 이 결과를 받아 각 segment 파일에 안전하게 접근할 수 있습니다.
     *
     * @param nodeId    비디오 노드의 ID
     * @param resolution 해상도 ("480p", "1080p" 등)
     * @return Presigned URL로 변환된 output.m3u8 문자열
     */
    @Override
    public String getResolutionPlaylist(String nodeId, String resolution) {
        if (!ALLOWED_RESOLUTIONS.contains(resolution)) {
            throw new IllegalArgumentException("지원하지 않는 해상도입니다: " + resolution);
        }

        String basePath = "node_file/video/" + nodeId + "/" + resolution + "/";
        String s3Key = basePath + "output.m3u8";


        String m3u8Content = readS3FileAsString(s3Key);
        return replaceSegmentsWithPresignedUrls(m3u8Content, basePath);
    }

    /**
     * S3에서 지정된 파일을 문자열로 읽어 반환합니다.
     *
     * @param s3Key S3 키 (파일 경로)
     * @return 파일 내용 문자열
     * @throws IllegalStateException S3 읽기 실패 시 예외 발생
     */
    private String readS3FileAsString(String s3Key) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                s3Client.getObject(GetObjectRequest.builder()
                        .bucket(s3Config.getBucket())
                        .key(s3Key)
                        .build())
        ))) {
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (Exception e) {
            log.error("❌ S3에서 파일 읽기 실패: {}", s3Key, e);
            throw new IllegalStateException("❌ S3에서 파일 읽기 실패: " + s3Key, e);
        }
    }

    /**
     * m3u8 파일의 segment 경로를 Presigned URL로 변환합니다.
     * <p>
     * - .ts로 끝나는 경로를 Presigned URL로 변환
     * - 나머지 라인은 그대로 유지
     *
     * @param m3u8Content   원본 m3u8 문자열
     * @param segmentBasePath segment 파일들의 S3 경로 prefix
     * @return Presigned URL이 적용된 m3u8 문자열
     */
    private String replaceSegmentsWithPresignedUrls(String m3u8Content, String segmentBasePath) {
        String[] lines = m3u8Content.split("\n");
        /*
         * StringBuilder는 내부적으로 동적으로 메모리를 할당함.
         * 기본 용량으로 시작 후 용량이 넘치면 자동으로 늘어나지만, 이 과정에서 불필요한 복사(copy) 작업이 발생할 수 있다.
         * m3u8Content.length()에 약간의 여유 공간을 주면,
         * 대부분의 경우 StringBuilder가 1~2회 재할당 없이 바로 모든 라인을 담을 수 있어 성능이 향상된다.
         */
        StringBuilder updated = new StringBuilder(m3u8Content.length() + 200);
        for (String line : lines) {
            if (line.endsWith(".ts")) {
                String segmentKey = segmentBasePath + line;
                String presignedUrl = presignedUrlService
                        .generateDownloadUrl(segmentKey, Duration.ofHours(24))
                        .toString();
                updated.append(presignedUrl);
            } else {
                updated.append(line);
            }
            updated.append("\n");
        }

        return !updated.isEmpty() && updated.charAt(updated.length() - 1) == '\n'
                ? updated.substring(0, updated.length() - 1)
                : updated.toString();
    }
}