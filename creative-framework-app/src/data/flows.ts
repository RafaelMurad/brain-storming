export interface CreativeFlow {
  id: string;
  name: string;
  description: string;
  phases: {
    name: string;
    description: string;
    activities: string[];
    mindset: string;
    duration: string;
  }[];
  tips: string[];
  icon: string;
  color: string;
}

export const creativeFlows: CreativeFlow[] = [
  {
    id: 'divergent-convergent',
    name: 'Divergent-Convergent Thinking',
    description: 'The fundamental creative rhythm: first expand possibilities (diverge), then narrow to the best solution (converge). This double-diamond approach is the foundation of most creative processes.',
    phases: [
      {
        name: 'Divergent Phase',
        description: 'Expand your thinking to generate many possibilities without judgment.',
        activities: [
          'Brainstorm without filtering',
          'Explore wild and unusual ideas',
          'Make unexpected connections',
          'Question assumptions',
          'Use "Yes, and..." thinking'
        ],
        mindset: 'Open, curious, playful, non-judgmental',
        duration: 'Variable - until ideas slow down'
      },
      {
        name: 'Convergent Phase',
        description: 'Narrow down to the best ideas through analysis and selection.',
        activities: [
          'Evaluate ideas against criteria',
          'Combine and improve ideas',
          'Prototype and test',
          'Make decisions',
          'Refine and polish'
        ],
        mindset: 'Analytical, critical, decisive, practical',
        duration: 'Variable - until decision is made'
      }
    ],
    tips: [
      'Keep phases separate - don\'t judge during divergence',
      'Allow enough time for divergence before converging',
      'Cycle through multiple rounds',
      'Celebrate quantity in divergence'
    ],
    icon: 'GitMerge',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'creative-problem-solving',
    name: 'Creative Problem Solving (CPS)',
    description: 'A comprehensive framework that guides you through clarification, ideation, and implementation. Developed by Osborn and Parnes, it\'s one of the most researched creativity methods.',
    phases: [
      {
        name: 'Clarify',
        description: 'Understand the challenge and gather information.',
        activities: [
          'Explore the vision',
          'Gather data and facts',
          'Define the problem statement',
          'Identify key stakeholders'
        ],
        mindset: 'Curious, questioning, observant',
        duration: '20% of total time'
      },
      {
        name: 'Ideate',
        description: 'Generate diverse and novel ideas.',
        activities: [
          'Brainstorm possibilities',
          'Use creativity techniques',
          'Build on ideas',
          'Defer judgment'
        ],
        mindset: 'Playful, imaginative, unrestricted',
        duration: '40% of total time'
      },
      {
        name: 'Develop',
        description: 'Strengthen and evaluate promising solutions.',
        activities: [
          'Evaluate ideas against criteria',
          'Combine and strengthen ideas',
          'Anticipate challenges',
          'Plan for implementation'
        ],
        mindset: 'Analytical, constructive, practical',
        duration: '20% of total time'
      },
      {
        name: 'Implement',
        description: 'Create action plans and execute.',
        activities: [
          'Create action plan',
          'Identify resources needed',
          'Build prototypes',
          'Execute and iterate'
        ],
        mindset: 'Action-oriented, persistent, adaptive',
        duration: '20% of total time'
      }
    ],
    tips: [
      'Start with a clear and inspiring problem statement',
      'Use "How Might We" to frame challenges',
      'Allow incubation time between phases',
      'Involve diverse perspectives'
    ],
    icon: 'Workflow',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'four-stage-creativity',
    name: 'Four Stages of Creativity',
    description: 'The classic creativity model describing how creative insights emerge through preparation, incubation, illumination, and verification. Understanding these stages helps you work with your natural creative rhythms.',
    phases: [
      {
        name: 'Preparation',
        description: 'Immerse yourself in the problem and gather knowledge.',
        activities: [
          'Research thoroughly',
          'Learn relevant skills',
          'Define the problem clearly',
          'Collect diverse inputs',
          'Study existing solutions'
        ],
        mindset: 'Focused, analytical, thorough',
        duration: 'Hours to weeks'
      },
      {
        name: 'Incubation',
        description: 'Let ideas simmer in your unconscious mind.',
        activities: [
          'Take breaks from active thinking',
          'Sleep on problems',
          'Engage in different activities',
          'Allow mind to wander',
          'Exercise or walk'
        ],
        mindset: 'Relaxed, patient, trusting',
        duration: 'Hours to months'
      },
      {
        name: 'Illumination',
        description: 'Experience the "aha!" moment when insights emerge.',
        activities: [
          'Stay receptive to insights',
          'Capture ideas immediately',
          'Don\'t force it',
          'Notice patterns',
          'Trust your intuition'
        ],
        mindset: 'Open, receptive, attentive',
        duration: 'Moments'
      },
      {
        name: 'Verification',
        description: 'Evaluate, develop, and validate your creative insight.',
        activities: [
          'Test the idea',
          'Refine and improve',
          'Get feedback',
          'Iterate based on results',
          'Implement the solution'
        ],
        mindset: 'Critical, practical, persistent',
        duration: 'Hours to months'
      }
    ],
    tips: [
      'Trust the incubation process',
      'Keep a notebook to capture illuminations',
      'Don\'t skip preparation - it feeds incubation',
      'Schedule time for different activities'
    ],
    icon: 'Sunrise',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'flow-state',
    name: 'Flow State',
    description: 'The optimal state of consciousness where creativity and productivity peak. Achieving flow requires balancing challenge and skill while eliminating distractions.',
    phases: [
      {
        name: 'Struggle Phase',
        description: 'Initial effort to engage with the challenge.',
        activities: [
          'Load information into the brain',
          'Face initial resistance',
          'Push through discomfort',
          'Focus intensely'
        ],
        mindset: 'Determined, persistent, focused',
        duration: '15-30 minutes'
      },
      {
        name: 'Release Phase',
        description: 'Let go and allow the mind to shift gears.',
        activities: [
          'Step back from the problem',
          'Do something relaxing',
          'Exercise or walk',
          'Take a mental break'
        ],
        mindset: 'Relaxed, open, trusting',
        duration: '10-20 minutes'
      },
      {
        name: 'Flow Phase',
        description: 'Enter the state of effortless high performance.',
        activities: [
          'Deep focus and engagement',
          'Time distortion (hours feel like minutes)',
          'Self-consciousness disappears',
          'Automatic, effortless action'
        ],
        mindset: 'Absorbed, energized, confident',
        duration: '45-90 minutes typically'
      },
      {
        name: 'Recovery Phase',
        description: 'Rest and consolidate after flow.',
        activities: [
          'Rest and recharge',
          'Reflect on insights',
          'Record learnings',
          'Prepare for next session'
        ],
        mindset: 'Restful, reflective, grateful',
        duration: 'Variable'
      }
    ],
    tips: [
      'Challenge must match skill level',
      'Eliminate distractions completely',
      'Have clear goals and immediate feedback',
      'Create rituals to trigger flow'
    ],
    icon: 'Zap',
    color: 'from-green-500 to-emerald-500'
  }
];

export interface CreativePattern {
  id: string;
  name: string;
  description: string;
  howToUse: string[];
  examples: string[];
  relatedPatterns: string[];
  icon: string;
}

export const creativePatterns: CreativePattern[] = [
  {
    id: 'combination',
    name: 'Combination',
    description: 'Creating something new by combining existing elements in novel ways. Most innovations are combinations of existing ideas rather than completely new inventions.',
    howToUse: [
      'List features from different products or ideas',
      'Look for unexpected pairings',
      'Consider cross-industry combinations',
      'Mix high-tech with low-tech',
      'Combine physical and digital'
    ],
    examples: [
      'Smartphone (phone + camera + computer)',
      'Netflix (mail delivery + streaming)',
      'Food trucks (restaurant + mobility)'
    ],
    relatedPatterns: ['analogy', 'bisociation'],
    icon: 'Merge'
  },
  {
    id: 'analogy',
    name: 'Analogy',
    description: 'Applying solutions from one domain to problems in another. Nature-inspired design (biomimicry) is a powerful form of analogical thinking.',
    howToUse: [
      'Find parallel problems in different fields',
      'Study how nature solves similar problems',
      'Look at how other industries handle it',
      'Use "This is like..." thinking',
      'Extract principles from analogies'
    ],
    examples: [
      'Velcro (inspired by burrs)',
      'Bullet train nose (kingfisher beak)',
      'Swimming suits (shark skin)'
    ],
    relatedPatterns: ['combination', 'transfer'],
    icon: 'Repeat'
  },
  {
    id: 'inversion',
    name: 'Inversion',
    description: 'Flipping assumptions or processes to discover new possibilities. Ask "What if the opposite were true?"',
    howToUse: [
      'List all assumptions about your challenge',
      'Reverse each assumption',
      'Consider inverse relationships',
      'Flip the process order',
      'Change who does what'
    ],
    examples: [
      'Self-service instead of full service',
      'User-generated content instead of professional',
      'Subscription instead of purchase'
    ],
    relatedPatterns: ['contradiction', 'provocation'],
    icon: 'RefreshCw'
  },
  {
    id: 'constraint',
    name: 'Constraint',
    description: 'Using limitations to drive creativity. Constraints force novel solutions and prevent overwhelming choice paralysis.',
    howToUse: [
      'Set artificial limitations (time, budget, materials)',
      'Remove a key element',
      'Limit to one feature',
      'Use the "Twitter test" (140 chars)',
      'Work with what you have'
    ],
    examples: [
      'Twitter\'s character limit',
      'Instagram\'s square photos (originally)',
      'Haiku poetry structure'
    ],
    relatedPatterns: ['elimination', 'simplification'],
    icon: 'Lock'
  },
  {
    id: 'exaptation',
    name: 'Exaptation',
    description: 'Repurposing existing features for entirely new uses. Many innovations come from finding new uses for existing things.',
    howToUse: [
      'List all features of what you have',
      'Ask "What else could this do?"',
      'Consider byproducts as products',
      'Look for unintended uses',
      'Study how users hack products'
    ],
    examples: [
      'Bubble wrap (originally wallpaper)',
      'Play-Doh (originally wallpaper cleaner)',
      'Slack (originally game company internal tool)'
    ],
    relatedPatterns: ['combination', 'serendipity'],
    icon: 'Recycle'
  },
  {
    id: 'bisociation',
    name: 'Bisociation',
    description: 'Connecting two previously unrelated frames of reference to create new meaning. This is the basis of humor, scientific discovery, and artistic creation.',
    howToUse: [
      'Hold two unrelated ideas simultaneously',
      'Find the unexpected connection',
      'Look for patterns across domains',
      'Use random stimuli for collision',
      'Embrace absurd combinations'
    ],
    examples: [
      'Sushi burrito (Japanese + Mexican)',
      'Jazz improvisation (rules + freedom)',
      'Scientific metaphors'
    ],
    relatedPatterns: ['combination', 'analogy'],
    icon: 'Shuffle'
  },
  {
    id: 'serendipity',
    name: 'Serendipity',
    description: 'Creating conditions for happy accidents. While you can\'t force serendipity, you can increase its likelihood through exposure and attention.',
    howToUse: [
      'Expose yourself to diverse inputs',
      'Stay curious and attentive',
      'Follow interesting tangents',
      'Talk to people outside your field',
      'Keep a "ideas spotted" journal'
    ],
    examples: [
      'Post-it Notes (failed adhesive)',
      'Penicillin (contaminated petri dish)',
      'X-rays (accidental discovery)'
    ],
    relatedPatterns: ['exaptation', 'exploration'],
    icon: 'Sparkles'
  },
  {
    id: 'provocation',
    name: 'Provocation',
    description: 'Using deliberately illogical statements to break thinking patterns. Provocations create stepping stones to new ideas.',
    howToUse: [
      'Make deliberately illogical statements',
      'Use "What if..." scenarios',
      'Exaggerate to absurdity',
      'Remove essential elements mentally',
      'Connect to escape from provocation'
    ],
    examples: [
      '"Cars should have square wheels"',
      '"Restaurants with no food"',
      '"Schools with no teachers"'
    ],
    relatedPatterns: ['inversion', 'constraint'],
    icon: 'AlertTriangle'
  }
];
