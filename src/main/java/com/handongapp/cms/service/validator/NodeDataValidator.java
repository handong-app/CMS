package com.handongapp.cms.service.validator;

import com.handongapp.cms.domain.TbNode.NodeType;
import java.util.*;

/*
 * spring component가 아닌 static 방식으로 작성한 이유 : 
 *  - 다른 component와의 의존성 없이 독립적으로 사용할 수 있도록 하기 위함
 *  - 가볍게 사용할 수 있도록 
 */

public class NodeDataValidator {

    public static void validate(NodeType type, Map<String, Object> data) {
        if (data == null || data.isEmpty()) {
            throw new IllegalArgumentException("node data cannot be empty");
        }

        switch (type) {
            case TEXT -> validateText(data);
            case IMAGE -> validateImage(data);
            case VIDEO -> validateVideo(data);
            //case QUIZ  -> validateQuiz(data);
            default -> throw new IllegalArgumentException("Unsupported node type: " + type);
        }
    }

    private static void validateText(Map<String, Object> data) {
        require(data, "content", String.class);
        require(data, "format", String.class);
        require(data, "word_count", Number.class);
    }

    private static void validateImage(Map<String, Object> data) {
        Map<?, ?> original = require(data, "original", Map.class);
        require(original, "url", String.class);
        require(original, "width", Number.class);
        require(original, "height", Number.class);
        require(original, "bytes", Number.class);
        require(data, "alt", String.class);
        require(data, "caption", String.class);
    }

    private static void validateVideo(Map<String, Object> data) {
        require(data, "title", String.class);
        require(data, "duration", Number.class);
        List<?> sources = require(data, "sources", List.class);
        for (Object o : sources) {
            Map<?, ?> source = castMap(o, "Each source must be an object");
            require(source, "label", String.class);
            require(source, "mime", String.class);
            require(source, "url", String.class);
        }

        List<?> captions = require(data, "captions", List.class);
        for (Object o : captions) {
            Map<?, ?> cap = castMap(o, "Each caption must be an object");
            require(cap, "lang", String.class);
            require(cap, "url", String.class);
        }

        require(data, "auto_play", Boolean.class);
    }

    // private static void validateQuiz(Map<String, Object> data) {
    //     require(data, "total_questions", Number.class);
    //     require(data, "shuffle_questions", Boolean.class);
    //     require(data, "time_limit_sec", Number.class);
    //     require(data, "pass_score", Number.class);
    //     require(data, "result_reveal", String.class);

    //     List<?> questions = require(data, "questions", List.class);
    //     if (questions.isEmpty()) throw new IllegalArgumentException("questions[] cannot be empty");

    //     for (Object q : questions) {
    //         Map<?, ?> question = castMap(q, "Each question must be an object");
    //         require(question, "text", String.class);
    //         List<?> options = require(question, "options", List.class);
    //         if (options.size() < 2) throw new IllegalArgumentException("Each question must have at least 2 options");
    //         require(question, "correct", Number.class);
    //     }
    // }

    // ----- Helpers -----

    @SuppressWarnings("unchecked")
    private static <T> T require(Map<?, ?> map, String key, Class<T> type) {
        Object value = map.get(key);
        if (value == null)
            throw new IllegalArgumentException("Missing required field: " + key);
        if (!type.isInstance(value))
            throw new IllegalArgumentException("Field '" + key + "' must be of type " + type.getSimpleName());
        return (T) value;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> castMap(Object o, String msg) {
        if (!(o instanceof Map<?, ?> m))
            throw new IllegalArgumentException(msg);
        return (Map<String, Object>) m;
    }
}
