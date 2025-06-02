package com.handongapp.cms.service;


/**
 * Service for providing HLS playlist (m3u8) files for VIDEO nodes.
 * <p>
 * It generates the master playlist and resolution-specific playlists by replacing segment URLs with
 * presigned URLs, allowing secure video streaming.
 */
public interface VideoNodeHlsService {
    /**
     * Returns the master playlist (master.m3u8) content for the specified video node.
     *
     * @param nodeId the video node ID
     * @return the master playlist as a string
     */
    String getMasterPlaylist(String nodeId);

    /**
     * Returns the resolution-specific playlist (e.g., 480p/output.m3u8 or 1080p/output.m3u8) content
     * for the specified video node and resolution.
     *
     * @param nodeId     the video node ID
     * @param resolution the resolution (e.g., "480p" or "1080p")
     * @return the updated playlist with presigned segment URLs
     */
    String getResolutionPlaylist(String nodeId, String resolution);
}
