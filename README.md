# SousCheff Waitlist Website

A production-ready waitlist website for SousCheff, a food waste tracking mobile app. Built with vanilla HTML, CSS, and JavaScript with Supabase backend.

## 🚀 Quick Start

### 1. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create a table called `signups` with these columns:
   - `id` (int8, primary key)
   - `email` (text, unique)
   - `ref_code` (text, unique)
   - `referred_by` (text, nullable)
   - `referral_count` (int8, default 0)
   - `position` (int8)
   - `created_at` (timestamptz, default now())

3. Create a PostgreSQL function to increment referrals:
```sql
CREATE OR REPLACE FUNCTION increment_referral(ref text)
RETURNS void AS $$
BEGIN
  UPDATE signups
  SET referral_count = referral_count + 1
  WHERE ref_code = ref;
END;
$$ LANGUAGE plpgsql;
```

4. Enable Row Level Security (RLS) and add policies:
```sql
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert
CREATE POLICY "Allow insert" ON signups
FOR INSERT WITH CHECK (true);

-- Allow anyone to read
CREATE POLICY "Allow read" ON signups
FOR SELECT USING (true);
```

### 2. Configure Credentials

Open `js/supabase.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

### 3. Preview the Site

**Option 1: VS Code Live Server**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

**Option 2: Python Simple Server**
```bash
cd "souscheff waitlist"
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
souscheff waitlist/
├── index.html          # Landing page with signup form
├── thanks.html         # Confirmation page with sharing
├── leaderboard.html    # Top referrers leaderboard
├── css/
│   └── style.css       # Custom styles and animations
├── js/
│   ├── supabase.js     # Supabase client configuration
│   ├── main.js         # Signup form logic
│   ├── thanks.js       # Thanks page logic
│   └── leaderboard.js  # Leaderboard logic
└── README.md           # This file
```

## ✨ Features

### Landing Page (`index.html`)
- Hero section with compelling copy
- Email signup form with validation
- Social proof bar
- "How it works" section
- Referral teaser banner
- Mobile-responsive design

### Thanks Page (`thanks.html`)
- Confetti celebration animation
- Position in waitlist display
- Referral stats (count, spots skipped, rank)
- Shareable referral link
- Copy-to-clipboard functionality
- Native share buttons (Twitter, WhatsApp, SMS)
- Incentives for sharing

### Leaderboard Page (`leaderboard.html`)
- Top 10 referrers display
- Gold/silver/bronze styling for top 3
- Masked email addresses for privacy
- Empty state when no referrals exist
- Real-time data from Supabase

## 🎨 Design System

- **Primary Background:** `#14100C` (deep near-black)
- **Accent Color:** `#E85C1A` (bright orange)
- **Secondary Surface:** `#1F1916` (cards/sections)
- **Font:** Inter (Google Fonts)
- **Buttons:** Rounded-full, orange with black text
- **Animations:** Smooth fade-ins, hover effects

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **Tailwind CSS** (via CDN) - Utility-first styling
- **Vanilla JavaScript** - No frameworks
- **Supabase** (via CDN) - Backend database
- **Canvas Confetti** (via CDN) - Celebration animation

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive (375px+)

### Performance
- No build tools required
- CDN-based dependencies
- Total page weight under 200KB
- No images (emoji + CSS only)

## 🧪 Testing the Flow

1. **Sign up** with a test email on `index.html`
2. **Verify** you're redirected to `thanks.html`
3. **Check** your position and referral code
4. **Copy** your referral link
5. **Open** the link in an incognito window
6. **Sign up** with a different email
7. **Check** the leaderboard to see the first referral

## 📝 Notes

- The `position` field in the database should be auto-incremented or calculated based on signup order
- Referral codes are 6 characters (A-Z, 2-9, excluding confusing characters)
- Email validation uses regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- All errors are handled with user-friendly messages

## 🐛 Troubleshooting

**Signup not working:**
- Check Supabase credentials in `js/supabase.js`
- Verify table structure matches requirements
- Check browser console for errors

**Leaderboard not loading:**
- Ensure RLS policies allow read access
- Check that `referral_count` column exists
- Verify Supabase connection

**Confetti not showing:**
- Check that canvas-confetti CDN is loading
- Verify no JavaScript errors in console

## 📄 License

Built for SousCheff - A food waste tracking mobile app.

---

**Made by a high schooler with too much summer time.** 🚀