import React, { useEffect } from 'react';
import { ADSENSE_CONFIG, loadAdSenseScript } from '../config/adsense';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  responsive = true
}) => {
  useEffect(() => {
    const initializeAd = async () => {
      // 개발 환경에서 광고를 표시하지 않는 경우
      if (!ADSENSE_CONFIG.showAds) {
        console.log('개발 환경: AdSense 광고가 비활성화되었습니다.');
        return;
      }

      try {
        // AdSense 스크립트 로드
        await loadAdSenseScript(ADSENSE_CONFIG.publisherId);
        
        // 광고 초기화
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense 광고 로드 중 오류:', error);
      }
    };

    initializeAd();
  }, []);

  // 개발 환경에서 광고 대신 플레이스홀더 표시
  if (!ADSENSE_CONFIG.showAds) {
    return (
      <div className={`adsense-placeholder ${className}`} style={adStyle}>
        <div className="flex items-center justify-center h-full bg-gray-700/20 border-2 border-dashed border-gray-600 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-sm font-medium">AdSense 광고 영역</div>
            <div className="text-xs mt-1">슬롯: {adSlot}</div>
            <div className="text-xs">형식: {adFormat}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdSenseAd; 