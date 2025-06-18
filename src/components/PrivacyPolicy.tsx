import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">개인정보처리방침</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. 개인정보의 수집 및 이용</h2>
            <div className="space-y-3">
              <p>
                <strong>수집하는 개인정보:</strong> 본 웹사이트는 서비스 제공을 위해 다음과 같은 정보를 자동으로 수집합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>방문 기록, IP 주소, 쿠키, 접속 로그</li>
                <li>브라우저 종류 및 OS 정보</li>
                <li>방문한 페이지 및 이용 시간</li>
              </ul>
              <p>
                <strong>수집 목적:</strong> 서비스 제공, 서비스 개선, 통계 분석, 광고 게재
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Google AdSense 및 광고</h2>
            <div className="space-y-3">
              <p>
                본 웹사이트는 Google AdSense를 통해 광고를 게재합니다. Google AdSense는 사용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Google은 이 웹사이트에 광고를 게재하기 위해 쿠키를 사용합니다</li>
                <li>사용자는 Google 광고 설정에서 맞춤 광고를 비활성화할 수 있습니다</li>
                <li>Google의 개인정보 처리방침: <a href="https://policies.google.com/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. 쿠키 사용</h2>
            <div className="space-y-3">
              <p>본 웹사이트는 다음과 같은 쿠키를 사용합니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>필수 쿠키:</strong> 웹사이트 기본 기능 제공</li>
                <li><strong>분석 쿠키:</strong> 웹사이트 이용 통계 분석</li>
                <li><strong>광고 쿠키:</strong> 맞춤형 광고 제공</li>
              </ul>
              <p>
                브라우저 설정을 통해 쿠키를 거부할 수 있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. 개인정보의 보관 및 파기</h2>
            <div className="space-y-3">
              <p>
                수집된 개인정보는 수집 목적 달성 후 지체 없이 파기됩니다. 다만, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. 개인정보의 제3자 제공</h2>
            <div className="space-y-3">
              <p>
                본 웹사이트는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>사용자의 동의가 있는 경우</li>
                <li>법령의 규정에 의한 경우</li>
                <li>Google AdSense 등 광고 서비스 제공을 위한 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. 개인정보 보호책임자</h2>
            <div className="space-y-3">
              <p>개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정합니다.</p>
              <div className="bg-card p-4 rounded-lg">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>이메일: contact@yourdomain.com</p>
                <p>연락처: 문의사항이 있으시면 이메일로 연락 바랍니다.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. 개인정보 처리방침의 변경</h2>
            <div className="space-y-3">
              <p>
                본 개인정보 처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 변경 최소 7일 전부터 웹사이트를 통해 변경이유 및 내용 등을 공지하도록 하겠습니다.
              </p>
              <p><strong>공고일자:</strong> 2024년 12월 18일</p>
              <p><strong>시행일자:</strong> 2024년 12월 18일</p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            메인 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 