# Supabase Integration Guide

To add a backend database and authentication to your Nihongo Master app using Supabase, follow these steps.

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/log in.
2. Click **"New Project"**.
3. Enter your project details and wait for the database to start.

### 2. Get Your API Keys
1. In your Supabase dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Find the **Project URL** and **anon public key**.

### 3. Install the Supabase Client
In your terminal, run:
```bash
npm install @supabase/supabase-js
```

### 4. Configure Environment Variables
Open your `.env.local` file and add the following lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Create the Supabase Client
Create a new file `src/services/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

### 6. Use Supabase in Your App
You can now import `supabase` in any component to fetch data or handle logins.

```typescript
import { supabase } from '../services/supabaseClient';

// Example: Fetch words
const { data, error } = await supabase
  .from('vocabulary')
  .select('*');
```
