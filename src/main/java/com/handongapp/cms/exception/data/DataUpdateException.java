package com.handongapp.cms.exception.data;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 *  Data 업데이트 실패시 사용하는 예외처리
 *  HttpStatus 500
 */
@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
@SuppressWarnings("serial")
@NoArgsConstructor
public class DataUpdateException extends RuntimeException {
    public DataUpdateException(String message) {
        super(message);
    }

    public DataUpdateException(String message, Throwable cause) {
        super(message, cause);
    }
}