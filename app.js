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
const googleProvider = new firebase.auth.GoogleAuthProvider();

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

  // On mobile, Google sign-in uses redirect flow.
  // getRedirectResult() MUST be awaited before onAuthStateChanged is set up,
  // so the redirect credential is captured first and doesn't get lost.
  firebaseAuth.getRedirectResult()
    .then(result => {
      // If there's a redirect result, user will be signed in.
      // onAuthStateChanged below will fire with the user — nothing extra needed.
      if (result && result.user) {
        console.log('Redirect sign-in success:', result.user.email);
      }
    })
    .catch(e => {
      if (e.code && e.code !== 'auth/no-auth-event') {
        console.error('Redirect result error:', e.code, e.message);
        showAuthError('login', friendlyAuthError(e.code));
      }
    })
    .finally(() => {
      // Set up auth state listener AFTER redirect result is processed
      firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          currentUser = user;
          showApp(user);
        } else {
          currentUser = null;
          showAuthScreen();
        }
      });
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

function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
}

function showApp(user) {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  // Set up app DOM listeners now that app-screen is visible
  initAppListeners();
  renderUserAvatar(user);
  document.getElementById('user-email-display').textContent = user.email || 'Signed in';

  // Attempt Sheets OAuth
  if (Config.clientId) {
    const isGoogleUser = user.providerData && user.providerData.some(p => p.providerId === 'google.com');
    initSheetsAuth(isGoogleUser ? user.email : null);
  }

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

function signInGoogle() {
  clearAuthErrors();

  // Detect mobile — Android Chrome cannot reliably deliver popup postMessage
  // back to a backgrounded parent tab. Use redirect on mobile, popup on desktop.
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // Show a brief "Redirecting..." message so user knows something is happening
    document.querySelectorAll('.auth-btn-google').forEach(btn => {
      btn.textContent = 'Redirecting to Google...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    });
    // signInWithRedirect navigates away; result is captured by
    // getRedirectResult() when the page loads again (see DOMContentLoaded above)
    firebaseAuth.signInWithRedirect(googleProvider);
    // Code after this line does NOT run — page navigates away
    return;
  }

  // Desktop: popup works reliably
  document.querySelectorAll('.auth-btn-google').forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });

  firebaseAuth.signInWithPopup(googleProvider).then(() => {
    // onAuthStateChanged fires → showApp()
  }).catch(e => {
    document.querySelectorAll('.auth-btn-google').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '';
    });
    if (e.code === 'auth/popup-blocked') {
      showAuthError('login', 'Popup blocked. Allow popups for this site in Chrome settings and try again.');
    } else if (e.code !== 'auth/popup-closed-by-user') {
      showAuthError('login', friendlyAuthError(e.code));
      console.error('Google sign-in error:', e.code, e.message);
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
  await firebaseAuth.signOut();
  allTransactions = []; recentItems = [];
  accessToken = null;
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

// ── Google Sheets OAuth (separate from Firebase Auth) ──
function initSheetsAuth(emailHint) {
  if (!Config.clientId) return;

  const tryInit = () => {
    if (typeof google === 'undefined' || !google.accounts) { setTimeout(tryInit, 500); return; }
    if (sheetsTokenClient) {
      // Already initialized, just request token
      sheetsTokenClient.requestAccessToken({ prompt: '', login_hint: emailHint || '' });
      return;
    }
    sheetsTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: Config.clientId,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      callback: (resp) => {
        if (!resp.error) {
          accessToken = resp.access_token;
          document.getElementById('sync-indicator')?.classList.add('hidden');
          // Auto-sync queue if any pending
          if (Queue.count() > 0) syncQueue();
        }
      },
      error_callback: () => {},
    });
    sheetsTokenClient.requestAccessToken({ prompt: '', login_hint: emailHint || '' });
  };
  tryInit();
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
  if (!accessToken || !Config.sheetId) { showToast('Connect Google Sheets first', 'error'); return; }
  const queue = Queue.getAll();
  if (!queue.length) { showToast('Nothing to sync', 'info'); return; }
  let synced = 0;
  for (const item of queue) {
    try {
      await appendRow([item.timestamp, item.description, item.amount, item.category, item.month, item.week]);
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
const SHEET_RANGE = SHEET_NAME + '!A:F';

async function sheetsAPI(method, range, body, qp) {
  if (!accessToken) throw new Error('No Sheets access. Connect Google Sheets in Settings.');
  let url = 'https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + '/values/' + range;
  if (qp) url += '?' + new URLSearchParams(qp).toString();
  const opts = { method, headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 401) {
    accessToken = null;
    if (sheetsTokenClient) sheetsTokenClient.requestAccessToken({ prompt: '' });
    throw new Error('Sheets token expired — reconnecting...');
  }
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || 'Sheets error ' + res.status); }
  return res.json();
}

async function appendRow(row) {
  const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + '/values/' + SHEET_RANGE + ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || 'Append error'); }
  const data = await res.json();
  const match = data.updates?.updatedRange?.match(/!A(\d+):/);
  return match ? parseInt(match[1], 10) : null;
}

async function updateRow(sheetRow, row) {
  return sheetsAPI('PUT', SHEET_NAME + '!A' + sheetRow + ':F' + sheetRow, { values: [row] }, { valueInputOption: 'USER_ENTERED' });
}

async function deleteRow(sheetRow) {
  const metaRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId, {
    headers: { 'Authorization': 'Bearer ' + accessToken },
  });
  const meta  = await metaRes.json();
  const sheet = meta.sheets?.find(s => s.properties?.title === SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found');
  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + ':batchUpdate', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ deleteDimension: { range: { sheetId: sheet.properties.sheetId, dimension: 'ROWS', startIndex: sheetRow-1, endIndex: sheetRow } } }] }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || 'Delete error'); }
}

async function readAllRows() {
  const data = await sheetsAPI('GET', SHEET_RANGE);
  return data.values || [];
}

async function initSheetHeaders() {
  if (!accessToken) { showToast('Connect Google Sheets first', 'error'); return; }
  try {
    const checkUrl = 'https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId;
    const metaRes  = await fetch(checkUrl, { headers: { 'Authorization': 'Bearer ' + accessToken } });
    if (!metaRes.ok) { showToast('Cannot access Sheet. Check Sheet ID.', 'error'); return; }
    const meta = await metaRes.json();
    if (!meta.sheets?.some(s => s.properties?.title === SHEET_NAME)) {
      await fetch(checkUrl + ':batchUpdate', {
        method: 'POST', headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }),
      });
    }
    await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + Config.sheetId + '/values/' + SHEET_NAME + '!A1:F1?valueInputOption=USER_ENTERED', {
      method: 'PUT', headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['Timestamp','Description','Amount','Category','Month','Week']] }),
    });
    showToast('Headers created ✓', 'success');
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

// ══════════════════════════════════════════════
// LOAD TODAY'S RECENT
// ══════════════════════════════════════════════

async function loadTodayRecent() {
  if (!accessToken || !Config.sheetId) return;
  try {
    const rows = await readAllRows();
    if (rows.length <= 1) return;
    const todayStr = new Date().toLocaleDateString('id-ID', { year:'numeric', month:'2-digit', day:'2-digit' });
    const all = rows.slice(1).map((r, i) => ({
      timestamp:   r[0] || '',
      description: r[1] || '',
      amount:      parseInt((r[2] || '0').toString().replace(/\D/g,''), 10),
      category:    r[3] || 'Others',
      month:       r[4] || '',
      week:        r[5] || '',
      sheetRow:    i + 2,
    }));
    recentItems     = all.filter(tx => (tx.timestamp.split(',')[0]?.trim()||'') === todayStr).reverse().slice(0,10);
    allTransactions = all.reverse();
    renderRecent(); updateTodayTotal();
  } catch (e) { console.warn('loadTodayRecent:', e.message); }
}

function updateTodayTotal() {
  const total = recentItems.reduce((s,tx) => s+tx.amount, 0);
  const badge = document.getElementById('today-total');
  if (total > 0) {
    badge.classList.remove('hidden');
    document.getElementById('today-total-amount').textContent = 'Rp ' + total.toLocaleString('id-ID');
  } else {
    badge.classList.add('hidden');
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

  const parseDate = (ts) => {
    const parts = ts.split(',')[0]?.trim().split('/');
    if (parts?.length === 3) return new Date(parseInt(parts[2]),parseInt(parts[1])-1,parseInt(parts[0]));
    return null;
  };

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
  const txData   = { timestamp, description, amount, category, month: monthStr, week: weekStr };

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
    const sheetRow = await appendRow([timestamp, description, amount, category, monthStr, weekStr]);
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

    descEl.value=''; amtEl.value=''; setDateToday(); descEl.focus();
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
  if (editTarget.sheetRow) {
    try { await updateRow(editTarget.sheetRow,[newTs,newDesc,newAmount,newCat,newMonth,newWeek]); showToast('Updated ✓','success'); }
    catch(e) { showToast('Update failed: '+e.message,'error'); return; }
  }
  tx.timestamp=newTs; tx.description=newDesc; tx.amount=newAmount; tx.category=newCat; tx.month=newMonth; tx.week=newWeek;
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
  if (!accessToken||!Config.sheetId) {
    const listEl = document.getElementById('history-list');
    if (listEl) listEl.innerHTML = '<p class="empty-state">Set up Google Sheets in Settings first</p>';
    return;
  }
  const listEl = document.getElementById('history-list');
  const icon   = document.getElementById('history-refresh-icon');
  listEl.innerHTML='<p class="empty-state">Loading...</p>';
  if (icon) icon.classList.add('spinning');
  try {
    const rows = await readAllRows();
    if (rows.length<=1) { listEl.innerHTML='<p class="empty-state">No data yet. Add your first spending!</p>'; return; }
    allTransactions = rows.slice(1).map((r,i) => ({
      timestamp:r[0]||'', description:r[1]||'',
      amount:parseInt((r[2]||'0').toString().replace(/\D/g,''),10),
      category:r[3]||'Others', month:r[4]||'', week:r[5]||'', sheetRow:i+2,
    })).reverse();
    applyHistoryFilter();
  } catch(e) { listEl.innerHTML='<p class="empty-state">Error: '+e.message+'</p>'; }
  finally { if (icon) icon.classList.remove('spinning'); }
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
  if(!accessToken||!Config.sheetId) { showToast('Connect Sheets first in Settings','error'); return; }
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
  // History: always auto-load when switching to tab (no manual refresh needed)
  if (tab==='history') {
    if (accessToken && Config.sheetId) {
      loadHistory();
    } else {
      const listEl = document.getElementById('history-list');
      if (listEl) listEl.innerHTML = '<p class="empty-state">Set up Google Sheets in Settings first</p>';
    }
  }
  if(tab==='dashboard'&&allTransactions.length===0&&accessToken) loadDashboard();
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
