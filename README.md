# Anantayu Manas Prakriti

Ayurvedic mental constitution assessment platform. Users discover their Manas Prakriti (mental constitution) through a scientifically-backed quiz and receive personalized wellness reports.

## Prerequisites

- **macOS** (tested on macOS Sonoma)
- **Homebrew** — install from https://brew.sh
- **Python 3.11+** — comes with macOS or `brew install python@3.12`
- **Node.js 18+** — `brew install node`
- **PostgreSQL 16** — `brew install postgresql@16`

## Step-by-Step Setup

### 1. Start PostgreSQL

```bash
# Start the PostgreSQL service
brew services start postgresql@16

# Add psql to your PATH (add this to ~/.zshrc for permanence)
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

# Verify it's running
pg_isready
```

### 2. Create the database

```bash
# Create the manas database (use your macOS username as the DB user)
createdb manas

# Verify you can connect
psql manas -c "SELECT 1;"
```

### 3. Set up the backend

```bash
cd backend

# Create virtual environment (skip if .venv already exists)
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Install dependencies
pip install -e ".[dev]"

# Install Razorpay (new dependency)
pip install razorpay
```

### 4. Configure backend environment

```bash
# Create .env file in the backend directory
cat > .env << 'EOF'
DATABASE_URL=postgresql+asyncpg://nikhil@localhost:5432/manas
SECRET_KEY=change-this-to-a-random-string

# LLM Provider: "anthropic" | "gemini" | "openai"
LLM_PROVIDER=anthropic

# API Keys — at minimum, set one of these
ANTHROPIC_API_KEY=your-anthropic-key-here
GEMINI_API_KEY=
OPENAI_API_KEY=

# Razorpay (for premium purchases)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EOF
```

**Where to get API keys:**
- **Anthropic**: https://console.anthropic.com/settings/keys (required for AI insights + premium reports)
- **Razorpay**: https://dashboard.razorpay.com/app/keys (required for payments — use Test Mode keys for development)

### 5. Run database migrations

```bash
cd backend
source .venv/bin/activate

# Seed the questions into the database first
python -c "
import asyncio, json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from app.database import Base
from app.models import Question

async def seed():
    engine = create_async_engine('postgresql+asyncpg://nikhil@localhost:5432/manas')
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as session:
        # Check if questions already exist
        from sqlalchemy import select, func
        count = await session.scalar(select(func.count()).select_from(Question))
        if count and count > 0:
            print(f'Questions already seeded ({count} rows)')
            return
        
        # Load and insert quick questions
        with open('app/data/questions_quick_en.json') as f:
            questions = json.load(f)
        for q in questions:
            session.add(Question(
                id=q['id'], section=q['section'],
                question_number=q['question_number'],
                text_en=q['text_en'], bhava_tag=q['bhava_tag'],
                bhava_description_en=q['bhava_description_en'],
                assessment_type='quick'
            ))
        
        # Load and insert full questions
        with open('app/data/questions_full_en.json') as f:
            questions = json.load(f)
        for q in questions:
            session.add(Question(
                id=q['id'], section=q['section'],
                question_number=q['question_number'],
                text_en=q['text_en'], bhava_tag=q['bhava_tag'],
                bhava_description_en=q['bhava_description_en'],
                assessment_type='full'
            ))
        
        await session.commit()
        print('Seeded questions successfully')

asyncio.run(seed())
"

# Run Alembic migrations
alembic upgrade head
```

### 6. Start the backend server

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

The API will be available at **http://localhost:8001**. Check health: http://localhost:8001/health

### 7. Set up the frontend

```bash
cd frontend

# Install dependencies
npm install
```

### 8. Configure frontend environment

The `.env` file should already exist with:
```
VITE_API_URL=http://localhost:8001
```

If not, create it:
```bash
echo "VITE_API_URL=http://localhost:8001" > .env
```

### 9. Start the frontend dev server

```bash
cd frontend
npm run dev
```

The app will be available at **http://localhost:5173**

## Running Both Servers

Open two terminal tabs:

**Tab 1 — Backend:**
```bash
cd ~/Desktop/Code/manas/backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

**Tab 2 — Frontend:**
```bash
cd ~/Desktop/Code/manas/frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Running Tests

```bash
cd backend
source .venv/bin/activate
python -m pytest tests/ -v
```

## User Flow

1. **Landing page** → Click "Begin Your Journey"
2. **Assessment Intro** → Sign up / login → Fill demographics
3. **Quick Assessment** (25 questions) → Free results with basic AI insight
4. **Results page** → See prakriti type, guna chart, share card
5. **Pricing page** → Pay ₹399 via Razorpay
6. **Deep Assessment** (80 questions) → Premium personality-mirror report

## Project Structure

```
manas/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # FastAPI route handlers
│   │   ├── core/            # Security, exceptions
│   │   ├── data/            # Question JSONs, svabhava profiles
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic (scoring, AI, payments)
│   │   ├── config.py        # Settings from .env
│   │   ├── database.py      # Async SQLAlchemy engine
│   │   └── main.py          # FastAPI app entry point
│   ├── alembic/             # Database migrations
│   ├── tests/               # pytest tests
│   └── pyproject.toml       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page-level components
│   │   ├── stores/          # Zustand state management
│   │   ├── lib/             # API client, constants, utilities
│   │   ├── data/            # Question JSON files
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets, i18n locale files
│   └── package.json         # Node dependencies
├── designs/                 # HTML design mockups
└── docs/                    # Documentation
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, Zustand |
| Backend | Python FastAPI, SQLAlchemy async, Alembic |
| Database | PostgreSQL 16 |
| AI | Anthropic Claude (Haiku for free, Sonnet for premium) |
| Payments | Razorpay |
| Auth | JWT + bcrypt |

## Environment Variables Reference

### Backend (.env in /backend)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SECRET_KEY` | Yes | JWT signing key |
| `LLM_PROVIDER` | No | Default: `anthropic` |
| `ANTHROPIC_API_KEY` | Yes* | For AI insights and premium reports |
| `GEMINI_API_KEY` | No | Fallback LLM provider |
| `OPENAI_API_KEY` | No | Fallback LLM provider |
| `RAZORPAY_KEY_ID` | For payments | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | For payments | From Razorpay dashboard |

*At least one LLM API key is required for AI features.

### Frontend (.env in /frontend)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API URL (default: http://localhost:8001) |

## Troubleshooting

**"connection refused" on backend start:**
PostgreSQL isn't running. Run `brew services start postgresql@16`

**"database manas does not exist":**
Run `createdb manas` (requires psql in PATH)

**"psql: command not found":**
Add PostgreSQL to PATH: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"`

**Frontend can't reach backend:**
Check that `VITE_API_URL` in frontend/.env matches the backend port (8001)

**AI insights not generating:**
Set at least one LLM API key in backend/.env
