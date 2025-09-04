import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchAllServicesStatus,
  serviceFetchers,
  fetchOpenAIStatus,
  fetchAnthropicStatus,
  fetchCursorStatus,
  fetchGoogleAIStatus,
  fetchGitHubStatus,
  fetchNetlifyStatus,
  fetchDockerHubStatus,
  fetchAWSStatus,
  fetchSlackStatus,
  fetchFirebaseStatus,
  fetchSupabaseStatus,
  fetchPerplexityStatus,
  fetchV0Status,
  fetchReplitStatus,
  fetchXAIStatus,
  fetchHerokuStatus,
  fetchAtlassianStatus,
  fetchCircleCIStatus,
  fetchAuth0Status,
  fetchSendGridStatus,
  fetchCloudflareStatus,
  fetchDatadogStatus,
  fetchZetaGlobalStatus,
  fetchVercelStatus,
  fetchStripeStatus,
  fetchMongoDBStatus,
  fetchHuggingFaceStatus,
  fetchGitLabStatus,
} from '../../src/services/api';
import type { Service } from '../../src/types/status';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({
        data: {
          status: { indicator: 'operational' },
          components: [{ name: 'Test Component', status: 'operational', group_id: null }],
        },
      }),
    })),
  },
}));

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to validate service structure
  const validateService = (service: Service) => {
    expect(service).toHaveProperty('service_name');
    expect(service).toHaveProperty('display_name');
    expect(service).toHaveProperty('description');
    expect(service).toHaveProperty('status');
    expect(service).toHaveProperty('page_url');
    expect(service).toHaveProperty('icon');
    expect(service).toHaveProperty('components');
    expect(Array.isArray(service.components)).toBe(true);
  };

  describe('Individual Service Fetchers', () => {
    it('should fetch OpenAI status', async () => {
      const service = await fetchOpenAIStatus();
      validateService(service);
      expect(service.service_name).toBe('openai');
      expect(service.display_name).toBe('OpenAI ChatGPT');
    });

    it('should fetch Anthropic status', async () => {
      const service = await fetchAnthropicStatus();
      validateService(service);
      expect(service.service_name).toBe('anthropic');
      expect(service.display_name).toBe('Anthropic Claude');
    });

    it('should fetch Cursor status', async () => {
      const service = await fetchCursorStatus();
      validateService(service);
      expect(service.service_name).toBe('cursor');
      expect(service.display_name).toBe('Cursor Editor');
    });

    it('should fetch Google AI status', async () => {
      const service = await fetchGoogleAIStatus();
      validateService(service);
      expect(service.service_name).toBe('googleai');
      expect(service.display_name).toBe('Google AI Studio');
    });

    it('should fetch GitHub status', async () => {
      const service = await fetchGitHubStatus();
      validateService(service);
      expect(service.service_name).toBe('github');
      expect(service.display_name).toBe('GitHub');
    });

    it('should fetch Netlify status', async () => {
      const service = await fetchNetlifyStatus();
      validateService(service);
      expect(service.service_name).toBe('netlify');
      expect(service.display_name).toBe('Netlify');
    });

    it('should fetch Docker Hub status', async () => {
      const service = await fetchDockerHubStatus();
      validateService(service);
      expect(service.service_name).toBe('dockerhub');
      expect(service.display_name).toBe('Docker Hub');
    });

    it('should fetch AWS status', async () => {
      const service = await fetchAWSStatus();
      validateService(service);
      expect(service.service_name).toBe('aws');
      expect(service.display_name).toBe('AWS');
    });

    it('should fetch Slack status', async () => {
      const service = await fetchSlackStatus();
      validateService(service);
      expect(service.service_name).toBe('slack');
      expect(service.display_name).toBe('Slack');
    });

    it('should fetch Firebase status', async () => {
      const service = await fetchFirebaseStatus();
      validateService(service);
      expect(service.service_name).toBe('firebase');
      expect(service.display_name).toBe('Firebase');
    });

    it('should fetch Supabase status', async () => {
      const service = await fetchSupabaseStatus();
      validateService(service);
      expect(service.service_name).toBe('supabase');
      expect(service.display_name).toBe('Supabase');
    });

    it('should fetch Perplexity status', async () => {
      const service = await fetchPerplexityStatus();
      validateService(service);
      expect(service.service_name).toBe('perplexity');
      expect(service.display_name).toBe('Perplexity AI');
    });

    it('should fetch v0 status', async () => {
      const service = await fetchV0Status();
      validateService(service);
      expect(service.service_name).toBe('v0');
      expect(service.display_name).toBe('v0 by Vercel');
    });

    it('should fetch Replit status', async () => {
      const service = await fetchReplitStatus();
      validateService(service);
      expect(service.service_name).toBe('replit');
      expect(service.display_name).toBe('Replit');
    });

    it('should fetch xAI status', async () => {
      const service = await fetchXAIStatus();
      validateService(service);
      expect(service.service_name).toBe('xai');
      expect(service.display_name).toBe('xAI');
    });

    it('should fetch Heroku status', async () => {
      const service = await fetchHerokuStatus();
      validateService(service);
      expect(service.service_name).toBe('heroku');
      expect(service.display_name).toBe('Heroku');
    });

    it('should fetch Atlassian status', async () => {
      const service = await fetchAtlassianStatus();
      validateService(service);
      expect(service.service_name).toBe('atlassian');
      expect(service.display_name).toBe('Atlassian');
    });

    it('should fetch CircleCI status', async () => {
      const service = await fetchCircleCIStatus();
      validateService(service);
      expect(service.service_name).toBe('circleci');
      expect(service.display_name).toBe('CircleCI');
    });

    it('should fetch Auth0 status', async () => {
      const service = await fetchAuth0Status();
      validateService(service);
      expect(service.service_name).toBe('auth0');
      expect(service.display_name).toBe('Auth0');
    });

    it('should fetch SendGrid status', async () => {
      const service = await fetchSendGridStatus();
      validateService(service);
      expect(service.service_name).toBe('sendgrid');
      expect(service.display_name).toBe('SendGrid');
    });

    it('should fetch Cloudflare status', async () => {
      const service = await fetchCloudflareStatus();
      validateService(service);
      expect(service.service_name).toBe('cloudflare');
      expect(service.display_name).toBe('Cloudflare');
    });

    it('should fetch Datadog status', async () => {
      const service = await fetchDatadogStatus();
      validateService(service);
      expect(service.service_name).toBe('datadog');
      expect(service.display_name).toBe('Datadog');
    });
  });

  describe('New Services - Recently Added', () => {
    it('should fetch Zeta Global status', async () => {
      const service = await fetchZetaGlobalStatus();
      validateService(service);
      expect(service.service_name).toBe('zetaglobal');
      expect(service.display_name).toBe('Zeta Global');
      expect(service.components.length).toBeGreaterThan(0);
    });

    it('should fetch Vercel status', async () => {
      const service = await fetchVercelStatus();
      validateService(service);
      expect(service.service_name).toBe('vercel');
      expect(service.display_name).toBe('Vercel');
      expect(service.components.length).toBeGreaterThan(0);
    });

    it('should fetch Stripe status', async () => {
      const service = await fetchStripeStatus();
      validateService(service);
      expect(service.service_name).toBe('stripe');
      expect(service.display_name).toBe('Stripe');
      expect(service.components.length).toBeGreaterThan(0);
    });

    it('should fetch MongoDB Atlas status', async () => {
      const service = await fetchMongoDBStatus();
      validateService(service);
      expect(service.service_name).toBe('mongodb');
      expect(service.display_name).toBe('MongoDB Atlas');
      expect(service.components.length).toBeGreaterThan(0);
    });

    it('should fetch Hugging Face status', async () => {
      const service = await fetchHuggingFaceStatus();
      validateService(service);
      expect(service.service_name).toBe('huggingface');
      expect(service.display_name).toBe('Hugging Face');
      expect(service.components.length).toBeGreaterThan(0);
    });

    it('should fetch GitLab status', async () => {
      const service = await fetchGitLabStatus();
      validateService(service);
      expect(service.service_name).toBe('gitlab');
      expect(service.display_name).toBe('GitLab');
      expect(service.components.length).toBeGreaterThan(0);
    });
  });

  describe('Service Fetchers Mapping', () => {
    it('should have all services in serviceFetchers mapping', () => {
      const expectedServices = [
        'openai',
        'anthropic',
        'cursor',
        'googleai',
        'github',
        'netlify',
        'dockerhub',
        'aws',
        'slack',
        'firebase',
        'supabase',
        'perplexity',
        'v0',
        'replit',
        'xai',
        'heroku',
        'atlassian',
        'circleci',
        'auth0',
        'sendgrid',
        'cloudflare',
        'datadog',
        'zetaglobal',
        'vercel',
        'stripe',
        'mongodb',
        'huggingface',
        'gitlab',
      ];

      expectedServices.forEach(serviceName => {
        expect(serviceFetchers).toHaveProperty(serviceName);
        expect(typeof serviceFetchers[serviceName]).toBe('function');
      });
    });

    it('should have 28 services in total', () => {
      expect(Object.keys(serviceFetchers)).toHaveLength(28);
    });
  });

  describe('Integration Tests', () => {
    it('should fetch all services status successfully', async () => {
      const services = await fetchAllServicesStatus();

      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);

      services.forEach(service => {
        validateService(service);
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock an API error for one service
      const originalGet = vi.fn().mockRejectedValueOnce(new Error('Network error'));
      vi.doMock('axios', () => ({
        default: {
          create: vi.fn(() => ({ get: originalGet })),
        },
      }));

      // Service should still return a valid structure with error state
      const service = await fetchOpenAIStatus();
      validateService(service);
      expect(service.status).toBeDefined();
    });

    it('should handle empty API responses', async () => {
      // Mock empty response
      const originalGet = vi.fn().mockResolvedValueOnce({ data: {} });
      vi.doMock('axios', () => ({
        default: {
          create: vi.fn(() => ({ get: originalGet })),
        },
      }));

      const service = await fetchOpenAIStatus();
      validateService(service);
    });
  });

  describe('Service Categories', () => {
    const aiServices = [
      'openai',
      'anthropic',
      'cursor',
      'googleai',
      'perplexity',
      'v0',
      'replit',
      'xai',
      'huggingface',
    ];
    const devToolsServices = [
      'github',
      'netlify',
      'dockerhub',
      'heroku',
      'atlassian',
      'circleci',
      'vercel',
      'gitlab',
    ];
    const cloudServices = ['aws', 'firebase', 'supabase', 'mongodb'];
    const communicationServices = ['slack', 'sendgrid'];
    const securityServices = ['auth0'];
    const infraServices = ['cloudflare', 'datadog'];
    const marketingServices = ['zetaglobal'];
    const paymentServices = ['stripe'];

    it('should have all AI services', () => {
      aiServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all development tools services', () => {
      devToolsServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all cloud services', () => {
      cloudServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all communication services', () => {
      communicationServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all security services', () => {
      securityServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all infrastructure services', () => {
      infraServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all marketing services', () => {
      marketingServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });

    it('should have all payment services', () => {
      paymentServices.forEach(service => {
        expect(serviceFetchers).toHaveProperty(service);
      });
    });
  });
});
