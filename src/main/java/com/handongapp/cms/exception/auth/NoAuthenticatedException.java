package com.handongapp.cms.exception.auth;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * 해당 메서드 권한 없을 경우 사용되는 예외처리
 * HttpStatus UNAUTHORIZED
 */
@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
@SuppressWarnings("serial")
@NoArgsConstructor
public class NoAuthenticatedException extends RuntimeException {
    public NoAuthenticatedException(String message) {
        super(message);
    }
}