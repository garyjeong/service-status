import React from 'react';
import { Mail, MessageCircle, Shield, Code, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">연락처</h1>
        
        <div className="space-y-8">
          <section className="text-center">
            <p className="text-lg text-muted-foreground mb-8">
              서비스 이용 중 문의사항이나 제안사항이 있으시면 언제든지 연락해 주세요.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 일반 문의 */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold">일반 문의</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                서비스 이용, 기능 제안, 협업 문의 등
              </p>
              <a 
                href="mailto:contact@yourdomain.com" 
                className="text-blue-400 hover:underline font-medium"
              >
                contact@yourdomain.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                응답 시간: 영업일 기준 1-2일 이내
              </p>
            </div>

            {/* 기술 지원 */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold">기술 지원</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                버그 신고, 기술적 문제, API 관련 문의
              </p>
              <a 
                href="mailto:support@yourdomain.com" 
                className="text-green-400 hover:underline font-medium"
              >
                support@yourdomain.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                응답 시간: 영업일 기준 24시간 이내
              </p>
            </div>

            {/* 개인정보 문의 */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-semibold">개인정보 문의</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                개인정보 처리, 쿠키 정책, 데이터 삭제 요청
              </p>
              <a 
                href="mailto:privacy@yourdomain.com" 
                className="text-yellow-400 hover:underline font-medium"
              >
                privacy@yourdomain.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                응답 시간: 영업일 기준 48시간 이내
              </p>
            </div>

            {/* 미디어 문의 */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold">미디어 문의</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                보도자료, 인터뷰, 언론 관련 문의
              </p>
              <a 
                href="mailto:media@yourdomain.com" 
                className="text-purple-400 hover:underline font-medium"
              >
                media@yourdomain.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                응답 시간: 영업일 기준 1-3일 이내
              </p>
            </div>
          </div>

          {/* 서비스 정보 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold">서비스 정보</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">모니터링 대상 서비스</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI 서비스: OpenAI, Anthropic, Cursor, Google AI</li>
                  <li>• 개발 플랫폼: GitHub, Netlify, Docker Hub</li>
                  <li>• 클라우드: AWS, Firebase, Supabase</li>
                  <li>• 커뮤니케이션: Slack</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">기술 스택</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Frontend: React 19 + TypeScript</li>
                  <li>• Styling: Tailwind CSS 4.1</li>
                  <li>• Build: Vite 6.3</li>
                  <li>• 업데이트: 15초 간격 자동 갱신</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Q. 서비스 상태 정보는 얼마나 정확한가요?</h3>
                <p className="text-sm text-muted-foreground">
                  각 서비스의 공식 상태 API를 통해 실시간으로 정보를 수집합니다. 다만, 네트워크 지연이나 API 제한으로 인해 약간의 지연이 있을 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Q. 새로운 서비스 추가를 요청할 수 있나요?</h3>
                <p className="text-sm text-muted-foreground">
                  네, 언제든지 contact@yourdomain.com으로 요청해 주세요. 공개 상태 API가 있는 서비스라면 검토 후 추가하겠습니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Q. 모바일에서도 이용할 수 있나요?</h3>
                <p className="text-sm text-muted-foreground">
                  네, 반응형 디자인으로 제작되어 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 환경을 제공합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 오픈소스 정보 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">오픈소스</h2>
            <p className="text-muted-foreground mb-4">
              본 프로젝트는 오픈소스로 공개되어 있습니다. 코드 기여, 이슈 리포트, 기능 제안 등을 환영합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com/yourusername/service-status-check" 
                className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="w-4 h-4 mr-2" />
                GitHub Repository
              </a>
              <a 
                href="https://github.com/yourusername/service-status-check/issues" 
                className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Issue Tracker
              </a>
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

export default Contact; 