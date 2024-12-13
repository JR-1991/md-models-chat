# MD-Models Chat

MD-Models Chat is a web application designed to transform unstructured data into structured data using knowledge graphs and schema evaluation. It leverages OpenAI's API to process and extract meaningful insights from text data, making it easier to analyze and visualize complex information.

## Features

- Extracts knowledge graphs from text data.
- Evaluates schema compatibility and suggests improvements.
- Provides a user-friendly interface for data input and visualization.
- Extracts data from text using LLM-based extraction.

## Prerequisites

- Node.js (version 14 or later)
- Vercel CLI
- OpenAI API Key
- Ollama (Optional)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/md-models-chat.git
   cd md-models-chat
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your OpenAI API key:

   ```bash
   # Node environment variables
   OPENAI_API_KEY=<your-openai-api-key>
   LLM_MODEL=<your-llm-model>
   ALLOWED_ORIGIN=<your-allowed-origin>
   JWT_SECRET=<your-jwt-secret>
   OLLAMA_URL=<your-ollama-url> # Optional
   SECRET=<your-app-secret> # Optional

   # Vite environment variables
   VITE_USE_PASSWORD=false
   ```

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key.
- `LLM_MODEL`: The model to use for LLM-based extraction.
- `ALLOWED_ORIGIN`: The origin to allow for requests.
- `JWT_SECRET`: The secret to use for JWT authentication.
- `OLLAMA_URL`: The URL to use for OLLAMA. (Optional)
- `SECRET`: The secret to use for the app. (Optional)
- `VITE_PUBLIC_USE_PASSWORD`: Whether to use password for the app. (Optional)

## Using Vercel CLI

The Vercel CLI is used to deploy the app to Vercel or run it locally.

```bash
# Install Vercel CLI
npm i -g vercel
```

```bash
# Run the app locally
vercel dev
```
