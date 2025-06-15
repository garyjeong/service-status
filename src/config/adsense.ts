// Google AdSense 설정
export const ADSENSE_CONFIG = {
  // 실제 사용 시 환경변수나 설정에서 가져오도록 변경
  publisherId: import.meta.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-8862471412851871',
  adSlots: {
    banner: import.meta.env.VITE_ADSENSE_AD_SLOT_BANNER || 'YOUR_BANNER_AD_SLOT_ID',
    rectangle: import.meta.env.VITE_ADSENSE_AD_SLOT_RECTANGLE || 'YOUR_RECTANGLE_AD_SLOT_ID',
    sidebar: import.meta.env.VITE_ADSENSE_AD_SLOT_SIDEBAR || 'YOUR_SIDEBAR_AD_SLOT_ID',
  },
  // 개발 환경에서 광고 표시 여부
  showAds: import.meta.env.VITE_SHOW_ADS === 'true' || import.meta.env.PROD,
};

// AdSense 스크립트 동적 로드 함수
export const loadAdSenseScript = (publisherId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (document.querySelector(`script[src*="${publisherId}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.crossOrigin = 'anonymous';

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('AdSense 스크립트 로드 실패'));

    document.head.appendChild(script);
  });
};
