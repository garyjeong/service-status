# 🎯 Google AdSense 연동 가이드

## 📋 목차
1. [AdSense 계정 생성 및 승인](#1-adsense-계정-생성-및-승인)
2. [프로젝트 설정](#2-프로젝트-설정)
3. [환경변수 설정](#3-환경변수-설정)
4. [광고 단위 생성](#4-광고-단위-생성)
5. [배포 및 테스트](#5-배포-및-테스트)
6. [문제 해결](#6-문제-해결)

## 1. AdSense 계정 생성 및 승인

### 1.1 AdSense 계정 신청
1. [Google AdSense](https://www.google.com/adsense/) 접속
2. "시작하기" 클릭
3. 웹사이트 URL 입력 (예: `https://your-domain.com`)
4. 국가/지역 선택 (한국)
5. 결제 정보 입력

### 1.2 사이트 승인 요구사항
- ✅ **고품질 콘텐츠**: 유용하고 독창적인 내용
- ✅ **충분한 트래픽**: 일일 방문자 수십 명 이상
- ✅ **완성된 웹사이트**: 네비게이션, 개인정보처리방침 등
- ✅ **모바일 친화적**: 반응형 디자인 (현재 프로젝트는 이미 구현됨)
- ✅ **빠른 로딩 속도**

### 1.3 필수 페이지 추가
다음 페이지들을 추가해야 합니다:
- 개인정보처리방침 (Privacy Policy)
- 이용약관 (Terms of Service)
- 연락처 (Contact)

## 2. 프로젝트 설정

### 2.1 현재 구현된 기능
- ✅ AdSense 컴포넌트 (`src/components/AdSenseAd.tsx`)
- ✅ 설정 관리 (`src/config/adsense.ts`)
- ✅ 개발 환경 플레이스홀더
- ✅ 반응형 광고 배치

### 2.2 광고 배치 위치
1. **푸터 배너**: 화면 하단 고정 배너 광고
2. **콘텐츠 사이**: 3번째, 6번째 서비스 카드 뒤에 삽입

## 3. 환경변수 설정

### 3.1 `.env` 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
# Google AdSense 설정
VITE_ADSENSE_PUBLISHER_ID=ca-pub-YOUR_ACTUAL_PUBLISHER_ID
VITE_ADSENSE_AD_SLOT_BANNER=YOUR_BANNER_AD_SLOT_ID
VITE_ADSENSE_AD_SLOT_RECTANGLE=YOUR_RECTANGLE_AD_SLOT_ID

# 프로덕션에서 광고 표시
VITE_SHOW_ADS=true
```

### 3.2 실제 값으로 교체
AdSense 승인 후 다음 값들을 실제 값으로 교체:
- `YOUR_ACTUAL_PUBLISHER_ID`: AdSense에서 제공하는 게시자 ID
- `YOUR_BANNER_AD_SLOT_ID`: 배너 광고 단위 ID
- `YOUR_RECTANGLE_AD_SLOT_ID`: 사각형 광고 단위 ID

## 4. 광고 단위 생성

### 4.1 AdSense 대시보드에서 광고 단위 생성
1. AdSense 계정 로그인
2. "광고" → "광고 단위별" 클릭
3. "디스플레이 광고" 선택

### 4.2 배너 광고 설정
- **이름**: "Footer Banner"
- **크기**: 반응형
- **광고 유형**: 디스플레이 광고

### 4.3 사각형 광고 설정
- **이름**: "Content Rectangle"
- **크기**: 반응형 또는 336x280
- **광고 유형**: 디스플레이 광고

## 5. 배포 및 테스트

### 5.1 개발 환경에서 테스트
```bash
# 개발 서버 실행
npm run dev

# 광고 플레이스홀더 확인
# VITE_SHOW_ADS=false일 때 플레이스홀더가 표시됨
```

### 5.2 프로덕션 배포
```bash
# 빌드
npm run build

# 배포 (Netlify 예시)
npm run deploy
```

### 5.3 광고 표시 확인
- 실제 도메인에서 광고가 표시되는지 확인
- 모바일/데스크톱 반응형 동작 확인
- 광고 로딩 시간 확인

## 6. 문제 해결

### 6.1 광고가 표시되지 않는 경우
1. **AdSense 승인 상태 확인**
   - AdSense 계정이 승인되었는지 확인
   - 사이트가 AdSense 정책을 준수하는지 확인

2. **설정 값 확인**
   - 게시자 ID가 올바른지 확인
   - 광고 슬롯 ID가 올바른지 확인
   - 환경변수가 제대로 설정되었는지 확인

3. **브라우저 콘솔 확인**
   - JavaScript 오류가 있는지 확인
   - AdSense 스크립트가 로드되었는지 확인

### 6.2 일반적인 오류 해결
```javascript
// 콘솔에서 AdSense 상태 확인
console.log('AdSense 로드됨:', !!window.adsbygoogle);
console.log('광고 큐:', window.adsbygoogle?.length);
```

### 6.3 성능 최적화
- 광고 스크립트를 비동기로 로드 (이미 구현됨)
- 광고 로딩 중 레이아웃 시프트 방지
- 광고 영역에 최소 높이 설정 (이미 구현됨)

## 📊 수익 최적화 팁

### 1. 광고 배치 최적화
- 사용자 시선이 머무는 곳에 배치
- 콘텐츠와 자연스럽게 어우러지도록 배치
- 너무 많은 광고는 사용자 경험 저해

### 2. 광고 형식 실험
- 다양한 광고 크기 테스트
- 텍스트/이미지 광고 비율 조정
- A/B 테스트를 통한 최적화

### 3. 트래픽 증가
- SEO 최적화
- 소셜 미디어 활용
- 유용한 콘텐츠 지속 제공

## 🚀 다음 단계

1. **AdSense 계정 승인 받기**
2. **실제 게시자 ID와 광고 슬롯 ID로 교체**
3. **프로덕션 환경에 배포**
4. **광고 성과 모니터링**
5. **수익 최적화**

---

**참고**: 이 가이드는 현재 프로젝트에 이미 구현된 AdSense 연동 기능을 기반으로 작성되었습니다. 실제 사용 시에는 Google AdSense 정책을 준수해야 합니다. 