# LearnDebt AI • Learning Debt Detection Platform
### MISSION-07 · Software · Education
> **Tagline**: "Detect Early. Learn Stronger."  
> **Secondary Tagline**: "Find Learning Gaps. Build Stronger Foundations."

---

## 🌟 Overview
**LearnDebt AI** is a complete, production-quality EdTech SaaS platform designed to detect hidden conceptual learning debt in students that remains invisible in standard exam marks alone.

---

## 🚀 Key Features & Flow Architecture
- **Multi-Role Portals**: Student, Teacher, Parent, and Admin dashboards with instant 1-click Demo buttons.
- **Interactive Concept Graph**: Built using `React Flow` to map prerequisite dependencies (`SQL -> JOIN -> Functional Dependency -> Candidate Key -> Normalization -> 1NF/2NF/3NF`).
- **Flagship Learning Debt Waterfall**: Tracks Net Debt (+8 accumulated, -12 resolved) across Foundational, Concept, Practice, and Prerequisite debt categories.
- **AI Gap Detection**: Analyzes student performance vectors to identify root causes and cascading prerequisite failures.
- **Diagnostic Quiz Runner**: Interactive quiz runner with timer, question counter, immediate scoring, and before/after Learning Debt reduction calculations.
- **LearnDebt AI Assistant**: Floating bottom-right chat drawer providing real-time AI study help and custom prompt generation.
- **Developer AI Test Console**: Dedicated diagnostic page at `/admin/ai-test` for testing backend endpoints and latency without exposing secret keys.

---

## 🔒 Security Architecture (Google Gemini Integration)

### **Zero Client Key Exposure Guarantee**
- The `GEMINI_API_KEY` is **NEVER** hardcoded in frontend React code, JavaScript, HTML, public assets, or git commits.
- No `VITE_` prefixed secret variables are used.
- The API key is stored **ONLY** in `.env` on the server and accessed exclusively via Node.js server middleware (`/api/ai/*`).
- All requests flow securely through:  
  `Client Browser (React)` ➔ `Backend Server Proxy (/api/ai/*)` ➔ `Google Gemini REST API`.

---

## 🛠️ Environment Setup & Configuration

### 1. Create your `.env` file
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Configure environment variables in `.env`
```env
# Google Gemini API Key (Obtain from Google AI Studio: https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Configurable Gemini Model (Default: gemini-3.7-flash)
GEMINI_MODEL=gemini-3.7-flash
```

> ⚠️ **Note**: Never commit `.env` to source control. `.env` is listed in `.gitignore`.

---

## 🏃 Running the Application

### Development Mode (with Server Proxy & Vite Hot Reload)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Standalone Node Server (Optional)
```bash
node server.js
```
Runs the backend API on [http://localhost:3001](http://localhost:3001).

---

## 🤖 Testing Google Gemini AI Integration

1. Log in as an **Administrator** or click **Admin Demo** on `/login`.
2. Navigate to **AI Diagnostic Test** in the left sidebar (`/admin/ai-test`).
3. View real-time connection status, active model name (`gemini-3.7-flash`), latency in milliseconds, and test buttons:
   - **`[Generate Test Question]`** — POST `/api/ai/generate-quiz`
   - **`[Analyze Learning Gap]`** — POST `/api/ai/analyze-learning-gap`
   - **`[Generate Study Path]`** — POST `/api/ai/create-learning-path`
   - **`[Chat Test]`** — POST `/api/ai/chat`

---

## 🛡️ Smart Fallback Mode (Hackathon Guarantee)
If `GEMINI_API_KEY` is omitted, invalid (401/403), or rate-limited (429), **LearnDebt AI automatically activates local smart fallback mode**. The application, dashboards, diagnostic quizzes, learning debt calculations, and UI will continue working 100% reliably for live hackathon demonstrations without crashing!

---

## ⚙️ Changing AI Models
To switch the Gemini model, simply update `GEMINI_MODEL` in `.env`:
```env
GEMINI_MODEL=gemini-2.5-flash
```
No frontend rebuild is required; the server proxy automatically applies the new model!
