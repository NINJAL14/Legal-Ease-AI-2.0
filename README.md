🏛️ Legal Ease AI

Making Law Accessible for Everyone

Legal Ease AI is a web application built for Smart India Hackathon 2025 under the theme Smart Automation. It helps people understand complex legal contracts by converting them into plain language summaries, highlighting key clauses, and enabling Q&A with citations — making law affordable and accessible for individuals, startups, and communities.

🚀 Features

📄 Contract Upload – Upload PDF contracts for instant analysis.

📝 Simplified Summary – AI-generated plain-language explanation of legal text.

⚖️ Key Clauses Detection – Highlights risky/legal terms like liability, penalty, termination.

💬 Interactive Chatbot – Ask questions about the contract and get answers with citations.

🌐 Multilingual Support – English, Hindi, Marathi (extensible to more languages).

📑 Downloadable Report – Save contract analysis with flagged risks.

🔒 Disclaimer – Built-in legal disclaimer & lawyer referral for complex queries.

🛠️ How It Works

Upload PDF Contract → Extract text.

Embedding + RAG Pipeline → Convert text into embeddings & retrieve relevant sections.

AI Model (LLM) → Summarize, simplify, and answer queries.

Frontend (React + Tailwind) → Clean, responsive UI with summary, clauses, and chat interface.

Backend (FastAPI / Node.js) → Handles PDF parsing, embeddings, RAG pipeline, and API responses.

Database → Stores user data and embeddings (FAISS/Chroma + PostgreSQL).

💡 Use Cases

🏠 Individuals: Understand contracts before signing.

🚀 Startups & SMEs: Quick contract review without expensive lawyers.

🧑‍⚖️ Lawyers & Paralegals: Automate first-level contract scanning.

🏛️ Government & NGOs: Legal literacy drives & legal aid centers.

🏗️ Tech Stack

Frontend: React, TailwindCSS, shadcn/ui

Backend: FastAPI (Python) / Node.js

AI: LangChain, OpenAI/Hugging Face models

Database: PostgreSQL + FAISS/Chroma (vector DB)

Deployment: Docker, Vercel/Netlify (frontend), AWS/GCP/Render (backend)

📌 Project Status

✅ Prototype ready (PDF upload, summary, key clauses, chatbot) 🚧 Improvements ongoing: UI aesthetics, mobile responsiveness, multilingual extension

⚠️ Disclaimer

This app is for educational and informational purposes only. It does not replace professional legal advice. For complex matters, please consult a licensed lawyer.
