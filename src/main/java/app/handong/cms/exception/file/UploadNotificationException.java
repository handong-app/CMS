package app.handong.cms.exception.file;


import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * 업로드 완료 알림을 외부 시스템(RabbitMQ 등)에 전송하는 과정에서 발생하는 예외
 * HttpStatus BAD_GATEWAY
 */
@ResponseStatus(value = HttpStatus.BAD_GATEWAY)
@SuppressWarnings("serial")
@NoArgsConstructor
public class UploadNotificationException extends RuntimeException {

    public UploadNotificationException(String message) {
        super(message);
    }

    public UploadNotificationException(String message, Throwable cause) {
        super(message, cause);
    }

    public UploadNotificationException(Throwable cause) {
        super("외부 시스템(RabbitMQ)로 업로드 완료 알림 전송 실패", cause);
    }
}