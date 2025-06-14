package app.handong.cms.exception;


import app.handong.cms.exception.auth.InvalidTokenException;
import app.handong.cms.exception.auth.NoAuthenticatedException;
import app.handong.cms.exception.auth.NoAuthorizationException;
import app.handong.cms.exception.data.DataUpdateException;
import app.handong.cms.exception.data.DuplicateEntityException;
import app.handong.cms.exception.data.DuplicateTagCodeException;
import app.handong.cms.exception.data.NotFoundException;
import app.handong.cms.exception.file.PresignedUrlCreationException;
import app.handong.cms.exception.file.UploadNotificationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            InvalidTokenException.class,
            NoAuthenticatedException.class,
            NoAuthorizationException.class,
            DuplicateEntityException.class,
            DuplicateTagCodeException.class,
            NotFoundException.class,
            DataUpdateException.class,
            UploadNotificationException.class,
            PresignedUrlCreationException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<Map<String, Object>> handleCustomExceptions(Exception ex) {
        HttpStatus status = resolveHttpStatus(ex);
        return ResponseEntity.status(status).body(buildErrorBody(status, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
//        ex.printStackTrace();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        return ResponseEntity.status(status).body(buildErrorBody(status, ex.getMessage()));
    }

    private HttpStatus resolveHttpStatus(Exception ex) {

        if (ex instanceof IllegalArgumentException) {
            return HttpStatus.BAD_REQUEST;
        }

        ResponseStatus statusAnnotation = ex.getClass().getAnnotation(ResponseStatus.class);
        return (statusAnnotation != null) ? statusAnnotation.value() : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private Map<String, Object> buildErrorBody(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return body;
    }
}