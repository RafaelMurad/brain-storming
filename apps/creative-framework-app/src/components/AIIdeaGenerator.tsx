'use client';

import { useState } from 'react';
import {
  Wand2, Sparkles, Send, RefreshCw, Copy, Check, Loader2,
  Puzzle, Search, Shuffle, Telescope, Brain, FileText, Lock, Expand, Repeat
} from 'lucide-react';
import { aiPromptTemplates, getRandomWord, getRandomTip, randomWords } from '@/data/ai-prompts';

const iconMap: Record<string, any> = {
  Expand, Puzzle, RefreshCw, Shuffle, Telescope, Brain, Repeat, Lock, Search, FileText
};

export default function AIIdeaGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(aiPromptTemplates[0]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [dailyTip, setDailyTip] = useState(getRandomTip());
  const [randomWord, setRandomWord] = useState(getRandomWord());

  const handleInputChange = (variable: string, value: string) => {
    setInputs(prev => ({ ...prev, [variable]: value }));
  };

  const generatePrompt = () => {
    let prompt = selectedTemplate.prompt;
    selectedTemplate.variables.forEach(variable => {
      const value = inputs[variable] || `[Enter ${variable}]`;
      prompt = prompt.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refreshRandomWord = () => {
    setRandomWord(getRandomWord());
    if (selectedTemplate.id === 'random-connection') {
      setInputs(prev => ({ ...prev, random_element: getRandomWord() }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-4">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">AI-Powered Ideation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
          Generate Ideas with AI
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Use these AI prompt templates to expand your ideas, reframe problems, and discover creative solutions.
          Copy the generated prompt and use it with your favorite AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template selector */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
          <div className="space-y-3">
            {aiPromptTemplates.map((template) => {
              const Icon = iconMap[template.icon] || Sparkles;
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setInputs({});
                    setGeneratedPrompt('');
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedTemplate.id === template.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-white/50">{template.category}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Daily creativity tip */}
          <div className="mt-6 glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Creativity Tip</span>
            </div>
            <p className="text-sm text-white/60 italic">&quot;{dailyTip}&quot;</p>
            <button
              onClick={() => setDailyTip(getRandomTip())}
              className="mt-2 text-xs text-white/40 hover:text-white/60 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              New tip
            </button>
          </div>
        </div>

        {/* Input and output area */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            {/* Template info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{selectedTemplate.name}</h3>
              <p className="text-white/60 text-sm">{selectedTemplate.description}</p>
            </div>

            {/* Input fields */}
            <div className="space-y-4 mb-6">
              {selectedTemplate.variables.map((variable) => (
                <div key={variable}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {variable.replace(/_/g, ' ')}
                    {variable === 'random_element' && (
                      <button
                        onClick={refreshRandomWord}
                        className="ml-2 text-xs text-purple-400 hover:text-purple-300"
                      >
                        <RefreshCw className="w-3 h-3 inline mr-1" />
                        Random: {randomWord}
                      </button>
                    )}
                  </label>
                  <input
                    type="text"
                    value={inputs[variable] || ''}
                    onChange={(e) => handleInputChange(variable, e.target.value)}
                    placeholder={selectedTemplate.examples[0]?.split('|')[0]?.split(':')[1]?.trim() || `Enter ${variable}`}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            {/* Example suggestions */}
            <div className="mb-6">
              <span className="text-xs text-white/40 block mb-2">Example inputs:</span>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const parts = example.split('|');
                      parts.forEach(part => {
                        const [key, value] = part.split(':').map(s => s.trim());
                        const varName = key.toLowerCase().replace(/ /g, '_');
                        if (selectedTemplate.variables.includes(varName)) {
                          handleInputChange(varName, value);
                        } else if (selectedTemplate.variables.length === 1) {
                          handleInputChange(selectedTemplate.variables[0], example);
                        }
                      });
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
                  >
                    {example.length > 40 ? example.substring(0, 40) + '...' : example}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generatePrompt}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-6"
            >
              <Wand2 className="w-5 h-5" />
              Generate AI Prompt
            </button>

            {/* Generated prompt */}
            {generatedPrompt && (
              <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-purple-300">Generated Prompt</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-sm text-white/70 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                  {generatedPrompt}
                </pre>
              </div>
            )}

            {/* Usage instructions */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-white/5">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                How to use
              </h4>
              <ol className="text-xs text-white/50 space-y-1 list-decimal list-inside">
                <li>Fill in the input fields above with your challenge or idea</li>
                <li>Click &quot;Generate AI Prompt&quot; to create your customized prompt</li>
                <li>Copy the generated prompt using the copy button</li>
                <li>Paste it into ChatGPT, Claude, or your preferred AI assistant</li>
                <li>Review the AI&apos;s response and iterate on interesting ideas</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
