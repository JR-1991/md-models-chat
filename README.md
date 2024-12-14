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

Using environment variables, you can control which stages of the RAG graph utilize OpenAI or oLLAMA. We recommend OpenAI, if applicable, otherwise oLLAMA using Gemma2:7b performs very well on evaluation and knowledge graph creation. However, since oLLAMA does not support the `strict` response format, the resulting extraction will be less accurate and can/will deviate from the schema. Hence, we recommend using OpenAI for extraction.

#### LLM Configuration

In this section, you can specify the API key for OpenAI and the URL for oLLAMA. You can also specify whether to use oLLAMA for each stage of the RAG graph.

- `OPENAI_API_KEY`: Your OpenAI API key.
- `OLLAMA_URL`: The URL to use for OLLAMA. (Optional)
- `EXTRACT_PROVIDER`: The provider to use for extraction. (Optional)
- `EVAL_PROVIDER`: The provider to use for evaluation. (Optional)
- `KNOWLEDGE_GRAPH_PROVIDER`: The provider to use for knowledge graph generation. (Optional)

#### LLM Models

In this section, you can specify the models to use for each stage of the RAG graph.

- `EVAL_LLM_MODEL`: The model to use for LLM-based evaluation.
- `EXTRACT_LLM_MODEL`: The model to use for LLM-based extraction.
- `KNOWLEDGE_GRAPH_LLM_MODEL`: The model to use for LLM-based knowledge graph generation.

#### App

The following environment variables are used to configure the app. This includes secrets and allowed origins to secure your application. If you want to restrict access to your application, you can set the `VITE_USE_PASSWORD` to `true` and set the `SECRET` environment variable. Users then have to provide a password to access the application.

- `VITE_PUBLIC_BASE_URL`: The base URL for the app. Not necessary for vercel deployments.
- `JWT_SECRET`: The secret to use for JWT authentication.
- `SECRET`: The secret to use for the app. (Optional)
- `VITE_USE_PASSWORD`: Whether to use password for the app. (Optional)

## Using Vercel CLI

The Vercel CLI is used to deploy the app to Vercel or run it locally.

```bash
# Install Vercel CLI
npm i -g vercel
vercel login
```

```bash
# Run the app locally
vercel dev
```
