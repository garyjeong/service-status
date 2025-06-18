import React from 'react';
import { Activity, Clock, Globe, Shield, Star, Users, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">서비스 소개</h1>
        
        <div className="space-y-8">
          {/* 서비스 개요 */}
          <section className="text-center">
            <p className="text-lg text-muted-foreground mb-8">
              개발자와 IT 전문가를 위한 실시간 외부 서비스 상태 모니터링 플랫폼입니다.
              주요 AI 서비스와 개발 도구들의 상태를 한눈에 확인하고, 서비스 장애에 빠르게 대응하세요.
            </p>
          </section>

          {/* 주요 특징 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              주요 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">실시간 모니터링</h3>
                    <p className="text-sm text-muted-foreground">
                      15초마다 자동으로 서비스 상태를 업데이트하여 최신 정보를 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">다중 서비스 지원</h3>
                    <p className="text-sm text-muted-foreground">
                      11개의 주요 서비스와 100여 개의 하위 컴포넌트 상태를 모니터링합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">다국어 지원</h3>
                    <p className="text-sm text-muted-foreground">
                      한국어와 영어를 지원하여 글로벌 사용자들이 편리하게 이용할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">개인정보 보호</h3>
                    <p className="text-sm text-muted-foreground">
                      사용자 데이터를 수집하지 않으며, 모든 정보는 클라이언트에서 처리됩니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">빠른 성능</h3>
                    <p className="text-sm text-muted-foreground">
                      최신 React 19와 Vite를 사용하여 빠른 로딩과 부드러운 사용자 경험을 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">사용자 친화적</h3>
                    <p className="text-sm text-muted-foreground">
                      직관적인 인터페이스와 모바일 최적화로 언제 어디서나 편리하게 사용할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 모니터링 대상 서비스 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6">모니터링 대상 서비스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">AI 서비스</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">OpenAI ChatGPT</h4>
                    <p className="text-sm text-muted-foreground">
                      ChatGPT 웹 인터페이스, OpenAI API, DALL-E, Whisper API, GPT-4 등 6개 컴포넌트
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Anthropic Claude</h4>
                    <p className="text-sm text-muted-foreground">
                      Claude 채팅, Anthropic API, Claude Pro, API 콘솔 등 5개 컴포넌트
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Cursor Editor</h4>
                    <p className="text-sm text-muted-foreground">
                      데스크톱 앱, AI 코파일럿, 동기화 서비스, 확장 프로그램 등 6개 컴포넌트
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Google AI Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Gemini API, AI Studio, Model Garden, Vertex AI 등 4개 컴포넌트
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-400">개발 & 클라우드 서비스</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <p className="text-sm text-muted-foreground">
                      Git 작업, API 요청, Issues & PRs, Actions, Pages, Copilot 등 8개 컴포넌트
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">AWS</h4>
                    <p className="text-sm text-muted-foreground">
                      EC2, S3, RDS, Lambda, CloudFront, Route 53 등 주요 AWS 서비스 10개 컴포넌트
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Firebase & Supabase</h4>
                    <p className="text-sm text-muted-foreground">
                      Firebase 10개, Supabase 10개 컴포넌트로 백엔드 서비스 전반 모니터링
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">기타 서비스</h4>
                    <p className="text-sm text-muted-foreground">
                      Netlify (7개), Docker Hub (6개), Slack (8개) 컴포넌트 지원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 기술 스택 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6">기술 스택</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-blue-400">Frontend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React 19 (최신 버전)</li>
                  <li>• TypeScript 5.8</li>
                  <li>• Tailwind CSS 4.1</li>
                  <li>• Lucide React Icons</li>
                  <li>• 반응형 디자인</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-green-400">개발 도구</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vite 6.3 (빌드 도구)</li>
                  <li>• pnpm (패키지 관리)</li>
                  <li>• ESLint 9 (코드 품질)</li>
                  <li>• Prettier 3.5 (포맷팅)</li>
                  <li>• Vitest 3.2 (테스트)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-purple-400">배포 & 운영</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Netlify 호스팅</li>
                  <li>• GitHub Actions CI/CD</li>
                  <li>• 정적 사이트 생성</li>
                  <li>• CDN 최적화</li>
                  <li>• SSL 인증서</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 가이드 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. 실시간 상태 확인</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  메인 대시보드에서 각 서비스의 현재 상태를 색상으로 구분하여 확인할 수 있습니다:
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• 🟢 녹색: 정상 운영 (Operational)</li>
                  <li>• 🟡 노란색: 성능 저하 (Degraded)</li>
                  <li>• 🔴 빨간색: 서비스 장애 (Outage)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. 세부 정보 보기</h3>
                <p className="text-sm text-muted-foreground">
                  각 서비스 카드를 클릭하면 하위 컴포넌트들의 개별 상태를 확인할 수 있습니다.
                  예를 들어, AWS 카드를 클릭하면 EC2, S3, RDS 등의 개별 상태를 볼 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. 즐겨찾기 관리</h3>
                <p className="text-sm text-muted-foreground">
                  자주 확인하는 서비스나 컴포넌트를 즐겨찾기에 추가하여 상단에서 빠르게 확인할 수 있습니다.
                  별표 아이콘을 클릭하여 즐겨찾기를 추가/제거하세요.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. 수동 새로고침</h3>
                <p className="text-sm text-muted-foreground">
                  자동 업데이트 외에도 헤더의 새로고침 버튼이나 각 서비스 카드의 개별 새로고침 버튼을 사용하여
                  원하는 시점에 상태를 업데이트할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 개발자 정보 */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6">개발자 정보</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                이 서비스는 개발자들이 일상적으로 사용하는 외부 서비스들의 상태를 효율적으로 모니터링하기 위해 개발되었습니다.
                특히 AI 서비스의 급속한 발전과 함께 이러한 서비스들의 안정성 모니터링이 더욱 중요해지고 있습니다.
              </p>
              <p className="text-muted-foreground">
                본 프로젝트는 오픈소스로 공개되어 있으며, 커뮤니티의 기여를 환영합니다.
                새로운 서비스 추가 요청이나 기능 개선 제안은 언제든지 연락 주시기 바랍니다.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">현재 운영 중</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">지속적 개선</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">오픈소스</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            메인 대시보드로 이동
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 