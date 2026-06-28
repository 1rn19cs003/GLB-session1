// Mock Data
const mockUser = {
  _id: 'user_1',
  name: 'Demo Admin',
  email: 'admin@devhub.com',
  role: 'admin',
  bio: 'Full-stack developer and community builder.',
  skills: ['React', 'Node.js', 'MongoDB'],
  github: 'https://github.com/admin',
  createdAt: new Date().toISOString()
};

const mockProjects = [
  {
    _id: 'proj_1',
    title: 'React Dashboard',
    description: 'A beautiful analytics dashboard built with Vite and React.',
    techStack: ['React', 'Chart.js', 'CSS'],
    ownerId: 'user_1',
    ownerName: 'Demo Admin',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: ['user_2'],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj_2',
    title: 'E-commerce API',
    description: 'RESTful API for an online store using Express.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    ownerId: 'user_2',
    ownerName: 'Alice Dev',
    githubUrl: 'https://github.com',
    likes: [],
    createdAt: new Date().toISOString()
  }
];

const mockDevelopers = [
  mockUser,
  {
    _id: 'user_2',
    name: 'Alice Dev',
    email: 'alice@devhub.com',
    role: 'developer',
    bio: 'Backend specialist.',
    skills: ['Node.js', 'Python'],
    github: 'https://github.com/alice',
    createdAt: new Date().toISOString()
  }
];

// Helper to simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Fake Axios Instance
const api = {
  defaults: {
    headers: { common: {} }
  },
  
  get: async (url) => {
    await delay();
    if (url === '/auth/me') return { data: mockUser };
    if (url === '/projects') return { data: mockProjects };
    if (url === '/users') return { data: mockDevelopers };
    
    // Handle dynamic routes like /projects/proj_1
    if (url.startsWith('/projects/') && !url.includes('comments')) {
      const project = mockProjects.find(p => url.includes(p._id));
      return { data: project || mockProjects[0] };
    }
    
    if (url.includes('/comments')) return { data: [] }; // Mock empty comments
    if (url.startsWith('/users/')) return { data: mockUser }; // Mock profile view
    
    return { data: {} };
  },

  post: async (url, data) => {
    await delay();
    if (url === '/auth/login' || url === '/auth/register') {
      return { 
        data: { token: 'fake-jwt-token-123', user: mockUser } 
      };
    }
    
    if (url.includes('/like')) {
      const project = mockProjects[0]; // Simplified mock like return
      return { data: { ...project, likes: [...project.likes, 'user_1'] } };
    }
    
    // Mock creating a new project or comment
    return { data: { _id: Math.random().toString(), ...data, createdAt: new Date() } };
  },

  put: async (url, data) => {
    await delay();
    return { data: { ...data, _id: 'updated_id' } }; // Mock successful update
  },

  delete: async (url) => {
    await delay();
    return { data: { success: true } }; // Mock successful deletion
  }
};

export default api;