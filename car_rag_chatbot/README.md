# RAG-Based Chatbot 🚀

A **Retrieval-Augmented Generation (RAG) chatbot** built using **FastAPI**, **Llama-3.1-8B-Instant (Groq)**, and **Sentence Transformers**.

The system retrieves relevant documents from a **vector database stored in Azure SQL** and generates context-aware responses using a **large language model (LLM)**. This architecture helps reduce hallucinations and ensures answers are grounded in retrieved knowledge.

---

# Features

- Retrieval-Augmented Generation (RAG) architecture
- FastAPI-based REST API backend
- Semantic search using embeddings
- Vector similarity search using **Azure SQL**
- LLM inference powered by **Groq**
- Lightweight embedding model: **all-MiniLM-L6-v2**
- Dockerized environment for deployment
- Deployable on **Azure Virtual Machine**

---

# Tech Stack

## Backend
- FastAPI
- Uvicorn

## AI / NLP
- Sentence Transformers
- Transformers
- PyTorch

## Machine Learning
- Scikit-learn
- NumPy

## Database
- Azure SQL
- SQLAlchemy
- PyODBC

## LLM Provider
- Groq API
- Model: **llama-3.1-8b-instant**

## Infrastructure
- Azure Virtual Machine
- Docker

---

# Architecture Overview

```
User Query
    │
    ▼
FastAPI API Endpoint
    │
    ▼
Generate Embedding
(all-MiniLM-L6-v2)
    │
    ▼
Vector Similarity Search
(Azure SQL Vector Store)
    │
    ▼
Retrieve Relevant Context
    │
    ▼
LLM Generation
(Llama-3.1-8B via Groq)
    │
    ▼
Final Response
```

---

# Project Structure

# Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/rag-chatbot.git
cd rag-chatbot
```

Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file in the root directory.

```
GROQ_API_KEY=your_groq_api_key

AZURE_SQL_SERVER=your_server
AZURE_SQL_DATABASE=your_database
AZURE_SQL_USERNAME=your_username
AZURE_SQL_PASSWORD=your_password
```

---

# Running the Application

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Server will start at:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```


# Deployment

This project can be deployed on **Azure Virtual Machine**.


# Embedding Model

Embedding model used for semantic search:

```
all-MiniLM-L6-v2
```

Advantages:

- Lightweight
- Fast inference
- Good semantic similarity performance

---

# LLM Model

LLM used for generation:

```
llama-3.1-8b-instant
```

Provider:

```
Groq
```

Advantages:

- Extremely fast inference
- Low latency
- Good reasoning ability for RAG pipelines

---

# Author

**Naveen Chethiya**

Computer Science Undergraduate  
AI / Machine Learning Enthusiast