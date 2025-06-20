import React, { useEffect, useRef, useState } from 'react';

interface AdFitBannerProps {
  adUnit: string;
  onNoAd?: () => void;
}

declare global {
  interface Window {
    adsbykakao: any[];
    kakaoAdFitCallbacks: { [key: string]: (element: HTMLElement) => void };
  }
}

const AdFitBanner: React.FC<AdFitBannerProps> = ({
  adUnit,
  onNoAd
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const callbackName = `adFitCallback_${adUnit.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // 고정 배너 사이즈
  const BANNER_WIDTH = 728;
  const BANNER_HEIGHT = 90;

  // NO-AD 콜백 함수 등록
  useEffect(() => {
    if (!window.kakaoAdFitCallbacks) {
      window.kakaoAdFitCallbacks = {};
    }

    window.kakaoAdFitCallbacks[callbackName] = (element: HTMLElement) => {
      console.warn('AdFit NO-AD callback called for:', adUnit);
      setAdFailed(true);
      
      if (onNoAd) {
        onNoAd();
      }
      
      // NO-AD 시 대체 컨텐츠 표시 (선택사항)
      if (element && element.parentElement) {
        element.parentElement.style.display = 'none';
      }
    };

    return () => {
      // 컴포넌트 언마운트 시 콜백 정리
      if (window.kakaoAdFitCallbacks && window.kakaoAdFitCallbacks[callbackName]) {
        delete window.kakaoAdFitCallbacks[callbackName];
      }
    };
  }, [adUnit, callbackName, onNoAd]);

  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    const existingScript = document.querySelector('script[src*="kas/static/ba.min.js"]');
    
    if (!existingScript) {
      // Kakao AdFit 스크립트 로드
      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      script.charset = 'utf-8';
      
      script.onload = () => {
        console.log('AdFit script loaded successfully');
        setAdLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load AdFit script');
        setAdFailed(true);
      };
      
      document.head.appendChild(script);
    } else {
      // 스크립트가 이미 로드되어 있으면 바로 준비 완료
      setAdLoaded(true);
    }
  }, []);

  // 완전한 CSS 격리를 위한 스타일 - 모든 상속 차단
  const isolatedContainerStyle: React.CSSProperties = {
    all: 'initial',
    display: 'block',
    width: '728px',
    height: '90px',
    margin: '0',
    padding: '0',
    border: 'none',
    borderRadius: '0',
    boxShadow: 'none',
    background: 'transparent',
    overflow: 'visible',
    transform: 'none',
    transition: 'none',
    animation: 'none',
    position: 'static',
    zIndex: 'auto',
    opacity: '1',
    visibility: 'visible',
    clipPath: 'none',
    filter: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none'
  };

  const isolatedAdStyle: React.CSSProperties = {
    all: 'initial',
    display: 'none',
    width: '728px',
    height: '90px',
    margin: '0',
    padding: '0',
    border: 'none',
    borderRadius: '0',
    boxShadow: 'none',
    background: 'transparent',
    overflow: 'visible',
    transform: 'none',
    transition: 'none',
    animation: 'none',
    position: 'static',
    zIndex: 'auto',
    opacity: '1',
    visibility: 'visible',
    clipPath: 'none',
    filter: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none'
  };

  return (
    <div ref={adRef} style={isolatedContainerStyle}>
      {!adFailed && (
        <ins
          className="kakao_ad_area"
          style={isolatedAdStyle}
          data-ad-unit={adUnit}
          data-ad-width="728"
          data-ad-height="90"
          data-ad-onfail={`window.kakaoAdFitCallbacks.${callbackName}`}
        />
      )}
      
      {/* 로딩 상태 표시 (선택사항) */}
      {!adLoaded && !adFailed && (
        <div 
          style={{
            all: 'initial',
            width: '728px',
            height: '90px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            margin: '0',
            padding: '0',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            overflow: 'visible',
            transform: 'none',
            transition: 'none',
            animation: 'none',
            position: 'static',
            zIndex: 'auto',
            opacity: '1',
            visibility: 'visible',
            clipPath: 'none',
            filter: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none'
          }}
        >
          광고 로딩 중...
        </div>
      )}
    </div>
  );
};

export default AdFitBanner; 