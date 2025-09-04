import { describe, it, expect } from 'vitest';
import axios from 'axios';

// 실제 상태 페이지 URL들이 접근 가능한지 확인하는 통합 테스트
describe('Status Pages Integration Tests', () => {
  const timeout = 30000; // 30초 타임아웃

  // 모든 서비스의 상태 페이지 URL 목록
  const statusPageUrls = [
    { name: 'OpenAI', url: 'https://status.openai.com/' },
    { name: 'Anthropic', url: 'https://status.anthropic.com/' },
    { name: 'Cursor', url: 'https://status.cursor.com/' },
    { name: 'Google AI Studio', url: 'https://status.cloud.google.com/' },
    { name: 'GitHub', url: 'https://www.githubstatus.com/' },
    { name: 'Netlify', url: 'https://www.netlifystatus.com/' },
    { name: 'Docker Hub', url: 'https://status.docker.com/' },
    { name: 'AWS', url: 'https://health.aws.amazon.com/health/status' },
    { name: 'Slack', url: 'https://status.slack.com/' },
    { name: 'Firebase', url: 'https://status.firebase.google.com/' },
    { name: 'Supabase', url: 'https://status.supabase.com/' },
    { name: 'Perplexity AI', url: 'https://status.perplexity.ai/' },
    { name: 'v0 by Vercel', url: 'https://www.vercel-status.com/' },
    { name: 'Replit', url: 'https://status.replit.com/' },
    { name: 'xAI', url: 'https://status.x.ai/' },
    { name: 'Heroku', url: 'https://status.heroku.com/' },
    { name: 'Atlassian', url: 'https://status.atlassian.com/' },
    { name: 'CircleCI', url: 'https://status.circleci.com/' },
    { name: 'Auth0', url: 'https://status.auth0.com/' },
    { name: 'SendGrid', url: 'https://status.sendgrid.com/' },
    { name: 'Cloudflare', url: 'https://www.cloudflarestatus.com/' },
    { name: 'Datadog', url: 'https://status.datadoghq.com/' },
    { name: 'Zeta Global', url: 'https://status.zetaglobal.net/' },
    { name: 'Stripe', url: 'https://status.stripe.com/' },
    { name: 'MongoDB Atlas', url: 'https://status.cloud.mongodb.com/' },
    { name: 'Hugging Face', url: 'https://status.huggingface.co/' },
    { name: 'GitLab', url: 'https://status.gitlab.com/' },
  ];

  // 모든 API 엔드포인트 URL 목록 (JSON API)
  const apiEndpoints = [
    { name: 'OpenAI API', url: 'https://status.openai.com/api/v2/status.json' },
    { name: 'Anthropic API', url: 'https://status.anthropic.com/api/v2/status.json' },
    { name: 'Cursor API', url: 'https://status.cursor.com/api/v2/status.json' },
    { name: 'GitHub API', url: 'https://www.githubstatus.com/api/v2/status.json' },
    { name: 'Netlify API', url: 'https://www.netlifystatus.com/api/v2/status.json' },
    { name: 'Docker Hub API', url: 'https://status.docker.com/api/v2/status.json' },
    { name: 'Slack API', url: 'https://status.slack.com/api/v2/status.json' },
    { name: 'Firebase API', url: 'https://status.firebase.google.com/api/v2/status.json' },
    { name: 'Supabase API', url: 'https://status.supabase.com/api/v2/status.json' },
    { name: 'Perplexity AI API', url: 'https://status.perplexity.ai/api/v2/status.json' },
    { name: 'v0 by Vercel API', url: 'https://www.vercel-status.com/api/v2/status.json' },
    { name: 'Replit API', url: 'https://status.replit.com/api/v2/status.json' },
    { name: 'xAI API', url: 'https://status.x.ai/api/v2/status.json' },
    { name: 'Heroku API', url: 'https://status.heroku.com/api/v2/status.json' },
    { name: 'Atlassian API', url: 'https://status.atlassian.com/api/v2/status.json' },
    { name: 'CircleCI API', url: 'https://status.circleci.com/api/v2/status.json' },
    { name: 'Auth0 API', url: 'https://status.auth0.com/api/v2/status.json' },
    { name: 'SendGrid API', url: 'https://status.sendgrid.com/api/v2/status.json' },
    { name: 'Cloudflare API', url: 'https://www.cloudflarestatus.com/api/v2/status.json' },
    { name: 'Datadog API', url: 'https://status.datadoghq.com/api/v2/status.json' },
    { name: 'Zeta Global API', url: 'https://status.zetaglobal.net/api/v2/status.json' },
    { name: 'Stripe API', url: 'https://status.stripe.com/api/v2/status.json' },
    { name: 'MongoDB Atlas API', url: 'https://status.cloud.mongodb.com/api/v2/status.json' },
    { name: 'Hugging Face API', url: 'https://status.huggingface.co/api/v2/status.json' },
    { name: 'GitLab API', url: 'https://status.gitlab.com/api/v2/status.json' },
  ];

  describe('Status Page URLs Accessibility', () => {
    statusPageUrls.forEach(({ name, url }) => {
      it(
        `should be able to access ${name} status page`,
        async () => {
          try {
            const response = await axios.get(url, {
              timeout: 10000,
              validateStatus: status => status < 500, // Accept redirects and client errors
            });

            expect(response.status).toBeLessThan(500);
            expect(response.data).toBeDefined();
          } catch (error) {
            // Log the error but don't fail the test for network issues
            console.warn(`Warning: Could not access ${name} status page: ${error.message}`);

            // If it's a network error, we'll mark it as a warning
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
              console.warn(`Network issue accessing ${name}, skipping...`);
              return;
            }

            throw error;
          }
        },
        timeout
      );
    });
  });

  describe('API Endpoints Accessibility', () => {
    apiEndpoints.forEach(({ name, url }) => {
      it(
        `should be able to access ${name} JSON endpoint`,
        async () => {
          try {
            const response = await axios.get(url, {
              timeout: 10000,
              headers: {
                Accept: 'application/json',
                'User-Agent': 'Service-Status-Monitor/1.0',
              },
            });

            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(typeof response.data).toBe('object');

            // 기본적인 status page 구조 검증
            if (response.data.status) {
              expect(response.data.status).toHaveProperty('indicator');
            }

            if (response.data.page) {
              expect(response.data.page).toHaveProperty('name');
            }
          } catch (error) {
            // Log the error but don't fail the test for network issues
            console.warn(`Warning: Could not access ${name} API: ${error.message}`);

            // If it's a network error, we'll mark it as a warning
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
              console.warn(`Network issue accessing ${name} API, skipping...`);
              return;
            }

            throw error;
          }
        },
        timeout
      );
    });
  });

  describe('CORS Proxy Integration', () => {
    const CORS_PROXY = 'https://api.allorigins.win/get?url=';

    it(
      'should be able to access APIs through CORS proxy',
      async () => {
        const testUrl = 'https://status.openai.com/api/v2/status.json';
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(testUrl)}`;

        try {
          const response = await axios.get(proxyUrl, { timeout: 15000 });

          expect(response.status).toBe(200);
          expect(response.data).toBeDefined();
          expect(response.data).toHaveProperty('contents');

          // Parse the contents to verify it's valid JSON
          const apiData = JSON.parse(response.data.contents);
          expect(apiData).toBeDefined();
          expect(typeof apiData).toBe('object');
        } catch (error) {
          console.warn(`Warning: CORS proxy test failed: ${error.message}`);

          // If it's a network error, we'll mark it as a warning
          if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.warn('Network issue with CORS proxy, skipping...');
            return;
          }

          throw error;
        }
      },
      timeout
    );
  });

  describe('Service Count Validation', () => {
    it('should have 27 services configured', () => {
      expect(statusPageUrls.length).toBe(27);
      expect(apiEndpoints.length).toBe(24); // AWS and Google have different API endpoints
    });

    it('should not have duplicate URLs', () => {
      const pageUrls = statusPageUrls.map(s => s.url);
      const apiUrls = apiEndpoints.map(s => s.url);

      expect(new Set(pageUrls).size).toBe(pageUrls.length);
      expect(new Set(apiUrls).size).toBe(apiUrls.length);
    });

    it('should have valid URL formats', () => {
      [...statusPageUrls, ...apiEndpoints].forEach(({ name, url }) => {
        expect(url).toMatch(/^https:\/\/.+/);
        expect(() => new URL(url)).not.toThrow();
      });
    });
  });
});
