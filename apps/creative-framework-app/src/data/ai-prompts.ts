export interface AIPromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  variables: string[];
  examples: string[];
  icon: string;
}

export const aiPromptTemplates: AIPromptTemplate[] = [
  {
    id: 'idea-expansion',
    name: 'Idea Expansion',
    description: 'Take a seed idea and expand it into multiple variations and possibilities',
    category: 'Ideation',
    prompt: `You are a creative ideation assistant. Take this seed idea and expand it into 5 unique variations, each exploring a different angle or possibility.

Seed Idea: {{idea}}

For each variation:
1. Give it a catchy name
2. Describe the core concept (2-3 sentences)
3. Explain what makes it unique
4. Suggest one potential challenge to overcome

Be creative, unexpected, and push beyond obvious interpretations.`,
    variables: ['idea'],
    examples: [
      'A mobile app for learning languages',
      'A sustainable packaging solution',
      'A community engagement platform'
    ],
    icon: 'Expand'
  },
  {
    id: 'scamper-analysis',
    name: 'SCAMPER Analysis',
    description: 'Apply all SCAMPER techniques to generate new ideas from an existing concept',
    category: 'Framework',
    prompt: `Apply the SCAMPER technique to this concept and generate creative ideas for each letter:

Concept: {{concept}}

For each SCAMPER element, provide 2 specific, actionable ideas:

**S - Substitute**: What can be replaced?
**C - Combine**: What can be merged together?
**A - Adapt**: What can be borrowed from elsewhere?
**M - Modify/Magnify**: What can be changed in form or scale?
**P - Put to Other Uses**: What other purposes could it serve?
**E - Eliminate**: What can be removed or simplified?
**R - Reverse/Rearrange**: What can be flipped or reordered?

Make ideas specific, surprising, and implementable.`,
    variables: ['concept'],
    examples: [
      'Traditional coffee shop',
      'Online education platform',
      'Fitness tracking app'
    ],
    icon: 'Puzzle'
  },
  {
    id: 'problem-reframe',
    name: 'Problem Reframing',
    description: 'Reframe a problem from multiple perspectives to find new solution spaces',
    category: 'Problem Solving',
    prompt: `Help reframe this problem from multiple perspectives to discover new solution spaces:

Problem: {{problem}}

Provide 5 different reframes:

1. **User Perspective**: How would different users describe this problem?
2. **Opposite Frame**: What if the opposite were the problem?
3. **Bigger Picture**: What larger system is this problem part of?
4. **Root Cause**: What underlying issue might this be a symptom of?
5. **Opportunity Frame**: How might this problem be an opportunity?

For each reframe, suggest one potential solution direction that emerges from this new perspective.`,
    variables: ['problem'],
    examples: [
      'Users are abandoning their shopping carts',
      'Team meetings are unproductive',
      'Customer complaints are increasing'
    ],
    icon: 'RefreshCw'
  },
  {
    id: 'random-connection',
    name: 'Random Connection',
    description: 'Force unexpected connections between your challenge and random elements',
    category: 'Lateral Thinking',
    prompt: `Create unexpected connections between this challenge and random elements to spark new ideas:

Challenge: {{challenge}}
Random Element: {{random_element}}

1. List 5 characteristics or associations of "{{random_element}}"
2. For each characteristic, force a connection to your challenge
3. Develop the most promising connection into a concrete idea
4. Explain how this unexpected connection adds value

Be bold - the best ideas often come from the most unlikely connections!`,
    variables: ['challenge', 'random_element'],
    examples: [
      'Challenge: Improve customer onboarding | Random: Butterfly',
      'Challenge: Reduce meeting time | Random: Jazz music',
      'Challenge: Increase engagement | Random: Volcano'
    ],
    icon: 'Shuffle'
  },
  {
    id: 'future-scenario',
    name: 'Future Scenario',
    description: 'Imagine how your concept might evolve in different future scenarios',
    category: 'Strategic Thinking',
    prompt: `Imagine how this concept might evolve in different future scenarios:

Concept: {{concept}}
Time Horizon: {{time_horizon}}

Explore 4 different future scenarios:

1. **Optimistic Future**: Everything goes right - what does success look like?
2. **Challenging Future**: What obstacles might arise and how might you adapt?
3. **Technological Shift**: How might emerging tech transform this concept?
4. **Social Change**: How might shifting values or behaviors affect it?

For each scenario:
- Paint a vivid picture of that future
- Identify key opportunities
- Suggest strategic preparations for today`,
    variables: ['concept', 'time_horizon'],
    examples: [
      'Concept: Remote work | Time: 10 years',
      'Concept: Electric vehicles | Time: 5 years',
      'Concept: Online education | Time: 15 years'
    ],
    icon: 'Telescope'
  },
  {
    id: 'six-hats-analysis',
    name: 'Six Thinking Hats Analysis',
    description: 'Analyze an idea from all six thinking perspectives',
    category: 'Framework',
    prompt: `Analyze this idea using the Six Thinking Hats framework:

Idea: {{idea}}

Provide insights from each hat perspective:

🔵 **Blue Hat (Process)**: What is the overall goal and how should we think about this?

⚪ **White Hat (Facts)**: What data and information do we have or need?

❤️ **Red Hat (Emotions)**: What are the gut feelings and intuitions about this?

⚫ **Black Hat (Caution)**: What are the risks, dangers, and potential problems?

💛 **Yellow Hat (Benefits)**: What are the advantages and positive outcomes?

💚 **Green Hat (Creativity)**: What alternatives and creative possibilities exist?

End with a balanced recommendation based on all perspectives.`,
    variables: ['idea'],
    examples: [
      'Launching a new product line',
      'Implementing a four-day work week',
      'Expanding into a new market'
    ],
    icon: 'Brain'
  },
  {
    id: 'analogy-generator',
    name: 'Analogy Generator',
    description: 'Generate powerful analogies to explain or improve your concept',
    category: 'Communication',
    prompt: `Generate powerful analogies for this concept to aid understanding and spark improvements:

Concept: {{concept}}

1. **Nature Analogy**: How is this like something in nature?
2. **Historical Analogy**: What historical parallel illuminates this?
3. **Everyday Object**: What common object shares key characteristics?
4. **Different Industry**: What similar thing exists in an unrelated field?
5. **Story/Narrative**: What story or myth captures the essence?

For each analogy:
- Explain the key parallels
- Identify what insights this analogy provides
- Suggest one improvement inspired by the analogy`,
    variables: ['concept'],
    examples: [
      'A startup growing rapidly',
      'Customer relationship management',
      'Knowledge sharing in organizations'
    ],
    icon: 'Repeat'
  },
  {
    id: 'constraints-creativity',
    name: 'Constraint-Based Creativity',
    description: 'Use artificial constraints to force creative solutions',
    category: 'Ideation',
    prompt: `Use constraints to force creative solutions for this challenge:

Challenge: {{challenge}}

Apply these constraints and generate one idea for each:

1. **Time Constraint**: Solve it in 1 hour
2. **Budget Constraint**: Solve it with $100
3. **Resource Constraint**: Solve it with only what you have now
4. **Simplicity Constraint**: Solve it in one step
5. **Scale Constraint**: Solve it for 1 million people

For each constrained solution:
- Describe the solution
- Explain how the constraint shaped the approach
- Identify what makes this solution valuable

Then synthesize: What common principles emerge across these constrained solutions?`,
    variables: ['challenge'],
    examples: [
      'Improve employee engagement',
      'Reduce customer churn',
      'Increase brand awareness'
    ],
    icon: 'Lock'
  },
  {
    id: 'five-whys',
    name: 'Five Whys Deep Dive',
    description: 'Get to the root cause of a problem through iterative questioning',
    category: 'Problem Solving',
    prompt: `Apply the Five Whys technique to uncover the root cause:

Problem: {{problem}}

Starting with the problem, ask "Why?" five times, going deeper each time:

**Why 1**: Why does this problem occur?
→ [Answer and explanation]

**Why 2**: Why does [Answer 1] happen?
→ [Answer and explanation]

**Why 3**: Why does [Answer 2] happen?
→ [Answer and explanation]

**Why 4**: Why does [Answer 3] happen?
→ [Answer and explanation]

**Why 5**: Why does [Answer 4] happen?
→ [Root cause and explanation]

**Root Cause Identified**: [Summary]

**Recommended Actions**:
- Immediate fix
- Long-term prevention
- How to verify the fix worked`,
    variables: ['problem'],
    examples: [
      'Website traffic has declined 30%',
      'Project deadlines keep getting missed',
      'Customer satisfaction scores are dropping'
    ],
    icon: 'Search'
  },
  {
    id: 'creative-brief',
    name: 'Creative Brief Generator',
    description: 'Generate a comprehensive creative brief for your project',
    category: 'Planning',
    prompt: `Generate a comprehensive creative brief for this project:

Project: {{project}}
Target Audience: {{audience}}

Create a creative brief including:

**1. Background**
- Context and situation
- Why this project matters now

**2. Objective**
- Primary goal
- How success will be measured

**3. Target Audience**
- Demographics and psychographics
- Key insights about them
- What they currently think/feel/do

**4. Key Message**
- Single most important takeaway
- Supporting messages

**5. Tone & Style**
- Voice characteristics
- Visual direction
- What to avoid

**6. Deliverables**
- Required outputs
- Specifications

**7. Inspiration**
- Reference examples
- Mood board suggestions`,
    variables: ['project', 'audience'],
    examples: [
      'Project: App launch campaign | Audience: Gen Z',
      'Project: Brand refresh | Audience: Small business owners',
      'Project: Educational content | Audience: Career changers'
    ],
    icon: 'FileText'
  }
];

export const randomWords = [
  'Ocean', 'Lightning', 'Garden', 'Bridge', 'Forest', 'Compass', 'Mirror', 'River',
  'Mountain', 'Butterfly', 'Clock', 'Key', 'Window', 'Tree', 'Fire', 'Cloud',
  'Star', 'Wave', 'Stone', 'Wind', 'Rain', 'Snow', 'Sun', 'Moon', 'Bird',
  'Fish', 'Dragon', 'Castle', 'Ship', 'Train', 'Rocket', 'Telescope', 'Microscope',
  'Piano', 'Drum', 'Canvas', 'Brush', 'Pen', 'Book', 'Map', 'Puzzle',
  'Maze', 'Ladder', 'Door', 'Path', 'Journey', 'Dance', 'Song', 'Dream'
];

export const creativityTips = [
  'Take a walk when stuck - movement boosts creative thinking',
  'Keep a notebook by your bed for capturing dream-inspired ideas',
  'Cross-pollinate ideas from completely unrelated fields',
  'Set constraints to force creative solutions',
  'Sleep on it - incubation is a real creative phenomenon',
  'Talk to someone outside your field about your challenge',
  'Ask "What would a child do?" to break expert blindness',
  'Combine two unrelated things to create something new',
  'Flip your assumptions upside down',
  'Start with "What if?" instead of "How?"',
  'Embrace boredom - it\'s the birthplace of creativity',
  'Collect interesting things even if you don\'t know why',
  'Do something new today - novelty feeds creativity',
  'Question the question before answering it',
  'Make the familiar strange and the strange familiar'
];

export const getRandomWord = () => randomWords[Math.floor(Math.random() * randomWords.length)];
export const getRandomTip = () => creativityTips[Math.floor(Math.random() * creativityTips.length)];
