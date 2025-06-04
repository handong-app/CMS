// src/components/LandingPage/LottieBackground.tsx (가정)
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/Animation2.json'; // 실제 경로로 변경하세요

interface LottieBackgroundProps {
  appBarHeight?: string; // AppBar 높이를 props로 받습니다. (string 타입으로)
}

const LottieBackground: React.FC<LottieBackgroundProps> = ({ appBarHeight = '0px' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: appBarHeight, // AppBar 높이만큼 아래로 내립니다.
        left: 0,
        width: '100%',
        height: `calc(100% - ${appBarHeight})`, // AppBar 높이만큼 전체 높이에서 줄입니다.
        overflow: 'hidden',
        zIndex: 0, // 배경으로 설정
        pointerEvents: 'none', // 마우스 이벤트 무시
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // 컨테이너를 꽉 채우도록 하면서 비율 유지
        }}
      />
    </div>
  );
};

export default LottieBackground;