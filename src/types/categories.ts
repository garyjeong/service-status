// 서비스 카테고리 정의
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'ai-ml',
    name: 'AI/ML',
    icon: '🤖',
    services: [
      'openai',
      'anthropic',
      'cursor',
      'googleai',
      'perplexity',
      'xai',
      'groq',
      'leonardo',
      'hailuo',
      'consensus',
      'deepseek',
      'mage',
      'vooster',
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    icon: '☁️',
    services: [
      'aws',
      'firebase',
      'supabase',
      'netlify',
      'vercel',
      'heroku',
      'cloudflare',
      'dockerhub',
    ],
  },
  {
    id: 'devtools',
    name: 'DevTools',
    icon: '🛠️',
    services: ['github', 'gitlab', 'circleci', 'atlassian', 'replit', 'v0', 'huggingface'],
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    services: ['stripe', 'auth0', 'slack', 'sendgrid', 'datadog', 'mongodb', 'zetaglobal'],
  },
];

// 서비스명으로 카테고리 찾기
export function getCategoryForService(serviceName: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(category => category.services.includes(serviceName));
}

// 카테고리별 서비스 그룹핑
export function groupServicesByCategory(services: any[]) {
  const grouped: Record<string, any[]> = {};

  SERVICE_CATEGORIES.forEach(category => {
    grouped[category.id] = services.filter(service =>
      category.services.includes(service.service_name)
    );
  });

  return grouped;
}
