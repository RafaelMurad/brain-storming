export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  duration: string;
  role: string;
  team: string[];
  tools: string[];
  thumbnail: string;
  heroImage: string;
  color: string;
  overview: string;
  challenge: string;
  solution: string;
  process: ProcessStep[];
  metrics: Metric[];
  gallery: GalleryItem[];
  testimonial?: Testimonial;
  nextProject?: string;
}

export interface ProcessStep {
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  image?: string;
}

export interface Metric {
  value: string;
  label: string;
  description: string;
}

export interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  caption: string;
  aspect?: 'square' | 'wide' | 'tall';
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'fintech-banking-app',
    title: 'Reimagining Digital Banking',
    subtitle: 'A mobile-first banking experience for Gen Z',
    category: 'Mobile App Design',
    year: '2024',
    duration: '4 months',
    role: 'Lead UX Designer',
    team: ['Product Manager', '2 Engineers', 'UX Researcher'],
    tools: ['Figma', 'Maze', 'Hotjar', 'Principle'],
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&h=900&fit=crop',
    color: '#6366f1',
    overview: 'NeoBank approached us to design a mobile banking app targeting Gen Z users. The goal was to create an experience that feels native to a generation that grew up with smartphones, making banking feel less intimidating and more intuitive.',
    challenge: 'Traditional banking apps are often cluttered, confusing, and designed with legacy users in mind. Gen Z users reported feeling overwhelmed by complex features and banking jargon. Our challenge was to simplify the banking experience without sacrificing functionality.',
    solution: 'We designed a card-based interface with gesture-driven navigation, gamified savings goals, and AI-powered spending insights. The visual language uses friendly illustrations and a vibrant color palette that resonates with younger users.',
    process: [
      {
        phase: 'Discovery',
        title: 'Understanding Gen Z Banking',
        description: 'We conducted 24 user interviews, analyzed competitor apps, and ran a survey with 500+ respondents to understand Gen Z banking behaviors and pain points.',
        deliverables: ['User Personas', 'Journey Maps', 'Competitive Analysis', 'Research Report'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      },
      {
        phase: 'Define',
        title: 'Problem Framing',
        description: 'Synthesized research into actionable insights. Identified 3 key opportunity areas: simplified onboarding, visual spending tracking, and social savings features.',
        deliverables: ['Problem Statements', 'How Might We Questions', 'Success Metrics'],
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop',
      },
      {
        phase: 'Ideate',
        title: 'Exploring Solutions',
        description: 'Ran design sprints with cross-functional team. Generated 50+ concepts, prioritized using impact/effort matrix, and selected top 5 features for MVP.',
        deliverables: ['Sketches', 'Concept Maps', 'Feature Prioritization'],
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=500&fit=crop',
      },
      {
        phase: 'Design',
        title: 'Crafting the Experience',
        description: 'Created high-fidelity prototypes with micro-interactions. Established design system with 200+ components. Ensured WCAG 2.1 AA compliance.',
        deliverables: ['Wireframes', 'UI Design', 'Design System', 'Prototype'],
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
      },
      {
        phase: 'Test',
        title: 'Validating with Users',
        description: 'Conducted 3 rounds of usability testing with 18 participants. Achieved 94% task completion rate. Iterated based on feedback.',
        deliverables: ['Usability Reports', 'Iteration Logs', 'Final Designs'],
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop',
      },
    ],
    metrics: [
      { value: '94%', label: 'Task Completion', description: 'Users successfully completed core banking tasks' },
      { value: '4.8', label: 'App Store Rating', description: 'Average rating after 3 months of launch' },
      { value: '+127%', label: 'Daily Active Users', description: 'Increase in DAU compared to old app' },
      { value: '-60%', label: 'Support Tickets', description: 'Reduction in UX-related support requests' },
    ],
    gallery: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop', caption: 'Home Dashboard', aspect: 'wide' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=800&fit=crop', caption: 'Savings Goals', aspect: 'tall' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop', caption: 'Spending Insights', aspect: 'square' },
    ],
    testimonial: {
      quote: 'The new app completely transformed how our users interact with their finances. The team\'s research-driven approach and attention to detail exceeded our expectations.',
      author: 'Sarah Chen',
      role: 'CPO, NeoBank',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    nextProject: 'healthcare-patient-portal',
  },
  {
    slug: 'healthcare-patient-portal',
    title: 'Healthcare Made Human',
    subtitle: 'Redesigning the patient experience',
    category: 'Web App Design',
    year: '2024',
    duration: '6 months',
    role: 'Senior UX Researcher & Designer',
    team: ['Design Lead', '3 Engineers', 'Clinical Advisor'],
    tools: ['Figma', 'UserTesting', 'Optimal Workshop', 'Dovetail'],
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop',
    color: '#06b6d4',
    overview: 'MedCare Health System needed a complete redesign of their patient portal. With 2M+ patients, the stakes were high to create an accessible, intuitive experience for managing appointments, records, and communications.',
    challenge: 'The existing portal had a 23% abandonment rate and received hundreds of daily support calls. Patients struggled to find information, schedule appointments, and understand their medical records. Accessibility compliance was also a major concern.',
    solution: 'We created a dashboard-first approach with personalized health insights, simplified appointment booking, and plain-language medical information. The design prioritizes accessibility with AAA compliance and supports users aged 18-85+.',
    process: [
      {
        phase: 'Discovery',
        title: 'Deep Dive Research',
        description: 'Conducted contextual inquiries with 30 patients across demographics. Analyzed 6 months of support tickets and conducted stakeholder interviews.',
        deliverables: ['Research Plan', 'Affinity Diagrams', 'Stakeholder Map', 'Insights Report'],
      },
      {
        phase: 'Define',
        title: 'Mapping the Journey',
        description: 'Created comprehensive journey maps for 4 patient personas. Identified 12 critical pain points and prioritized based on impact and feasibility.',
        deliverables: ['Personas', 'Journey Maps', 'Service Blueprint', 'Opportunity Areas'],
      },
      {
        phase: 'Ideate',
        title: 'Co-Design Sessions',
        description: 'Facilitated 3 co-design workshops with patients, nurses, and administrators. Generated solutions collaboratively with end users.',
        deliverables: ['Workshop Outputs', 'Concept Sketches', 'Feature Roadmap'],
      },
      {
        phase: 'Design',
        title: 'Inclusive Design System',
        description: 'Built accessible design system from ground up. Tested with screen readers, ensured color contrast, and created multiple interaction modes.',
        deliverables: ['Design System', 'Accessibility Specs', 'Responsive Designs'],
      },
      {
        phase: 'Test',
        title: 'Accessibility Testing',
        description: 'Conducted testing with users of assistive technologies. Ran A/B tests on key flows. Achieved WCAG 2.1 AAA compliance.',
        deliverables: ['Accessibility Audit', 'A/B Test Results', 'Launch Metrics'],
      },
    ],
    metrics: [
      { value: '-78%', label: 'Support Calls', description: 'Reduction in portal-related support calls' },
      { value: 'AAA', label: 'WCAG Rating', description: 'Highest accessibility compliance level' },
      { value: '+89%', label: 'Patient Satisfaction', description: 'Increase in portal satisfaction scores' },
      { value: '2.3M', label: 'Active Users', description: 'Monthly active patients on new portal' },
    ],
    gallery: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop', caption: 'Patient Dashboard', aspect: 'wide' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=800&fit=crop', caption: 'Appointment Booking', aspect: 'tall' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&h=600&fit=crop', caption: 'Health Records', aspect: 'square' },
    ],
    testimonial: {
      quote: 'For the first time, my 78-year-old mother can manage her appointments without calling me for help. This is what healthcare technology should be.',
      author: 'Michael Torres',
      role: 'Patient Family Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    nextProject: 'saas-dashboard-redesign',
  },
  {
    slug: 'saas-dashboard-redesign',
    title: 'Data That Tells Stories',
    subtitle: 'Enterprise analytics made intuitive',
    category: 'SaaS Product Design',
    year: '2023',
    duration: '5 months',
    role: 'Product Designer',
    team: ['PM', 'Data Scientist', '4 Engineers'],
    tools: ['Figma', 'Amplitude', 'FullStory', 'Lottie'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
    color: '#a855f7',
    overview: 'DataFlow, a B2B analytics platform, was losing enterprise customers due to a complex, outdated interface. We redesigned the entire dashboard experience to make complex data accessible and actionable.',
    challenge: 'Power users loved the depth of features but new users had a 40% drop-off during onboarding. The learning curve was too steep, and important insights were buried under layers of menus.',
    solution: 'Introduced progressive disclosure, AI-powered insights surfacing, and customizable dashboard widgets. Created role-based views that show relevant data first while keeping advanced features accessible.',
    process: [
      {
        phase: 'Discovery',
        title: 'User Segmentation Research',
        description: 'Identified 3 distinct user segments with different needs. Conducted 40+ hours of contextual inquiry sessions.',
        deliverables: ['User Segments', 'Task Analysis', 'Pain Point Map'],
      },
      {
        phase: 'Define',
        title: 'Information Architecture',
        description: 'Restructured IA using card sorting with 50 users. Reduced navigation depth from 5 levels to 3.',
        deliverables: ['New IA', 'Navigation Model', 'Content Hierarchy'],
      },
      {
        phase: 'Ideate',
        title: 'Widget-Based Approach',
        description: 'Designed modular widget system allowing users to customize their dashboard. Created 24 widget types.',
        deliverables: ['Widget Library', 'Layout System', 'Customization Flows'],
      },
      {
        phase: 'Design',
        title: 'Data Visualization System',
        description: 'Created comprehensive chart library with consistent interactions. Designed for accessibility and print.',
        deliverables: ['Chart Components', 'Dark/Light Modes', 'Export Designs'],
      },
      {
        phase: 'Test',
        title: 'Beta Program',
        description: 'Ran 8-week beta with 50 enterprise customers. Collected 200+ feedback items and iterated weekly.',
        deliverables: ['Beta Reports', 'Iteration Log', 'Launch Plan'],
      },
    ],
    metrics: [
      { value: '+156%', label: 'Feature Adoption', description: 'Increase in advanced feature usage' },
      { value: '-65%', label: 'Time to Insight', description: 'Faster to find key business metrics' },
      { value: '92', label: 'NPS Score', description: 'Net Promoter Score post-redesign' },
      { value: '$2.4M', label: 'ARR Impact', description: 'Additional revenue from reduced churn' },
    ],
    gallery: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', caption: 'Analytics Dashboard', aspect: 'wide' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop', caption: 'Custom Reports', aspect: 'square' },
    ],
    testimonial: {
      quote: 'The new dashboard reduced our team\'s reporting time from hours to minutes. It\'s like having a data analyst built into the product.',
      author: 'Jennifer Walsh',
      role: 'VP of Operations, TechCorp',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    nextProject: 'fintech-banking-app',
  },
];

export const services = [
  {
    title: 'UX Research',
    description: 'Deep user insights through interviews, usability testing, and data analysis',
    icon: '🔬',
  },
  {
    title: 'Product Design',
    description: 'End-to-end design from wireframes to polished, production-ready interfaces',
    icon: '✨',
  },
  {
    title: 'Design Systems',
    description: 'Scalable component libraries that ensure consistency across products',
    icon: '🧩',
  },
  {
    title: 'Prototyping',
    description: 'Interactive prototypes that bring ideas to life before development',
    icon: '🎬',
  },
];

export const profile = {
  name: 'Alex Morgan',
  title: 'Senior UX Designer & Researcher',
  location: 'San Francisco, CA',
  email: 'hello@alexmorgan.design',
  bio: 'I\'m a product designer with 8+ years of experience crafting digital experiences for startups and Fortune 500 companies. I believe great design is invisible—it just works.',
  longBio: `With a background in cognitive psychology and human-computer interaction, I bring a research-driven approach to every project. I've led design for products used by millions, from banking apps to healthcare platforms.

My process combines rigorous user research with creative problem-solving. I believe the best designs emerge from deep empathy with users and close collaboration with cross-functional teams.

When I'm not designing, you'll find me mentoring junior designers, speaking at design conferences, or exploring the intersection of AI and design.`,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  stats: [
    { value: '8+', label: 'Years Experience' },
    { value: '50+', label: 'Projects Delivered' },
    { value: '12M+', label: 'Users Impacted' },
    { value: '3', label: 'Design Awards' },
  ],
  social: {
    linkedin: 'https://linkedin.com/in/alexmorgan',
    dribbble: 'https://dribbble.com/alexmorgan',
    twitter: 'https://twitter.com/alexmorgan',
    medium: 'https://medium.com/@alexmorgan',
  },
};
