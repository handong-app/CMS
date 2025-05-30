package com.handongapp.cms.exception.file;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Presigned URL 생성 실패 시 발생하는 예외
 * HttpStatus INTERNAL_SERVER_ERROR
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class PresignedUrlCreationException extends RuntimeException {

    public PresignedUrlCreationException(String message) {
        super(message);
    }

    public PresignedUrlCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}