# AI Place Recommendation Chatbot

An AI-powered chatbot that helps you find places using natural language conversations. It combines Ollama's LLM capabilities with Google Maps API to provide intelligent location recommendations.

## Features

- Interactive CLI chat interface
- Natural language conversations in English and Indonesian
- Smart detection of location-related queries
- Integration with Google Maps API for accurate place data
- AI-powered analysis of places based on ratings, reviews, and characteristics
- Support for location-based searches with customizable radius

## Prerequisites

- Node.js (v14 or higher)
- Ollama installed on your system
- Google Maps API key
- TypeScript

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd heypico
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Install and start Ollama:
```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Start Ollama
ollama serve
```

5. Pull the Mistral model (only needed once):
```bash
ollama pull mistral
```

## Running the Chatbot

1. Make sure Ollama is running:
```bash
ollama run mistral
```

2. In a new terminal, start the chatbot:
```bash
npm run chat
```

## Using the Chatbot

1. The chatbot will greet you and wait for your input
2. You can:
   - Ask for place recommendations:
     - "Find me a good dimsum restaurant in South Jakarta"
     - "Recommend some coffee shops in Kemang"
     - "Where can I find good street food in Central Jakarta?"
   - Have general conversations:
     - "Hello, how are you?"
     - "What kind of places can you recommend?"
   - Type 'exit' or 'quit' to end the conversation

### Example Conversation:

## API Usage

### Get Place Recommendations

**Endpoint:** POST /api/recommendations

**Request Body:**
```