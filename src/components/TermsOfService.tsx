import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">이용약관</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
            <p>
              본 약관은 외부 서비스 상태 모니터링 대시보드(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제2조 (서비스의 내용)</h2>
            <div className="space-y-3">
              <p>본 서비스는 다음과 같은 기능을 제공합니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI 서비스(OpenAI, Anthropic, Cursor, Google AI) 상태 모니터링</li>
                <li>외부 서비스(GitHub, Netlify, Docker Hub, AWS, Slack, Firebase, Supabase) 상태 모니터링</li>
                <li>실시간 서비스 상태 업데이트</li>
                <li>즐겨찾기 기능</li>
                <li>다국어 지원 (한국어/영어)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제3조 (서비스 이용)</h2>
            <div className="space-y-3">
              <p>
                <strong>1. 이용 조건:</strong> 본 서비스는 누구나 무료로 이용할 수 있습니다.
              </p>
              <p>
                <strong>2. 이용 제한:</strong> 다음과 같은 행위는 금지됩니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>다른 이용자에게 피해를 주는 행위</li>
                <li>법령에 위반되는 행위</li>
                <li>서비스를 상업적 목적으로 무단 이용하는 행위</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제4조 (광고 게재)</h2>
            <div className="space-y-3">
              <p>
                <strong>1. 광고 서비스:</strong> 본 웹사이트는 Google AdSense를 통해 광고를 게재합니다.
              </p>
              <p>
                <strong>2. 광고 정책:</strong> 이용자는 다음 사항에 동의합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>광고 게재에 따른 쿠키 사용</li>
                <li>맞춤형 광고 제공을 위한 데이터 활용</li>
                <li>광고 클릭은 자발적이어야 하며, 인위적 클릭은 금지됩니다</li>
              </ul>
              <p>
                <strong>3. 광고 수익:</strong> 광고를 통해 발생하는 수익은 서비스 운영 및 개선에 사용됩니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제5조 (면책사항)</h2>
            <div className="space-y-3">
              <p>서비스 제공자는 다음 사항에 대해 책임을 지지 않습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>외부 서비스 상태 정보의 정확성:</strong> 본 서비스는 외부 API를 통해 정보를 제공하며, 정보의 정확성을 보장하지 않습니다</li>
                <li><strong>서비스 중단:</strong> 시스템 점검, 장애, 기타 부득이한 사유로 인한 서비스 중단</li>
                <li><strong>외부 링크:</strong> 외부 사이트로 연결되는 링크의 내용</li>
                <li><strong>이용자 손해:</strong> 서비스 이용으로 인해 발생하는 직간접적 손해</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제6조 (저작권)</h2>
            <div className="space-y-3">
              <p>
                <strong>1. 서비스 로고:</strong> 각 서비스의 로고는 해당 회사의 저작물이며, 상태 표시 목적으로만 사용됩니다.
              </p>
              <p>
                <strong>2. 서비스 콘텐츠:</strong> 본 웹사이트의 디자인, 코드, 구조는 서비스 제공자의 저작물입니다.
              </p>
              <p>
                <strong>3. 오픈소스:</strong> 본 프로젝트는 오픈소스로 공개되어 있으며, 관련 라이선스를 준수합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제7조 (개인정보 보호)</h2>
            <div className="space-y-3">
              <p>
                개인정보의 수집, 이용, 보관, 파기 등에 관한 사항은 별도의 개인정보처리방침에 따릅니다.
              </p>
              <p>
                <a href="/privacy-policy" className="text-blue-400 hover:underline">
                  개인정보처리방침 보기
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제8조 (약관의 변경)</h2>
            <div className="space-y-3">
              <p>
                <strong>1. 변경 사유:</strong> 법령의 제정·개정, 정부 정책의 변경, 서비스 내용의 변경 등의 사유로 약관을 변경할 수 있습니다.
              </p>
              <p>
                <strong>2. 변경 공지:</strong> 약관이 변경되는 경우, 변경 내용과 적용 일자를 명시하여 최소 7일 전에 공지합니다.
              </p>
              <p>
                <strong>3. 동의 간주:</strong> 변경된 약관에 대해 이의를 제기하지 않고 서비스를 계속 이용하는 경우 동의한 것으로 간주됩니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제9조 (연락처)</h2>
            <div className="space-y-3">
              <p>서비스 이용과 관련한 문의사항이 있으시면 아래 연락처로 문의하시기 바랍니다:</p>
              <div className="bg-card p-4 rounded-lg">
                <p><strong>서비스 문의</strong></p>
                <p>이메일: contact@yourdomain.com</p>
                <p>응답 시간: 영업일 기준 1-2일 이내</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">부칙</h2>
            <div className="space-y-3">
              <p><strong>시행일:</strong> 본 약관은 2024년 12월 18일부터 시행됩니다.</p>
              <p><strong>개정일:</strong> 2024년 12월 18일</p>
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

export default TermsOfService; 