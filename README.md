# Simple RAG (Retrieval Augmented Generation) Application

A demonstration of building a RAG application that allows users to chat with their documents using AI. This project shows how to implement the key components of RAG: document processing, embedding generation, vector storage, and AI-powered chat.

## How it Works

1. **Document Processing**: Upload PDFs which are split into smaller chunks
2. **Embedding Generation**: Each chunk is converted to embeddings using OpenAI's embedding model
3. **Vector Storage**: Embeddings are stored in Supabase's vector database
4. **Retrieval**: When users ask questions, relevant chunks are retrieved using similarity search
5. **Generation**: OpenAI's GPT model generates responses based on the retrieved context

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Vector database & authentication
- [OpenAI](https://openai.com/) - Embeddings & text generation
- [LangChain](https://js.langchain.com/) - Document loading & text splitting
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Core Features

- 📄 PDF processing and chunking
- 🔤 Text embedding generation
- 📊 Vector similarity search
- 💬 Context-aware AI chat
- 🔒 User authentication

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (for vector storage)
- An OpenAI API key (for embeddings and chat)

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/eric-ricky/ai-document-chat.git
```

### 2. Install dependencies

```
npm install
```
