import React, { useEffect, useRef } from "react";
import { useFetchBe } from "../tools/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import videojs from "video.js";
import "@videojs/http-streaming";
// 화질 선택 플러그인 import
import "videojs-http-source-selector";
// Video.js 스타일 import (필수)
import "video.js/dist/video-js.css";

// video.js 및 HLS 플러그인 import

function NodeGroupTest() {
  const NODEGROUPID = "088c56343a6f4d14b9920e7964c8869f";
  const fetchBe = useFetchBe();

  const queryClient = useQueryClient();
  const { data: myData, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () =>
      fetchBe(`/v1/node-group/${NODEGROUPID}`, { onUnauthorized: () => {} }),
  });

  console.log("myData", myData);

  interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
  }

  // m3u8 재생용 Video.js 컴포넌트
  const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, title }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
      let raf: number;
      if (videoRef.current && !playerRef.current) {
        raf = requestAnimationFrame(() => {
          if (videoRef.current && !playerRef.current) {
            playerRef.current = videojs(videoRef.current, {
              controls: true,
              responsive: true,
              fluid: true,
              sources: [
                {
                  src,
                  type: "application/x-mpegURL",
                },
              ],
              poster,
              html5: {
                vhs: {
                  overrideNative: true,
                  enableLowInitialPlaylist: true, // 네트워크 느릴 때 낮은 화질 우선
                  beforeRequest: (options: any) => {
                    // Authorization 헤더 추가 (필요시)
                    // options.headers = ...
                    return options;
                  },
                },
              },
            });
            // 화질 선택 메뉴 활성화
            playerRef.current.httpSourceSelector &&
              playerRef.current.httpSourceSelector();
            // 가장 높은 화질(1080p 등) 자동 선택
            playerRef.current.on("loadedmetadata", function () {
              const qualityLevels =
                playerRef.current.qualityLevels &&
                playerRef.current.qualityLevels();
              if (qualityLevels && qualityLevels.length > 0) {
                let maxIdx = 0;
                let maxHeight = 0;
                for (let i = 0; i < qualityLevels.length; i++) {
                  if (qualityLevels[i].height > maxHeight) {
                    maxHeight = qualityLevels[i].height;
                    maxIdx = i;
                  }
                }
                for (let i = 0; i < qualityLevels.length; i++) {
                  qualityLevels[i].enabled = i === maxIdx;
                }
              }
            });
          }
        });
      }
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
        if (raf) cancelAnimationFrame(raf);
      };
    }, [src, poster]);

    return (
      <div style={{ maxWidth: 640 }}>
        {title && <div style={{ marginBottom: 8 }}>{title}</div>}
        <video
          ref={videoRef}
          className="video-js vjs-default-skin"
          playsInline
        />
      </div>
    );
  };

  // 기존 Video 컴포넌트 대체 (m3u8 주소가 있으면 VideoPlayer로 렌더)
  const Video = ({ data }: any) => {
    const m3u8Url = data?.file?.playlist;
    if (!m3u8Url) return <div>비디오 주소 없음</div>;
    return <VideoPlayer src={m3u8Url} title={data.title} />;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {myData.nodes.map((node: any) => (
        <div key={node.id} style={{ marginBottom: 32 }}>
          <div>{node.type}</div>
          {node.type === "VIDEO" && <Video data={node.data} />}
        </div>
      ))}
    </div>
  );
}

export default NodeGroupTest;
