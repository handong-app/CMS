package app.handong.cms.listener;

import app.handong.cms.service.NodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.amqp.core.Queue;
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

    @Bean
    public Queue transcodeStatusQueue(@Value("${rabbitmq.queue.transcode-status}") String name) {
        return new Queue(name, true);
    }
}
