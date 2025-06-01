package com.handongapp.cms.util;

import org.apache.tika.Tika;

public class FileUtil {

    private FileUtil() {}

    private static final Tika tika = new Tika();

    /**
     * 파일명으로 MIME 타입을 추정한다 (확장자 기반).
     * @param filename 예: example.pdf
     * @return 예: application/pdf
     */
    public static String detectMimeTypeByFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("파일명이 비어 있습니다.");
        }
        return tika.detect(filename);
    }
}