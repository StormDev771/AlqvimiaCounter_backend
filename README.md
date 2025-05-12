# AWER Backend

This is the backend API for the AWER application, built with Express.js and Firebase.

## Features

- RESTful API with Express.js
- Authentication with Firebase Auth
- Data storage with Firestore
- Call functionality with Telnyx WebRTC
- Transcription with Deepgram
- Agent management and routing
- OpenAI-powered text chat

## Prerequisites

- Node.js 14.x or later
- Firebase project with Firestore and Authentication enabled
- Telnyx account for call functionality
- Deepgram account for transcription
- OpenAI API key for chat functionality

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/awer-backend.git
cd awer-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
FIREBASE_DATABASE_URL=https://your-firebase-project.firebaseio.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"..."}
TELNYX_SIP_USERNAME=your-telnyx-sip-username
TELNYX_SIP_PASSWORD=your-telnyx-sip-password
TELNYX_CALLER_ID=your-telnyx-caller-id
DEEPGRAM_API_KEY=your-deepgram-api-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=1024
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout a user

### Users
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `POST /api/users` - Create a new user (requires authentication)
- `PUT /api/users/:id` - Update a user (requires authentication)
- `DELETE /api/users/:id` - Delete a user (requires authentication)

### Calls
- `POST /api/calls/initiate` - Initiate a new call (requires authentication)
- `POST /api/calls/:id/end` - End an active call (requires authentication)
- `GET /api/calls` - Get all calls for the user (requires authentication)
- `GET /api/calls/:id` - Get call details by ID (requires authentication)
- `POST /api/calls/:id/transcribe` - Start call transcription (requires authentication)
- `GET /api/calls/:id/transcript` - Get call transcript (requires authentication)

### Agents
- `GET /api/agents` - Get all agents with optional filtering (requires authentication)
- `GET /api/agents/:id` - Get agent by ID (requires authentication)
- `POST /api/agents` - Create a new agent (requires authentication)
- `PUT /api/agents/:id` - Update an agent (requires authentication)
- `DELETE /api/agents/:id` - Delete an agent (requires authentication)
- `PUT /api/agents/:id/status` - Update agent status (requires authentication)
- `GET /api/agents/available/find` - Find available agents for a call (requires authentication)
- `PUT /api/agents/:id/call-counter` - Update agent call counter (requires authentication)
- `PUT /api/agents/:id/metrics` - Update agent performance metrics (requires authentication)

### Chat
- `POST /api/chat/simple` - Generate a simple text response (requires authentication)
- `POST /api/chat/completion` - Generate a chat completion (requires authentication)
- `POST /api/chat/agent/:agentId` - Generate a response from a specific agent (requires authentication)

## License

ISC
