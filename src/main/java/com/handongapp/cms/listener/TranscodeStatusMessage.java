package com.handongapp.cms.listener;

import lombok.Data;

@Data
public class TranscodeStatusMessage {
    private String videoId;
    private String status;
    private Integer progress;
}
