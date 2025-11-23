# Voice API

**AI-Powered Voice Recognition API** - Speech-to-text transcription with multiple providers, custom vocabularies, and extensive configuration options.

## Features

- **Multi-Provider Support** - OpenAI Whisper, AssemblyAI, Deepgram
- **Custom Vocabularies** - Improve accuracy with domain-specific terms
- **Config Presets** - Save and reuse transcription configurations
- **Word-Level Timestamps** - Precise timing for each word
- **Speaker Diarization** - Identify different speakers
- **20+ Languages** - Auto-detection or specify language
- **Webhook Callbacks** - Get notified when transcription completes
- **Multiple Formats** - JSON, SRT, VTT output formats

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Create uploads directory
mkdir -p uploads

# Set your API key
cp .env.example .env
# Edit .env with your OpenAI key

# Start development server
npm run dev
```

Server runs on `http://localhost:3008`

## API Usage

### 1. Create a Project

```bash
curl -X POST http://localhost:3008/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reminder App",
    "openaiKey": "sk-your-openai-key"
  }'
```

### 2. Simple Transcription

```bash
curl -X POST http://localhost:3008/api/v1/transcriptions/transcribe \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@recording.mp3"
```

### 3. Advanced Transcription with Options

```bash
curl -X POST http://localhost:3008/api/v1/transcriptions/transcribe \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@meeting.wav" \
  -F "language=en" \
  -F "timestamps=word" \
  -F "diarization=true" \
  -F "prompt=Meeting about project planning" \
  -F "webhookUrl=https://your-app.com/webhook"
```

### 4. Create Config Preset

```bash
curl -X POST http://localhost:3008/api/v1/configs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "reminder-config",
    "description": "Config for reminder voice notes",
    "provider": "openai",
    "model": "whisper-1",
    "language": "en",
    "options": {
      "timestamps": "segment",
      "punctuation": true,
      "prompt": "Voice note for creating a reminder"
    },
    "isDefault": true
  }'

# Use config preset
curl -X POST http://localhost:3008/api/v1/transcriptions/transcribe \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@reminder.mp3" \
  -F "configName=reminder-config"
```

### 5. Create Custom Vocabulary

```bash
curl -X POST http://localhost:3008/api/v1/vocabularies \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tech-terms",
    "description": "Technical terms for better accuracy",
    "words": ["Kubernetes", "PostgreSQL", "TypeScript", "GraphQL", "Redis"],
    "boost": 1.5,
    "category": "technical"
  }'
```

### 6. Get Transcription Result

```bash
curl http://localhost:3008/api/v1/transcriptions/TRANSCRIPTION_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "status": "completed",
    "text": "Remind me to call John tomorrow at 3pm about the project deadline",
    "segments": [
      {"start": 0.0, "end": 2.5, "text": "Remind me to call John"},
      {"start": 2.5, "end": 5.2, "text": "tomorrow at 3pm about the project deadline"}
    ],
    "duration": 5.2,
    "language": "en",
    "processingTime": 1250
  }
}
```

## Integration Example (Reminder App)

```javascript
class VoiceRecognition {
  constructor(apiKey, baseUrl = 'http://localhost:3008') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async transcribe(audioBlob, options = {}) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    if (options.configName) formData.append('configName', options.configName);
    if (options.language) formData.append('language', options.language);
    if (options.prompt) formData.append('prompt', options.prompt);

    const response = await fetch(`${this.baseUrl}/api/v1/transcriptions/transcribe`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: formData,
    });

    const { data } = await response.json();
    return data;
  }

  async getResult(transcriptionId) {
    const response = await fetch(`${this.baseUrl}/api/v1/transcriptions/${transcriptionId}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
    });
    const { data } = await response.json();
    return data;
  }

  async waitForCompletion(transcriptionId, pollInterval = 1000) {
    while (true) {
      const result = await this.getResult(transcriptionId);
      if (result.status === 'completed') return result;
      if (result.status === 'failed') throw new Error(result.errorMessage);
      await new Promise(r => setTimeout(r, pollInterval));
    }
  }
}

// Usage in Reminder App
const voice = new VoiceRecognition('your_api_key');

// Record audio from microphone...
const audioBlob = await recordAudio();

// Transcribe
const { id } = await voice.transcribe(audioBlob, {
  configName: 'reminder-config',
  prompt: 'Voice note for creating a reminder with date, time, and description'
});

// Wait for result
const result = await voice.waitForCompletion(id);
console.log('Transcribed text:', result.text);

// Parse reminder from text
const reminder = parseReminderFromText(result.text);
```

## Transcription Options

| Option | Type | Description |
|--------|------|-------------|
| `language` | string | Language code or "auto" (default: auto) |
| `provider` | string | "openai", "assemblyai", "deepgram" |
| `model` | string | Model name (default: whisper-1) |
| `temperature` | number | Randomness 0-1 (default: 0) |
| `prompt` | string | Context prompt for better accuracy |
| `timestamps` | string | "none", "segment", "word" |
| `diarization` | boolean | Speaker identification |
| `punctuation` | boolean | Add punctuation (default: true) |
| `profanityFilter` | boolean | Filter profanity |
| `responseFormat` | string | "json", "text", "srt", "vtt" |
| `vocabulary` | array | Custom words/phrases |
| `webhookUrl` | string | URL for completion callback |
| `configName` | string | Use saved config preset |
| `metadata` | object | Custom metadata |

## Supported Languages

| Code | Language | Code | Language |
|------|----------|------|----------|
| auto | Auto-detect | zh | Chinese |
| en | English | ja | Japanese |
| es | Spanish | ko | Korean |
| fr | French | ar | Arabic |
| de | German | hi | Hindi |
| pt | Portuguese | ru | Russian |
| it | Italian | pl | Polish |

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Prisma (PostgreSQL-ready)
- **File Upload**: Multer
- **Speech-to-Text**: OpenAI Whisper API
- **Validation**: Zod

## License

MIT
