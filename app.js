/* ============================================
   WALLET TRACKER v1.7
   FIX: Switched from ES module imports to
   Firebase Compat SDK (window.firebase).
   All functions now live on window scope
   so onclick="" attributes work correctly.
   ============================================ */

// ── Firebase init (compat SDK, already loaded via <script> tags) ──
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAfliZxi3RnP1Iv9ccuHYStqPYPyTbny4k",
  authDomain:        "wallet-tracker-46f81.firebaseapp.com",
  projectId:         "wallet-tracker-46f81",
  storageBucket:     "wallet-tracker-46f81.firebasestorage.app",
  messagingSenderId: "8284017349",
  appId:             "1:8284017349:web:767fce55c4009e18dbd6ac",
};

firebase.initializeApp(FIREBASE_CONFIG);
const firebaseAuth   = firebase.auth();
const firebaseDB     = firebase.firestore(); // Firestore for per-user Sheet ID storage
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Set persistence to LOCAL — user stays logged in across sessions/restarts
// Firebase default is already LOCAL but we set it explicitly to be safe
firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => {
  console.warn('setPersistence failed:', e);
});

// ── Categories ──
const CATEGORIES = [
  { name: 'Food & Dining',    emoji: '🍜', color: '#f97316' },
  { name: 'Groceries',        emoji: '🛒', color: '#22c55e' },
  { name: 'Transport',        emoji: '🚗', color: '#3b82f6' },
  { name: 'Health',           emoji: '💊', color: '#ef4444' },
  { name: 'Shopping',         emoji: '👕', color: '#a855f7' },
  { name: 'Entertainment',    emoji: '🎮', color: '#ec4899' },
  { name: 'Home & Utilities', emoji: '🏠', color: '#14b8a6' },
  { name: 'Tech',             emoji: '📱', color: '#6366f1' },
  { name: 'Education',        emoji: '📚', color: '#eab308' },
  { name: 'Others',           emoji: '💰', color: '#94a3b8' },
];

const MONTH_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

const KEYWORD_MAP = {
  'Food & Dining': [
    'makan','mie','nasi','ayam','bakso','sate','soto','rendang','gado','pecel',
    'warteg','restoran','resto','cafe','kopi','coffee','starbucks','mcd','mcdonald',
    'kfc','burger','pizza','roti','es teh','es jeruk','jus','boba','chatime',
    'janji jiwa','kenangan','fore','tuku','latte','cappuccino','americano',
    'indomie','gorengan','martabak','siomay','batagor','pempek','geprek',
    'lalapan','padang','sushi','ramen','dim sum','shabu','hotpot',
    'makan siang','makan malam','sarapan','breakfast','lunch','dinner',
    'snack','jajan','cemilan','dessert','kue','donat','nasi goreng',
    'nasi padang','nasi uduk','bubur','sop','ikan','seafood','bebek',
    'tahu','tempe','mie ayam','mie goreng','mie rebus','bakmi','kwetiau','bihun',
    'ricebowl','rice bowl','salad','sandwich','wrap','kebab','shawarma',
    'food court','food','minum','minuman','drink','thai tea','matcha',
    'smoothie','milkshake','es krim','ice cream','coklat','chocolate',
    'pancake','waffle','croissant','pastry','bakery','breadtalk','jco',
    'kopitiam','kedai','angkringan','hokben','yoshinoya','marugame','solaria',
    'cendol','tteokbokki','ramyeon','tom yum','pho','banh mi','tempura','katsu',
  ],
  'Groceries': [
    'indomaret','alfamart','alfamidi','supermarket','superindo','hypermart',
    'giant','lottemart','carrefour','ranch market','hero',
    'beras','telur','minyak goreng','gula','garam','sayur','buah','daging',
    'susu','roti tawar','sabun','sampo','shampoo','tissue','odol','pasta gigi',
    'detergen','deterjen','grocery','belanja bulanan','sembako','tepung',
    'mentega','margarin','keju','yogurt','sosis','nugget','frozen',
    'bumbu','kecap','saos','saus','cabai','tomat','kentang','wortel',
    'kangkung','bayam','brokoli','jamur','jagung','timun','santan','madu',
    'snack anak','pampers','popok','susu formula','kapas','cotton bud',
    'pel','ember','trash bag','plastik','tisu basah','hand soap','body wash',
    'conditioner','lotion','sunscreen','deodorant',
  ],
  'Transport': [
    'grab','gojek','gocar','goride','grabcar','grabbike','uber','taxi','taksi',
    'bensin','pertamax','pertalite','solar','shell','pertamina',
    'tol','parkir','toll','angkot','bus','transjakarta','busway',
    'mrt','lrt','krl','commuter','kereta','train','ojek','ojol','maxim',
    'pesawat','flight','tiket pesawat','travel','shuttle','damri','bluebird',
    'transport','transportasi','ganti oli','oli','servis motor','servis mobil',
    'cuci motor','cuci mobil','ban','e-toll','etoll','indriver','indrive',
  ],
  'Health': [
    'obat','apotek','apotik','farmasi','pharmacy','dokter','doctor',
    'klinik','clinic','rumah sakit','rs','hospital','vitamin','supplement','suplemen',
    'lab','laboratorium','check up','checkup','vaksin','vaccine','gigi','dentist',
    'optik','terapi','therapy','psikolog','psikiater','bpjs','asuransi kesehatan',
    'masker medis','hand sanitizer','antiseptik','perban','plester','paracetamol',
    'ibuprofen','antibiotik','salep','herbal','jamu','tolak angin','betadine','koyo',
  ],
  'Shopping': [
    'baju','celana','sepatu','sandal','tas','jaket','hoodie','kaos',
    'kemeja','dress','rok','jeans','sneakers','boots',
    'uniqlo','h&m','zara','cotton on','eiger','shopee','tokopedia','lazada',
    'blibli','tiktok shop','bukalapak','fashion','pakaian','aksesoris',
    'jam tangan','gelang','kalung','anting','parfum','perfume','skincare','makeup',
    'kosmetik','serum','toner','moisturizer','lipstik','mascara',
    'dompet','wallet','belt','topi','syal','kaus kaki','underwear',
    'oleh oleh','souvenir','kado','hadiah','perhiasan','jewelry','mall','outlet',
  ],
  'Entertainment': [
    'netflix','spotify','disney','youtube premium','hbo','prime video',
    'apple music','joox','vidio','viu','wetv','bioskop','cinema','xxi','cgv',
    'game','steam','playstation','ps5','xbox','mobile legend','ml','pubg',
    'free fire','genshin','valorant','minecraft','konser','concert','festival',
    'karaoke','bowling','billiard','arcade','timezone','nonton','film','movie',
    'series','drakor','anime','museum','waterpark','ancol','dufan',
    'escape room','gym','fitness','yoga','pilates','renang','badminton','futsal',
    'bar','club','lounge','rooftop','hangout','nongkrong','board game',
    'hotel','resort','villa','airbnb','traveloka','tiket.com','agoda','liburan',
  ],
  'Home & Utilities': [
    'listrik','pln','token listrik','pdam','air','iuran air',
    'wifi','internet','indihome','biznet','firstmedia','myrepublic','telkom',
    'gas','lpg','elpiji','tabung gas','bright gas',
    'sewa','kost','kos','kontrakan','kontrak','apartment','apartemen',
    'ipl','maintenance','iuran','rt','rw','sampah','laundry','dry clean',
    'cuci baju','renovasi','tukang','plumber','furniture','ikea','informa',
    'cat','lampu','kasur','bantal','sprei','handuk','gorden','karpet',
    'kompor','kulkas','mesin cuci','ac','rice cooker','dispenser','microwave',
    'panci','wajan','piring','gelas','tupperware','kpr','mortgage',
  ],
  'Tech': [
    'laptop','komputer','computer','pc','macbook','thinkpad',
    'handphone','hp','smartphone','iphone','samsung','xiaomi','oppo',
    'vivo','realme','poco','asus','lenovo','gadget','elektronik','charger','kabel',
    'earphone','headphone','headset','earbuds','airpods','speaker','bluetooth',
    'mouse','keyboard','monitor','printer','scanner','ssd','ram','flashdisk',
    'power bank','powerbank','screen protector','tempered glass','tripod',
    'tablet','ipad','smartwatch','router','modem','kamera','camera','lensa',
    'software','subscription','langganan','domain','hosting','icloud','google one',
    'ganti lcd','service hp','service laptop','pulsa','paket data','kuota',
  ],
  'Education': [
    'kursus','course','les','private','bimbel','bimbingan belajar',
    'buku','book','ebook','novel','komik','majalah','udemy','coursera',
    'skillshare','ruangguru','zenius','seminar','webinar','workshop','training',
    'pelatihan','bootcamp','sertifikasi','certification','ujian','test','sekolah',
    'school','kuliah','university','spp','uang kuliah','skripsi','thesis',
    'print','fotokopi','alat tulis','stationery','pensil','pulpen','binder',
    'notebook','buku tulis','stabilo','spidol','kalkulator','tutor','mentor',
  ],
};

function categorize(desc) {
  const input = desc.toLowerCase().trim();
  let best = null, bestLen = 0;
  for (const [cat, kws] of Object.entries(KEYWORD_MAP)) {
    for (const kw of kws) {
      if (input.includes(kw) && kw.length > bestLen) { best = cat; bestLen = kw.length; }
    }
  }
  return best || 'Others';
}

// ── Config ──
const Config = {
  get(k)         { return localStorage.getItem('wt_' + k) || ''; },
  set(k, v)      { localStorage.setItem('wt_' + k, v); },
  get sheetId()  { return this.get('sheetId'); },
  get clientId() { return this.get('clientId'); },
};

// ── Budget ──
const Budget = {
  getAll() { try { return JSON.parse(localStorage.getItem('wt_budgets') || '{}'); } catch { return {}; } },
  get(cat) { return parseInt(this.getAll()[cat] || '0', 10); },
  saveAll(obj) { localStorage.setItem('wt_budgets', JSON.stringify(obj)); },
};

// ── Offline Queue ──
const Queue = {
  getAll() { try { return JSON.parse(localStorage.getItem('wt_queue') || '[]'); } catch { return []; } },
  add(item) {
    const q = this.getAll(); q.push({ ...item, _qid: Date.now() });
    localStorage.setItem('wt_queue', JSON.stringify(q)); updateQueueUI();
  },
  remove(qid) {
    const q = this.getAll().filter(i => i._qid !== qid);
    localStorage.setItem('wt_queue', JSON.stringify(q)); updateQueueUI();
  },
  count() { return this.getAll().length; },
};

// ── Pattern / Suggestion Engine ──
const Patterns = {
  _key: 'wt_patterns',
  getAll() { try { return JSON.parse(localStorage.getItem(this._key) || '{}'); } catch { return {}; } },
  saveAll(p) { localStorage.setItem(this._key, JSON.stringify(p)); },
  normalize(desc) {
    return desc.toLowerCase().replace(/[0-9]/g, '').replace(/\s+/g, ' ').trim();
  },
  record(desc, amount, category) {
    const key = this.normalize(desc);
    if (!key) return;
    const all = this.getAll();
    if (!all[key]) all[key] = { amounts: [], category };
    all[key].amounts.push(amount);
    if (all[key].amounts.length > 20) all[key].amounts = all[key].amounts.slice(-20);
    all[key].category = category;
    this.saveAll(all);
  },
  suggest(desc) {
    if (!desc || desc.length < 3) return null;
    const key = this.normalize(desc);
    const all = this.getAll();
    if (all[key] && all[key].amounts.length >= 3) return this._build(key, all[key]);
    const inputWords = key.split(' ').filter(w => w.length > 2);
    if (!inputWords.length) return null;
    let bestMatch = null, bestScore = 0;
    for (const [pk, pv] of Object.entries(all)) {
      if (pv.amounts.length < 3) continue;
      const pkWords = pk.split(' ').filter(w => w.length > 2);
      const overlap = inputWords.filter(w => pkWords.some(pw => pw.includes(w) || w.includes(pw))).length;
      const score = overlap / Math.max(inputWords.length, pkWords.length);
      if (score >= 0.5 && score > bestScore) { bestScore = score; bestMatch = { key: pk, ...pv }; }
    }
    return bestMatch ? this._build(bestMatch.key, bestMatch) : null;
  },
  _build(key, data) {
    const freq = {};
    data.amounts.forEach(a => { freq[a] = (freq[a] || 0) + 1; });
    const modeAmount = parseInt(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0], 10);
    return { suggestedAmount: modeAmount, count: data.amounts.length, category: data.category };
  },
};

// ── State ──
let currentUser       = null;
let accessToken       = null;
let sheetsTokenClient = null;
let allTransactions   = [];
let recentItems       = [];
let dashboardMonth    = new Date();
let pieChart          = null;
let barChart          = null;
let editTarget        = null;
let deleteTarget      = null;
let useCustomDate     = false;
let activeFilterCat   = 'all';
let activeSort        = 'date-desc'; // date-desc | date-asc | amount-desc | amount-asc
let isOnline          = navigator.onLine;
let currentSuggestion = null;
let notifTimers       = [];

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme immediately
  const savedDark = Config.get('darkMode');
  applyDarkMode(savedDark !== 'false'); // default dark

  updateQueueUI();
  renderTemplates();
  renderTemplateManageList();

  window.addEventListener('online',  () => { isOnline = true;  onOnline(); });
  window.addEventListener('offline', () => { isOnline = false; onOffline(); });
  if (!navigator.onLine) onOffline();

  // Dismiss user menu on outside click
  document.addEventListener('click', e => {
    const menu   = document.getElementById('user-menu');
    const avatar = document.getElementById('user-avatar');
    if (menu && avatar && !menu.contains(e.target) && !avatar.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });

  // Show loading overlay while Firebase resolves auth state
  // This prevents the login screen flashing before persisted session loads
  showLoadingScreen();

  // Firebase auth state — single source of truth
  // onAuthStateChanged fires once immediately with persisted user (if any)
  firebaseAuth.onAuthStateChanged(user => {
    hideLoadingScreen();
    if (user) {
      currentUser = user;
      showApp(user);
    } else {
      currentUser = null;
      showAuthScreen();
    }
  });
});

// Called after showApp — set up app-specific listeners once the DOM is visible
function initAppListeners() {
  const amtInput = document.getElementById('input-amount');
  if (amtInput && !amtInput._listenerAttached) {
    amtInput._listenerAttached = true;
    amtInput.addEventListener('input', () => {
      let raw = amtInput.value.replace(/\D/g, '');
      if (raw) amtInput.value = Number(raw).toLocaleString('id-ID');
    });
    amtInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
  }
  const editAmt = document.getElementById('edit-amount');
  if (editAmt && !editAmt._listenerAttached) {
    editAmt._listenerAttached = true;
    editAmt.addEventListener('input', () => {
      let raw = editAmt.value.replace(/\D/g, '');
      if (raw) editAmt.value = Number(raw).toLocaleString('id-ID');
    });
  }
  const inputDate = document.getElementById('input-date');
  if (inputDate) inputDate.value = todayISO();

  loadSettingsUI();
  renderBudgetInputs();
  loadNotifSettings();
}

// ══════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════

function showLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.classList.remove('hidden');
}

function hideLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.classList.add('hidden');
}

function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
}

async function showApp(user) {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  initAppListeners();
  renderUserAvatar(user);
  document.getElementById('user-email-display').textContent = user.email || 'Signed in';

  // Reset Sheets auth state for this user
  accessToken        = null;
  sheetsTokenExpiry  = 0;
  sheetsTokenClient  = null;
  sheetsTokenPending = false;
  sheetsTokenWaiters.forEach(w => w.reject(new Error('User changed')));
  sheetsTokenWaiters = [];

  // Init Sheets OAuth client with this user's email hint
  if (Config.clientId) {
    const hint = user.email || '';
    Config.set('sheetsHint', hint);
    initSheetsClient(hint);
  }

  // Load or create this user's Google Sheet automatically
  await setupUserSheet(user);

  renderTemplates();
  renderTemplateManageList();
  // Start tutorial for new users
  setTimeout(() => startTutorial(false), 600);
  loadTodayRecent();
}

function renderUserAvatar(user) {
  const el = document.getElementById('user-avatar');
  if (!el) return;
  if (user.photoURL) {
    el.innerHTML = `<img src="${user.photoURL}" style="width:32px;height:32px;border-radius:50%;object-fit:cover" referrerpolicy="no-referrer">`;
  } else {
    el.textContent = (user.email || 'U').charAt(0).toUpperCase();
  }
}

function showAuthTab(tab) {
  document.getElementById('auth-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('auth-signup').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('tab-login-btn').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup-btn').classList.toggle('active', tab === 'signup');
  // Clear errors on tab switch
  document.getElementById('auth-error-login').classList.add('hidden');
  document.getElementById('auth-error-signup').classList.add('hidden');
}

async function signInEmail() {
  const email  = document.getElementById('login-email').value.trim();
  const pass   = document.getElementById('login-password').value;
  const text   = document.getElementById('login-text');
  const loader = document.getElementById('login-loader');

  if (!email || !pass) { showAuthError('login', 'Please fill in all fields'); return; }

  text.classList.add('hidden'); loader.classList.remove('hidden');
  try {
    await firebaseAuth.signInWithEmailAndPassword(email, pass);
    // onAuthStateChanged will fire and call showApp
  } catch (e) {
    showAuthError('login', friendlyAuthError(e.code));
  } finally {
    text.classList.remove('hidden'); loader.classList.add('hidden');
  }
}

async function forgotPassword() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    showAuthError('login', 'Enter your email address first, then tap Forgot Password.');
    document.getElementById('login-email').focus();
    return;
  }
  const btn = document.getElementById('forgot-btn');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  try {
    await firebaseAuth.sendPasswordResetEmail(email);
    showAuthError('login', '✓ Reset link sent to ' + email + '. Check your inbox (and spam folder).');
    document.getElementById('auth-error-login').style.background = 'rgba(0,186,124,0.1)';
    document.getElementById('auth-error-login').style.color = 'var(--success)';
    document.getElementById('auth-error-login').style.borderColor = 'rgba(0,186,124,0.3)';
  } catch (e) {
    showAuthError('login', friendlyAuthError(e.code));
  } finally {
    if (btn) { btn.textContent = 'Forgot password?'; btn.disabled = false; }
  }
}

async function signUpEmail() {
  const email   = document.getElementById('signup-email').value.trim();
  const pass    = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const text    = document.getElementById('signup-text');
  const loader  = document.getElementById('signup-loader');

  if (!email || !pass)     { showAuthError('signup', 'Please fill in all fields'); return; }
  if (pass !== confirm)    { showAuthError('signup', 'Passwords do not match'); return; }
  if (pass.length < 6)     { showAuthError('signup', 'Password must be at least 6 characters'); return; }

  text.classList.add('hidden'); loader.classList.remove('hidden');
  try {
    await firebaseAuth.createUserWithEmailAndPassword(email, pass);
    // onAuthStateChanged will fire and call showApp
  } catch (e) {
    showAuthError('signup', friendlyAuthError(e.code));
  } finally {
    text.classList.remove('hidden'); loader.classList.add('hidden');
  }
}

// Google sign-in — popup on desktop, clear message on mobile
function signInGoogle() {
  clearAuthErrors();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    showAuthError('login',
      'Google sign-in on mobile needs popups enabled. Tap ⋮ → Site settings → Popups → Allow, then try again. Or use email/password — works perfectly on mobile.');
    return;
  }
  document.querySelectorAll('.auth-btn-google').forEach(btn => {
    btn.disabled = true; btn.style.opacity = '0.6';
  });
  firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => { /* onAuthStateChanged fires → showApp */ })
    .catch(e => {
      document.querySelectorAll('.auth-btn-google').forEach(btn => {
        btn.disabled = false; btn.style.opacity = '';
      });
      if (e.code !== 'auth/popup-closed-by-user') {
        showAuthError('login', friendlyAuthError(e.code));
      }
    });
}

function clearAuthErrors() {
  const el1 = document.getElementById('auth-error-login');
  const el2 = document.getElementById('auth-error-signup');
  if (el1) el1.classList.add('hidden');
  if (el2) el2.classList.add('hidden');
}


async function handleSignOut() {
  document.getElementById('user-menu').classList.add('hidden');
  // Clear all Sheets auth state — next user gets a completely fresh token
  accessToken       = null;
  sheetsTokenExpiry = 0;
  sheetsTokenClient = null; // force re-init with new user's hint
  sheetsTokenPending = false;
  sheetsTokenWaiters.forEach(w => w.reject(new Error('Signed out')));
  sheetsTokenWaiters = [];
  Config.set('sheetsHint', '');
  await firebaseAuth.signOut();
  allTransactions = []; recentItems = [];
}

function toggleUserMenu() {
  document.getElementById('user-menu').classList.toggle('hidden');
}

function showAuthError(form, msg) {
  const el = document.getElementById('auth-error-' + form);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found':        'No account with this email. Sign up instead.',
    'auth/wrong-password':        'Incorrect password',
    'auth/invalid-credential':    'Email or password is incorrect',
    'auth/email-already-in-use':  'Email already registered. Sign in instead.',
    'auth/invalid-email':         'Invalid email address',
    'auth/weak-password':         'Password is too weak (min 6 characters)',
    'auth/popup-closed-by-user':  'Sign-in popup closed. Try again.',
    'auth/network-request-failed':'Network error. Check your connection.',
    'auth/too-many-requests':     'Too many attempts. Try again later.',
  };
  return map[code] || ('Error: ' + (code || 'Unknown error'));
}


// ══════════════════════════════════════════════
// AUTO SHEET SETUP (Option 2 — per-user Sheet)
// Flow:
//   1. Check Firestore for this user's Sheet ID
//   2. If found → use it (returning user)
//   3. If not found → create new Sheet in their Drive → save to Firestore
// ══════════════════════════════════════════════

async function setupUserSheet(user) {
  if (!user) return;

  updateSheetStatus('connecting');

  // ── Priority 1: localStorage already has Sheet ID ──────────────────────────
  // This covers: existing users who already set up their Sheet manually,
  // AND users who already went through the auto-setup before.
  // Always trust localStorage first — it's the fastest and most reliable path.
  const localSheetId = Config.get('sheetId');
  if (localSheetId) {
    updateSheetStatus('connected');
    // Best-effort: try to also save to Firestore in background (non-blocking)
    // If Firestore rules aren't set up yet, this fails silently — app still works
    firebaseDB.collection('users').doc(user.uid).get().then(snap => {
      if (!snap.exists || !snap.data().sheetId) {
        firebaseDB.collection('users').doc(user.uid).set({
          sheetId:    localSheetId,
          email:      user.email || '',
          migratedAt: new Date().toISOString(),
        }).catch(e => console.warn('Firestore sync skipped (rules not set):', e.code));
      }
    }).catch(e => console.warn('Firestore read skipped:', e.code));
    return;
  }

  // ── Priority 2: Check Firestore for Sheet ID (linked on another device) ────
  try {
    const docSnap = await firebaseDB.collection('users').doc(user.uid).get();
    if (docSnap.exists && docSnap.data().sheetId) {
      const sheetId = docSnap.data().sheetId;
      Config.set('sheetId', sheetId);
      updateSheetStatus('connected');
      return;
    }
  } catch (e) {
    // Firestore not configured or rules not set — skip silently
    console.warn('Firestore check skipped:', e.code || e.message);
  }

  // ── Priority 3: Try to auto-create Sheet via Google Drive API ───────────────
  // Only works if user has Google OAuth connected (Client ID set in Settings)
  if (!Config.clientId) {
    // No Client ID — guide user to enter Sheet ID manually
    updateSheetStatus('needs_setup');
    showToast('Add your Sheet ID in Settings to get started', 'info');
    return;
  }

  updateSheetStatus('creating');

  try {
    const token = await ensureToken();

    // Create Sheet in user's Google Drive
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     'Wallet Tracker — ' + (user.email || user.uid),
        mimeType: 'application/vnd.google-apps.spreadsheet',
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Drive API error ' + createRes.status);
    }

    const file    = await createRes.json();
    const sheetId = file.id;

    // Write headers
    await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId +
      '/values/Sheet1!A1:G1?valueInputOption=USER_ENTERED',
      {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [['Timestamp','Description','Amount','Category','Month','Week','Notes']],
        }),
      }
    );

    // Rename tab to Transactions
    const meta  = await (await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + sheetId,
      { headers: { 'Authorization': 'Bearer ' + token } })).json();
    const tabId = meta.sheets?.[0]?.properties?.sheetId;
    if (tabId !== undefined) {
      await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + ':batchUpdate', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ updateSheetProperties: {
          properties: { sheetId: tabId, title: 'Transactions' }, fields: 'title',
        }}]}),
      });
    }

    // Save to localStorage immediately
    Config.set('sheetId', sheetId);
    updateSheetStatus('connected');
    showToast('✓ Your personal Sheet has been created in Google Drive!', 'success');

    // Best-effort Firestore save (non-blocking)
    firebaseDB.collection('users').doc(user.uid).set({
      sheetId, email: user.email || '', createdAt: new Date().toISOString(),
    }).catch(e => console.warn('Firestore save skipped:', e.code));

  } catch (e) {
    console.error('Auto Sheet creation failed:', e.message);
    // Graceful fallback — don't block the app, just guide the user
    updateSheetStatus('needs_setup');
    showToast('Could not auto-create Sheet. Please add Sheet ID in Settings.', 'info');
  }
}

function updateSheetStatus(status) {
  const el = document.getElementById('sheet-status');
  if (!el) return;
  const states = {
    connecting:  { text: '⟳ Connecting...', cls: 'sheet-status-connecting' },
    creating:    { text: '⟳ Setting up your Sheet...', cls: 'sheet-status-connecting' },
    connected:   { text: '', cls: '' },
    needs_setup: { text: '⚠ Connect Google in Settings', cls: 'sheet-status-warn' },
    error:       { text: '✗ Sheet error — check Settings', cls: 'sheet-status-error' },
  };
  const st = states[status] || states.error;
  el.textContent  = st.text;
  el.className    = 'sheet-status ' + st.cls;
  el.style.display = st.text ? '' : 'none';
}

// ── Google Sheets OAuth ──────────────────────────────────────────────────────
//
// STRATEGY: Lazy + on-demand token fetch, NEVER on page load.
//
// Why previous approach caused popups:
//   requestAccessToken() called immediately on every showApp() →
//   GIS library sometimes shows consent UI even with prompt:''
//   because it can't always silently resolve the session on mobile.
//
// New approach:
//   1. On showApp(), only INITIALISE the token client (no request yet)
//   2. First Sheets API call triggers ensureSheetsToken() which requests
//      the token lazily using prompt:'' — by this time the page is fully
//      loaded and GIS can resolve silently from cached consent
//   3. Token is cached + auto-refreshed in background before expiry
//   4. If silent fetch fails → Sheets features degrade gracefully,
//      no popup is ever shown to the user

let sheetsTokenExpiry  = 0;
let sheetsTokenPending = false;          // true while a token request is in flight
let sheetsTokenWaiters = [];             // callbacks queued while token is being fetched

function initSheetsClient(emailHint) {
  // Just initialise the client object — do NOT request a token yet
  if (!Config.clientId) return;
  if (typeof google === 'undefined' || !google.accounts) {
    setTimeout(() => initSheetsClient(emailHint), 600);
    return;
  }
  if (sheetsTokenClient) return; // already initialised
  sheetsTokenClient = google.accounts.oauth2.initTokenClient({
    client_id:      Config.clientId,
    scope:          'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
    callback:       onSheetsToken,
    error_callback: onSheetsTokenError,
  });
  // Store hint for later use
  Config.set('sheetsHint', emailHint || Config.get('userEmail') || '');
}

function ensureSheetsToken() {
  // Returns a Promise that resolves when we have a valid accessToken.
  // Waits for GIS library + token client to be ready before requesting.
  return new Promise((resolve, reject) => {
    // Already have a valid non-expired token — resolve immediately
    if (accessToken && Date.now() < sheetsTokenExpiry) {
      resolve(accessToken);
      return;
    }

    // No Client ID in settings at all — real config error
    if (!Config.clientId) {
      reject(new Error('Add Google Client ID in Settings first.'));
      return;
    }

    // No Sheet ID — real config error
    if (!Config.sheetId) {
      reject(new Error('Add Google Sheet ID in Settings first.'));
      return;
    }

    // Queue this waiter — will be resolved when token arrives
    sheetsTokenWaiters.push({ resolve, reject });

    // Only fire one request even if multiple callers are waiting
    if (sheetsTokenPending) return;

    // If token client not ready yet (GIS still loading), wait and retry
    if (!sheetsTokenClient) {
      const waitForClient = (attempts) => {
        if (sheetsTokenClient) {
          // Client ready — fire the queued request
          requestSheetsTokenSilent();
        } else if (attempts < 20) {
          setTimeout(() => waitForClient(attempts + 1), 300);
        } else {
          // GIS never loaded (network issue, ad blocker, etc.)
          sheetsTokenPending = false;
          const waiters = sheetsTokenWaiters.splice(0);
          waiters.forEach(w => w.reject(new Error('Google auth library failed to load. Check your connection.')));
        }
      };
      waitForClient(0);
      return;
    }

    requestSheetsTokenSilent();
  });
}

function requestSheetsTokenSilent() {
  sheetsTokenPending = true;
  sheetsTokenClient.requestAccessToken({
    prompt:     '',   // silent — no popup, no UI ever shown
    login_hint: Config.get('sheetsHint') || '',
  });
}

function onSheetsToken(resp) {
  sheetsTokenPending = false;
  if (resp.error) {
    onSheetsTokenError(resp);
    return;
  }
  accessToken      = resp.access_token;
  const expiresIn  = (resp.expires_in || 3600);
  sheetsTokenExpiry = Date.now() + (expiresIn - 300) * 1000; // refresh 5min early

  document.getElementById('sync-indicator')?.classList.add('hidden');

  // Resolve all queued waiters
  const waiters = sheetsTokenWaiters.splice(0);
  waiters.forEach(w => w.resolve(accessToken));

  // Auto-refresh before expiry (background, no UI)
  setTimeout(() => {
    accessToken = null; // clear so next call triggers refresh
    sheetsTokenExpiry = 0;
    if (currentUser && sheetsTokenClient) {
      sheetsTokenPending = true;
      sheetsTokenClient.requestAccessToken({
        prompt:     '',
        login_hint: Config.get('sheetsHint') || '',
      });
    }
  }, (expiresIn - 300) * 1000);

  // Sync any queued offline transactions
  if (Queue.count() > 0) syncQueue();
}

function onSheetsTokenError(err) {
  sheetsTokenPending = false;
  console.warn('Sheets token silent fetch failed (no popup shown):', err);
  // Reject all waiters gracefully — Sheets calls will fail with a clear message
  const waiters = sheetsTokenWaiters.splice(0);
  waiters.forEach(w => w.reject(new Error('Google Sheets authentication failed. Check Client ID in Settings.')));
}

// Legacy alias — called from saveGoogleSettings
function initSheetsAuth(emailHint) {
  Config.set('sheetsHint', emailHint || '');
  initSheetsClient(emailHint);
}

// ══════════════════════════════════════════════
// DARK MODE
// ══════════════════════════════════════════════

function toggleDark() {
  const isDark = !document.body.classList.contains('dark');
  applyDarkMode(isDark);
  Config.set('darkMode', isDark ? 'true' : 'false');
}

function applyDarkMode(isDark) {
  document.body.classList.toggle('dark', isDark);
  const moon = document.getElementById('icon-moon');
  const sun  = document.getElementById('icon-sun');
  if (moon) moon.style.display = isDark ? 'none' : '';
  if (sun)  sun.style.display  = isDark ? '' : 'none';
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) toggle.checked = isDark;
}

// ══════════════════════════════════════════════
// ONLINE / OFFLINE
// ══════════════════════════════════════════════

function onOffline() {
  document.getElementById('offline-banner')?.classList.remove('hidden');
}
function onOnline() {
  document.getElementById('offline-banner')?.classList.add('hidden');
  if (Queue.count() > 0 && accessToken) {
    showToast('Syncing ' + Queue.count() + ' pending transactions...', 'info');
    syncQueue();
  }
}

function updateQueueUI() {
  const count     = Queue.count();
  const indicator = document.getElementById('sync-indicator');
  const notice    = document.getElementById('queue-notice');
  const noticeText = document.getElementById('queue-notice-text');
  const syncCount  = document.getElementById('sync-count');
  if (count > 0) {
    indicator?.classList.remove('hidden');
    if (syncCount) syncCount.textContent = count;
    notice?.classList.remove('hidden');
    if (noticeText) noticeText.textContent = count + ' transaction' + (count > 1 ? 's' : '') + ' pending sync';
  } else {
    indicator?.classList.add('hidden');
    notice?.classList.add('hidden');
  }
}

async function syncQueue() {
  if (!Config.sheetId) { showToast('Add Sheet ID in Settings first', 'error'); return; }
  const queue = Queue.getAll();
  if (!queue.length) { showToast('Nothing to sync', 'info'); return; }
  let synced = 0;
  for (const item of queue) {
    try {
      await appendRow([item.timestamp, item.description, item.amount, item.category, item.month, item.week, item.notes||'']);
      Queue.remove(item._qid); synced++;
    } catch (e) { console.error('Sync fail:', e); }
  }
  if (synced) { showToast('✓ ' + synced + ' transaction' + (synced > 1 ? 's' : '') + ' synced', 'success'); loadTodayRecent(); }
}

// ══════════════════════════════════════════════
// SMART SUGGESTION
// ══════════════════════════════════════════════

function onDescInput() {
  const desc = document.getElementById('input-desc').value.trim();
  if (!desc || desc.length < 3) { dismissSuggestion(); return; }
  const suggestion = Patterns.suggest(desc);
  if (!suggestion) { dismissSuggestion(); return; }
  const amtField = document.getElementById('input-amount').value;
  if (amtField && amtField !== '0') return;
  currentSuggestion = suggestion;
  document.getElementById('suggestion-text').textContent =
    '💡 Usually Rp ' + suggestion.suggestedAmount.toLocaleString('id-ID') + ' · ' + suggestion.category + ' (' + suggestion.count + '× before)';
  document.getElementById('suggestion-banner').classList.remove('hidden');
}

function applySuggestion() {
  if (!currentSuggestion) return;
  document.getElementById('input-amount').value = currentSuggestion.suggestedAmount.toLocaleString('id-ID');
  dismissSuggestion();
}

function dismissSuggestion() {
  currentSuggestion = null;
  document.getElementById('suggestion-banner')?.classList.add('hidden');
}

// ══════════════════════════════════════════════
// DATE
// ══════════════════════════════════════════════

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function setDateToday() {
  useCustomDate = false;
  document.getElementById('btn-today').classList.add('active');
  document.getElementById('input-date').classList.remove('active-pick');
  document.getElementById('input-date').value = todayISO();
}
function setDateCustom() {
  useCustomDate = true;
  document.getElementById('btn-today').classList.remove('active');
  document.getElementById('input-date').classList.add('active-pick');
}
function getSelectedDate() {
  if (!useCustomDate) return new Date();
  const val = document.getElementById('input-date').value;
  if (!val) return new Date();
  const parts = val.split('-').map(Number);
  const now   = new Date();
  return new Date(parts[0], parts[1]-1, parts[2], now.getHours(), now.getMinutes(), now.getSeconds());
}

// ══════════════════════════════════════════════
// SHEETS API
// ══════════════════════════════════════════════

const SHEET_NAME  = 'Transactions';
const SHEET_RANGE = SHEET_NAME + '!A:G'; // G = Notes

async function ensureToken() {
  // Wrapper around ensureSheetsToken — fetches Sheets OAuth token lazily
  try {
    return await ensureSheetsToken();
  } catch (e) {
    showToast(e.message, 'error');
    throw e;
  }
}

async function sheetsAPI(method, range, body, qp) {
  // Always call ensureToken() — fetches token lazily if needed, no popup
  const token = await ensureToken();
  let url = 'https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + '/values/' + range;
  if (qp) url += '?' + new URLSearchParams(qp).toString();
  const opts = { method, headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 401) {
    // Token rejected — clear and retry once
    accessToken = null;
    sheetsTokenExpiry = 0;
    const retryToken = await ensureToken();
    opts.headers['Authorization'] = 'Bearer ' + retryToken;
    const retry = await fetch(url, opts);
    if (!retry.ok) { const e = await retry.json().catch(() => ({})); throw new Error(e.error?.message || 'Sheets error ' + retry.status); }
    return retry.json();
  }
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || 'Sheets error ' + res.status); }
  return res.json();
}

async function appendRow(row) {
  const token = await ensureToken();
  const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + '/values/' + SHEET_RANGE + ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || 'Append error'); }
  const data = await res.json();
  const match = data.updates?.updatedRange?.match(/!A(\d+):/);
  return match ? parseInt(match[1], 10) : null;
}

async function updateRow(sheetRow, row) {
  return sheetsAPI('PUT', SHEET_NAME + '!A' + sheetRow + ':G' + sheetRow, { values: [row] }, { valueInputOption: 'USER_ENTERED' });
}

async function deleteRow(sheetRow) {
  const token = await ensureToken();
  const metaRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId, {
    headers: { 'Authorization': 'Bearer ' + token },
  });
  const meta  = await metaRes.json();
  const sheet = meta.sheets?.find(s => s.properties?.title === SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found');
  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + ':batchUpdate', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ deleteDimension: { range: { sheetId: sheet.properties.sheetId, dimension: 'ROWS', startIndex: sheetRow-1, endIndex: sheetRow } } }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || 'Delete error'); }
}

async function readAllRows() {
  const data = await sheetsAPI('GET', SHEET_RANGE);
  return data.values || [];
}

async function initSheetHeaders() {
  try {
    const token    = await ensureToken();
    const checkUrl = 'https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId;
    const metaRes  = await fetch(checkUrl, { headers: { 'Authorization': 'Bearer ' + token } });
    if (!metaRes.ok) { showToast('Cannot access Sheet. Check Sheet ID.', 'error'); return; }
    const meta = await metaRes.json();
    if (!meta.sheets?.some(s => s.properties?.title === SHEET_NAME)) {
      await fetch(checkUrl + ':batchUpdate', {
        method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }),
      });
    }
    await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + '/values/' + SHEET_NAME + '!A1:G1?valueInputOption=USER_ENTERED', {
      method: 'PUT', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['Timestamp','Description','Amount','Category','Month','Week','Notes']] }),
    });
    showToast('Headers created ✓', 'success');
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

// ══════════════════════════════════════════════
// LOAD TODAY'S RECENT
// ══════════════════════════════════════════════

async function loadTodayRecent() {
  if (!Config.sheetId) return; // ensureSheetsToken() handles auth
  try {
    const rows = await readAllRows();
    if (rows.length <= 1) return;

    const all = rows.slice(1).map((r, i) => ({
      timestamp:   r[0] || '',
      description: r[1] || '',
      amount:      parseInt((r[2] || '0').toString().replace(/\D/g,''), 10),
      category:    r[3] || 'Others',
      month:       r[4] || '',
      week:        r[5] || '',
      notes:       r[6] || '',
      sheetRow:    i + 2,
    }));

    // Use numeric date comparison instead of locale string matching.
    // Locale string format varies across Android/iOS/desktop browsers,
    // causing string equality to fail even on the same day.
    const now   = new Date();
    const todayY = now.getFullYear();
    const todayM = now.getMonth();   // 0-indexed
    const todayD = now.getDate();

    recentItems = all.filter(tx => {
      const d = parseTxDate(tx.timestamp);
      return d !== null &&
        d.getFullYear() === todayY &&
        d.getMonth()    === todayM &&
        d.getDate()     === todayD;
    }).reverse().slice(0, 20); // show up to 20 today items

    allTransactions = all.reverse();
    renderRecent(); updateTodayTotal();
    updateExportCounts();
  } catch (e) { console.warn('loadTodayRecent:', e.message); }
}

/**
 * Parse a transaction timestamp into a Date object.
 * Handles multiple formats produced by different browser locales:
 *   "20/06/2026, 19.32.00"   ← id-ID on most Android
 *   "20/06/2026, 19:32:00"   ← id-ID on some devices
 *   "06/20/2026, 19:32:00"   ← en-US fallback
 *   "2026-06-20, 19:32:00"   ← ISO-like
 * Returns null if unparseable.
 */
function parseTxDate(timestamp) {
  if (!timestamp) return null;
  try {
    // Split off date part (before comma or space-only)
    const datePart = timestamp.split(',')[0].trim();

    // Try DD/MM/YYYY or MM/DD/YYYY (detect by value range)
    const slashMatch = datePart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const a = parseInt(slashMatch[1], 10);
      const b = parseInt(slashMatch[2], 10);
      const y = parseInt(slashMatch[3], 10);
      // If first part > 12 it must be DD/MM/YYYY
      // If second part > 12 it must be MM/DD/YYYY
      // Default assumption: DD/MM/YYYY (id-ID locale)
      if (a > 12) return new Date(y, b - 1, a);  // DD/MM/YYYY
      if (b > 12) return new Date(y, a - 1, b);  // MM/DD/YYYY
      return new Date(y, b - 1, a);               // assume DD/MM/YYYY
    }

    // Try YYYY-MM-DD (ISO)
    const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      return new Date(
        parseInt(isoMatch[1], 10),
        parseInt(isoMatch[2], 10) - 1,
        parseInt(isoMatch[3], 10)
      );
    }

    // Fallback: let browser parse it
    const d = new Date(datePart);
    return isNaN(d.getTime()) ? null : d;
  } catch (e) {
    return null;
  }
}

function updateTodayTotal() {
  const total = recentItems.reduce((s,tx) => s+tx.amount, 0);
  // Update the compact badge
  const badge = document.getElementById('today-total');
  if (badge) {
    if (total > 0) {
      badge.classList.remove('hidden');
      const amtEl = document.getElementById('today-total-amount');
      if (amtEl) amtEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
    } else {
      badge.classList.add('hidden');
    }
  }
  // Update section title to show count + total inline
  const titleEl = document.getElementById('added-today-title');
  if (titleEl) {
    if (recentItems.length > 0) {
      titleEl.innerHTML = 'Added Today <span class="today-count-badge">' + recentItems.length + ' · Rp ' + total.toLocaleString('id-ID') + '</span>';
    } else {
      titleEl.innerHTML = 'Added Today';
    }
  }
}

// ══════════════════════════════════════════════
// BUDGET
// ══════════════════════════════════════════════

function renderBudgetInputs() {
  const container = document.getElementById('budget-inputs');
  if (!container) return;
  const budgets = Budget.getAll();
  container.innerHTML = CATEGORIES.map(cat => {
    const id  = 'budget-' + cat.name.replace(/[^a-z]/gi,'_');
    const val = budgets[cat.name] ? Number(budgets[cat.name]).toLocaleString('id-ID') : '';
    return '<div class="budget-input-card" style="border-top-color:' + cat.color + '">' +
      '<div class="budget-cat-header">' +
      '<span class="budget-cat-emoji">' + cat.emoji + '</span>' +
      '<span class="budget-cat-name">' + cat.name + '</span></div>' +
      '<span class="budget-input-prefix">Rp</span>' +
      '<input type="text" class="budget-input-field" id="' + id + '" inputmode="numeric" placeholder="No limit" value="' + val + '">' +
      '</div>';
  }).join('');
  container.querySelectorAll('.budget-input-field').forEach(inp => {
    inp.addEventListener('input', () => {
      let raw = inp.value.replace(/\D/g, '');
      inp.value = raw ? Number(raw).toLocaleString('id-ID') : '';
    });
  });
}

function saveBudgets() {
  const budgets = {};
  CATEGORIES.forEach(cat => {
    const el = document.getElementById('budget-' + cat.name.replace(/[^a-z]/gi,'_'));
    if (el) { const raw = parseInt(el.value.replace(/\D/g,''), 10); if (raw > 0) budgets[cat.name] = raw; }
  });
  Budget.saveAll(budgets);
  showToast('Budget saved ✓', 'success');
}

function checkBudgetWarning(category, monthTotal) {
  const limit = Budget.get(category);
  if (!limit) return;
  const pct = monthTotal / limit;
  const cat = CATEGORIES.find(c => c.name === category);
  if (pct >= 1.0) showToast('🚨 ' + (cat?.emoji||'') + ' ' + category + ' over budget!', 'error');
  else if (pct >= 0.8) showToast('⚠️ ' + (cat?.emoji||'') + ' ' + category + ' at ' + Math.round(pct*100) + '% of budget', 'info');
}

function renderBudgetBars(catTotals) {
  const budgets   = Budget.getAll();
  const section   = document.getElementById('budget-progress-section');
  const container = document.getElementById('budget-bars');
  if (!container || !section) return;
  const budgetedCats = CATEGORIES.filter(cat => budgets[cat.name]);
  if (!budgetedCats.length) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');
  container.innerHTML = budgetedCats.map(cat => {
    const spent  = catTotals[cat.name] || 0;
    const limit  = budgets[cat.name];
    const pct    = Math.min(100, Math.round((spent/limit)*100));
    const status = pct >= 100 ? 'over' : pct >= 80 ? 'warning' : 'ok';
    const left   = (limit - spent).toLocaleString('id-ID');
    return '<div class="budget-bar-row">' +
      '<div class="budget-bar-header">' +
      '<span class="budget-bar-label">' + cat.emoji + ' ' + cat.name + '</span>' +
      '<span class="budget-bar-amounts">Rp ' + spent.toLocaleString('id-ID') + ' / Rp ' + limit.toLocaleString('id-ID') + '</span></div>' +
      '<div class="budget-bar-track"><div class="budget-bar-fill ' + status + '" style="width:' + pct + '%"></div></div>' +
      '<div class="budget-bar-pct ' + status + '">' + pct + '% ' + (status==='over'?'🚨 Over budget!':status==='warning'?'⚠️ Almost there':'· Rp '+left+' left') + '</div>' +
      '</div>';
  }).join('');
}

// ══════════════════════════════════════════════
// WEEK ON WEEK
// ══════════════════════════════════════════════

function renderWoWCard(transactions) {
  const card = document.getElementById('wow-card');
  if (!card) return;
  const now  = new Date();
  const getMonday = (d) => { const date=new Date(d); const day=date.getDay(); date.setDate(date.getDate()-((day+6)%7)); date.setHours(0,0,0,0); return date; };
  const thisMonday = getMonday(now);
  const lastMonday = new Date(thisMonday); lastMonday.setDate(lastMonday.getDate()-7);
  const lastSunday = new Date(thisMonday); lastSunday.setDate(lastSunday.getDate()-1); lastSunday.setHours(23,59,59,999);

  const parseDate = (ts) => parseTxDate(ts);

  const thisWeekTxs = transactions.filter(tx => { const d=parseDate(tx.timestamp); return d && d>=thisMonday && d<=now; });
  const lastWeekTxs = transactions.filter(tx => { const d=parseDate(tx.timestamp); return d && d>=lastMonday && d<=lastSunday; });

  const thisTotal = thisWeekTxs.reduce((s,tx) => s+tx.amount, 0);
  const lastTotal = lastWeekTxs.reduce((s,tx) => s+tx.amount, 0);

  if (thisTotal === 0 && lastTotal === 0) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');

  const delta = thisTotal - lastTotal;
  const pct   = lastTotal > 0 ? Math.round(Math.abs(delta/lastTotal)*100) : null;
  const badge = document.getElementById('wow-badge');
  const dir   = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  badge.className = 'wow-badge ' + dir;
  badge.textContent = pct !== null ? (delta>0?'▲ ':delta<0?'▼ ':'') + (pct !== null ? pct+'%' : '') : (delta>0?'▲ New':'—');

  document.getElementById('wow-this').textContent = 'Rp ' + thisTotal.toLocaleString('id-ID');
  document.getElementById('wow-last').textContent = 'Rp ' + lastTotal.toLocaleString('id-ID');

  const thisCats={}, lastCats={};
  thisWeekTxs.forEach(tx => { thisCats[tx.category]=(thisCats[tx.category]||0)+tx.amount; });
  lastWeekTxs.forEach(tx => { lastCats[tx.category]=(lastCats[tx.category]||0)+tx.amount; });
  const allCats = new Set([...Object.keys(thisCats),...Object.keys(lastCats)]);
  const deltas  = Array.from(allCats)
    .map(cat => ({ cat, delta: (thisCats[cat]||0)-(lastCats[cat]||0) }))
    .filter(x => x.delta !== 0)
    .sort((a,b) => Math.abs(b.delta)-Math.abs(a.delta))
    .slice(0,4);

  const bd = document.getElementById('wow-breakdown');
  if (deltas.length) {
    bd.innerHTML = '<div class="wow-breakdown-title">Top changes vs last week</div>' +
      deltas.map(({cat, delta: d}) => {
        const catObj = CATEGORIES.find(c=>c.name===cat);
        const cls  = d > 0 ? 'up' : 'down';
        const sign = d > 0 ? '+' : '';
        return '<div class="wow-breakdown-row">' +
          '<span class="wow-breakdown-cat">' + (catObj?.emoji||'') + ' ' + cat + '</span>' +
          '<span class="wow-breakdown-delta ' + cls + '">' + sign + 'Rp ' + Math.abs(d).toLocaleString('id-ID') + '</span></div>';
      }).join('');
  } else { bd.innerHTML = ''; }
}

// ══════════════════════════════════════════════
// SUBMIT
// ══════════════════════════════════════════════

async function handleSubmit() {
  const descEl    = document.getElementById('input-desc');
  const amtEl     = document.getElementById('input-amount');
  const btn       = document.getElementById('btn-submit');
  const btnText   = document.getElementById('btn-submit-text');
  const btnLoader = document.getElementById('btn-submit-loader');

  const description = descEl.value.trim();
  const amount = parseInt(amtEl.value.replace(/\D/g,''), 10);

  if (!description) { showToast('Fill in description', 'error'); descEl.focus(); return; }
  if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); amtEl.focus(); return; }

  const category    = categorize(description);
  const selectedDate = getSelectedDate();
  const timestamp   = selectedDate.toLocaleString('id-ID', {
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit',
  });
  const monthStr = MONTH_NAMES[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear();
  const weekStr  = 'Week ' + getWeekNumber(selectedDate);
  const notes    = ''; // Notes removed from input UI
  const txData   = { timestamp, description, amount, category, month: monthStr, week: weekStr, notes };

  btn.disabled=true; btnText.textContent='Saving...'; btnLoader.classList.remove('hidden');

  Patterns.record(description, amount, category);
  dismissSuggestion();

  if (!isOnline || !accessToken || !Config.sheetId) {
    Queue.add(txData);
    const cat = CATEGORIES.find(c=>c.name===category)||CATEGORIES[9];
    showToast('Saved offline · ' + cat.emoji + ' ' + category, 'info');
    recentItems.unshift({ ...txData, sheetRow: null });
    if (recentItems.length > 10) recentItems.pop();
    renderRecent(); updateTodayTotal();
    descEl.value=''; amtEl.value=''; setDateToday(); descEl.focus();
    btn.disabled=false; btnText.textContent='Add Spending'; btnLoader.classList.add('hidden');
    return;
  }

  try {
    const sheetRow = await appendRow([timestamp, description, amount, category, monthStr, weekStr, notes]);
    const cat = CATEGORIES.find(c=>c.name===category)||CATEGORIES[9];
    showToast(cat.emoji + ' ' + category + ' · Rp ' + amount.toLocaleString('id-ID') + ' ✓', 'success');
    recentItems.unshift({ ...txData, sheetRow });
    if (recentItems.length > 10) recentItems.pop();
    renderRecent(); updateTodayTotal();

    // Budget warning
    const curMonth = MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear();
    const monthSpend = allTransactions
      .filter(tx => tx.category===category && tx.month===curMonth)
      .reduce((s,tx) => s+tx.amount, 0) + amount;
    checkBudgetWarning(category, monthSpend);

    descEl.value=''; amtEl.value=''; setDateToday();
    descEl.focus();
  } catch (e) {
    Queue.add(txData);
    showToast('Save failed — queued offline', 'error');
  } finally {
    btn.disabled=false; btnText.textContent='Add Spending'; btnLoader.classList.add('hidden');
  }
}

// ══════════════════════════════════════════════
// TRANSACTION ITEM (swipe to delete)
// ══════════════════════════════════════════════

function buildTransactionItem(tx, index, source) {
  const cat = CATEGORIES.find(c=>c.name===tx.category)||CATEGORIES[9];
  const wrapper = document.createElement('div'); wrapper.className='swipe-wrapper';
  const bg   = document.createElement('div'); bg.className='swipe-delete-bg'; bg.textContent='🗑️';
  const item = document.createElement('div'); item.className='transaction-item';
  item.style.borderLeftColor = cat.color;
  const pending = !tx.sheetRow ? ' <span style="font-size:10px;color:#f59e0b">⏳</span>' : '';
  item.innerHTML =
    '<span class="tx-emoji">' + cat.emoji + '</span>' +
    '<div class="tx-details">' +
      '<div class="tx-desc">' + escHtml(tx.description) + pending + '</div>' +
      '<div class="tx-cat">' + tx.category + '</div>' +
    '</div>' +
    '<div class="tx-right"><div class="tx-amount">Rp ' + tx.amount.toLocaleString('id-ID') + '</div></div>' +
    '<span class="tx-edit-hint">✎</span>';
  item.addEventListener('click', () => openEdit(source, index));
  addSwipeToDelete(item, bg, wrapper, () => openDelete(source, index));
  wrapper.appendChild(bg); wrapper.appendChild(item);
  return wrapper;
}

function addSwipeToDelete(item, bg, wrapper, onDelete) {
  let startX=0, currentX=0, isSwiping=false;
  const THRESHOLD=80;
  const onStart = x => { startX=x; isSwiping=true; item.classList.add('swiping'); };
  const onMove  = x => { if(!isSwiping) return; currentX=Math.min(0,x-startX); item.style.transform='translateX('+currentX+'px)'; bg.style.width=Math.max(0,-currentX)+'px'; };
  const onEnd   = () => {
    if(!isSwiping) return; isSwiping=false; item.classList.remove('swiping');
    if(currentX < -THRESHOLD) { item.style.transform='translateX(-'+wrapper.offsetWidth+'px)'; setTimeout(onDelete,150); }
    else { item.style.transform=''; bg.style.width='0'; }
    currentX=0;
  };
  item.addEventListener('touchstart', e=>onStart(e.touches[0].clientX), {passive:true});
  item.addEventListener('touchmove',  e=>onMove(e.touches[0].clientX),  {passive:true});
  item.addEventListener('touchend',   onEnd);
  item.addEventListener('mousedown',  e=>{ if(e.button===0) onStart(e.clientX); });
  window.addEventListener('mousemove', e=>{ if(isSwiping){e.preventDefault();onMove(e.clientX);} });
  window.addEventListener('mouseup',   ()=>{ if(isSwiping) onEnd(); });
}

function renderRecent() {
  const el = document.getElementById('recent-list');
  if (!recentItems.length) { el.innerHTML='<p class="empty-state">No spending today yet</p>'; return; }
  el.innerHTML='';
  recentItems.forEach((tx,i) => el.appendChild(buildTransactionItem(tx,i,'recent')));
}

// ══════════════════════════════════════════════
// DELETE
// ══════════════════════════════════════════════

function openDelete(source, index) {
  const tx = source==='recent' ? recentItems[index] : allTransactions[index];
  if (!tx) return;
  deleteTarget = { source, index, tx };
  document.getElementById('delete-preview').innerHTML =
    '<strong>' + escHtml(tx.description) + '</strong><br>Rp ' + tx.amount.toLocaleString('id-ID') + ' · ' + tx.category + '<br><span style="font-size:12px;opacity:.6">' + tx.timestamp + '</span>';
  document.getElementById('delete-modal').classList.remove('hidden');
}

async function confirmDelete() {
  if (!deleteTarget) return;
  const { source, index, tx } = deleteTarget;
  if (source==='recent') { recentItems.splice(index,1); renderRecent(); updateTodayTotal(); }
  else { allTransactions.splice(index,1); applyHistoryFilter(); }
  closeDelete();
  if (tx.sheetRow) {
    try {
      await deleteRow(tx.sheetRow);
      allTransactions.forEach(t => { if(t.sheetRow>tx.sheetRow) t.sheetRow--; });
      recentItems.forEach(t => { if(t.sheetRow>tx.sheetRow) t.sheetRow--; });
      showToast('Deleted ✓', 'success');
    } catch(e) { showToast('Delete from Sheet failed: ' + e.message, 'error'); }
  } else { showToast('Deleted ✓', 'success'); }
}

function closeDelete() {
  document.getElementById('delete-modal').classList.add('hidden'); deleteTarget=null;
  document.querySelectorAll('.transaction-item').forEach(el => { el.style.transform=''; });
  document.querySelectorAll('.swipe-delete-bg').forEach(el => { el.style.width='0'; });
}
function closeDeleteIfOverlay(e) { if(e.target===document.getElementById('delete-modal')) closeDelete(); }

// ══════════════════════════════════════════════
// EDIT
// ══════════════════════════════════════════════

function openEdit(source, index) {
  const tx = source==='recent' ? recentItems[index] : allTransactions[index];
  if (!tx) return;
  editTarget = { source, index, sheetRow: tx.sheetRow };
  document.getElementById('edit-desc').value   = tx.description;
  document.getElementById('edit-amount').value = tx.amount.toLocaleString('id-ID');
  const editNotesEl = document.getElementById('edit-notes');
  if (editNotesEl) editNotesEl.value = tx.notes || '';
  const parts = tx.timestamp.split(',')[0]?.trim().split('/');
  document.getElementById('edit-date').value = (parts?.length===3)
    ? (parts[2]+'-'+parts[1].padStart(2,'0')+'-'+parts[0].padStart(2,'0')) : todayISO();
  document.getElementById('edit-category-chips').innerHTML = CATEGORIES.map(cat => {
    const sel = cat.name===tx.category;
    return '<button class="cat-chip' + (sel?' selected':'') + '" style="' +
      (sel?'background:'+cat.color+';color:#fff;border-color:'+cat.color:'background:transparent') +
      '" data-cat="' + cat.name + '" onclick="selectEditCategory(this,\'' + cat.name.replace(/'/g,"\\'") + '\')">' +
      cat.emoji + ' ' + cat.name + '</button>';
  }).join('');
  // Show receipt in edit modal if exists
  const editReceiptSection = document.getElementById('edit-receipt-section');
  const editReceiptImg     = document.getElementById('edit-receipt-img');
  if (editReceiptSection && editReceiptImg && tx.sheetRow) {
    const receiptData = Receipts.get('row_' + tx.sheetRow);
    if (receiptData) {
      editReceiptImg.src = receiptData;
      editReceiptSection.classList.remove('hidden');
    } else {
      editReceiptSection.classList.add('hidden');
    }
  }
  document.getElementById('edit-modal').classList.remove('hidden');
}

function selectEditCategory(el, name) {
  document.querySelectorAll('#edit-category-chips .cat-chip').forEach(chip => {
    const cat = CATEGORIES.find(c=>c.name===chip.dataset.cat);
    if (cat?.name===name) { chip.classList.add('selected'); chip.style.background=cat.color; chip.style.color='#fff'; chip.style.borderColor=cat.color; }
    else { chip.classList.remove('selected'); chip.style.background='transparent'; chip.style.color=''; chip.style.borderColor=''; }
  });
}

async function saveEdit() {
  if (!editTarget) return;
  const newDesc   = document.getElementById('edit-desc').value.trim();
  const newAmount = parseInt(document.getElementById('edit-amount').value.replace(/\D/g,''), 10);
  const newCat    = document.querySelector('#edit-category-chips .cat-chip.selected')?.dataset.cat || 'Others';
  const newDateV  = document.getElementById('edit-date').value;
  if (!newDesc)            { showToast('Description required', 'error'); return; }
  if (!newAmount||newAmount<=0) { showToast('Invalid amount', 'error'); return; }

  const tx = editTarget.source==='recent' ? recentItems[editTarget.index] : allTransactions[editTarget.index];
  let newTs=tx.timestamp, newMonth=tx.month, newWeek=tx.week;
  if (newDateV) {
    const p = newDateV.split('-').map(Number);
    const editDate = new Date(p[0],p[1]-1,p[2]);
    const timePart = tx.timestamp.split(',')[1]?.trim() || new Date().toLocaleTimeString('id-ID');
    newTs    = editDate.toLocaleDateString('id-ID',{year:'numeric',month:'2-digit',day:'2-digit'}) + ', ' + timePart;
    newMonth = MONTH_NAMES[editDate.getMonth()] + ' ' + editDate.getFullYear();
    newWeek  = 'Week ' + getWeekNumber(editDate);
  }
  const newNotes = document.getElementById('edit-notes')?.value.trim() || '';
  if (editTarget.sheetRow) {
    try { await updateRow(editTarget.sheetRow,[newTs,newDesc,newAmount,newCat,newMonth,newWeek,newNotes]); showToast('Updated ✓','success'); }
    catch(e) { showToast('Update failed: '+e.message,'error'); return; }
  }
  tx.timestamp=newTs; tx.description=newDesc; tx.amount=newAmount; tx.category=newCat; tx.month=newMonth; tx.week=newWeek; tx.notes=newNotes;
  if (editTarget.source==='recent') { renderRecent(); updateTodayTotal(); }
  else { applyHistoryFilter(); }
  closeEdit();
}

function closeEdit() { document.getElementById('edit-modal').classList.add('hidden'); editTarget=null; }
function closeEditIfOverlay(e) { if(e.target===document.getElementById('edit-modal')) closeEdit(); }

// ══════════════════════════════════════════════
// HISTORY
// ══════════════════════════════════════════════

async function loadHistory() {
  // No accessToken check here — ensureToken() inside readAllRows() handles
  // lazy Sheets auth and will wait for token to be ready
  if (!Config.sheetId) {
    const listEl = document.getElementById('history-list');
    if (listEl) listEl.innerHTML = '<p class="empty-state">Add your Google Sheet ID in Settings to view history.</p>';
    return;
  }
  const listEl = document.getElementById('history-list');
  const icon   = document.getElementById('history-refresh-icon');
  listEl.innerHTML = '<p class="empty-state">Loading...</p>';
  if (icon) icon.classList.add('spinning');
  try {
    const rows = await readAllRows();
    if (rows.length <= 1) {
      listEl.innerHTML = '<p class="empty-state">No transactions yet. Add your first spending!</p>';
      return;
    }
    allTransactions = rows.slice(1).map((r, i) => ({
      timestamp:   r[0] || '',
      description: r[1] || '',
      amount:      parseInt((r[2] || '0').toString().replace(/\D/g, ''), 10),
      category:    r[3] || 'Others',
      month:       r[4] || '',
      week:        r[5] || '',
      notes:       r[6] || '',
      sheetRow:    i + 2,
    })).reverse();
    applyHistoryFilter();
  } catch (e) {
    console.error('loadHistory error:', e);
    listEl.innerHTML = '<p class="empty-state">Could not load — ' + e.message + '</p>';
  } finally {
    if (icon) icon.classList.remove('spinning');
  }
}

function setFilterCat(cat) {
  activeFilterCat=cat;
  document.querySelectorAll('.filter-chip').forEach(el=>el.classList.toggle('active',el.dataset.cat===cat));
  applyHistoryFilter();
}

function setSort(sort) {
  activeSort = sort;
  document.querySelectorAll('.sort-btn').forEach(el =>
    el.classList.toggle('active', el.dataset.sort === sort)
  );
  applyHistoryFilter();
}

function getSortedList(list) {
  const sorted = [...list];
  if (activeSort === 'date-desc') {
    // newest first — parse date from timestamp DD/MM/YYYY
    sorted.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
  } else if (activeSort === 'date-asc') {
    sorted.sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp));
  } else if (activeSort === 'amount-desc') {
    sorted.sort((a, b) => b.amount - a.amount);
  } else if (activeSort === 'amount-asc') {
    sorted.sort((a, b) => a.amount - b.amount);
  }
  return sorted;
}

function parseTimestamp(ts) {
  // Format: "DD/MM/YYYY, HH:MM:SS"
  const parts = ts.split(',')[0]?.trim().split('/');
  if (parts?.length === 3) {
    return new Date(parts[2], parts[1]-1, parts[0]).getTime();
  }
  return 0;
}

function applyHistoryFilter() {
  const q = document.getElementById('history-search')?.value.toLowerCase().trim()||'';
  const filtered = allTransactions.filter(tx => {
    const matchCat    = activeFilterCat==='all' || tx.category===activeFilterCat;
    const matchSearch = !q || tx.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  const sorted = getSortedList(filtered);
  renderHistoryList(document.getElementById('history-list'), sorted);
  const summaryEl = document.getElementById('history-filter-summary');
  const hasFilter = activeFilterCat!=='all' || q;
  if (hasFilter) {
    const total=filtered.reduce((s,tx)=>s+tx.amount,0);
    summaryEl.classList.remove('hidden');
    summaryEl.textContent=filtered.length+' transactions · Rp '+total.toLocaleString('id-ID');
  } else { summaryEl.classList.add('hidden'); }
}

function renderHistoryList(el, list) {
  const txList=list||allTransactions;
  if(!txList.length) { el.innerHTML='<p class="empty-state">No transactions found</p>'; return; }
  el.innerHTML='';
  const showDateGroups = activeSort === 'date-desc' || activeSort === 'date-asc';
  let lastDate='';
  txList.forEach(tx => {
    if (showDateGroups) {
      const dateStr=tx.timestamp.split(',')[0]?.trim()||'';
      if(dateStr!==lastDate) {
        const dg=document.createElement('div'); dg.className='history-date-group'; dg.textContent=dateStr;
        el.appendChild(dg); lastDate=dateStr;
      }
    }
    const origIndex=allTransactions.indexOf(tx);
    el.appendChild(buildTransactionItem(tx,origIndex,'history'));
  });
}

// ══════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════

function changeMonth(delta) {
  dashboardMonth.setMonth(dashboardMonth.getMonth()+delta);
  updateMonthLabel(); renderDashboardData();
}
function updateMonthLabel() {
  document.getElementById('dashboard-month').textContent =
    MONTH_NAMES[dashboardMonth.getMonth()] + ' ' + dashboardMonth.getFullYear();
}

async function loadDashboard() {
  if(!Config.sheetId) { showToast('Add Sheet ID in Settings first', 'error'); return; }
  showToast('Loading...','info');
  try {
    const rows=await readAllRows();
    allTransactions=rows.slice(1).map((r,i)=>({
      timestamp:r[0]||'', description:r[1]||'',
      amount:parseInt((r[2]||'0').toString().replace(/\D/g,''),10),
      category:r[3]||'Others', month:r[4]||'', week:r[5]||'', sheetRow:i+2,
    })).reverse();
    renderDashboardData();
  } catch(e) { showToast('Error: '+e.message,'error'); }
}

function renderDashboardData() {
  updateMonthLabel();
  const targetMonth=MONTH_NAMES[dashboardMonth.getMonth()]+' '+dashboardMonth.getFullYear();
  const filtered=allTransactions.filter(tx=>tx.month===targetMonth);
  const total=filtered.reduce((s,tx)=>s+tx.amount,0);
  const daysWithSpending=new Set(filtered.map(tx=>tx.timestamp.split(',')[0]?.trim()||'').filter(Boolean)).size;
  const avg=daysWithSpending>0?Math.round(total/daysWithSpending):0;
  const catTotals={};
  filtered.forEach(tx=>{catTotals[tx.category]=(catTotals[tx.category]||0)+tx.amount;});
  const topCat=Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0];

  document.getElementById('sum-total').textContent='Rp '+total.toLocaleString('id-ID');
  document.getElementById('sum-avg').textContent='Rp '+avg.toLocaleString('id-ID');
  document.getElementById('sum-top').textContent=topCat?(CATEGORIES.find(c=>c.name===topCat[0])?.emoji||'')+' '+topCat[0]:'—';

  renderWoWCard(allTransactions);
  renderBudgetBars(catTotals);
  renderPieChart(catTotals);

  const dailyTotals={};
  filtered.forEach(tx=>{const day=tx.timestamp.split(',')[0]?.trim()||'unknown'; dailyTotals[day]=(dailyTotals[day]||0)+tx.amount;});
  renderBarChart(dailyTotals);
}

function renderPieChart(catTotals) {
  const ctx=document.getElementById('chart-pie');
  const labels=[],data=[],colors=[];
  Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).forEach(([name,amount])=>{
    const cat=CATEGORIES.find(c=>c.name===name);
    labels.push((cat?.emoji||'')+' '+name); data.push(amount); colors.push(cat?.color||'#94a3b8');
  });
  if(pieChart){pieChart.destroy();pieChart=null;}
  if(!data.length) return;
  const isDark=document.body.classList.contains('dark');
  pieChart=new Chart(ctx,{
    type:'doughnut',
    data:{labels,datasets:[{data,backgroundColor:colors,borderWidth:0}]},
    options:{responsive:true,plugins:{
      legend:{position:'bottom',labels:{font:{family:'Inter',size:11},padding:12,color:isDark?'#71767b':'#536471'}},
      tooltip:{callbacks:{label:i=>'Rp '+i.raw.toLocaleString('id-ID')}},
    }},
  });
}

function renderBarChart(dailyTotals) {
  const ctx=document.getElementById('chart-bar');
  const sorted=Object.entries(dailyTotals).sort((a,b)=>a[0].localeCompare(b[0]));
  if(barChart){barChart.destroy();barChart=null;}
  if(!sorted.length) return;
  const isDark=document.body.classList.contains('dark');
  const gridColor=isDark?'#2f3336':'#eff3f4';
  const tickColor=isDark?'#71767b':'#536471';
  barChart=new Chart(ctx,{
    type:'bar',
    data:{labels:sorted.map(([d])=>d),datasets:[{data:sorted.map(([,v])=>v),backgroundColor:'#1d9bf0',borderRadius:4}]},
    options:{responsive:true,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:i=>'Rp '+i.raw.toLocaleString('id-ID')}}},
      scales:{
        x:{ticks:{font:{family:'Inter',size:10},maxRotation:45,color:tickColor},grid:{color:gridColor}},
        y:{ticks:{font:{family:'Inter',size:10},color:tickColor,callback:v=>v>=1000000?(v/1000000).toFixed(1)+'jt':v>=1000?(v/1000)+'rb':v},grid:{color:gridColor}},
      },
    },
  });
}

// ══════════════════════════════════════════════
// TAB NAVIGATION
// ══════════════════════════════════════════════

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.querySelector('.nav-btn[data-tab="'+tab+'"]').classList.add('active');
  if (tab === 'settings') { renderTemplateManageList(); updateExportCounts(); }
  // History: always auto-load when switching to tab (no manual refresh needed)
  if (tab==='history') {
    loadHistory(); // ensureSheetsToken() inside handles auth lazily
  }
  if(tab==='dashboard'&&allTransactions.length===0&&Config.sheetId) loadDashboard();
  if(tab==='dashboard'){updateMonthLabel(); if(allTransactions.length>0) renderDashboardData();}
}

// ══════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════

function loadNotifSettings() {
  const enabled=Config.get('notif')==='true';
  const t1=Config.get('notif_t1')||'12:30';
  const t2=Config.get('notif_t2')||'19:30';
  const toggle=document.getElementById('notif-toggle');
  const t1El=document.getElementById('notif-time-1');
  const t2El=document.getElementById('notif-time-2');
  if(toggle) toggle.checked=enabled;
  if(t1El) t1El.value=t1;
  if(t2El) t2El.value=t2;
  if(enabled) scheduleNotifications(t1,t2);
}

async function toggleNotifications() {
  const enabled=document.getElementById('notif-toggle')?.checked;
  if(enabled) {
    if(!('Notification' in window)){updateNotifStatus('error','Browser does not support notifications'); document.getElementById('notif-toggle').checked=false; return;}
    if(Notification.permission==='denied'){updateNotifStatus('error','Notifications blocked. Enable in browser settings.'); document.getElementById('notif-toggle').checked=false; return;}
    const perm=Notification.permission==='granted'?'granted':await Notification.requestPermission();
    if(perm!=='granted'){updateNotifStatus('error','Permission not granted'); document.getElementById('notif-toggle').checked=false; return;}
    Config.set('notif','true');
    const t1=document.getElementById('notif-time-1')?.value||'12:30';
    const t2=document.getElementById('notif-time-2')?.value||'19:30';
    scheduleNotifications(t1,t2); updateNotifStatus('ok','✓ Reminders active');
  } else { Config.set('notif','false'); clearNotifTimers(); updateNotifStatus('',''); }
}

function saveNotifSettings() {
  const t1=document.getElementById('notif-time-1')?.value||'12:30';
  const t2=document.getElementById('notif-time-2')?.value||'19:30';
  Config.set('notif_t1',t1); Config.set('notif_t2',t2);
  if(Config.get('notif')==='true'){scheduleNotifications(t1,t2); updateNotifStatus('ok','✓ Set for '+t1+' & '+t2+' daily');}
  showToast('Reminders saved ✓','success');
}

function clearNotifTimers(){notifTimers.forEach(id=>clearTimeout(id)); notifTimers=[];}

function scheduleNotifications(t1,t2){
  clearNotifTimers();
  scheduleOne(t1,'🌤️ Noon reminder','Time to log your midday spending!');
  scheduleOne(t2,'🌙 Evening reminder','Have you logged all your spending today?');
}

function scheduleOne(timeStr,title,body){
  const [h,m]=timeStr.split(':').map(Number);
  const now=new Date(), target=new Date();
  target.setHours(h,m,0,0);
  if(target<=now) target.setDate(target.getDate()+1);
  const id=setTimeout(()=>{
    fireNotification(title,body);
    const next=setTimeout(()=>scheduleOne(timeStr,title,body),1000);
    notifTimers.push(next);
  }, target-now);
  notifTimers.push(id);
}

function fireNotification(title,body){
  if(Notification.permission!=='granted') return;
  try { const n=new Notification(title,{body,tag:'wallet-tracker',renotify:true}); n.onclick=()=>{window.focus();n.close();}; }
  catch(e){console.warn('Notification error:',e);}
}

function updateNotifStatus(cls,msg){
  const el=document.getElementById('notif-status');
  if(!el) return;
  el.className='notif-status'+(cls?' '+cls:''); el.textContent=msg;
}

// ══════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════

function loadSettingsUI(){
  const c=document.getElementById('set-client-id');
  const s=document.getElementById('set-sheet-id');
  if(c) c.value=Config.clientId;
  if(s) s.value=Config.sheetId;
}

function saveGoogleSettings(){
  const clientId=document.getElementById('set-client-id').value.trim();
  const sheetId=document.getElementById('set-sheet-id').value.trim();
  if(!clientId){showToast('Client ID required','error');return;}
  if(!sheetId){showToast('Sheet ID required','error');return;}
  Config.set('clientId',clientId); Config.set('sheetId',sheetId);
  if(currentUser) initSheetsAuth(currentUser.email);
  showToast('Saved ✓','success');
}

function saveAnthropicKey() {
  const key = document.getElementById('set-anthropic-key')?.value.trim();
  if (!key) { showToast('API key cannot be empty','error'); return; }
  Config.set('anthropicKey', key);
  showToast('Anthropic key saved ✓ — receipt OCR enabled','success');
}

// ══════════════════════════════════════════════
// TEMPLATES ENGINE
// ══════════════════════════════════════════════

const Templates = {
  _key: 'wt_templates',
  getAll() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch { return []; }
  },
  save(templates) {
    localStorage.setItem(this._key, JSON.stringify(templates));
  },
  add(template) {
    const all = this.getAll();
    // Prevent duplicates by description
    const exists = all.find(t => t.description.toLowerCase() === template.description.toLowerCase());
    if (exists) {
      showToast('Template already exists for "' + template.description + '"', 'info');
      return false;
    }
    all.unshift(template);
    this.save(all);
    return true;
  },
  remove(index) {
    const all = this.getAll();
    all.splice(index, 1);
    this.save(all);
  },
};

function saveAsTemplate() {
  const desc   = document.getElementById('input-desc')?.value.trim();
  const amtRaw = document.getElementById('input-amount')?.value.replace(/\D/g, '');
  const amount = parseInt(amtRaw, 10);
  const notes  = document.getElementById('input-notes')?.value.trim() || '';

  if (!desc)           { showToast('Fill in description first', 'error'); return; }
  if (!amount || amount <= 0) { showToast('Fill in amount first', 'error'); return; }

  const category = categorize(desc);
  const cat      = CATEGORIES.find(c => c.name === category) || CATEGORIES[9];

  const added = Templates.add({ description: desc, amount, category, notes, emoji: cat.emoji });
  if (added) {
    showToast(`Template saved: ${cat.emoji} ${desc}`, 'success');
    renderTemplates();
    renderTemplateManageList();
  }
}

function applyTemplate(index) {
  const templates = Templates.getAll();
  const t = templates[index];
  if (!t) return;

  document.getElementById('input-desc').value   = t.description;
  document.getElementById('input-amount').value = t.amount.toLocaleString('id-ID');
  const notesEl = document.getElementById('input-notes');
  if (notesEl) notesEl.value = t.notes || '';

  // Trigger suggestion engine
  onDescInput();
  // Scroll to submit button
  document.getElementById('btn-submit').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast(`Template loaded: ${t.emoji} ${t.description}`, 'info');
}

function renderTemplates() {
  const container = document.getElementById('templates-list');
  const section   = document.getElementById('templates-section');
  if (!container) return;

  const templates = Templates.getAll();
  if (templates.length === 0) {
    container.innerHTML = '<p class="empty-state-small">No templates yet — fill the form above and tap "Save as template"</p>';
    return;
  }

  container.innerHTML = templates.map((t, i) => `
    <button class="template-chip" onclick="applyTemplate(${i})">
      <span class="template-chip-emoji">${t.emoji}</span>
      <div class="template-chip-info">
        <div class="template-chip-name">${escHtml(t.description)}</div>
        <div class="template-chip-amount">Rp ${t.amount.toLocaleString('id-ID')}</div>
      </div>
    </button>
  `).join('');
}

function renderTemplateManageList() {
  const container = document.getElementById('template-manage-list');
  const emptyMsg  = document.getElementById('template-empty-msg');
  if (!container) return;

  const templates = Templates.getAll();
  if (templates.length === 0) {
    container.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = '';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';

  container.innerHTML = templates.map((t, i) => `
    <div class="template-manage-item">
      <span style="font-size:20px">${t.emoji}</span>
      <div class="template-manage-info">
        <div class="template-manage-name">${escHtml(t.description)}</div>
        <div class="template-manage-meta">Rp ${t.amount.toLocaleString('id-ID')} · ${t.category}${t.notes ? ' · ' + escHtml(t.notes) : ''}</div>
      </div>
      <button class="btn-delete-template" onclick="deleteTemplate(${i})" title="Delete">✕</button>
    </div>
  `).join('');
}

function deleteTemplate(index) {
  Templates.remove(index);
  renderTemplates();
  renderTemplateManageList();
  // Start tutorial for new users — only after app screen is visible
  setTimeout(() => startTutorial(false), 600);

  showToast('Template deleted', 'info');
}

// ══════════════════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════════════════

function exportCSV(scope) {
  if (!allTransactions.length) {
    showToast('No data to export. Load history first.', 'error');
    return;
  }

  const now       = new Date();
  const curMonth  = MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear();
  const rows      = scope === 'month'
    ? allTransactions.filter(tx => tx.month === curMonth)
    : allTransactions;

  if (!rows.length) {
    showToast('No transactions for this period', 'info');
    return;
  }

  // Build CSV content
  const headers = ['Timestamp', 'Description', 'Amount (Rp)', 'Category', 'Notes', 'Month', 'Week'];
  const csvRows = [
    headers.join(','),
    ...rows.map(tx => [
      `"${(tx.timestamp || '').replace(/"/g, '""')}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.amount || 0,
      `"${(tx.category || '').replace(/"/g, '""')}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
      `"${(tx.month || '').replace(/"/g, '""')}"`,
      `"${(tx.week || '').replace(/"/g, '""')}"`,
    ].join(','))
  ];

  const csv      = csvRows.join('\n');
  const blob     = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url      = URL.createObjectURL(blob);
  const filename = scope === 'month'
    ? `wallet-tracker-${curMonth.replace(' ', '-')}.csv`
    : `wallet-tracker-all-${now.toISOString().split('T')[0]}.csv`;

  // Trigger download
  const a = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Downloaded: ${filename}`, 'success');
}

function updateExportCounts() {
  const countEl      = document.getElementById('export-count');
  const monthLabelEl = document.getElementById('export-month-label');
  if (!countEl) return;

  const now      = new Date();
  const curMonth = MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear();
  const monthly  = allTransactions.filter(tx => tx.month === curMonth);

  countEl.textContent      = `${allTransactions.length} transactions`;
  if (monthLabelEl) monthLabelEl.textContent = curMonth;
}



// ══════════════════════════════════════════════
// ONBOARDING TUTORIAL
// ══════════════════════════════════════════════

const TUTORIAL_KEY = 'wt_tutorial_done';

const TUTORIAL_STEPS = [
  {
    emoji:  '👋',
    title:  'Welcome to Wallet Tracker!',
    body:   'Track your daily spending in seconds. Let us show you around — it only takes a minute.',
    target: null, // no spotlight, centered
    position: 'center',
  },
  {
    emoji:  '✏️',
    title:  'Add Spending Here',
    body:   'Type what you bought and how much. We auto-detect the category instantly using our keyword library — no AI needed.',
    target: '.input-card',
    position: 'below',
  },
  {
    emoji:  '📷',
    title:  'Scan a Receipt',
    body:   'Tap "Scan Receipt" to photograph a bill. Claude AI reads it and fills the form automatically (requires Anthropic API key in Settings).',
    target: '.receipt-row',
    position: 'below',
  },
  {
    emoji:  '⚡',
    title:  'Quick Templates',
    body:   'Save frequent spending as templates — like your daily Grab or coffee. One tap fills the whole form.',
    target: '.templates-section',
    position: 'below',
  },
  {
    emoji:  '📋',
    title:  'Spending History',
    body:   'The History tab shows all your transactions. Search by keyword, filter by category, or sort by date and amount.',
    target: '[data-tab="history"]',
    position: 'above',
  },
  {
    emoji:  '📊',
    title:  'Dashboard & Budget',
    body:   'See monthly charts, week-on-week comparison, and set spending limits per category — all in the Dashboard tab.',
    target: '[data-tab="dashboard"]',
    position: 'above',
  },
  {
    emoji:  '🎉',
    title:  "You're all set!",
    body:   'Start by adding your first spending. You can replay this tour anytime from Settings → Help.',
    target: null,
    position: 'center',
  },
];

let tutorialStep = 0;

function startTutorial(force) {
  // Only auto-start for new users; force=true for manual replay
  if (!force && localStorage.getItem(TUTORIAL_KEY)) return;
  // Never show tutorial if auth screen is visible — only show inside the app
  const appScreen = document.getElementById('app-screen');
  if (!appScreen || appScreen.classList.contains('hidden')) return;
  // Switch to input tab so tutorial starts at the right place
  switchTab('input');
  tutorialStep = 0;
  document.getElementById('tutorial-overlay').classList.remove('hidden');
  renderTutorialStep();
}

function skipTutorial() {
  document.getElementById('tutorial-overlay').classList.add('hidden');
  localStorage.setItem(TUTORIAL_KEY, 'done');
}

function nextTutorialStep() {
  tutorialStep++;
  if (tutorialStep >= TUTORIAL_STEPS.length) {
    skipTutorial();
    // Switch to input tab to start fresh
    switchTab('input');
    return;
  }
  renderTutorialStep();
}

function renderTutorialStep() {
  const step    = TUTORIAL_STEPS[tutorialStep];
  const total   = TUTORIAL_STEPS.length;
  const isLast  = tutorialStep === total - 1;

  // Update tooltip content
  document.getElementById('tutorial-emoji').textContent = step.emoji;
  document.getElementById('tutorial-title').textContent = step.title;
  document.getElementById('tutorial-body').textContent  = step.body;

  const nextBtn = document.getElementById('tutorial-next-btn');
  nextBtn.textContent = isLast ? '🎉 Get Started' : 'Next →';
  nextBtn.className   = 'tutorial-next' + (isLast ? ' finish' : '');

  // Step dots
  document.getElementById('tutorial-step-dots').innerHTML = TUTORIAL_STEPS.map((_, i) =>
    '<span class="tutorial-dot' + (i === tutorialStep ? ' active' : '') + '"></span>'
  ).join('');

  // Position spotlight on target element
  const spotlight = document.getElementById('tutorial-spotlight');
  const tooltip   = document.getElementById('tutorial-tooltip');

  if (!step.target) {
    // No target — center tooltip, hide spotlight
    spotlight.style.display = 'none';
    tooltip.style.top    = '50%';
    tooltip.style.bottom = 'auto';
    tooltip.style.transform = 'translateX(-50%) translateY(-50%)';
    return;
  }

  spotlight.style.display = 'block';
  tooltip.style.transform = 'translateX(-50%)';

  // Find target element and spotlight it
  const el = document.querySelector(step.target);
  if (el) {
    const rect    = el.getBoundingClientRect();
    const padding = 8;
    spotlight.style.top    = (rect.top - padding) + 'px';
    spotlight.style.left   = (rect.left - padding) + 'px';
    spotlight.style.width  = (rect.width + padding * 2) + 'px';
    spotlight.style.height = (rect.height + padding * 2) + 'px';

    // Position tooltip above or below spotlight
    if (step.position === 'below') {
      tooltip.style.top    = (rect.bottom + 20) + 'px';
      tooltip.style.bottom = 'auto';
    } else if (step.position === 'above') {
      tooltip.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
      tooltip.style.top    = 'auto';
    }
  } else {
    // Element not found — skip to next
    spotlight.style.display = 'none';
    tooltip.style.top = '30%'; tooltip.style.bottom = 'auto';
  }

  // Scroll target into view smoothly
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ══════════════════════════════════════════════
// BUDGET MODAL (moved from Settings)
// ══════════════════════════════════════════════

function openBudgetModal() {
  // Populate budget inputs inside modal
  const container = document.getElementById('budget-modal-inputs');
  if (!container) return;
  const budgets = Budget.getAll();
  container.innerHTML = CATEGORIES.map(cat => {
    const id  = 'bm-' + cat.name.replace(/[^a-z]/gi,'_');
    const val = budgets[cat.name] ? Number(budgets[cat.name]).toLocaleString('id-ID') : '';
    return '<div class="budget-input-card" style="border-top-color:' + cat.color + '">' +
      '<div class="budget-cat-header">' +
      '<span class="budget-cat-emoji">' + cat.emoji + '</span>' +
      '<span class="budget-cat-name">' + cat.name + '</span></div>' +
      '<span class="budget-input-prefix">Rp</span>' +
      '<input type="text" class="budget-input-field" id="' + id + '" inputmode="numeric" placeholder="No limit" value="' + val + '">' +
      '</div>';
  }).join('');

  // Format on input
  container.querySelectorAll('.budget-input-field').forEach(inp => {
    inp.addEventListener('input', () => {
      let raw = inp.value.replace(/\D/g,'');
      inp.value = raw ? Number(raw).toLocaleString('id-ID') : '';
    });
  });

  document.getElementById('budget-modal').classList.remove('hidden');
}

function saveBudgetsFromModal() {
  const budgets = {};
  CATEGORIES.forEach(cat => {
    const id = 'bm-' + cat.name.replace(/[^a-z]/gi,'_');
    const el = document.getElementById(id);
    if (el) {
      const raw = parseInt(el.value.replace(/\D/g,''), 10);
      if (raw > 0) budgets[cat.name] = raw;
    }
  });
  Budget.saveAll(budgets);
  showToast('Budget saved ✓', 'success');
  closeBudgetModal();
  // Re-render budget bars in dashboard with current data
  if (allTransactions.length > 0) renderDashboardData();
  else {
    // No data yet — just update the empty state
    updateBudgetDashboardEmpty();
  }
}

function closeBudgetModal() {
  document.getElementById('budget-modal').classList.add('hidden');
}

function closeBudgetModalIfOverlay(e) {
  if (e.target === document.getElementById('budget-modal')) closeBudgetModal();
}

function updateBudgetDashboardEmpty() {
  const budgets = Budget.getAll();
  const emptyBtn = document.getElementById('btn-set-budget-empty');
  const barsContainer = document.getElementById('budget-bars');
  if (!emptyBtn || !barsContainer) return;
  const hasBudgets = Object.keys(budgets).length > 0;
  emptyBtn.style.display = hasBudgets ? 'none' : '';
  if (!hasBudgets) barsContainer.innerHTML = '';
}

// ══════════════════════════════════════════════
// RECEIPT PHOTOS
// Store photos as base64 in localStorage
// Key: receipt_<sheetRow> or receipt_tmp_<queueId>
// ══════════════════════════════════════════════

const Receipts = {
  _prefix: 'wt_receipt_',
  save(key, base64) {
    try {
      localStorage.setItem(this._prefix + key, base64);
    } catch(e) {
      // localStorage full — clear oldest receipts
      console.warn('localStorage full, clearing old receipts');
      this.clearOldest(5);
      try { localStorage.setItem(this._prefix + key, base64); } catch(e2) {}
    }
  },
  get(key) {
    return localStorage.getItem(this._prefix + key) || null;
  },
  delete(key) {
    localStorage.removeItem(this._prefix + key);
  },
  // Rename key when offline tx gets synced and gets a real sheetRow
  rename(oldKey, newKey) {
    const data = this.get(oldKey);
    if (data) { this.save(newKey, data); this.delete(oldKey); }
  },
  clearOldest(count) {
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(this._prefix))
      .slice(0, count);
    keys.forEach(k => localStorage.removeItem(k));
  },
};

// Current pending receipt (captured before save)
let pendingReceiptBase64 = null;
let pendingReceiptKey    = null;

function openReceiptCamera() {
  const input = document.getElementById('receipt-camera-input');
  if (input) input.click();
}

function onReceiptSelected(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = ''; // reset so same file can be re-selected

  const reader = new FileReader();
  reader.onload = async (e) => {
    const fullDataUrl = e.target.result;            // data:image/jpeg;base64,....
    const base64Data  = fullDataUrl.split(',')[1];  // just the base64 part
    const mediaType   = file.type || 'image/jpeg';

    // Store for later save
    pendingReceiptBase64 = fullDataUrl;
    showReceiptPreview(fullDataUrl, 'receipt-preview-container', 'receipt-preview-img');

    // Show OCR scanning state
    showOCRStatus('scanning');

    // Run OCR via Claude vision
    await runReceiptOCR(base64Data, mediaType);
  };
  reader.readAsDataURL(file);
}

function showOCRStatus(state) {
  const btn = document.querySelector('.btn-camera');
  if (!btn) return;
  if (state === 'scanning') {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Reading receipt...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Take Photo';
    btn.disabled = false;
    btn.style.opacity = '';
  }
}

async function runReceiptOCR(base64Data, mediaType) {
  const apiKey = Config.get('anthropicKey');
  if (!apiKey) {
    showToast('Add Anthropic API key in Settings to enable OCR', 'info');
    showOCRStatus('idle');
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':                          'application/json',
        'x-api-key':                             apiKey,
        'anthropic-version':                     '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            {
              type:   'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            {
              type: 'text',
              text: `You are reading a receipt or bill photo. Extract:
1. The merchant name or main item purchased (short, max 4 words, in Indonesian if possible)
2. The TOTAL amount in Indonesian Rupiah (IDR) as a plain integer — no Rp, no dots, no commas

Respond ONLY with valid JSON, nothing else:
{"description": "merchant or item name", "amount": 12000}

If you cannot read the receipt clearly, respond: {"description": "", "amount": 0}`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) throw new Error('API error ' + response.status);

    const data   = await response.json();
    const text   = (data.content?.[0]?.text || '').trim();
    const clean  = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    if (parsed.description || parsed.amount > 0) {
      // Auto-fill form fields
      if (parsed.description) {
        const descEl = document.getElementById('input-desc');
        if (descEl && !descEl.value) {
          descEl.value = parsed.description;
          onDescInput(); // trigger pattern suggestion
        }
      }
      if (parsed.amount > 0) {
        const amtEl = document.getElementById('input-amount');
        if (amtEl && !amtEl.value) {
          amtEl.value = parsed.amount.toLocaleString('id-ID');
        }
      }
      showToast('Receipt read ✓ — check & adjust if needed', 'success');
    } else {
      showToast('Could not read receipt clearly — fill manually', 'info');
    }
  } catch (e) {
    console.error('OCR error:', e);
    showToast('OCR failed — fill manually', 'info');
  } finally {
    showOCRStatus('idle');
  }
}

function showReceiptPreview(base64, containerId, imgId) {
  const container = document.getElementById(containerId);
  const img       = document.getElementById(imgId);
  if (!container || !img) return;
  img.src = base64;
  container.classList.remove('hidden');
}

function clearReceiptPreview() {
  pendingReceiptBase64 = null;
  const container = document.getElementById('receipt-preview-container');
  if (container) container.classList.add('hidden');
}

function savePendingReceipt(key) {
  if (!pendingReceiptBase64) return;
  Receipts.save(key, pendingReceiptBase64);
  pendingReceiptBase64 = null;
}

// Show receipt in edit modal
function openReceiptViewer(key) {
  const data = Receipts.get(key);
  if (!data) { showToast('No receipt for this transaction', 'info'); return; }
  // Open in new tab
  const win = window.open();
  win.document.write('<img src="' + data + '" style="max-width:100%;height:auto;">');
}


// ══════════════════════════════════════════════
// MONTHLY SPENDING REPORT (Print/PDF)
// ══════════════════════════════════════════════

function generateMonthlyReport(monthStr) {
  const targetMonth = monthStr || (MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear());
  const filtered    = allTransactions.filter(tx => tx.month === targetMonth);

  if (!filtered.length) {
    showToast('No transactions for ' + targetMonth, 'info');
    return;
  }

  // Aggregate stats
  const total = filtered.reduce((s, tx) => s + tx.amount, 0);
  const catTotals = {};
  filtered.forEach(tx => { catTotals[tx.category] = (catTotals[tx.category]||0) + tx.amount; });
  const sortedCats = Object.entries(catTotals).sort((a,b) => b[1]-a[1]);
  const topCat     = sortedCats[0];
  const daysWithSpending = new Set(
    filtered.map(tx => tx.timestamp.split(',')[0]?.trim()).filter(Boolean)
  ).size;
  const avgPerDay = daysWithSpending > 0 ? Math.round(total / daysWithSpending) : 0;

  // Top 5 transactions
  const top5 = [...filtered].sort((a,b) => b.amount - a.amount).slice(0, 5);

  // Category rows HTML
  const catRows = sortedCats.map(([name, amount]) => {
    const cat  = CATEGORIES.find(c => c.name === name) || CATEGORIES[9];
    const pct  = Math.round((amount / total) * 100);
    const bar  = Math.round(pct * 1.8); // max ~180px
    return `<tr>
      <td style="padding:8px 12px;font-size:14px">${cat.emoji} ${name}</td>
      <td style="padding:8px 12px;">
        <div style="background:#e2e8f0;border-radius:4px;height:8px;width:180px">
          <div style="background:${cat.color};width:${bar}px;height:8px;border-radius:4px"></div>
        </div>
      </td>
      <td style="padding:8px 12px;text-align:right;font-weight:600;font-size:14px">Rp ${amount.toLocaleString('id-ID')}</td>
      <td style="padding:8px 12px;text-align:right;color:#64748b;font-size:13px">${pct}%</td>
    </tr>`;
  }).join('');

  // Top 5 transaction rows
  const top5Rows = top5.map(tx => {
    const cat = CATEGORIES.find(c => c.name === tx.category) || CATEGORIES[9];
    return `<tr>
      <td style="padding:6px 12px;font-size:13px;color:#64748b">${tx.timestamp.split(',')[0]||''}</td>
      <td style="padding:6px 12px;font-size:14px">${cat.emoji} ${tx.description}</td>
      <td style="padding:6px 12px;font-size:13px;color:#64748b">${tx.category}</td>
      <td style="padding:6px 12px;text-align:right;font-weight:600;font-size:14px">Rp ${tx.amount.toLocaleString('id-ID')}</td>
    </tr>`;
  }).join('');

  // Build full HTML report
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Spending Report — ${targetMonth}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#0f1419; background:#fff; padding:32px; max-width:680px; margin:0 auto; }
    .logo { display:flex; align-items:center; gap:10px; margin-bottom:32px; }
    .logo-box { width:40px; height:40px; background:#1d9bf0; border-radius:10px; display:flex; align-items:center; justify-content:center; }
    .logo-box svg { width:24px; height:24px; }
    .logo-title { font-size:20px; font-weight:800; }
    h1 { font-size:28px; font-weight:800; letter-spacing:-0.5px; margin-bottom:4px; }
    .subtitle { color:#64748b; font-size:15px; margin-bottom:28px; }
    .summary-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:28px; }
    .stat-card { background:#f7f9f9; border-radius:12px; padding:16px; }
    .stat-value { font-size:22px; font-weight:800; letter-spacing:-0.5px; margin-bottom:4px; }
    .stat-label { font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; font-weight:600; }
    .stat-card.accent { background:#1d9bf0; color:#fff; }
    .stat-card.accent .stat-label { color:rgba(255,255,255,0.75); }
    h2 { font-size:16px; font-weight:700; margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid #f1f5f9; }
    table { width:100%; border-collapse:collapse; margin-bottom:28px; }
    tr:nth-child(even) { background:#f7f9f9; }
    .footer { text-align:center; color:#94a3b8; font-size:12px; margin-top:32px; padding-top:16px; border-top:1px solid #e2e8f0; }
    @media print {
      body { padding:20px; }
      .no-print { display:none; }
    }
  </style>
</head>
<body>
  <div class="logo">
    <div class="logo-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    </div>
    <span class="logo-title">Wallet Tracker</span>
  </div>

  <h1>Spending Report</h1>
  <p class="subtitle">${targetMonth} · Generated ${new Date().toLocaleDateString('id-ID', {day:'2-digit',month:'long',year:'numeric'})}</p>

  <div class="summary-grid">
    <div class="stat-card accent">
      <div class="stat-value">Rp ${total.toLocaleString('id-ID')}</div>
      <div class="stat-label">Total Spending</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">Rp ${avgPerDay.toLocaleString('id-ID')}</div>
      <div class="stat-label">Avg / Spending Day</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${filtered.length}</div>
      <div class="stat-label">Transactions</div>
    </div>
  </div>

  <h2>Spending by Category</h2>
  <table>
    <tbody>${catRows}</tbody>
  </table>

  <h2>Top 5 Transactions</h2>
  <table>
    <tbody>${top5Rows}</tbody>
  </table>

  <div class="footer">
    <p>Generated by Wallet Tracker · ${new Date().toISOString()}</p>
    <p style="margin-top:4px">farrashfz.github.io/dompet</p>
  </div>

  <br>
  <div class="no-print" style="text-align:center;margin-top:16px">
    <button onclick="window.print()" style="padding:12px 28px;background:#1d9bf0;color:#fff;border:none;border-radius:999px;font-size:15px;font-weight:700;cursor:pointer">
      🖨 Save as PDF / Print
    </button>
    <p style="color:#94a3b8;font-size:12px;margin-top:8px">Chrome: Print → Save as PDF</p>
  </div>

</body>
</html>`;

  // Open in new tab
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

// ══════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════

function showToast(message,type='info'){
  const el=document.getElementById('toast');
  el.textContent=message; el.className='toast '+type+' show';
  clearTimeout(el._timer);
  el._timer=setTimeout(()=>el.classList.remove('show'),3000);
}

function escHtml(str){
  const d=document.createElement('div'); d.textContent=str; return d.innerHTML;
}

function getWeekNumber(date){
  const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));
  const ys=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d-ys)/86400000)+1)/7);
}
