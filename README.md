# Finance Tracker

Mobile-first personal expense tracking web app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run development server:
```bash
npm run dev
```

## Database Setup

Create a table in Supabase:

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Build

```bash
npm run build
```
