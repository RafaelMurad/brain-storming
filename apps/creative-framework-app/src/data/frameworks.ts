export interface Framework {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  origin: string;
  steps: {
    name: string;
    description: string;
    tips: string[];
  }[];
  benefits: string[];
  bestFor: string[];
  examples: string[];
  tools: string[];
  icon: string;
  color: string;
}

export const frameworks: Framework[] = [
  {
    id: 'design-thinking',
    name: 'Design Thinking',
    category: 'Human-Centered',
    shortDescription: 'A human-centered approach to innovation and problem-solving',
    description: 'Design Thinking is a non-linear, iterative process that teams use to understand users, challenge assumptions, redefine problems and create innovative solutions to prototype and test. It consists of five phases: Empathize, Define, Ideate, Prototype and Test.',
    origin: 'Developed at Stanford d.school and popularized by IDEO',
    steps: [
      {
        name: 'Empathize',
        description: 'Understand the human needs involved by observing, engaging, and immersing yourself in the experiences of users.',
        tips: [
          'Conduct user interviews and observations',
          'Create empathy maps',
          'Shadow users in their natural environment',
          'Ask "why" five times to get to root causes'
        ]
      },
      {
        name: 'Define',
        description: 'Process and synthesize your findings to form a user point of view that you will address.',
        tips: [
          'Create a clear problem statement',
          'Use "How Might We" questions',
          'Identify patterns and insights',
          'Define success criteria'
        ]
      },
      {
        name: 'Ideate',
        description: 'Generate a wide range of creative solutions through brainstorming and other ideation techniques.',
        tips: [
          'Defer judgment during brainstorming',
          'Go for quantity over quality initially',
          'Build on others\' ideas',
          'Encourage wild ideas'
        ]
      },
      {
        name: 'Prototype',
        description: 'Build rough representations of your ideas to learn more about them and test them.',
        tips: [
          'Start with low-fidelity prototypes',
          'Fail fast and iterate quickly',
          'Focus on learning, not perfection',
          'Make it tangible and testable'
        ]
      },
      {
        name: 'Test',
        description: 'Return to your users and get feedback on your prototypes to refine solutions.',
        tips: [
          'Observe how users interact',
          'Ask open-ended questions',
          'Don\'t defend your solution',
          'Iterate based on feedback'
        ]
      }
    ],
    benefits: [
      'Creates user-centered solutions',
      'Encourages experimentation',
      'Reduces risk through early testing',
      'Builds empathy with users',
      'Promotes collaboration'
    ],
    bestFor: [
      'Product development',
      'Service design',
      'Complex problem solving',
      'Innovation projects',
      'User experience design'
    ],
    examples: [
      'Airbnb redesigned their platform using Design Thinking',
      'Apple\'s product development process',
      'Healthcare system improvements'
    ],
    tools: ['Empathy Maps', 'Journey Maps', 'Persona Creation', 'Storyboarding'],
    icon: 'Lightbulb',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'scamper',
    name: 'SCAMPER',
    category: 'Ideation',
    shortDescription: 'A creative thinking technique using seven thinking strategies',
    description: 'SCAMPER is a brainstorming technique that uses a set of directed questions to help generate new ideas. Each letter represents a different way to play with the characteristics of what is challenging you: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, and Reverse.',
    origin: 'Developed by Bob Eberle based on Alex Osborn\'s checklist',
    steps: [
      {
        name: 'Substitute',
        description: 'What elements can be replaced with something else?',
        tips: [
          'Replace materials, people, or processes',
          'Consider alternative ingredients or components',
          'Think about different rules or approaches',
          'Swap one thing for another'
        ]
      },
      {
        name: 'Combine',
        description: 'What can be merged, mixed, or integrated?',
        tips: [
          'Merge two or more elements',
          'Combine purposes or functions',
          'Mix materials or approaches',
          'Integrate with other products or services'
        ]
      },
      {
        name: 'Adapt',
        description: 'What can be adjusted to serve another purpose?',
        tips: [
          'Look at how others have solved similar problems',
          'Borrow ideas from other industries',
          'Adapt to different contexts',
          'Consider what else is like this'
        ]
      },
      {
        name: 'Modify/Magnify',
        description: 'What can be modified, magnified, or minimized?',
        tips: [
          'Make it bigger or smaller',
          'Change the shape, color, or form',
          'Exaggerate or overstate elements',
          'Add extra value or features'
        ]
      },
      {
        name: 'Put to Other Uses',
        description: 'How can it be used differently or by different people?',
        tips: [
          'Consider new ways to use as is',
          'Think of other markets or users',
          'Repurpose waste or byproducts',
          'Find secondary uses'
        ]
      },
      {
        name: 'Eliminate',
        description: 'What can be removed or simplified?',
        tips: [
          'Remove unnecessary components',
          'Simplify the process',
          'Reduce to core essentials',
          'Split into different parts'
        ]
      },
      {
        name: 'Reverse/Rearrange',
        description: 'What can be reversed, reordered, or reorganized?',
        tips: [
          'Turn it inside out or upside down',
          'Reverse the order of operations',
          'Change the sequence',
          'Consider the opposite'
        ]
      }
    ],
    benefits: [
      'Provides structured approach to creativity',
      'Easy to learn and apply',
      'Works for any type of challenge',
      'Generates many ideas quickly',
      'Overcomes creative blocks'
    ],
    bestFor: [
      'Product improvement',
      'Process optimization',
      'Marketing campaigns',
      'Overcoming creative blocks',
      'Quick ideation sessions'
    ],
    examples: [
      'McDonald\'s combining drive-through with breakfast',
      'Swiss Army Knife combining multiple tools',
      'Netflix eliminating physical stores'
    ],
    tools: ['SCAMPER Worksheets', 'Checklist Templates', 'Mind Maps'],
    icon: 'Puzzle',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'six-thinking-hats',
    name: 'Six Thinking Hats',
    category: 'Decision Making',
    shortDescription: 'A parallel thinking process for exploring different perspectives',
    description: 'Six Thinking Hats is a powerful technique for looking at decisions from different perspectives. By mentally wearing different colored "hats", you can focus on specific types of thinking, leading to more balanced and thorough analysis.',
    origin: 'Created by Edward de Bono in 1985',
    steps: [
      {
        name: 'White Hat (Facts)',
        description: 'Focus on available data, facts, and information gaps.',
        tips: [
          'What do we know?',
          'What don\'t we know?',
          'What information do we need?',
          'How can we get the information?'
        ]
      },
      {
        name: 'Red Hat (Emotions)',
        description: 'Express feelings, intuitions, and gut reactions without justification.',
        tips: [
          'How do you feel about this?',
          'What\'s your gut reaction?',
          'What does your intuition tell you?',
          'No need to justify feelings'
        ]
      },
      {
        name: 'Black Hat (Caution)',
        description: 'Identify risks, dangers, and potential problems.',
        tips: [
          'What could go wrong?',
          'What are the weaknesses?',
          'What are the risks?',
          'Why might this not work?'
        ]
      },
      {
        name: 'Yellow Hat (Benefits)',
        description: 'Explore positives, benefits, and optimistic possibilities.',
        tips: [
          'What are the benefits?',
          'What\'s the best-case scenario?',
          'Why will this work?',
          'What are the opportunities?'
        ]
      },
      {
        name: 'Green Hat (Creativity)',
        description: 'Generate creative ideas, alternatives, and possibilities.',
        tips: [
          'What are the alternatives?',
          'Can we do this differently?',
          'What if...?',
          'What new ideas can we generate?'
        ]
      },
      {
        name: 'Blue Hat (Process)',
        description: 'Manage the thinking process and organize the discussion.',
        tips: [
          'What have we accomplished?',
          'What should we do next?',
          'What hat should we use now?',
          'Summarize and conclude'
        ]
      }
    ],
    benefits: [
      'Reduces conflict in discussions',
      'Separates ego from performance',
      'Ensures comprehensive analysis',
      'Saves time in meetings',
      'Encourages parallel thinking'
    ],
    bestFor: [
      'Team decision making',
      'Meeting facilitation',
      'Problem analysis',
      'Strategic planning',
      'Conflict resolution'
    ],
    examples: [
      'NASA using it for mission planning',
      'Corporate board decisions',
      'Educational curriculum design'
    ],
    tools: ['Colored Cards', 'Discussion Templates', 'Meeting Agendas'],
    icon: 'Brain',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'mind-mapping',
    name: 'Mind Mapping',
    category: 'Visual Thinking',
    shortDescription: 'A visual technique for organizing and connecting ideas',
    description: 'Mind Mapping is a visual thinking tool that helps structure information, analyze, comprehend, synthesize, recall, and generate new ideas. It starts with a central concept and branches out radially with associated topics, creating a visual representation of thoughts.',
    origin: 'Popularized by Tony Buzan in the 1970s',
    steps: [
      {
        name: 'Start with Central Idea',
        description: 'Place your main topic or question in the center of a blank page.',
        tips: [
          'Use an image or symbol if possible',
          'Make it colorful and memorable',
          'Keep it concise',
          'Position it prominently'
        ]
      },
      {
        name: 'Add Main Branches',
        description: 'Draw thick branches radiating from the center for main themes.',
        tips: [
          'Use different colors for each branch',
          'Keep branches curved, not straight',
          'Use single keywords, not sentences',
          'Make branches thicker near center'
        ]
      },
      {
        name: 'Add Sub-Branches',
        description: 'Extend thinner branches from main branches for subtopics.',
        tips: [
          'Keep the same color as parent branch',
          'Add keywords and images',
          'Let ideas flow freely',
          'Connect related concepts'
        ]
      },
      {
        name: 'Add Details',
        description: 'Continue adding layers of detail and connections.',
        tips: [
          'Use symbols and icons',
          'Draw connections between branches',
          'Add notes and references',
          'Review and refine'
        ]
      }
    ],
    benefits: [
      'Mimics how the brain naturally works',
      'Improves memory and recall',
      'Stimulates creativity',
      'Shows relationships between ideas',
      'Enables big-picture thinking'
    ],
    bestFor: [
      'Note-taking',
      'Brainstorming sessions',
      'Project planning',
      'Learning and studying',
      'Presentation preparation'
    ],
    examples: [
      'Planning a book or article',
      'Organizing a project',
      'Studying for exams'
    ],
    tools: ['MindMeister', 'XMind', 'Miro', 'Paper and Colored Pens'],
    icon: 'GitBranch',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'lateral-thinking',
    name: 'Lateral Thinking',
    category: 'Problem Solving',
    shortDescription: 'Indirect and creative approaches to problem solving',
    description: 'Lateral Thinking is solving problems through an indirect and creative approach, using reasoning that is not immediately obvious. It involves ideas that may not be obtainable by using traditional step-by-step logic.',
    origin: 'Coined by Edward de Bono in 1967',
    steps: [
      {
        name: 'Challenge Assumptions',
        description: 'Question every assumption about the problem.',
        tips: [
          'List all assumptions you\'re making',
          'Ask "Why must it be this way?"',
          'Consider the opposite of each assumption',
          'Look for hidden constraints'
        ]
      },
      {
        name: 'Generate Alternatives',
        description: 'Create multiple perspectives and alternative approaches.',
        tips: [
          'Use random entry techniques',
          'Apply provocative operations',
          'Consider analogies from other fields',
          'Embrace unusual combinations'
        ]
      },
      {
        name: 'Make Random Connections',
        description: 'Use random stimuli to spark new ideas.',
        tips: [
          'Pick a random word and connect it',
          'Use random images for inspiration',
          'Visit unfamiliar places for ideas',
          'Talk to people outside your field'
        ]
      },
      {
        name: 'Reverse the Problem',
        description: 'Look at the problem from the opposite direction.',
        tips: [
          'How could we make it worse?',
          'What\'s the opposite of the goal?',
          'Work backwards from the solution',
          'Consider anti-solutions'
        ]
      }
    ],
    benefits: [
      'Breaks through mental blocks',
      'Generates novel solutions',
      'Overcomes "analysis paralysis"',
      'Discovers hidden opportunities',
      'Challenges status quo'
    ],
    bestFor: [
      'Stuck problems',
      'Innovation challenges',
      'Breaking patterns',
      'Strategic thinking',
      'Creative breakthroughs'
    ],
    examples: [
      'The invention of Post-it Notes',
      'Dyson\'s bagless vacuum cleaner',
      'Southwest Airlines\' boarding process'
    ],
    tools: ['Random Word Generator', 'Provocation Techniques', 'Reversal Methods'],
    icon: 'Shuffle',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'triz',
    name: 'TRIZ',
    category: 'Systematic Innovation',
    shortDescription: 'Theory of Inventive Problem Solving with 40 principles',
    description: 'TRIZ (Theory of Inventive Problem Solving) is a systematic approach to creativity and innovation based on the study of patterns of invention in global patent literature. It provides tools and methods for generating innovative solutions.',
    origin: 'Developed by Genrich Altshuller in the USSR starting in 1946',
    steps: [
      {
        name: 'Define the Problem',
        description: 'Clearly state the problem and identify contradictions.',
        tips: [
          'Identify the ideal final result',
          'Find technical contradictions',
          'Determine physical contradictions',
          'Define the system and supersystem'
        ]
      },
      {
        name: 'Analyze Resources',
        description: 'Identify available and hidden resources in and around the system.',
        tips: [
          'List all available resources',
          'Consider substance, field, and functional resources',
          'Look for underutilized resources',
          'Explore environmental resources'
        ]
      },
      {
        name: 'Apply TRIZ Tools',
        description: 'Use appropriate TRIZ principles and tools for your contradiction.',
        tips: [
          'Use the 40 Inventive Principles',
          'Apply the Contradiction Matrix',
          'Consider separation principles',
          'Use patterns of evolution'
        ]
      },
      {
        name: 'Evaluate Solutions',
        description: 'Assess generated concepts against the ideal final result.',
        tips: [
          'Check if contradiction is resolved',
          'Evaluate practicality',
          'Consider implementation resources',
          'Test against ideal outcome'
        ]
      }
    ],
    benefits: [
      'Systematic approach to innovation',
      'Based on proven patterns',
      'Resolves contradictions',
      'Provides specific solution directions',
      'Accelerates invention process'
    ],
    bestFor: [
      'Engineering problems',
      'Technical innovation',
      'Patent development',
      'Product optimization',
      'Complex system design'
    ],
    examples: [
      'Samsung\'s product innovations',
      'Boeing aircraft design',
      'Procter & Gamble product development'
    ],
    tools: ['Contradiction Matrix', '40 Inventive Principles', 'Function Analysis'],
    icon: 'Cog',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'five-whys',
    name: 'Five Whys',
    category: 'Root Cause Analysis',
    shortDescription: 'Iterative questioning to find the root cause of problems',
    description: 'The Five Whys is an iterative interrogative technique used to explore cause-and-effect relationships. By repeating "Why?" five times, you can peel away layers of symptoms to reach the root cause of a problem.',
    origin: 'Developed by Sakichi Toyoda for Toyota Motor Corporation',
    steps: [
      {
        name: 'State the Problem',
        description: 'Clearly define the problem you\'re investigating.',
        tips: [
          'Be specific and factual',
          'Avoid assumptions',
          'Focus on one problem at a time',
          'Use observable symptoms'
        ]
      },
      {
        name: 'Ask Why (First Time)',
        description: 'Ask why the problem occurs and document the answer.',
        tips: [
          'Look for direct causes',
          'Base answers on facts',
          'Consider multiple causes',
          'Document each answer'
        ]
      },
      {
        name: 'Continue Asking Why',
        description: 'For each answer, ask why again until you reach the root cause.',
        tips: [
          'Don\'t stop at surface answers',
          'Follow the logic chain',
          'Challenge each answer',
          'May need more or fewer than 5 whys'
        ]
      },
      {
        name: 'Identify Root Cause',
        description: 'Recognize when you\'ve reached a root cause that can be addressed.',
        tips: [
          'Root cause should be actionable',
          'Should prevent recurrence when fixed',
          'May reveal multiple root causes',
          'Validate with evidence'
        ]
      }
    ],
    benefits: [
      'Simple and easy to use',
      'Gets to root cause quickly',
      'Avoids treating symptoms',
      'Requires no special training',
      'Promotes deeper understanding'
    ],
    bestFor: [
      'Quality issues',
      'Process problems',
      'Troubleshooting',
      'Continuous improvement',
      'Team problem solving'
    ],
    examples: [
      'Toyota Production System',
      'IT incident analysis',
      'Customer complaint investigation'
    ],
    tools: ['Fishbone Diagrams', 'Root Cause Templates', 'Problem Statements'],
    icon: 'HelpCircle',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'brainstorming',
    name: 'Classic Brainstorming',
    category: 'Ideation',
    shortDescription: 'Group creativity technique for generating many ideas',
    description: 'Brainstorming is a group creativity technique designed to generate a large number of ideas for solving a problem. It encourages free thinking and builds on the ideas of others while deferring judgment.',
    origin: 'Developed by Alex Osborn in 1939',
    steps: [
      {
        name: 'Define the Challenge',
        description: 'Clearly state the problem or opportunity you\'re addressing.',
        tips: [
          'Frame as "How might we..." question',
          'Keep it open-ended',
          'Ensure everyone understands it',
          'Make it inspiring'
        ]
      },
      {
        name: 'Set Ground Rules',
        description: 'Establish the rules for the brainstorming session.',
        tips: [
          'Defer judgment',
          'Encourage wild ideas',
          'Build on others\' ideas',
          'Go for quantity'
        ]
      },
      {
        name: 'Generate Ideas',
        description: 'Have the group generate as many ideas as possible.',
        tips: [
          'Write every idea down',
          'One conversation at a time',
          'Stay focused on topic',
          'Be visual'
        ]
      },
      {
        name: 'Evaluate and Select',
        description: 'Review ideas and select the most promising ones.',
        tips: [
          'Cluster similar ideas',
          'Vote on favorites',
          'Consider feasibility',
          'Combine ideas'
        ]
      }
    ],
    benefits: [
      'Generates many ideas quickly',
      'Builds team collaboration',
      'Encourages participation',
      'Creates energy and enthusiasm',
      'Low barrier to entry'
    ],
    bestFor: [
      'New product ideas',
      'Marketing campaigns',
      'Process improvements',
      'Problem solving',
      'Strategic planning'
    ],
    examples: [
      'Advertising agency creative sessions',
      'Product naming sessions',
      'Team building activities'
    ],
    tools: ['Sticky Notes', 'Whiteboards', 'Digital Collaboration Tools', 'Timers'],
    icon: 'Sparkles',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'storyboarding',
    name: 'Storyboarding',
    category: 'Visual Thinking',
    shortDescription: 'Visual narrative technique for planning sequences',
    description: 'Storyboarding is a visual technique that uses a sequence of illustrations to represent a story, process, or user journey. It helps teams visualize and communicate ideas, identify gaps, and plan experiences.',
    origin: 'Developed at Walt Disney Studios in the 1930s',
    steps: [
      {
        name: 'Define the Scenario',
        description: 'Determine what story or process you want to visualize.',
        tips: [
          'Identify the main character or user',
          'Define the goal or outcome',
          'Determine the context',
          'Set the scope'
        ]
      },
      {
        name: 'Identify Key Moments',
        description: 'Break down the story into key scenes or moments.',
        tips: [
          'Focus on critical interactions',
          'Include emotional moments',
          'Show before and after states',
          'Capture decision points'
        ]
      },
      {
        name: 'Sketch the Frames',
        description: 'Create simple drawings for each key moment.',
        tips: [
          'Stick figures are fine',
          'Include basic context',
          'Show actions and reactions',
          'Add captions or notes'
        ]
      },
      {
        name: 'Add Details and Refine',
        description: 'Enhance the storyboard with additional information.',
        tips: [
          'Add dialogue or thoughts',
          'Note pain points',
          'Include emotional indicators',
          'Review for completeness'
        ]
      }
    ],
    benefits: [
      'Makes ideas tangible',
      'Easy to share and discuss',
      'Identifies gaps in thinking',
      'Builds empathy',
      'Quick to create'
    ],
    bestFor: [
      'User experience design',
      'Marketing campaigns',
      'Film and video production',
      'Service design',
      'Presentation planning'
    ],
    examples: [
      'Disney film production',
      'User journey mapping',
      'Commercial development'
    ],
    tools: ['Paper Templates', 'Digital Storyboard Tools', 'Index Cards'],
    icon: 'Film',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'random-input',
    name: 'Random Input Technique',
    category: 'Ideation',
    shortDescription: 'Using random stimuli to spark creative connections',
    description: 'The Random Input Technique introduces unrelated elements into your thinking process to create unexpected associations and novel ideas. It leverages the brain\'s pattern-making ability to forge creative connections.',
    origin: 'Developed by Edward de Bono as part of Lateral Thinking',
    steps: [
      {
        name: 'Define Your Challenge',
        description: 'Clearly state the problem or opportunity you\'re working on.',
        tips: [
          'Be specific about what you want to achieve',
          'Write it down clearly',
          'Keep it visible during the exercise',
          'Focus on one challenge at a time'
        ]
      },
      {
        name: 'Generate Random Input',
        description: 'Select a random word, image, or object.',
        tips: [
          'Use a random word generator',
          'Point to a random word in a book',
          'Use random images from the internet',
          'Pick an object from your surroundings'
        ]
      },
      {
        name: 'Extract Principles',
        description: 'List characteristics, associations, and functions of the random input.',
        tips: [
          'What does it look like?',
          'What does it do?',
          'What are its properties?',
          'What does it remind you of?'
        ]
      },
      {
        name: 'Force Connections',
        description: 'Connect the principles to your challenge to generate new ideas.',
        tips: [
          'Don\'t dismiss connections as silly',
          'Look for unexpected parallels',
          'Use "What if..." thinking',
          'Build on initial connections'
        ]
      }
    ],
    benefits: [
      'Breaks habitual thinking patterns',
      'Generates truly novel ideas',
      'Works when stuck',
      'Simple to implement',
      'Can be done alone or in groups'
    ],
    bestFor: [
      'Creative blocks',
      'Innovation sessions',
      'New product development',
      'Marketing ideas',
      'Artistic projects'
    ],
    examples: [
      'Using "banana" to design a new laptop bag',
      'Using "fire engine" to improve customer service',
      'Random images for brand identity'
    ],
    tools: ['Random Word Generators', 'Image Libraries', 'Word Banks'],
    icon: 'Dice5',
    color: 'from-pink-500 to-rose-500'
  }
];

export const categories = [
  { id: 'all', name: 'All Frameworks', count: frameworks.length },
  { id: 'Human-Centered', name: 'Human-Centered', count: frameworks.filter(f => f.category === 'Human-Centered').length },
  { id: 'Ideation', name: 'Ideation', count: frameworks.filter(f => f.category === 'Ideation').length },
  { id: 'Decision Making', name: 'Decision Making', count: frameworks.filter(f => f.category === 'Decision Making').length },
  { id: 'Visual Thinking', name: 'Visual Thinking', count: frameworks.filter(f => f.category === 'Visual Thinking').length },
  { id: 'Problem Solving', name: 'Problem Solving', count: frameworks.filter(f => f.category === 'Problem Solving').length },
  { id: 'Systematic Innovation', name: 'Systematic Innovation', count: frameworks.filter(f => f.category === 'Systematic Innovation').length },
  { id: 'Root Cause Analysis', name: 'Root Cause Analysis', count: frameworks.filter(f => f.category === 'Root Cause Analysis').length },
];
