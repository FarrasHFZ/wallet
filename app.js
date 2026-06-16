/* ============================================
   WALLET TRACKER v1.6
   + Offline Queue
   + Budget Limits per Category
   ============================================ */

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
    'bakar','goreng','rebus','kuah','sambal','tongseng','gulai','rawon',
    'lontong','ketoprak','kerak telor','seblak','cilok','cireng','cimol',
    'tahu','tempe','sarden','mie ayam','mie goreng','mie rebus',
    'bakmi','kwetiau','bihun','capcay','nasi campur','nasi kuning',
    'ricebowl','rice bowl','salad','sandwich','wrap','kebab','shawarma',
    'takoyaki','okonomiyaki','bibimbap','jajanan','warung','kantin',
    'food court','food','minum','minuman','drink','thai tea','matcha',
    'smoothie','milkshake','es krim','ice cream','gelato','coklat',
    'chocolate','pancake','waffle','croissant','pastry','bakery',
    'breadtalk','tous les jours','holland bakery','dunkin','donuts',
    'jco','kopitiam','kedai','angkringan','lesehan',
    'hokben','yoshinoya','marugame','solaria','es campur','cendol',
    'dawet','kolak','klepon','onde','lumpia','risol','pastel',
    'kroket','tteokbokki','ramyeon','tom yum','somtam','pho',
    'banh mi','tempura','katsu','gyudon','curry','kari',
  ],
  'Groceries': [
    'indomaret','alfamart','alfamidi','supermarket','superindo','hypermart',
    'giant','lottemart','carrefour','ranch market','farmers market','hero',
    'beras','telur','minyak goreng','gula','garam','sayur','buah','daging',
    'susu','roti tawar','sabun','sampo','shampoo','tissue','odol','pasta gigi',
    'detergen','deterjen','grocery','belanja bulanan','sembako','tepung',
    'mentega','margarin','keju','yogurt','sosis','nugget','frozen',
    'bumbu','kecap','saos','saus','cuka','merica','kunyit','bawang',
    'cabai','cabe','tomat','kentang','wortel','kangkung','bayam',
    'brokoli','toge','jamur','jagung','terong','labu','timun','selada',
    'seledri','daun bawang','jahe','lengkuas','sereh','daun salam',
    'santan','kelapa','madu','selai','sereal','oat','granola',
    'snack anak','pampers','popok','susu formula','makanan bayi',
    'kapas','cotton bud','pembalut','pewangi','pelembut','sapu',
    'pel','ember','trash bag','plastik','aluminium foil','cling wrap',
    'tisu basah','hand soap','body wash','conditioner','lotion',
    'sunscreen','deodorant',
  ],
  'Transport': [
    'grab','gojek','gocar','goride','grabcar','grabbike','uber','taxi','taksi',
    'bensin','pertamax','pertalite','solar','shell','pertamina','bp',
    'tol','parkir','toll','angkot','bus','transjakarta','busway',
    'mrt','lrt','krl','commuter','kereta','train','ojek','ojol','maxim',
    'bandara','airport','pesawat','flight','tiket pesawat','boarding',
    'travel','shuttle','damri','bluebird','blue bird','express',
    'tarif','ongkir','ongkos','transport','transportasi',
    'ganti oli','oli','servis motor','servis mobil','service kendaraan',
    'cuci motor','cuci mobil','tune up','ban','tire',
    'sim','stnk','pajak kendaraan','samsat',
    'e-toll','etoll','flazz','brizzi','emoney','e-money','indriver','indrive',
  ],
  'Health': [
    'obat','apotek','apotik','farmasi','pharmacy','dokter','doctor',
    'klinik','clinic','rumah sakit','rs','hospital','vitamin',
    'supplement','suplemen','medical','kesehatan','health',
    'lab','laboratorium','check up','checkup','medical check',
    'pcr','antigen','vaksin','vaccine','gigi','dentist','dental',
    'mata','eye','optik','kacamata minus','terapi','therapy',
    'fisioterapi','physiotherapy','psikolog','psikiater','counseling',
    'konsultasi dokter','rawat','igd','ugd','bpjs','asuransi kesehatan',
    'masker medis','hand sanitizer','antiseptik','perban','plester',
    'thermometer','tensimeter','oximeter','inhaler','nebulizer',
    'paracetamol','ibuprofen','amoxicillin','antibiotik','salep',
    'tetes mata','sirup obat','herbal','jamu','tolak angin',
    'antangin','komix','promag','mylanta','diapet','oralit',
    'betadine','minyak kayu putih','balsem','koyo',
  ],
  'Shopping': [
    'baju','celana','sepatu','sandal','tas','jaket','hoodie','kaos',
    'kemeja','dress','rok','jeans','sneakers','boots','loafer',
    'uniqlo','h&m','hm','zara','pull and bear','pull&bear',
    'cotton on','mango','marks spencer','giordano','eiger',
    'shopee','tokopedia','lazada','blibli','tiktok shop','bukalapak',
    'fashion','pakaian','clothing','aksesoris','accessories',
    'jam tangan','watch','gelang','kalung','anting','cincin',
    'kacamata','sunglass','parfum','perfume','skincare','makeup',
    'cosmetic','kosmetik','bodycare','perawatan','foundation',
    'lipstik','lipstick','mascara','eyeshadow','blush','powder',
    'serum','toner','moisturizer','cleanser','face wash','sunblock',
    'body lotion','hand cream','nail polish','hair oil',
    'dompet','wallet','belt','ikat pinggang','topi','hat','cap',
    'syal','scarf','masker kain','kaus kaki','underwear',
    'oleh oleh','oleh-oleh','souvenir','gift','kado','hadiah',
    'bunga','florist','perhiasan','jewelry',
    'mall','department store','outlet','thrift','preloved','secondhand',
  ],
  'Entertainment': [
    'netflix','spotify','disney','youtube premium','hbo','prime video',
    'apple music','joox','vidio','viu','wetv','iqiyi','amazon prime',
    'bioskop','cinema','xxi','cgv','cinepolis','platinum',
    'game','steam','playstation','ps5','ps4','ps plus','xbox','gamepass',
    'nintendo','switch','mobile legend','ml','pubg','free fire','ff',
    'genshin','valorant','dota','fortnite','roblox','minecraft',
    'konser','concert','festival','tiket event','event','acara',
    'karaoke','bowling','billiard','bilyard','arcade','timezone',
    'nonton','film','movie','series','drakor','anime','manga',
    'museum','taman hiburan','waterpark','ancol','dufan','jungleland',
    'trans studio','kidzania','escape room','paintball','go kart',
    'rafting','diving','snorkeling','surfing','camping','hiking',
    'piknik','picnic','wisata','rekreasi','recreation','liburan',
    'vacation','staycation','hotel','resort','villa','airbnb',
    'traveloka','tiket.com','agoda','booking.com','pegi pegi',
    'gym','fitness','yoga','pilates','swimming','renang',
    'badminton','futsal','basket','tennis','golf','climbing',
    'bouldering','trampoline','ice skating',
    'bar','club','lounge','rooftop','hangout','nongkrong',
    'board game','escape','karting',
  ],
  'Home & Utilities': [
    'listrik','pln','token listrik','pdam','air','iuran air',
    'wifi','internet','indihome','biznet','firstmedia','myrepublic',
    'telkom','cbn','mnc play','xl home','iconnet',
    'gas','lpg','elpiji','tabung gas','bright gas',
    'sewa','kost','kos','kontrakan','kontrak','apartment','apartemen',
    'ipl','maintenance','iuran','rt','rw','sampah','kebersihan',
    'service ac','laundry','dry clean','cuci baju','setrika',
    'cleaning','bersih','cleaning service','asisten rumah tangga','art',
    'renovasi','perbaikan','tukang','plumber','pipa','keran',
    'furniture','ikea','informa','ace hardware','depo bangunan',
    'cat','lampu','bohlam','kasur','bantal','guling','sprei',
    'selimut','handuk','gorden','karpet','rak','lemari','meja','kursi',
    'sofa','cermin','jam dinding','hanger','jemuran',
    'kompor','kulkas','mesin cuci','ac','kipas angin',
    'vacuum','blender','rice cooker','dispenser','microwave','oven',
    'panci','wajan','spatula','pisau dapur','talenan','piring',
    'gelas','mangkok','sendok','garpu','tupperware',
    'pajak bumi','pbb','cicilan rumah','kpr','mortgage',
  ],
  'Tech': [
    'laptop','komputer','computer','pc','desktop','macbook','thinkpad',
    'handphone','hp','smartphone','iphone','samsung','xiaomi','oppo',
    'vivo','realme','poco','pixel','oneplus','nothing','asus','lenovo',
    'gadget','elektronik','electronic','charger','kabel','cable',
    'earphone','headphone','headset','earbuds','airpods','tws',
    'speaker','bluetooth','mouse','keyboard','monitor','webcam',
    'printer','scanner','harddisk','hard disk','ssd','ram','flash disk',
    'flashdisk','memory card','micro sd','usb','hub','dongle',
    'case hp','casing hp','cover hp','adapter','power bank','powerbank',
    'screen protector','tempered glass','anti gores',
    'tripod','gimbal','ring light','mic','microphone',
    'tablet','ipad','tab','smartwatch','smart watch','smart band',
    'router','modem','access point','switch hub',
    'drone','action cam','gopro','kamera','camera','lensa','lens',
    'software','aplikasi','app','subscription','langganan','domain',
    'hosting','cloud','storage','icloud','google one',
    'repair','ganti lcd','ganti baterai','service hp','service laptop',
    'pulsa','paket data','kuota','internet hp',
  ],
  'Education': [
    'kursus','course','les','private','bimbel','bimbingan belajar',
    'buku','book','ebook','e-book','kindle','novel','komik','majalah',
    'udemy','coursera','skillshare','codecademy','linkedin learning',
    'masterclass','ruangguru','zenius','brainly','quipper',
    'seminar','webinar','workshop','training','pelatihan','bootcamp',
    'sertifikasi','certification','exam','ujian','tes','test',
    'sekolah','school','kuliah','university','kampus','universitas',
    'tuition','spp','uang kuliah','uang sekolah','daftar ulang',
    'skripsi','thesis','jurnal','paper','riset','research',
    'print','fotokopi','photocopy','fotocopy','jilid','laminating',
    'alat tulis','stationery','atk','pensil','pulpen','binder',
    'notebook','buku tulis','map','amplop','stabilo','spidol',
    'penggaris','penghapus','tip ex','lem','gunting','stapler',
    'kalkulator','tas sekolah','seragam','perpustakaan','library',
    'tutor','mentor','coaching','konsultasi akademik',
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

// ---- Config ----
const Config = {
  get(k)        { return localStorage.getItem('dompet_' + k) || ''; },
  set(k, v)     { localStorage.setItem('dompet_' + k, v); },
  get clientId(){ return this.get('clientId'); },
  get sheetId() { return this.get('sheetId'); },
};

// ---- Budget ----
const Budget = {
  getAll() {
    try { return JSON.parse(localStorage.getItem('dompet_budgets') || '{}'); } catch { return {}; }
  },
  get(cat) { return parseInt(this.getAll()[cat] || '0', 10); },
  saveAll(obj) { localStorage.setItem('dompet_budgets', JSON.stringify(obj)); },
};

// ---- Offline Queue ----
const Queue = {
  getAll() {
    try { return JSON.parse(localStorage.getItem('dompet_queue') || '[]'); } catch { return []; }
  },
  add(item) {
    const q = this.getAll();
    q.push({ ...item, _queueId: Date.now() });
    localStorage.setItem('dompet_queue', JSON.stringify(q));
    updateQueueUI();
  },
  remove(queueId) {
    const q = this.getAll().filter(i => i._queueId !== queueId);
    localStorage.setItem('dompet_queue', JSON.stringify(q));
    updateQueueUI();
  },
  clear() {
    localStorage.removeItem('dompet_queue');
    updateQueueUI();
  },
  count() { return this.getAll().length; },
};

function updateQueueUI() {
  const count = Queue.count();
  const indicator = document.getElementById('sync-indicator');
  const notice = document.getElementById('queue-notice');
  const noticeText = document.getElementById('queue-notice-text');
  const syncCount = document.getElementById('sync-count');

  if (count > 0) {
    indicator?.classList.remove('hidden');
    if (syncCount) syncCount.textContent = count;
    notice?.classList.remove('hidden');
    if (noticeText) noticeText.textContent = `${count} transaksi pending sync ke Google Sheets`;
  } else {
    indicator?.classList.add('hidden');
    notice?.classList.add('hidden');
  }
}

// ---- State ----
let accessToken     = null;
let tokenClient     = null;
let allTransactions = [];
let recentItems     = [];
let dashboardMonth  = new Date();
let pieChart        = null;
let barChart        = null;
let editTarget      = null;
let deleteTarget    = null;
let useCustomDate   = false;
let activeFilterCat = 'all';
let isOnline        = navigator.onLine;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadSettingsUI();
  renderBudgetInputs();
  tryInitGoogle();
  tryAutoSignIn();
  applyDarkMode(Config.get('darkMode') === 'true');

  document.getElementById('input-date').value = todayISO();
  updateQueueUI();
  loadNotifSettings();

  const amtInput = document.getElementById('input-amount');
  amtInput.addEventListener('input', () => {
    let raw = amtInput.value.replace(/[^\d]/g, '');
    if (raw) amtInput.value = Number(raw).toLocaleString('id-ID');
  });
  amtInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });

  document.getElementById('edit-amount').addEventListener('input', () => {
    let raw = document.getElementById('edit-amount').value.replace(/[^\d]/g, '');
    if (raw) document.getElementById('edit-amount').value = Number(raw).toLocaleString('id-ID');
  });

  // Online / offline detection
  window.addEventListener('online',  () => { isOnline = true;  onOnline(); });
  window.addEventListener('offline', () => { isOnline = false; onOffline(); });
  if (!navigator.onLine) onOffline();
});

// ============================================
// ONLINE / OFFLINE
// ============================================

function onOffline() {
  document.getElementById('offline-banner')?.classList.remove('hidden');
}

function onOnline() {
  document.getElementById('offline-banner')?.classList.add('hidden');
  if (Queue.count() > 0 && accessToken) {
    showToast(`🔄 Online! Menyinkronkan ${Queue.count()} transaksi...`, 'info');
    syncQueue();
  }
}

async function syncQueue() {
  if (!accessToken || !Config.sheetId) {
    showToast('Sign in ke Google dulu sebelum sync', 'error');
    return;
  }
  const queue = Queue.getAll();
  if (queue.length === 0) { showToast('Tidak ada transaksi pending', 'info'); return; }

  let synced = 0;
  for (const item of queue) {
    try {
      const row = [item.timestamp, item.description, item.amount, item.category, item.month, item.week];
      await appendRow(row);
      Queue.remove(item._queueId);
      synced++;
    } catch (e) {
      console.error('Sync failed for item:', item, e);
    }
  }

  if (synced > 0) {
    showToast(`✓ ${synced} transaksi berhasil disinkronkan`, 'success');
    loadTodayRecent(); // refresh recent list
  }
  if (Queue.count() > 0) {
    showToast(`⚠️ ${Queue.count()} transaksi gagal sync`, 'error');
  }
}

// ============================================
// DARK MODE
// ============================================

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

// ============================================
// DATE
// ============================================

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
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
  const [y, m, d] = val.split('-').map(Number);
  const now = new Date();
  return new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds());
}

// ============================================
// GOOGLE AUTH
// ============================================

function tryInitGoogle() {
  if (!Config.clientId) return;
  if (typeof google === 'undefined' || !google.accounts) { setTimeout(tryInitGoogle, 500); return; }
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: Config.clientId,
    scope: 'https://www.googleapis.com/auth/spreadsheets openid email',
    callback: onTokenResponse,
    error_callback: (err) => { console.warn('Auto sign-in failed:', err); updateAuthUI(false); },
  });
}

function tryAutoSignIn() {
  if (!Config.clientId || !Config.get('userEmail')) return;
  document.getElementById('auth-status').textContent = '⟳ Connecting...';
  const attempt = () => {
    if (!tokenClient) { setTimeout(attempt, 500); return; }
    tokenClient.requestAccessToken({ prompt: '', login_hint: Config.get('userEmail') });
  };
  attempt();
}

function onTokenResponse(resp) {
  if (resp.error) { showToast('Auth gagal: ' + resp.error, 'error'); updateAuthUI(false); return; }
  accessToken = resp.access_token;
  fetchAndStoreEmail();
  if (!Config.get('userEmail')) showToast('Signed in ✓', 'success');
  updateAuthUI(true);
  loadTodayRecent();
  // Auto-sync queue on sign-in if online
  if (isOnline && Queue.count() > 0) {
    setTimeout(() => syncQueue(), 1500);
  }
}

async function fetchAndStoreEmail() {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { 'Authorization': `Bearer ${accessToken}` } });
    const data = await res.json();
    if (data.email) Config.set('userEmail', data.email);
  } catch (e) { console.warn(e); }
}

function handleSignIn() {
  if (!Config.clientId) { showToast('Isi Google Client ID dulu di Settings', 'error'); return; }
  if (!tokenClient) { tryInitGoogle(); setTimeout(handleSignIn, 800); return; }
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

function handleSignOut() {
  if (accessToken) google.accounts.oauth2.revoke(accessToken);
  accessToken = null;
  Config.set('userEmail', '');
  updateAuthUI(false);
  showToast('Signed out', 'info');
}

function updateAuthUI(signedIn) {
  const email = Config.get('userEmail');
  document.getElementById('auth-status').textContent = signedIn
    ? (email ? `● ${email.split('@')[0]}` : '● Connected') : '';
  document.getElementById('settings-auth').innerHTML = signedIn
    ? `<p class="signed-in-info">Terhubung sebagai <strong>${email || 'Google'}</strong></p><button class="btn-signout" onclick="handleSignOut()">Sign Out</button>`
    : '<button class="btn-google" onclick="handleSignIn()">Sign in with Google</button>';
}

async function ensureToken() {
  if (!accessToken) { showToast('Sign in ke Google dulu', 'error'); throw new Error('Not authenticated'); }
  return accessToken;
}

// ============================================
// SHEETS API
// ============================================

const SHEET_NAME = 'Transactions';
const SHEET_RANGE = `${SHEET_NAME}!A:F`;

async function sheetsAPI(method, range, body, queryParams) {
  const token = await ensureToken();
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}/values/${range}`;
  if (queryParams) url += '?' + new URLSearchParams(queryParams).toString();
  const opts = { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 401) { accessToken = null; updateAuthUI(false); showToast('Sesi habis, sign in ulang', 'error'); throw new Error('Token expired'); }
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || `Sheets error ${res.status}`); }
  return res.json();
}

async function appendRow(row) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}/values/${SHEET_RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const token = await ensureToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || 'Sheets error'); }
  const data = await res.json();
  const match = data.updates?.updatedRange?.match(/!A(\d+):/);
  return match ? parseInt(match[1], 10) : null;
}

async function updateRow(sheetRow, row) {
  return sheetsAPI('PUT', `${SHEET_NAME}!A${sheetRow}:F${sheetRow}`, { values: [row] }, { valueInputOption: 'USER_ENTERED' });
}

async function deleteRow(sheetRow) {
  const token = await ensureToken();
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}`, { headers: { 'Authorization': `Bearer ${token}` } });
  const meta = await metaRes.json();
  const sheet = meta.sheets?.find(s => s.properties?.title === SHEET_NAME);
  if (!sheet) throw new Error('Sheet tidak ditemukan');
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}:batchUpdate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ deleteDimension: { range: { sheetId: sheet.properties.sheetId, dimension: 'ROWS', startIndex: sheetRow - 1, endIndex: sheetRow } } }] }),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || 'Delete error'); }
}

async function readAllRows() {
  const data = await sheetsAPI('GET', SHEET_RANGE);
  return data.values || [];
}

async function initSheetHeaders() {
  try {
    await ensureToken();
    const token = accessToken;
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}`;
    const metaRes = await fetch(checkUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!metaRes.ok) { showToast('Gagal akses Sheet. Cek Sheet ID.', 'error'); return; }
    const meta = await metaRes.json();
    if (!meta.sheets?.some(s => s.properties?.title === SHEET_NAME)) {
      await fetch(`${checkUrl}:batchUpdate`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }),
      });
    }
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}/values/${SHEET_NAME}!A1:F1?valueInputOption=USER_ENTERED`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['Timestamp', 'Description', 'Amount', 'Category', 'Month', 'Week']] }),
    });
    showToast('Headers berhasil dibuat ✓', 'success');
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

// ============================================
// LOAD TODAY'S RECENT
// ============================================

async function loadTodayRecent() {
  if (!accessToken || !Config.sheetId) return;
  try {
    const rows = await readAllRows();
    if (rows.length <= 1) return;
    const todayStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const all = rows.slice(1).map((r, i) => ({
      timestamp: r[0] || '', description: r[1] || '',
      amount: parseInt((r[2] || '0').toString().replace(/[^\d]/g, ''), 10),
      category: r[3] || 'Others', month: r[4] || '', week: r[5] || '',
      sheetRow: i + 2,
    }));
    recentItems = all.filter(tx => tx.timestamp.split(',')[0]?.trim() === todayStr).reverse().slice(0, 10);
    renderRecent();
    updateTodayTotal();
    allTransactions = all.reverse();
  } catch (e) { console.warn('Could not load today recents:', e); }
}

function updateTodayTotal() {
  const total = recentItems.reduce((s, tx) => s + tx.amount, 0);
  const badge = document.getElementById('today-total');
  if (total > 0) {
    badge.classList.remove('hidden');
    document.getElementById('today-total-amount').textContent = 'Rp ' + total.toLocaleString('id-ID');
  } else {
    badge.classList.add('hidden');
  }
}

// ============================================
// BUDGET
// ============================================

function renderBudgetInputs() {
  const container = document.getElementById('budget-inputs');
  if (!container) return;
  const budgets = Budget.getAll();
  container.innerHTML = CATEGORIES.map(cat => {
    const id  = 'budget-' + cat.name.replace(/[^a-z]/gi,'_');
    const val = budgets[cat.name] ? Number(budgets[cat.name]).toLocaleString('id-ID') : '';
    return `
    <div class="budget-input-card" style="border-top: 3px solid ${cat.color}">
      <div class="budget-cat-header">
        <span class="budget-cat-emoji">${cat.emoji}</span>
        <span class="budget-cat-name">${cat.name}</span>
      </div>
      <span class="budget-input-prefix">Rp</span>
      <input type="text" class="budget-input-field" id="${id}"
        inputmode="numeric" placeholder="No limit"
        value="${val}">
    </div>`;
  }).join('');

  container.querySelectorAll('.budget-input-field').forEach(inp => {
    inp.addEventListener('input', () => {
      let raw = inp.value.replace(/[^\d]/g, '');
      inp.value = raw ? Number(raw).toLocaleString('id-ID') : '';
    });
  });
}

function saveBudgets() {
  const budgets = {};
  CATEGORIES.forEach(cat => {
    const id = 'budget-' + cat.name.replace(/[^a-z]/gi,'_');
    const el = document.getElementById(id);
    if (el) {
      const raw = parseInt(el.value.replace(/[^\d]/g, ''), 10);
      if (raw > 0) budgets[cat.name] = raw;
    }
  });
  Budget.saveAll(budgets);
  showToast('Budget tersimpan ✓', 'success');
}

function checkBudgetWarning(category, currentMonthTotal) {
  const limit = Budget.get(category);
  if (!limit) return;
  const pct = currentMonthTotal / limit;
  if (pct >= 1.0) {
    const cat = CATEGORIES.find(c => c.name === category);
    showToast(`🚨 ${cat?.emoji || ''} ${category} sudah melebihi budget!`, 'error');
  } else if (pct >= 0.8) {
    const cat = CATEGORIES.find(c => c.name === category);
    showToast(`⚠️ ${cat?.emoji || ''} ${category} sudah ${Math.round(pct*100)}% dari budget`, 'info');
  }
}

function renderBudgetBars(catTotals) {
  const budgets = Budget.getAll();
  const section = document.getElementById('budget-progress-section');
  const container = document.getElementById('budget-bars');
  if (!container || !section) return;

  const budgetedCats = CATEGORIES.filter(cat => budgets[cat.name]);
  if (budgetedCats.length === 0) { section.classList.add('hidden'); return; }

  section.classList.remove('hidden');
  container.innerHTML = budgetedCats.map(cat => {
    const spent = catTotals[cat.name] || 0;
    const limit = budgets[cat.name];
    const pct = Math.min(100, Math.round((spent / limit) * 100));
    const status = pct >= 100 ? 'over' : pct >= 80 ? 'warning' : 'ok';
    const remaining = limit - spent;
    return `
      <div class="budget-bar-row">
        <div class="budget-bar-header">
          <span class="budget-bar-label">${cat.emoji} ${cat.name}</span>
          <span class="budget-bar-amounts">
            Rp ${spent.toLocaleString('id-ID')} / Rp ${limit.toLocaleString('id-ID')}
          </span>
        </div>
        <div class="budget-bar-track">
          <div class="budget-bar-fill ${status}" style="width:${pct}%"></div>
        </div>
        <div class="budget-bar-pct ${status}">
          ${pct}% ${status === 'over' ? '🚨 Over budget!' : status === 'warning' ? '⚠️ Hampir habis' : `· Sisa Rp ${remaining.toLocaleString('id-ID')}`}
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// SUBMIT (with offline queue fallback)
// ============================================

async function handleSubmit() {
  const descEl    = document.getElementById('input-desc');
  const amtEl     = document.getElementById('input-amount');
  const btn       = document.getElementById('btn-submit');
  const btnText   = document.getElementById('btn-submit-text');
  const btnLoader = document.getElementById('btn-submit-loader');

  const description = descEl.value.trim();
  const amount = parseInt(amtEl.value.replace(/[^\d]/g, ''), 10);

  if (!description) { showToast('Isi deskripsi dulu', 'error'); descEl.focus(); return; }
  if (!amount || amount <= 0) { showToast('Isi jumlah yang valid', 'error'); amtEl.focus(); return; }

  const category    = categorize(description);
  const selectedDate = getSelectedDate();
  const timestamp   = selectedDate.toLocaleString('id-ID', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const monthStr = MONTH_NAMES[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear();
  const weekStr  = `Week ${getWeekNumber(selectedDate)}`;
  const txData   = { timestamp, description, amount, category, month: monthStr, week: weekStr };

  btn.disabled = true;
  btnText.textContent = 'Menyimpan...';
  btnLoader.classList.remove('hidden');

  // OFFLINE: save to queue
  if (!isOnline || !accessToken || !Config.sheetId) {
    Queue.add(txData);
    const cat = CATEGORIES.find(c => c.name === category) || CATEGORIES[9];
    showToast(`💾 Saved offline — ${cat.emoji} ${category}`, 'info');

    recentItems.unshift({ ...txData, sheetRow: null });
    if (recentItems.length > 10) recentItems.pop();
    renderRecent();
    updateTodayTotal();

    descEl.value = ''; amtEl.value = ''; setDateToday(); descEl.focus();
    btn.disabled = false; btnText.textContent = 'Tambah Pengeluaran'; btnLoader.classList.add('hidden');
    return;
  }

  // ONLINE: save to Sheet
  try {
    const row = [timestamp, description, amount, category, monthStr, weekStr];
    const sheetRow = await appendRow(row);

    const cat = CATEGORIES.find(c => c.name === category) || CATEGORIES[9];
    showToast(`${cat.emoji} ${category} — Rp ${amount.toLocaleString('id-ID')} ✓`, 'success');

    recentItems.unshift({ ...txData, sheetRow });
    if (recentItems.length > 10) recentItems.pop();
    renderRecent();
    updateTodayTotal();

    // Budget warning check for current month
    const currentMonth = MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear();
    const monthSpend = allTransactions
      .filter(tx => tx.category === category && tx.month === currentMonth)
      .reduce((s, tx) => s + tx.amount, 0) + amount;
    checkBudgetWarning(category, monthSpend);

    descEl.value = ''; amtEl.value = ''; setDateToday(); descEl.focus();
  } catch (e) {
    // If save fails (e.g. token expired mid-way), queue it
    Queue.add(txData);
    showToast('Gagal simpan — disimpan offline', 'error');
  } finally {
    btn.disabled = false; btnText.textContent = 'Tambah Pengeluaran'; btnLoader.classList.add('hidden');
  }
}

// ============================================
// RENDER TRANSACTION ITEM (with swipe-to-delete)
// ============================================

function buildTransactionItem(tx, index, source) {
  const cat = CATEGORIES.find(c => c.name === tx.category) || CATEGORIES[9];
  const wrapper = document.createElement('div');
  wrapper.className = 'swipe-wrapper';

  const bg = document.createElement('div');
  bg.className = 'swipe-delete-bg';
  bg.innerHTML = '🗑️';

  const item = document.createElement('div');
  item.className = 'transaction-item';
  item.style.borderLeftColor = cat.color;
  // Pending (not yet synced) items get a subtle indicator
  const isPending = !tx.sheetRow;
  item.innerHTML = `
    <span class="tx-emoji">${cat.emoji}</span>
    <div class="tx-details">
      <div class="tx-desc">${escHtml(tx.description)}${isPending ? ' <span style="font-size:10px;color:#f59e0b">⏳</span>' : ''}</div>
      <div class="tx-cat">${tx.category}</div>
    </div>
    <div class="tx-right">
      <div class="tx-amount">Rp ${tx.amount.toLocaleString('id-ID')}</div>
    </div>
    <span class="tx-edit-hint">✎</span>
  `;

  item.addEventListener('click', () => openEdit(source, index));
  addSwipeToDelete(item, bg, wrapper, () => openDelete(source, index));

  wrapper.appendChild(bg);
  wrapper.appendChild(item);
  return wrapper;
}

function addSwipeToDelete(item, bg, wrapper, onDelete) {
  let startX = 0, currentX = 0, isSwiping = false;
  const THRESHOLD = 80;

  const onStart = (x) => { startX = x; isSwiping = true; item.classList.add('swiping'); };
  const onMove = (x) => {
    if (!isSwiping) return;
    currentX = Math.min(0, x - startX);
    item.style.transform = `translateX(${currentX}px)`;
    bg.style.width = Math.max(0, -currentX) + 'px';
  };
  const onEnd = () => {
    if (!isSwiping) return;
    isSwiping = false;
    item.classList.remove('swiping');
    if (currentX < -THRESHOLD) {
      item.style.transform = `translateX(-${wrapper.offsetWidth}px)`;
      setTimeout(onDelete, 150);
    } else {
      item.style.transform = '';
      bg.style.width = '0';
    }
    currentX = 0;
  };

  item.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
  item.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
  item.addEventListener('touchend',   onEnd);
  item.addEventListener('mousedown',  e => { if (e.button === 0) onStart(e.clientX); });
  window.addEventListener('mousemove', e => { if (isSwiping) { e.preventDefault(); onMove(e.clientX); } });
  window.addEventListener('mouseup',   () => { if (isSwiping) onEnd(); });
}

// ============================================
// RECENT
// ============================================

function renderRecent() {
  const el = document.getElementById('recent-list');
  if (recentItems.length === 0) { el.innerHTML = '<p class="empty-state">📭 Belum ada pengeluaran</p>'; return; }
  el.innerHTML = '';
  recentItems.forEach((tx, i) => el.appendChild(buildTransactionItem(tx, i, 'recent')));
}

// ============================================
// DELETE
// ============================================

function openDelete(source, index) {
  const tx = source === 'recent' ? recentItems[index] : allTransactions[index];
  if (!tx) return;
  deleteTarget = { source, index, tx };
  document.getElementById('delete-preview').innerHTML =
    `<strong>${escHtml(tx.description)}</strong><br>Rp ${tx.amount.toLocaleString('id-ID')} · ${tx.category}<br><span style="font-size:12px;opacity:0.7">${tx.timestamp}</span>`;
  document.getElementById('delete-modal').classList.remove('hidden');
}

async function confirmDelete() {
  if (!deleteTarget) return;
  const { source, index, tx } = deleteTarget;

  if (source === 'recent') { recentItems.splice(index, 1); renderRecent(); updateTodayTotal(); }
  else { allTransactions.splice(index, 1); applyHistoryFilter(); }
  closeDelete();

  if (tx.sheetRow) {
    try {
      await deleteRow(tx.sheetRow);
      allTransactions.forEach(t => { if (t.sheetRow > tx.sheetRow) t.sheetRow -= 1; });
      recentItems.forEach(t => { if (t.sheetRow > tx.sheetRow) t.sheetRow -= 1; });
      showToast('Transaksi dihapus ✓', 'success');
    } catch (e) { showToast('Gagal hapus dari Sheet: ' + e.message, 'error'); }
  } else {
    showToast('Transaksi dihapus ✓', 'success');
  }
}

function closeDelete() {
  document.getElementById('delete-modal').classList.add('hidden');
  deleteTarget = null;
  document.querySelectorAll('.transaction-item').forEach(el => { el.style.transform = ''; });
  document.querySelectorAll('.swipe-delete-bg').forEach(el => { el.style.width = '0'; });
}
function closeDeleteIfOverlay(e) { if (e.target === document.getElementById('delete-modal')) closeDelete(); }

// ============================================
// EDIT
// ============================================

function openEdit(source, index) {
  const tx = source === 'recent' ? recentItems[index] : allTransactions[index];
  if (!tx) return;
  editTarget = { source, index, sheetRow: tx.sheetRow };

  document.getElementById('edit-desc').value = tx.description;
  document.getElementById('edit-amount').value = tx.amount.toLocaleString('id-ID');

  const parts = tx.timestamp.split(',')[0]?.trim().split('/');
  if (parts?.length === 3) {
    document.getElementById('edit-date').value = `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
  } else {
    document.getElementById('edit-date').value = todayISO();
  }

  document.getElementById('edit-category-chips').innerHTML = CATEGORIES.map(cat => {
    const sel = cat.name === tx.category;
    return `<button class="cat-chip ${sel ? 'selected' : ''}"
      style="${sel ? `background:${cat.color};border-color:${cat.color}` : ''}"
      data-cat="${cat.name}" onclick="selectEditCategory(this,'${cat.name}')">
      ${cat.emoji} ${cat.name}</button>`;
  }).join('');

  document.getElementById('edit-modal').classList.remove('hidden');
}

function selectEditCategory(el, name) {
  document.querySelectorAll('#edit-category-chips .cat-chip').forEach(chip => {
    const cat = CATEGORIES.find(c => c.name === chip.dataset.cat);
    if (cat?.name === name) { chip.classList.add('selected'); chip.style.background = cat.color; chip.style.borderColor = cat.color; }
    else { chip.classList.remove('selected'); chip.style.background = ''; chip.style.borderColor = ''; }
  });
}

function getSelectedEditCategory() {
  const sel = document.querySelector('#edit-category-chips .cat-chip.selected');
  return sel ? sel.dataset.cat : 'Others';
}

async function saveEdit() {
  if (!editTarget) return;
  const newDesc     = document.getElementById('edit-desc').value.trim();
  const newAmount   = parseInt(document.getElementById('edit-amount').value.replace(/[^\d]/g, ''), 10);
  const newCategory = getSelectedEditCategory();
  const newDateVal  = document.getElementById('edit-date').value;

  if (!newDesc) { showToast('Deskripsi tidak boleh kosong', 'error'); return; }
  if (!newAmount || newAmount <= 0) { showToast('Jumlah tidak valid', 'error'); return; }

  const tx = editTarget.source === 'recent' ? recentItems[editTarget.index] : allTransactions[editTarget.index];
  let newTimestamp = tx.timestamp, newMonth = tx.month, newWeek = tx.week;

  if (newDateVal) {
    const [y, m, d] = newDateVal.split('-').map(Number);
    const editDate  = new Date(y, m - 1, d);
    const timePart  = tx.timestamp.split(',')[1]?.trim() || new Date().toLocaleTimeString('id-ID');
    newTimestamp    = editDate.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ', ' + timePart;
    newMonth        = MONTH_NAMES[editDate.getMonth()] + ' ' + editDate.getFullYear();
    newWeek         = `Week ${getWeekNumber(editDate)}`;
  }

  if (editTarget.sheetRow) {
    try {
      await updateRow(editTarget.sheetRow, [newTimestamp, newDesc, newAmount, newCategory, newMonth, newWeek]);
      showToast('Berhasil diupdate ✓', 'success');
    } catch (e) { showToast('Gagal update: ' + e.message, 'error'); return; }
  }

  tx.timestamp = newTimestamp; tx.description = newDesc;
  tx.amount = newAmount; tx.category = newCategory; tx.month = newMonth; tx.week = newWeek;

  if (editTarget.source === 'recent') { renderRecent(); updateTodayTotal(); }
  else { applyHistoryFilter(); }
  closeEdit();
}

function closeEdit() { document.getElementById('edit-modal').classList.add('hidden'); editTarget = null; }
function closeEditIfOverlay(e) { if (e.target === document.getElementById('edit-modal')) closeEdit(); }

// ============================================
// HISTORY
// ============================================

async function loadHistory() {
  if (!accessToken || !Config.sheetId) { showToast('Sign in dan isi Sheet ID dulu', 'error'); return; }
  const listEl = document.getElementById('history-list');
  listEl.innerHTML = '<p class="empty-state">Memuat...</p>';
  try {
    const rows = await readAllRows();
    if (rows.length <= 1) { listEl.innerHTML = '<p class="empty-state">Belum ada data</p>'; return; }
    allTransactions = rows.slice(1).map((r, i) => ({
      timestamp: r[0] || '', description: r[1] || '',
      amount: parseInt((r[2] || '0').toString().replace(/[^\d]/g, ''), 10),
      category: r[3] || 'Others', month: r[4] || '', week: r[5] || '',
      sheetRow: i + 2,
    })).reverse();
    applyHistoryFilter();
  } catch (e) { listEl.innerHTML = `<p class="empty-state">Error: ${e.message}</p>`; }
}

function setFilterCat(cat) {
  activeFilterCat = cat;
  document.querySelectorAll('.filter-chip').forEach(el => el.classList.toggle('active', el.dataset.cat === cat));
  applyHistoryFilter();
}

function applyHistoryFilter() {
  const q = document.getElementById('history-search')?.value.toLowerCase().trim() || '';
  const filtered = allTransactions.filter(tx => {
    const matchCat    = activeFilterCat === 'all' || tx.category === activeFilterCat;
    const matchSearch = !q || tx.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  renderHistoryList(document.getElementById('history-list'), filtered);
  const summaryEl = document.getElementById('history-filter-summary');
  if (activeFilterCat !== 'all' || q) {
    const total = filtered.reduce((s, tx) => s + tx.amount, 0);
    summaryEl.classList.remove('hidden');
    summaryEl.textContent = `${filtered.length} transaksi · Total Rp ${total.toLocaleString('id-ID')}`;
  } else {
    summaryEl.classList.add('hidden');
  }
}

function renderHistoryList(el, list) {
  const txList = list || allTransactions;
  if (txList.length === 0) { el.innerHTML = '<p class="empty-state">Tidak ada transaksi ditemukan</p>'; return; }
  el.innerHTML = '';
  let lastDate = '';
  txList.forEach(tx => {
    const dateStr = tx.timestamp.split(',')[0]?.trim() || '';
    if (dateStr !== lastDate) {
      const dg = document.createElement('div');
      dg.className = 'history-date-group';
      dg.textContent = dateStr;
      el.appendChild(dg);
      lastDate = dateStr;
    }
    const origIndex = allTransactions.indexOf(tx);
    el.appendChild(buildTransactionItem(tx, origIndex, 'history'));
  });
}

// ============================================
// DASHBOARD
// ============================================

function changeMonth(delta) {
  dashboardMonth.setMonth(dashboardMonth.getMonth() + delta);
  updateMonthLabel(); renderDashboardData();
}

function updateMonthLabel() {
  document.getElementById('dashboard-month').textContent =
    MONTH_NAMES[dashboardMonth.getMonth()] + ' ' + dashboardMonth.getFullYear();
}

async function loadDashboard() {
  if (!accessToken || !Config.sheetId) { showToast('Sign in dan isi Sheet ID dulu', 'error'); return; }
  showToast('Memuat dashboard...', 'info');
  try {
    const rows = await readAllRows();
    allTransactions = rows.slice(1).map((r, i) => ({
      timestamp: r[0] || '', description: r[1] || '',
      amount: parseInt((r[2] || '0').toString().replace(/[^\d]/g, ''), 10),
      category: r[3] || 'Others', month: r[4] || '', week: r[5] || '',
      sheetRow: i + 2,
    })).reverse();
    renderDashboardData();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

function renderDashboardData() {
  updateMonthLabel();
  const targetMonth = MONTH_NAMES[dashboardMonth.getMonth()] + ' ' + dashboardMonth.getFullYear();
  const filtered    = allTransactions.filter(tx => tx.month === targetMonth);

  const total = filtered.reduce((s, tx) => s + tx.amount, 0);
  // Avg = total divided by days that actually have spending (not calendar days)
  const daysWithSpending = new Set(
    filtered.map(tx => tx.timestamp.split(',')[0]?.trim() || tx.timestamp.split(' ')[0] || '')
      .filter(Boolean)
  ).size;
  const avg = daysWithSpending > 0 ? Math.round(total / daysWithSpending) : 0;

  const catTotals = {};
  filtered.forEach(tx => { catTotals[tx.category] = (catTotals[tx.category] || 0) + tx.amount; });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('sum-total').textContent = 'Rp ' + total.toLocaleString('id-ID');
  document.getElementById('sum-avg').textContent   = 'Rp ' + avg.toLocaleString('id-ID');
  document.getElementById('sum-top').textContent   = topCat
    ? `${(CATEGORIES.find(c => c.name === topCat[0]) || {}).emoji || ''} ${topCat[0]}` : '-';

  renderBudgetBars(catTotals);
  renderPieChart(catTotals);

  const dailyTotals = {};
  filtered.forEach(tx => {
    const day = tx.timestamp.split(',')[0]?.trim() || 'unknown';
    dailyTotals[day] = (dailyTotals[day] || 0) + tx.amount;
  });
  renderBarChart(dailyTotals);
}

function renderPieChart(catTotals) {
  const ctx = document.getElementById('chart-pie');
  const labels = [], data = [], colors = [];
  Object.entries(catTotals).sort((a, b) => b[1] - a[1]).forEach(([name, amount]) => {
    const cat = CATEGORIES.find(c => c.name === name);
    labels.push((cat?.emoji || '') + ' ' + name); data.push(amount); colors.push(cat?.color || '#94a3b8');
  });
  if (pieChart) pieChart.destroy();
  if (!data.length) { pieChart = null; return; }
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: { responsive: true, plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 }, padding: 12 } },
      tooltip: { callbacks: { label: i => `Rp ${i.raw.toLocaleString('id-ID')}` } },
    }},
  });
}

function renderBarChart(dailyTotals) {
  const ctx = document.getElementById('chart-bar');
  const sorted = Object.entries(dailyTotals).sort((a, b) => a[0].localeCompare(b[0]));
  if (barChart) barChart.destroy();
  if (!sorted.length) { barChart = null; return; }
  barChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: sorted.map(([d]) => d), datasets: [{ data: sorted.map(([,v]) => v), backgroundColor: '#1e3a5f', borderRadius: 4 }] },
    options: { responsive: true,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => `Rp ${i.raw.toLocaleString('id-ID')}` } } },
      scales: {
        x: { ticks: { font: { family: 'Inter', size: 10 }, maxRotation: 45 }, grid: { display: false } },
        y: { ticks: { font: { family: 'Inter', size: 10 }, callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'jt' : v >= 1000 ? (v/1000)+'rb' : v } },
      },
    },
  });
}

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'history' && allTransactions.length === 0 && accessToken) loadHistory();
  if (tab === 'dashboard' && allTransactions.length === 0 && accessToken) loadDashboard();
  if (tab === 'dashboard') { updateMonthLabel(); if (allTransactions.length > 0) renderDashboardData(); }
}

// ============================================
// SETTINGS
// ============================================

function loadSettingsUI() {
  document.getElementById('set-client-id').value = Config.clientId;
  document.getElementById('set-sheet-id').value = Config.sheetId;
}

function saveGoogleSettings() {
  const clientId = document.getElementById('set-client-id').value.trim();
  const sheetId  = document.getElementById('set-sheet-id').value.trim();
  if (!clientId) { showToast('Client ID tidak boleh kosong', 'error'); return; }
  if (!sheetId)  { showToast('Sheet ID tidak boleh kosong', 'error'); return; }
  Config.set('clientId', clientId); Config.set('sheetId', sheetId);
  tryInitGoogle();
  showToast('Google settings tersimpan ✓', 'success');
}

// ============================================
// NOTIFICATIONS (Push + Scheduled)
// ============================================

const NOTIF_KEY = 'dompet_notif';
const NOTIF_T1_KEY  = 'dompet_notif_t1';
const NOTIF_T2_KEY  = 'dompet_notif_t2';
let notifTimers = [];

function loadNotifSettings() {
  const enabled = Config.get(NOTIF_KEY) === 'true';
  const t1 = Config.get(NOTIF_T1_KEY) || '12:30';
  const t2 = Config.get(NOTIF_T2_KEY) || '19:30';
  const toggle = document.getElementById('notif-toggle');
  const t1El   = document.getElementById('notif-time-1');
  const t2El   = document.getElementById('notif-time-2');
  if (toggle) toggle.checked = enabled;
  if (t1El) t1El.value = t1;
  if (t2El) t2El.value = t2;
  if (enabled) scheduleNotifications(t1, t2);
}

async function toggleNotifications() {
  const enabled = document.getElementById('notif-toggle')?.checked;
  if (enabled) {
    const perm = await requestNotifPermission();
    if (!perm) {
      document.getElementById('notif-toggle').checked = false;
      return;
    }
    Config.set(NOTIF_KEY, 'true');
    const t1 = document.getElementById('notif-time-1')?.value || '12:30';
    const t2 = document.getElementById('notif-time-2')?.value || '19:30';
    scheduleNotifications(t1, t2);
    updateNotifStatus('ok', '✓ Pengingat aktif');
  } else {
    Config.set(NOTIF_KEY, 'false');
    clearNotifTimers();
    updateNotifStatus('', '');
  }
}

async function requestNotifPermission() {
  if (!('Notification' in window)) {
    updateNotifStatus('error', '✗ Browser tidak mendukung notifikasi');
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') {
    updateNotifStatus('error', '✗ Izin notifikasi ditolak. Aktifkan di pengaturan browser.');
    return false;
  }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') {
    updateNotifStatus('error', '✗ Izin notifikasi tidak diberikan');
    return false;
  }
  return true;
}

function saveNotifSettings() {
  const t1 = document.getElementById('notif-time-1')?.value || '12:30';
  const t2 = document.getElementById('notif-time-2')?.value || '19:30';
  Config.set(NOTIF_T1_KEY, t1);
  Config.set(NOTIF_T2_KEY, t2);
  const enabled = Config.get(NOTIF_KEY) === 'true';
  if (enabled) {
    scheduleNotifications(t1, t2);
    updateNotifStatus('ok', `✓ Pengingat: ${t1} & ${t2} setiap hari`);
  } else {
    updateNotifStatus('', 'Aktifkan toggle untuk mulai menerima pengingat');
  }
  showToast('Pengingat tersimpan ✓', 'success');
}

function clearNotifTimers() {
  notifTimers.forEach(id => clearTimeout(id));
  notifTimers = [];
}

function scheduleNotifications(t1, t2) {
  clearNotifTimers();
  scheduleOne(t1, '🌤️ Pengingat Siang', 'Jangan lupa catat pengeluaran siang hari ini!');
  scheduleOne(t2, '🌙 Pengingat Malam', 'Sudah catat semua pengeluaran hari ini?');
}

function scheduleOne(timeStr, title, body) {
  const [h, m] = timeStr.split(':').map(Number);
  const now    = new Date();
  let target   = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1); // schedule for tomorrow if past
  const delay = target - now;

  const id = setTimeout(() => {
    fireNotification(title, body);
    // Reschedule for next day
    const nextId = setTimeout(() => {
      scheduleOne(timeStr, title, body);
    }, 1000);
    notifTimers.push(nextId);
  }, delay);
  notifTimers.push(id);
}

function fireNotification(title, body) {
  if (Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      body,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="%231e3a5f"/><path d="M7 10h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="22" cy="16" r="2.5" fill="white"/></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="%231e3a5f"/></svg>',
      tag: 'wallet-tracker-reminder',
      renotify: true,
    });
    n.onclick = () => { window.focus(); n.close(); };
  } catch(e) { console.warn('Notification failed:', e); }
}

function updateNotifStatus(cls, msg) {
  const el = document.getElementById('notif-status');
  if (!el) return;
  el.className = 'notif-status' + (cls ? ' ' + cls : '');
  el.textContent = msg;
}

// ============================================
// UTILITIES
// ============================================

function showToast(message, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast ${type} show`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3000);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
