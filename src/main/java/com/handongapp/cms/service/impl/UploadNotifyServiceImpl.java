package com.handongapp.cms.service.impl;

import com.handongapp.cms.dto.v1.S3Dto.UploadCompleteDto;
import com.handongapp.cms.exception.file.UploadNotificationException;
import com.handongapp.cms.service.UploadNotifyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadNotifyServiceImpl implements UploadNotifyService {

    private final AmqpTemplate amqpTemplate;

    @Value("${rabbitmq.queue.transcode-request}")
    private String transcodeRequestQueue;

    @Override
    public void notifyUploadComplete(UploadCompleteDto dto) {
        try {
            // RabbitMQ 에게 메시지 전송
            amqpTemplate.convertAndSend(transcodeRequestQueue, dto);
            log.info("\uD83D\uDE80  Transcode request sent to RabbitMQ: {}", transcodeRequestQueue);
        } catch (Exception e) {
            log.error("❌ Failed to send message to RabbitMQ: {}", e.getMessage(), e);
            throw new UploadNotificationException(e);
        }
    }
}