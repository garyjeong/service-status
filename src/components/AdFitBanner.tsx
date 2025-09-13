import React, { useEffect, useState } from 'react';

interface AdFitBannerProps {
  onNoAd?: () => void;
}

// 데스크탑 광고 단위 ID 배열 (랜덤 선택용)
const DESKTOP_AD_UNITS = [
  "DAN-By8Vld66HSdvGce9",  // 새로운 PC용 광고
];

// 모바일 광고 단위 ID 배열 (랜덤 선택용)
const MOBILE_AD_UNITS = [
  "DAN-D8eIi2s4ypXDbkH6",  // 새로운 모바일용 광고
];

const AdFitBanner: React.FC<AdFitBannerProps> = ({ onNoAd }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDesktopAdUnit, setSelectedDesktopAdUnit] = useState<string>('');
  const [selectedMobileAdUnit, setSelectedMobileAdUnit] = useState<string>('');

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

  // 데스크탑 광고 단위 랜덤 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DESKTOP_AD_UNITS.length);
    setSelectedDesktopAdUnit(DESKTOP_AD_UNITS[randomIndex]);
  }, []);

  // 모바일 광고 단위 랜덤 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOBILE_AD_UNITS.length);
    setSelectedMobileAdUnit(MOBILE_AD_UNITS[randomIndex]);
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
      {/* 데스크탑 광고 - 랜덤 선택된 광고 단위 사용 */}
      {!isMobile && selectedDesktopAdUnit && (
        <div>
          <ins 
            className="kakao_ad_area" 
            style={{ display: 'none' }}
            data-ad-unit={selectedDesktopAdUnit}
            data-ad-width="728"
            data-ad-height="90"
          />
        </div>
      )}

      {/* 모바일 광고 - 랜덤 선택된 광고 단위 사용 */}
      {isMobile && selectedMobileAdUnit && (
        <div>
          <ins 
            className="kakao_ad_area" 
            style={{ display: 'none' }}
            data-ad-unit={selectedMobileAdUnit}
            data-ad-width="320"
            data-ad-height="50"
          />
        </div>
      )}
    </div>
  );
};

export default AdFitBanner; 