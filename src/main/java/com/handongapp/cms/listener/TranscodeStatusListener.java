package com.handongapp.cms.listener;


import com.handongapp.cms.service.NodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TranscodeStatusListener {

    private final NodeService nodeService;

    @RabbitListener(queues = "${rabbitmq.queue.transcode-status}")
    public void handleTranscodeStatus(TranscodeStatusMessage message) {
        try {
            log.info("📡⚡️ 트랜스코딩 상태 메시지 수신 - videoId: {}, status: {}, progress: {}", message.getVideoId(), message.getStatus(), message.getProgress());

            nodeService.updateVideoTranscodeStatus(message.getVideoId(), message.getStatus(), message.getProgress());

        } catch (Exception e) {
            log.error("❌ 트랜스코딩 상태 메시지 처리 실패", e);
        }
    }
}
