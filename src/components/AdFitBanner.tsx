import React, { useEffect, useState } from 'react';

interface AdFitBannerProps {
  onNoAd?: () => void;
}

const AdFitBanner: React.FC<AdFitBannerProps> = ({ onNoAd }) => {
  const [isMobile, setIsMobile] = useState(false);

  // 모바일/데스크탑 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 스크립트 로드
  useEffect(() => {
    if (!document.querySelector('script[src*="ba.min.js"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="adfit-banner-container">
      {/* 데스크탑 광고 */}
      {!isMobile && (
        <div>
          <ins 
            className="kakao_ad_area" 
            style={{ display: 'none' }}
            data-ad-unit="DAN-wiu4St0eJQqPsPgL"
            data-ad-width="728"
            data-ad-height="90"
          />
        </div>
      )}

      {/* 모바일 광고 */}
      {isMobile && (
        <div>
          <ins 
            className="kakao_ad_area" 
            style={{ display: 'none' }}
            data-ad-unit="DAN-sNZd9e7TZodLtrDT"
            data-ad-width="320"
            data-ad-height="50"
          />
        </div>
      )}
    </div>
  );
};

export default AdFitBanner; 