# 💸 Dompet — Personal Spending Tracker

Track your daily spending from your phone. Type what you bought, it auto-categorizes using 200+ Indonesian keywords, and everything syncs to Google Sheets.

**No API keys. No backend. Completely free.**

---

## Setup Guide (One-Time, ~10 minutes)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown (top-left) → **New Project**
3. Name it `Dompet` → click **Create**
4. Make sure the new project is selected in the dropdown

#### Enable Google Sheets API

5. Go to **APIs & Services** → **Library** (left sidebar)
6. Search for `Google Sheets API`
7. Click it → click **Enable**

#### Set up OAuth Consent Screen

8. Go to **APIs & Services** → **OAuth consent screen**
9. Select **External** → click **Create**
10. Fill in:
    - App name: `Dompet`
    - User support email: *your email*
    - Developer contact email: *your email*
11. Click **Save and Continue**
12. On **Scopes** page → click **Add or Remove Scopes**
    - Search for `Google Sheets API`
    - Check `.../auth/spreadsheets`
    - Click **Update** → **Save and Continue**
13. On **Test users** page → click **Add Users**
    - Add your Gmail address
    - Click **Save and Continue**
14. Click **Back to Dashboard**

#### Create OAuth Client ID

15. Go to **APIs & Services** → **Credentials**
16. Click **+ Create Credentials** → **OAuth client ID**
17. Application type: **Web application**
18. Name: `Dompet Web`
19. Under **Authorized JavaScript origins**, add:
    - `https://YOUR_USERNAME.github.io`
20. Under **Authorized redirect URIs**, add:
    - `https://YOUR_USERNAME.github.io/dompet/`
21. Click **Create**
22. **Copy the Client ID** (looks like `123456789-xxxx.apps.googleusercontent.com`)

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Step 2: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) → create a **Blank spreadsheet**
2. Name it `Dompet Tracker` (or anything you want)
3. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit
   ```
   Copy only the long string between `/d/` and `/edit`

> Don't worry about headers — the app will auto-create them for you.

---

### Step 3: Deploy to GitHub Pages

1. Go to [GitHub](https://github.com) → click **+** → **New repository**
2. Repository name: `dompet`
3. Set to **Public** (required for free GitHub Pages)
4. Click **Create repository**
5. Upload these 4 files to the repository:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
6. Go to repository **Settings** → **Pages** (left sidebar)
7. Source: **Deploy from a branch**
8. Branch: `main` — folder: `/ (root)`
9. Click **Save**
10. Wait 1-2 minutes, your app will be live at:
    ```
    https://YOUR_USERNAME.github.io/dompet/
    ```

---

### Step 4: Configure the App

1. Open your app URL on your phone
2. Tap **⚙️ Setting** (bottom nav)
3. Paste your **Google Client ID**
4. Paste your **Google Sheet ID**
5. Tap **Simpan Google Settings**
6. Tap **Sign in with Google**
   - A Google popup will appear
   - You'll see "This app isn't verified" → tap **Advanced** → **Go to Dompet (unsafe)**
   - Grant access to Google Sheets
7. Tap **Auto-Setup Headers** to create the Transactions sheet with headers
8. Switch to **✏️ Input** tab — you're ready to go!

---

## Daily Usage

1. Open the app on your phone
2. Type what you bought: `kopi kenangan`
3. Type the amount: `28000`
4. Tap **Tambah Pengeluaran**
5. Category is auto-detected → confirm or tap a different one
6. Tap **Simpan ✓**
7. Done! Check your Google Sheet or the 📊 Dashboard tab

---

## Spending Categories

| Emoji | Category | Examples |
|-------|----------|----------|
| 🍜 | Food & Dining | mie ayam, kopi, makan siang |
| 🛒 | Groceries | indomaret, alfamart, beras |
| 🚗 | Transport | grab, bensin, tol |
| 💊 | Health | obat, apotik, dokter |
| 👕 | Shopping | baju, sepatu, shopee |
| 🎮 | Entertainment | netflix, game, bioskop |
| 🏠 | Home & Utilities | listrik, pdam, wifi |
| 📱 | Tech | gadget, aksesori |
| 📚 | Education | kursus, buku |
| 💰 | Others | anything else |

---

## FAQ

**Q: "This app isn't verified" warning?**
A: Normal for personal apps. Click Advanced → Go to Dompet (unsafe). Only you are a test user, so only you can access it.

**Q: Session expired?**
A: Google access tokens last 1 hour. Go to Settings → Sign in again.

**Q: Can others access my data?**
A: No. Your config is stored in your browser's localStorage. The Google Sheet is in your own Google account.

**Q: What if a keyword isn't recognized?**
A: It defaults to "Others". You can always tap a different category before saving. To add new keywords, edit the `KEYWORD_MAP` object in `app.js`.

---

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (no framework, no build step)
- **Auth**: Google Identity Services (OAuth 2.0)
- **Storage**: Google Sheets API v4
- **Categorization**: Keyword matching (200+ Indonesian terms, no API needed)
- **Hosting**: GitHub Pages (free)
- **Charts**: Chart.js 4
